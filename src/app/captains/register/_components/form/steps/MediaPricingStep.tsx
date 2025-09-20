import clsx from "clsx";
import type { ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Field } from "../components/Field";
import { MediaGrid } from "../components/MediaGrid";
import { pricingCards, ACCENT, ACCENT_TINT } from "../constants";
import type { CharterFormValues } from "../charterForm.schema";
import type { MediaPreview } from "../types";

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
  const { watch, setValue } = form;

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-900">Photos & videos</h2>
        <p className="text-sm text-slate-500">
          Clear visuals help anglers trust your charter. Aim for bright shots of the boat, crew, and catches.
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
              onChange={onPhotoChange}
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
              onChange={onVideoChange}
            />
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
                onClick={() => setValue("pricingModel", card.id, { shouldValidate: true })}
                className={clsx(
                  "flex h-full flex-col justify-between rounded-2xl border px-5 py-4 text-left transition",
                  watch("pricingModel") === card.id
                    ? "border-transparent text-white"
                    : "border-neutral-200 bg-white text-slate-700 hover:border-slate-300"
                )}
                style=
                  {watch("pricingModel") === card.id
                    ? {
                        borderColor: ACCENT,
                        backgroundColor: ACCENT_TINT,
                      }
                    : undefined}
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
                  style=
                    {watch("pricingModel") === card.id
                      ? { borderColor: ACCENT, backgroundColor: ACCENT }
                      : undefined}
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
