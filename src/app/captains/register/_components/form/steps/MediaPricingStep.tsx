import clsx from "clsx";
import { useState, type ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

// Lazy-loaded ffmpeg types (tolerant across versions and ESM/CJS interop)
type FFmpegExports = {
  createFFmpeg?: (opts: unknown) => any;
  fetchFile?: (file: unknown) => any;
  FFmpeg?: new (opts: unknown) => any;
};

import type { CharterFormValues } from "../charterForm.schema";
import { Field } from "../components/Field";
import { MediaGrid } from "../components/MediaGrid";
import { ACCENT, ACCENT_TINT, pricingCards } from "../constants";
import type { MediaPreview } from "../types";

// Client-side image resize util
async function resizeImage(
  file: File,
  {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.82,
    mimeType = "image/webp",
  }: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  } = {}
): Promise<File> {
  const img = document.createElement("img");
  const url = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image for resize"));
      img.src = url;
    });

    const { width, height } = img;
    // Compute target size (keep aspect ratio)
    let targetW = width;
    let targetH = height;
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      targetW = Math.round(width * ratio);
      targetH = Math.round(height * ratio);
    }

    // Size guard: if no resizing needed, return the original file
    if (width <= maxWidth && height <= maxHeight) {
      URL.revokeObjectURL(url);
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not available");
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) =>
          b ? resolve(b) : reject(new Error("Canvas toBlob returned null")),
        mimeType,
        quality
      )
    );

    const ext = mimeType.split("/")[1] || "webp";
    const resizedName = file.name.replace(/\.(\w+)$/i, `.${ext}`);
    return new File([blob], resizedName, {
      type: mimeType,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Client-side video transcode util (best-effort). Falls back to original when ffmpeg not present.
async function transcodeVideo(
  file: File,
  {
    targetHeight = 720,
    crf = 28,
    preset = "fast",
    maxBitrate = "4M",
    format = "mp4",
  }: {
    targetHeight?: number;
    crf?: number;
    preset?: string;
    maxBitrate?: string;
    format?: "mp4" | "webm";
  } = {},
  onProgress?: (ratio: number) => void
): Promise<File> {
  // Size guard: very small videos -> return as-is
  if (file.size <= 3 * 1024 * 1024) return file; // <= 3MB keep original

  // Try dynamic import to avoid bundling cost on initial load
  let ffmpegMod: FFmpegExports | null = null;
  try {
    const mod: unknown = await import("@ffmpeg/ffmpeg");
    // Support both ESM default export and named exports
    ffmpegMod = ((mod as { default?: FFmpegExports }).default ??
      mod) as FFmpegExports;
  } catch {
    return file; // ffmpeg not installed in bundle — keep original
  }

  const fetchFile = ffmpegMod.fetchFile;
  const createFFmpeg =
    ffmpegMod.createFFmpeg ??
    (ffmpegMod.FFmpeg
      ? (opts: unknown) => new (ffmpegMod.FFmpeg as any)(opts)
      : undefined);

  if (!createFFmpeg || !fetchFile) {
    return file; // Defensive: environment didn't expose expected APIs
  }

  const ffmpeg = createFFmpeg({
    log: false,
    progress: ({ ratio }: { ratio?: number }) => {
      try {
        onProgress?.(Math.max(0, Math.min(1, ratio || 0)));
      } catch {}
    },
    // Explicit core path to avoid resolution issues in various bundlers/hosts
    corePath: "/ffmpeg/ffmpeg-core.js",
    wasmPath: "/ffmpeg/ffmpeg-core.wasm",
    workerPath: "/ffmpeg/ffmpeg-core.worker.js",
  });

  try {
    await Promise.all([
      fetch("/ffmpeg/ffmpeg-core.js"),
      fetch("/ffmpeg/ffmpeg-core.wasm"),
      fetch("/ffmpeg/ffmpeg-core.worker.js"),
    ]).then((results) => {
      results.forEach((res, idx) => {
        if (!res.ok) {
          console.error(
            "⚠️ ffmpeg core file missing:",
            [".js", ".wasm", ".worker.js"][idx]
          );
        }
      });
    });
  } catch (err) {
    console.error("⚠️ Failed to fetch ffmpeg core files:", err);
  }

  try {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    const inName = "input." + (file.name.split(".").pop() || "mp4");
    const outName = `out.${format}`;

    ffmpeg.FS("writeFile", inName, await fetchFile(file));

    // Scale by height, preserve aspect; cap bitrate; set CRF/preset
    await ffmpeg.run(
      "-i",
      inName,
      "-vf",
      `scale=-2:${targetHeight}`,
      "-c:v",
      "libx264",
      "-preset",
      preset,
      "-crf",
      String(crf),
      "-maxrate",
      maxBitrate,
      "-bufsize",
      maxBitrate,
      "-movflags",
      "+faststart",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      outName
    );

    const data = ffmpeg.FS("readFile", outName);
    const blob = new Blob([data.buffer], { type: "video/mp4" });
    const newName = file.name.replace(/\.(\w+)$/i, ".mp4");

    return new File([blob], newName, {
      type: "video/mp4",
      lastModified: Date.now(),
    });
  } catch {
    return file; // Any failure -> keep original
  } finally {
    try {
      // Cleanup
      for (const f of [
        "input.mp4",
        "input.mov",
        "input.webm",
        "out.mp4",
        "out.webm",
      ]) {
        try {
          ffmpeg.FS("unlink", f);
        } catch {}
      }
    } catch {}
  }
}

type MediaPricingStepProps = {
  form: UseFormReturn<CharterFormValues>;
  fieldError: (path: string | undefined) => string | undefined;
  photoPreviews: MediaPreview[];
  videoPreviews: MediaPreview[];
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
  onRemoveVideo: (index: number) => void;
};

export function MediaPricingStep({
  form,
  fieldError,
  photoPreviews,
  videoPreviews,
  onPhotoChange,
  onVideoChange,
  onRemovePhoto,
  onRemoveVideo,
}: MediaPricingStepProps) {
  const [videoProgress, setVideoProgress] = useState<number | null>(null);
  const { watch, setValue } = form;

  const handlePhotoFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return onPhotoChange(e);

    // Resize all selected images
    const resized = await Promise.all(
      Array.from(files).map((f) =>
        resizeImage(f, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.82,
          mimeType: "image/webp",
        })
      )
    );

    // Build a FileList via DataTransfer
    const dt = new DataTransfer();
    resized.forEach((f) => dt.items.add(f));

    // Create a synthetic event compatible with the expected signature
    const syntheticEvent = {
      ...e,
      target: { ...e.target, files: dt.files },
      currentTarget: { ...e.currentTarget, files: dt.files },
    } as unknown as ChangeEvent<HTMLInputElement>;

    onPhotoChange(syntheticEvent);
  };

  const handleVideoFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return onVideoChange(e);

    // Quick size guard: reject extremely large files early (e.g., > 300MB)
    const TOO_BIG = 300 * 1024 * 1024;
    for (const f of Array.from(files)) {
      if (f.size > TOO_BIG) {
        alert(
          "Selected video is too large (>300MB). Please upload a smaller clip or compress it first."
        );
        return; // Do not forward
      }
    }

    setVideoProgress(0);
    const total = files.length;

    const processed = await Promise.all(
      Array.from(files).map(async (f, idx) => {
        if (f.size <= 5 * 1024 * 1024) {
          // Stage progress for tiny files instantly
          setVideoProgress((prev) => {
            const base = idx / total;
            return Math.max(base, prev ?? 0);
          });
          return f;
        }
        const base = idx / total;
        const span = 1 / total;
        return transcodeVideo(
          f,
          {
            targetHeight: 720,
            crf: 28,
            preset: "fast",
            maxBitrate: "4M",
            format: "mp4",
          },
          (ratio) => setVideoProgress(base + span * ratio)
        );
      })
    );

    const dt = new DataTransfer();
    processed.forEach((f) => dt.items.add(f));

    const syntheticEvent = {
      ...e,
      target: { ...e.target, files: dt.files },
      currentTarget: { ...e.currentTarget, files: dt.files },
    } as unknown as ChangeEvent<HTMLInputElement>;

    onVideoChange(syntheticEvent);
    setVideoProgress(1);
    setTimeout(() => setVideoProgress(null), 600);
  };

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-900">
          Photos & videos
        </h2>
        <p className="text-sm text-slate-500">
          Clear visuals help anglers trust your charter. Aim for bright shots of
          the boat, crew, and catches.
        </p>
      </header>

      <hr className="border-t my-6 border-neutral-200" />

      <div className="mt-6 space-y-6">
        <Field
          label="Upload photos"
          error={fieldError("photos")}
          hint="Minimum 3 photos, maximum 15"
        >
          <div className="grid gap-4">
            <button
              type="button"
              onClick={() => document.getElementById("photo-upload")?.click()}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Add photos
            </button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoFileInput}
            />
            <MediaGrid
              items={photoPreviews}
              emptyLabel="No photos yet"
              onRemove={onRemovePhoto}
            />
          </div>
        </Field>

        <Field
          label="Upload videos"
          error={fieldError("videos")}
          hint="Optional, up to 3 short clips"
        >
          <div className="grid gap-4">
            <button
              type="button"
              onClick={() => document.getElementById("video-upload")?.click()}
              className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
            >
              Add videos
            </button>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={handleVideoFileInput}
            />
            {videoProgress !== null && (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="w-28 shrink-0">Transcoding…</span>
                <div className="h-2 w-full rounded bg-neutral-200">
                  <div
                    className="h-2 rounded bg-slate-900 transition-[width] duration-200"
                    style={{
                      width: `${Math.round((videoProgress ?? 0) * 100)}%`,
                    }}
                  />
                </div>
                <span className="w-12 text-right tabular-nums">
                  {Math.round((videoProgress ?? 0) * 100)}%
                </span>
              </div>
            )}
            <MediaGrid
              items={videoPreviews}
              emptyLabel="No videos yet"
              onRemove={onRemoveVideo}
            />
          </div>
        </Field>

        <Field
          label="Select your pricing plan"
          error={fieldError("pricingModel")}
          className="mt-8"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {pricingCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() =>
                  setValue("pricingModel", card.id, { shouldValidate: true })
                }
                className={clsx(
                  "flex h-full flex-col justify-between rounded-2xl border px-5 py-4 text-left transition",
                  watch("pricingModel") === card.id
                    ? "border-transparent text-white"
                    : "border-neutral-200 bg-white text-slate-700 hover:border-slate-300"
                )}
                style={
                  watch("pricingModel") === card.id
                    ? {
                        borderColor: ACCENT,
                        backgroundColor: ACCENT_TINT,
                      }
                    : undefined
                }
              >
                <div>
                  <span className="text-3xl font-bold text-slate-900">
                    {card.percentage}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-slate-800">
                    {card.title}
                  </h3>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {card.features.map((feature) => (
                      <li key={`${card.id}-${feature}`}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <span
                  className={clsx(
                    "mt-4 inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold",
                    watch("pricingModel") === card.id
                      ? "text-white"
                      : "border-neutral-200 text-slate-600"
                  )}
                  style={
                    watch("pricingModel") === card.id
                      ? { borderColor: ACCENT, backgroundColor: ACCENT }
                      : undefined
                  }
                >
                  {watch("pricingModel") === card.id ? "Selected" : "Select"}
                </span>
              </button>
            ))}
          </div>
        </Field>
      </div>
    </section>
  );
}
