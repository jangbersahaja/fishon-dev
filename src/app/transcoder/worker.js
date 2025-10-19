// worker.js
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { del, put } from "@vercel/blob";
import express from "express";
import ffmpeg from "fluent-ffmpeg";
import fetch from "node-fetch";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { readFile, unlink } from "node:fs/promises";
import { join } from "node:path";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const app = express();
app.use(express.json({ limit: "200mb" }));

app.post("/transcode", async (req, res) => {
  const { key, url } = req.body || {};
  if (!key || !url)
    return res.status(400).json({ ok: false, error: "Missing key/url" });

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token)
    return res
      .status(500)
      .json({ ok: false, error: "Missing BLOB_READ_WRITE_TOKEN" });

  const tmpIn = join("/tmp", `${randomUUID()}-in`);
  const tmpOut = join("/tmp", `${randomUUID()}-out.mp4`);

  try {
    // 1) download
    const r = await fetch(url);
    if (!r.ok) throw new Error(`download ${r.status}`);
    await new Promise((resolve, reject) => {
      const ws = createWriteStream(tmpIn);
      r.body.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    });

    // 2) transcode → 720p
    await new Promise((resolve, reject) => {
      ffmpeg(tmpIn)
        .videoCodec("libx264")
        .audioCodec("aac")
        .outputOptions([
          "-vf",
          "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease",
          "-preset",
          "veryfast",
          "-crf",
          "28",
          "-b:a",
          "96k",
          "-movflags",
          "+faststart",
        ])
        .format("mp4")
        .on("end", resolve)
        .on("error", reject)
        .save(tmpOut);
    });

    // 3) upload result (overwrite or new key)
    const outKey = key.replace(/^uploads\/original\//, "uploads/720p/");
    const fileData = await readFile(tmpOut);
    const { url: newUrl } = await put(outKey, fileData, {
      access: "public",
      token,
      contentType: "video/mp4",
    });

    // 4) delete original
    await del(key, { token });

    // 5) (optional) call back your app to update DB
    // await fetch("https://<your-app>/api/mark-transcoded", { ... })

    res.json({ ok: true, key: outKey, url: newUrl });
  } catch (e) {
    console.error("transcode error", e);
    res
      .status(500)
      .json({ ok: false, error: e?.message || "transcode failed" });
  } finally {
    await unlink(tmpIn).catch(() => {});
    await unlink(tmpOut).catch(() => {});
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("worker on", port));
