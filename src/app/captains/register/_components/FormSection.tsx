"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { useForm } from "react-hook-form";

import { useCharterDraft } from "@/utils/useCharterDraft";
import { submitCharter, type CharterPayload } from "../actions";
import {
  charterFormOptions,
  createDefaultCharterFormValues,
} from "./form/charterForm.defaults";
import {
  hydrateDraftValues,
  sanitizeForDraft,
  type DraftValues,
} from "./form/charterForm.draft";
import {
  charterFormSchema,
  type CharterFormValues,
} from "./form/charterForm.schema";
import {
  StepProgress,
  type StepDefinition,
} from "./form/components/StepProgress";
import { useAutosaveDraft } from "./form/hooks/useAutosaveDraft";
import { useMediaPreviews } from "./form/hooks/useMediaPreviews";
import { useResponsiveSheet } from "./form/hooks/useResponsiveSheet";
import { createPreviewCharter } from "./form/preview/utils";
import { BasicsStep } from "./form/steps/BasicsStep";
import { ExperienceStep } from "./form/steps/ExperienceStep";
import { MediaPricingStep } from "./form/steps/MediaPricingStep";
import { ReviewStep } from "./form/steps/ReviewStep";
import { TripsStep } from "./form/steps/TripsStep";
import type { StepKey } from "./form/types";
import { formatTimestamp, getFieldError } from "./form/utils";

type FormStep = StepDefinition & {
  id: StepKey;
  fields: string[];
};

const STEP_SEQUENCE: FormStep[] = [
  {
    id: "basics",
    label: "Captain & Charter",
    fields: [
      "operator.firstName",
      "operator.lastName",
      "operator.displayName",
      "operator.experienceYears",
      "operator.bio",
      "operator.phone",
      "operator.avatar",
      "charterType",
      "charterName",
      "state",
      "district",
      "startingPoint",
      "postcode",
      "latitude",
      "longitude",
      "description",
    ],
  },
  {
    id: "experience",
    label: "Boat & Logistic",
    fields: [
      "boat.name",
      "boat.type",
      "boat.lengthFeet",
      "boat.capacity",
      "boat.features",
      "amenities",
      "pickup",
    ],
  },
  {
    id: "trips",
    label: "Trips & Availability",
    fields: ["trips"],
  },
  {
    id: "media",
    label: "Media & Pricing",
    fields: ["photos", "pricingModel"],
  },
  {
    id: "review",
    label: "Preview",
    fields: [],
  },
];

const REVIEW_STEP_INDEX = STEP_SEQUENCE.findIndex(
  (step) => step.id === "review"
);

export default function FormSection() {
  const [submitState, setSubmitState] = useState<
    | { type: "success"; message: string }
    | { type: "error"; message: string }
    | null
  >(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [captainAvatarPreview, setCaptainAvatarPreview] = useState<
    string | null
  >(null);
  const { loadDraft, saveDraft, clearDraft } = useCharterDraft<DraftValues>();
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isRestoringDraft, setIsRestoringDraft] = useState(false);

  const totalSteps = STEP_SEQUENCE.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isReviewStep = currentStep === REVIEW_STEP_INDEX;

  const defaultState = useMemo(createDefaultCharterFormValues, []);

  const form = useForm<CharterFormValues>({
    resolver: zodResolver(charterFormSchema),
    mode: "onBlur",
    defaultValues: defaultState,
  });

  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const formValues = watch();
  const photos = watch("photos");
  const videos = watch("videos");
  const selectedState = watch("state");
  const districtValue = watch("district");
  const captainAvatarFile = watch("operator.avatar");

  const photoPreviews = useMediaPreviews(photos as File[] | undefined);
  const videoPreviews = useMediaPreviews(videos as File[] | undefined);

  const { lastSavedAt, setLastSavedAt, persistDraft, initializeDraftState } =
    useAutosaveDraft({
      values: formValues,
      draftLoaded,
      isRestoring: isRestoringDraft,
      sanitize: sanitizeForDraft,
      saveDraft,
    });

  const { isDesktop, mobileSheetOpen, openMobileSheet, closeMobileSheet } =
    useResponsiveSheet();

  const { MALAYSIA_LOCATIONS } = charterFormOptions;

  useEffect(() => {
    setIsRestoringDraft(true);
    const snapshot = loadDraft();
    if (snapshot?.values) {
      const hydrated = hydrateDraftValues(defaultState, snapshot.values);
      reset(hydrated);
      initializeDraftState(hydrated, snapshot.savedAt ?? null);
      setCaptainAvatarPreview(null);
    } else {
      initializeDraftState(defaultState, null);
    }
    setDraftLoaded(true);
    setIsRestoringDraft(false);
  }, [defaultState, initializeDraftState, loadDraft, reset]);

  const activeStep = STEP_SEQUENCE[currentStep];

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNext = useCallback(async () => {
    const fields = STEP_SEQUENCE[currentStep].fields;
    const valid = fields.length
      ? await trigger(fields, { shouldFocus: true })
      : await trigger(undefined, { shouldFocus: true });
    if (!valid) return;
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    scrollToTop();
  }, [currentStep, totalSteps, trigger, scrollToTop]);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    scrollToTop();
  }, [scrollToTop]);

  const previewCharter = useMemo(
    () => createPreviewCharter(formValues, photoPreviews, captainAvatarPreview),
    [formValues, photoPreviews, captainAvatarPreview]
  );
  const formattedLastSaved = useMemo(
    () => formatTimestamp(lastSavedAt),
    [lastSavedAt]
  );

  useEffect(() => {
    if (captainAvatarFile instanceof File) {
      const url = URL.createObjectURL(captainAvatarFile);
      setCaptainAvatarPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setCaptainAvatarPreview(null);
    return undefined;
  }, [captainAvatarFile]);

  const handleManualSave = useCallback(() => {
    persistDraft();
  }, [persistDraft]);

  const saveAndCloseSheet = useCallback(() => {
    persistDraft();
    closeMobileSheet();
  }, [closeMobileSheet, persistDraft]);

  const handleDiscardDraft = useCallback(() => {
    clearDraft();
    setIsRestoringDraft(true);
    try {
      reset(defaultState);
      initializeDraftState(defaultState, null);
      setCaptainAvatarPreview(null);
    } finally {
      setIsRestoringDraft(false);
    }
  }, [clearDraft, defaultState, initializeDraftState, reset]);

  const goToReview = useCallback(() => {
    setCurrentStep(REVIEW_STEP_INDEX);
    scrollToTop();
  }, [scrollToTop, setCurrentStep]);

  useEffect(() => {
    const state = MALAYSIA_LOCATIONS.find(
      (item) => item.state === selectedState
    );
    if (!state) return;
    if (!state.districts.includes(districtValue)) {
      const fallback = state.districts[0] ?? "";
      if (fallback) {
        setValue("district", fallback, { shouldValidate: true });
      }
    }
  }, [MALAYSIA_LOCATIONS, selectedState, districtValue, setValue]);

  const districtOptions = useMemo(() => {
    const state = MALAYSIA_LOCATIONS.find(
      (option) => option.state === selectedState
    );
    return state?.districts ?? [];
  }, [MALAYSIA_LOCATIONS, selectedState]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setValue("operator.avatar", file, { shouldValidate: true });
    event.target.value = "";
  };

  const clearAvatar = () => {
    if (captainAvatarPreview) {
      URL.revokeObjectURL(captainAvatarPreview);
    }
    setValue("operator.avatar", undefined, { shouldValidate: true });
    setCaptainAvatarPreview(null);
    const input = document.getElementById(
      "captain-avatar-upload"
    ) as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    const current = watch("photos") ?? [];
    const next = [...current, ...Array.from(files)].slice(0, 15);
    setValue("photos", next, { shouldValidate: true });
    event.target.value = "";
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    const current = watch("videos") ?? [];
    const next = [...current, ...Array.from(files)].slice(0, 3);
    setValue("videos", next, { shouldValidate: true });
    event.target.value = "";
  };

  const removePhoto = (index: number) => {
    const current = watch("photos") ?? [];
    const next = current.filter((_, i) => i !== index);
    setValue("photos", next, { shouldValidate: true });
  };

  const removeVideo = (index: number) => {
    const current = watch("videos") ?? [];
    const next = current.filter((_, i) => i !== index);
    setValue("videos", next, { shouldValidate: true });
  };

  const onSubmit = async (values: CharterFormValues) => {
    setSubmitState(null);

    const photosPayload = (values.photos ?? []).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    const videosPayload = (values.videos ?? []).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    const avatarFile = values.operator.avatar;
    const avatarPayload =
      avatarFile instanceof File
        ? { name: avatarFile.name, url: URL.createObjectURL(avatarFile) }
        : undefined;
    const photoUrls = photosPayload.map((item) => item.url);
    const videoUrls = videosPayload.map((item) => item.url);
    const avatarUrl = avatarPayload?.url;

    const payload: CharterPayload = {
      operator: {
        firstName: values.operator.firstName,
        lastName: values.operator.lastName,
        name: values.operator.displayName,
        phone: values.operator.phone,
        experienceYears: Number.isFinite(values.operator.experienceYears)
          ? values.operator.experienceYears
          : 0,
        crewCount: values.boat.capacity || 1,
        bio: values.operator.bio,
        avatar: avatarPayload ?? null,
      },
      charterType: values.charterType,
      name: values.charterName,
      locationState: values.state,
      locationDistrict: values.district,
      location: `${values.district}, ${values.state}`,
      address: values.startingPoint,
      postcode: values.postcode,
      coordinates: { lat: values.latitude, lng: values.longitude },
      images: photosPayload,
      videos: videosPayload,
      description: values.description,
      trip: values.trips.map((trip) => ({
        name: trip.name,
        price: Number.isFinite(trip.price) ? trip.price : 0,
        duration: `${trip.durationHours} hours`,
        maxAnglers: Number.isFinite(trip.maxAnglers) ? trip.maxAnglers : 1,
        private: trip.charterStyle === "private",
        description: trip.description,
        targetSpecies: trip.targetSpecies,
        techniques: trip.techniques,
        startTimes: trip.startTimes,
      })),
      species: Array.from(
        new Set(values.trips.flatMap((trip) => trip.targetSpecies ?? []))
      ),
      techniques: Array.from(
        new Set(values.trips.flatMap((trip) => trip.techniques ?? []))
      ),
      includes: values.amenities,
      excludes: [],
      licenseProvided: values.policies.licenseProvided,
      pickup: {
        available: values.pickup.available,
        included: values.pickup.available,
        fee:
          values.pickup.available &&
          Number.isFinite(values.pickup.fee ?? undefined)
            ? (values.pickup.fee as number)
            : undefined,
        areas: values.pickup.available ? values.pickup.areas : [],
        notes: values.pickup.available ? values.pickup.notes : undefined,
      },
      policies: {
        catchAndKeep: values.policies.catchAndKeep,
        catchAndRelease: values.policies.catchAndRelease,
        childFriendly: values.policies.childFriendly,
        liveBaitProvided: values.policies.liveBaitProvided,
        alcoholAllowed: values.policies.alcoholAllowed,
        smokingAllowed: values.policies.smokingAllowed,
      },
      cancellation: { freeUntilHours: 72, afterPolicy: "" },
      languages: ["BM", "English"],
      boat: {
        name: values.boat.name,
        type: values.boat.type,
        length: `${values.boat.lengthFeet} ft`,
        capacity: Number.isFinite(values.boat.capacity)
          ? values.boat.capacity
          : 1,
        features: values.boat.features,
      },
      pricingModel: values.pricingModel,
    };

    try {
      const formData = new FormData();
      formData.set("payload", JSON.stringify(payload));
      const response = await submitCharter(formData);
      if (response?.ok) {
        setSubmitState({
          type: "success",
          message: "Thanks! We will be in touch shortly.",
        });
        reset(defaultState);
        clearDraft();
        lastSerializedRef.current = JSON.stringify(
          sanitizeForDraft(defaultState)
        );
        setLastSavedAt(null);
        setCaptainAvatarPreview(null);
      } else if (response?.error) {
        setSubmitState({ type: "error", message: response.error });
      } else {
        setSubmitState({
          type: "error",
          message: "Submission failed. Please try again.",
        });
      }
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
      videoUrls.forEach((url) => URL.revokeObjectURL(url));
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    }
  };

  const fieldError = useCallback(
    (path: string | undefined) =>
      getFieldError(errors as Record<string, unknown>, path),
    [errors]
  );

  if (!isDesktop && !mobileSheetOpen) {
    return (
      <div className="space-y-4">
        {formattedLastSaved ? (
          <div className="flex items-center justify-between px-4 text-xs text-slate-500">
            <span>Draft saved {formattedLastSaved}</span>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="font-semibold text-red-500 hover:underline"
            >
              Discard draft
            </button>
          </div>
        ) : null}
        <div className="px-4 pb-8">
          <button
            type="button"
            onClick={openMobileSheet}
            className="flex-6 w-full items-center justify-center rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
          >
            {lastSavedAt ? "Continue form" : "Open registration form"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        !isDesktop ? "fixed inset-0 z-40 flex flex-col bg-white" : ""
      )}
    >
      {!isDesktop ? (
        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-neutral-200 bg-white px-2 py-3 shadow-sm">
          <button
            type="button"
            onClick={saveAndCloseSheet}
            className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-slate-600"
          >
            Save &amp; close
          </button>
          <div className="flex flex-col items-center text-xs text-slate-900">
            <span className="font-semibold">
              Step {currentStep + 1} of {totalSteps}
            </span>
            {formattedLastSaved ? (
              <span className="text-[11px] font-normal text-slate-500">
                Saved {formattedLastSaved}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {lastSavedAt ? (
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-red-500 hover:underline"
              >
                Discard
              </button>
            ) : null}
            <button
              type="button"
              onClick={goToReview}
              disabled={isReviewStep}
              className={clsx(
                "rounded-full px-3 py-1 text-xs font-semibold",
                isReviewStep
                  ? "border border-neutral-200 text-neutral-400"
                  : "border border-slate-900 text-slate-900"
              )}
            >
              Preview
            </button>
          </div>
        </header>
      ) : null}
      <div
        className={clsx(
          "space-y-10",
          !isDesktop ? "flex-1 overflow-y-auto px-4 pb-28 pt-4" : ""
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <StepProgress steps={STEP_SEQUENCE} currentStep={currentStep} />
          {formattedLastSaved ? (
            <p className="text-xs text-slate-400">
              Draft saved {formattedLastSaved}
            </p>
          ) : null}
          {currentStep === 0 && (
            <BasicsStep
              form={form}
              fieldError={fieldError}
              captainAvatarPreview={captainAvatarPreview}
              onAvatarChange={handleAvatarChange}
              onAvatarClear={clearAvatar}
              districtOptions={districtOptions}
            />
          )}

          {currentStep === 1 && (
            <ExperienceStep form={form} fieldError={fieldError} />
          )}

          {currentStep === 2 && <TripsStep form={form} />}

          {currentStep === 3 && (
            <MediaPricingStep
              form={form}
              fieldError={fieldError}
              photoPreviews={photoPreviews}
              videoPreviews={videoPreviews}
              onPhotoChange={handlePhotoChange}
              onVideoChange={handleVideoChange}
              onRemovePhoto={removePhoto}
              onRemoveVideo={removeVideo}
            />
          )}

          {isReviewStep && <ReviewStep charter={previewCharter} />}

          {submitState ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                submitState.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {submitState.message}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              <div>
                Step {currentStep + 1} of {totalSteps} · {activeStep.label}
              </div>
              {formattedLastSaved ? (
                <div className="text-xs text-slate-400">
                  Draft saved {formattedLastSaved}
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              {lastSavedAt ? (
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-red-500 hover:underline"
                >
                  Discard draft
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleManualSave}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400"
              >
                Save draft
              </button>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400"
                >
                  Back
                </button>
              )}
              {!isLastStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting…" : "Submit charter"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
