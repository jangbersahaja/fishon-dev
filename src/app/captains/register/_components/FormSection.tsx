"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitCharter, type CharterPayload } from "../actions";

// ---- UI helpers -------------------------------------------------
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
function Grid({
  cols = 2,
  children,
  className = "",
}: {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={["grid gap-4", `sm:grid-cols-${cols}`, className].join(" ")}
    >
      {children}
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "mt-1 block w-full rounded-md border px-3 py-2",
          error ? "border-red-500" : "border-neutral-300",
          "focus:outline-none focus:ring-2 focus:ring-[#EC2227]/30",
        ].join(" ")}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  className,
  error,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: string | number;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={[
          "mt-1 block w-full rounded-md border px-3 py-2",
          error ? "border-red-500" : "border-neutral-300",
          "focus:outline-none focus:ring-2 focus:ring-[#EC2227]/30",
        ].join(" ")}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={[
          "mt-1 block w-full rounded-md border px-3 py-2",
          error ? "border-red-500" : "border-neutral-300",
          "focus:outline-none focus:ring-2 focus:ring-[#EC2227]/30",
        ].join(" ")}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-neutral-300 text-[#EC2227] focus:ring-[#EC2227]/30"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
function TagInput({
  label,
  items,
  placeholder,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  placeholder?: string;
  onAdd: (v: string) => void;
  onRemove: (idx: number) => void;
}) {
  const [input, setInput] = useState("");
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((it, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-sm"
          >
            {it}
            <button
              type="button"
              className="text-neutral-400 hover:text-neutral-700"
              onClick={() => onRemove(idx)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EC2227]/30"
        />
        <button
          type="button"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
          onClick={() => {
            if (input.trim()) {
              onAdd(input.trim());
              setInput("");
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
function Repeater({
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (idx: number) => void;
  placeholder?: string;
}) {
  const [val, setVal] = useState("");
  return (
    <div>
      <div className="space-y-2">
        {items.map((url, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2"
          >
            <span className="truncate text-sm">{url}</span>
            <button
              type="button"
              className="text-sm text-red-600 hover:underline"
              onClick={() => onRemove(idx)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-md border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EC2227]/30"
        />
        <button
          type="button"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
          onClick={() => {
            if (val.trim()) {
              onAdd(val.trim());
              setVal("");
            }
          }}
        >
          Add URL
        </button>
      </div>
    </div>
  );
}
function SubmitButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={onClick}
      className="inline-flex items-center rounded-md bg-[#EC2227] px-5 py-2.5 text-white shadow hover:opacity-95 disabled:opacity-60"
    >
      {pending ? "Submitting…" : "Submit Charter"}
    </button>
  );
}
// ----------------------------------------------------------------

export default function FormSection() {
  const [data, setData] = useState<CharterPayload>({
    name: "",
    location: "",
    address: "",
    coordinates: { lat: 0, lng: 0 },
    images: [],
    description: "",
    trip: [
      {
        name: "Half-Day Trip",
        price: 0,
        duration: "4 hours",
        startTimes: ["07:00"],
        maxAnglers: 2,
        private: true,
        description: "",
      },
    ],
    species: [],
    techniques: [],
    includes: [],
    excludes: [],
    licenseProvided: false,
    pickup: { available: false, included: false, fee: 0, areas: [], notes: "" },
    policies: {
      catchAndKeep: false,
      catchAndRelease: true,
      childFriendly: true,
      liveBaitProvided: false,
      alcoholAllowed: false,
      smokingAllowed: false,
    },
    cancellation: { freeUntilHours: 72, afterPolicy: "CXL_AFTER" },
    languages: ["BM", "EN"],
    boat: { name: "", type: "", length: "", capacity: 2, features: [] },
  });

  const [serverState, setServerState] = useState<{
    ok: boolean;
    errors?: Record<string, string>;
    error?: string;
  } | null>(null);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Required";
    if (!data.location.trim()) e.location = "Required";
    if (!data.address.trim()) e.address = "Required";
    if (!data.description.trim())
      e.description = "Please describe your charter.";
    if (!data.images.length) e.images = "Add at least one image URL.";
    if (!data.trip.length) e.trip = "Add at least one trip.";
    if (!data.boat.name.trim()) e.boatName = "Required";
    if (!data.boat.type.trim()) e.boatType = "Required";
    if (!data.boat.length.trim()) e.boatLength = "Required";
    return e;
  }, [data]);

  const onSubmit = async () => {
    const fd = new FormData();
    fd.set("payload", JSON.stringify(data));
    const res = await submitCharter(fd);
    setServerState(res as any);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      {/* Left: Form */}
      <div className="space-y-8">
        <Card title="Basic Info">
          <Grid cols={2}>
            <Field
              label="Charter Name *"
              value={data.name}
              error={errors.name || serverState?.errors?.name}
              onChange={(v) => setData((d) => ({ ...d, name: v }))}
            />
            <Field
              label="Location *"
              value={data.location}
              error={errors.location || serverState?.errors?.location}
              onChange={(v) => setData((d) => ({ ...d, location: v }))}
            />
            <Field
              className="col-span-2"
              label="Address *"
              value={data.address}
              error={errors.address || serverState?.errors?.address}
              onChange={(v) => setData((d) => ({ ...d, address: v }))}
            />
          </Grid>

          <Grid cols={2}>
            <NumberField
              label="Latitude *"
              value={data.coordinates.lat}
              step="0.000001"
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  coordinates: { ...d.coordinates, lat: v },
                }))
              }
              error={serverState?.errors?.coordinates}
            />
            <NumberField
              label="Longitude *"
              value={data.coordinates.lng}
              step="0.000001"
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  coordinates: { ...d.coordinates, lng: v },
                }))
              }
            />
          </Grid>

          <Textarea
            label="Short Description *"
            value={data.description}
            onChange={(v) => setData((d) => ({ ...d, description: v }))}
            placeholder="Briefly describe your charter, water type, target species, and style."
            error={errors.description}
          />
        </Card>

        <Card title="Images">
          <Repeater
            items={data.images}
            placeholder="https://…"
            onAdd={(v) =>
              v.trim() &&
              setData((d) => ({ ...d, images: [...d.images, v.trim()] }))
            }
            onRemove={(idx) =>
              setData((d) => ({
                ...d,
                images: d.images.filter((_, i) => i !== idx),
              }))
            }
          />
          {errors.images && (
            <p className="mt-1 text-xs text-red-600">{errors.images}</p>
          )}
        </Card>

        <Card title="Trips">
          <div className="space-y-6">
            {data.trip.map((t, i) => (
              <div key={i} className="rounded-lg border border-neutral-200 p-4">
                <Grid cols={2}>
                  <Field
                    label="Name *"
                    value={t.name}
                    onChange={(v) =>
                      setData((d) => {
                        const trip = [...d.trip];
                        trip[i] = { ...trip[i], name: v };
                        return { ...d, trip };
                      })
                    }
                  />
                  <NumberField
                    label="Price (MYR) *"
                    value={t.price}
                    min={0}
                    onChange={(v) =>
                      setData((d) => {
                        const trip = [...d.trip];
                        trip[i] = { ...trip[i], price: v };
                        return { ...d, trip };
                      })
                    }
                  />
                  <Field
                    label="Duration *"
                    value={t.duration}
                    placeholder="e.g. 4 hours / 8 hours"
                    onChange={(v) =>
                      setData((d) => {
                        const trip = [...d.trip];
                        trip[i] = { ...trip[i], duration: v };
                        return { ...d, trip };
                      })
                    }
                  />
                  <NumberField
                    label="Max Anglers *"
                    value={t.maxAnglers}
                    min={1}
                    onChange={(v) =>
                      setData((d) => {
                        const trip = [...d.trip];
                        trip[i] = { ...trip[i], maxAnglers: v };
                        return { ...d, trip };
                      })
                    }
                  />
                </Grid>

                <TagInput
                  label="Start Times (HH:mm)"
                  items={t.startTimes}
                  placeholder="07:00"
                  onAdd={(v) =>
                    /^[0-2]\d:[0-5]\d$/.test(v) &&
                    setData((d) => {
                      const trip = [...d.trip];
                      trip[i] = {
                        ...trip[i],
                        startTimes: [...t.startTimes, v],
                      };
                      return { ...d, trip };
                    })
                  }
                  onRemove={(idx) =>
                    setData((d) => {
                      const trip = [...d.trip];
                      const copy = [...t.startTimes];
                      copy.splice(idx, 1);
                      trip[i] = { ...trip[i], startTimes: copy };
                      return { ...d, trip };
                    })
                  }
                />

                <Checkbox
                  label="Private"
                  checked={t.private}
                  onChange={(checked) =>
                    setData((d) => {
                      const trip = [...d.trip];
                      trip[i] = { ...trip[i], private: checked };
                      return { ...d, trip };
                    })
                  }
                />

                <Textarea
                  label="Trip Description"
                  value={t.description || ""}
                  onChange={(v) =>
                    setData((d) => {
                      const trip = [...d.trip];
                      trip[i] = { ...trip[i], description: v };
                      return { ...d, trip };
                    })
                  }
                />

                <div className="mt-3 flex justify-end">
                  {data.trip.length > 1 && (
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          trip: d.trip.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      Remove trip
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setData((d) => ({
                  ...d,
                  trip: [
                    ...d.trip,
                    {
                      name: "New Trip",
                      price: 0,
                      duration: "4 hours",
                      startTimes: ["07:00"],
                      maxAnglers: 2,
                      private: true,
                      description: "",
                    },
                  ],
                }))
              }
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
            >
              + Add trip
            </button>
          </div>
          {errors.trip && (
            <p className="mt-1 text-xs text-red-600">{errors.trip}</p>
          )}
        </Card>

        <Card title="Species & Techniques">
          <TagInput
            label="Species"
            items={data.species}
            placeholder="e.g., Peacock Bass"
            onAdd={(v) =>
              v.trim() && setData((d) => ({ ...d, species: [...d.species, v] }))
            }
            onRemove={(idx) =>
              setData((d) => ({
                ...d,
                species: d.species.filter((_, i) => i !== idx),
              }))
            }
          />
          <TagInput
            label="Techniques"
            items={data.techniques}
            placeholder="e.g., Light Tackle"
            onAdd={(v) =>
              v.trim() &&
              setData((d) => ({ ...d, techniques: [...d.techniques, v] }))
            }
            onRemove={(idx) =>
              setData((d) => ({
                ...d,
                techniques: d.techniques.filter((_, i) => i !== idx),
              }))
            }
          />
        </Card>

        <Card title="What’s Included & Excluded">
          <TagInput
            label="Includes"
            items={data.includes}
            placeholder="e.g., Life Jackets"
            onAdd={(v) =>
              v.trim() &&
              setData((d) => ({ ...d, includes: [...d.includes, v] }))
            }
            onRemove={(idx) =>
              setData((d) => ({
                ...d,
                includes: d.includes.filter((_, i) => i !== idx),
              }))
            }
          />
          <TagInput
            label="Excludes"
            items={data.excludes}
            placeholder="e.g., Meals"
            onAdd={(v) =>
              v.trim() &&
              setData((d) => ({ ...d, excludes: [...d.excludes, v] }))
            }
            onRemove={(idx) =>
              setData((d) => ({
                ...d,
                excludes: d.excludes.filter((_, i) => i !== idx),
              }))
            }
          />
          <Checkbox
            label="Fishing license provided"
            checked={data.licenseProvided}
            onChange={(checked) =>
              setData((d) => ({ ...d, licenseProvided: checked }))
            }
          />
        </Card>

        <Card title="Pickup Options">
          <Grid cols={3}>
            <Checkbox
              label="Available"
              checked={data.pickup.available}
              onChange={(checked) =>
                setData((d) => ({
                  ...d,
                  pickup: { ...d.pickup, available: checked },
                }))
              }
            />
            <Checkbox
              label="Included"
              checked={data.pickup.included}
              onChange={(checked) =>
                setData((d) => ({
                  ...d,
                  pickup: { ...d.pickup, included: checked },
                }))
              }
            />
            <NumberField
              label="Pickup Fee (optional)"
              value={data.pickup.fee ?? 0}
              min={0}
              onChange={(v) =>
                setData((d) => ({ ...d, pickup: { ...d.pickup, fee: v } }))
              }
            />
          </Grid>
          <TagInput
            label="Pickup Areas"
            items={data.pickup.areas ?? []}
            placeholder="e.g., Port Klang Jetty"
            onAdd={(v) =>
              v.trim() &&
              setData((d) => ({
                ...d,
                pickup: {
                  ...d.pickup,
                  areas: [...(d.pickup.areas ?? []), v.trim()],
                },
              }))
            }
            onRemove={(idx) =>
              setData((d) => {
                const arr = [...(d.pickup.areas ?? [])];
                arr.splice(idx, 1);
                return { ...d, pickup: { ...d.pickup, areas: arr } };
              })
            }
          />
          <Textarea
            label="Pickup Notes"
            value={data.pickup.notes ?? ""}
            onChange={(v) =>
              setData((d) => ({ ...d, pickup: { ...d.pickup, notes: v } }))
            }
          />
        </Card>

        <Card title="Policies & Cancellation">
          <Grid cols={3}>
            <Checkbox
              label="Catch & Keep"
              checked={!!data.policies.catchAndKeep}
              onChange={(checked) =>
                setData((d) => ({
                  ...d,
                  policies: { ...d.policies, catchAndKeep: checked },
                }))
              }
            />
            <Checkbox
              label="Catch & Release"
              checked={!!data.policies.catchAndRelease}
              onChange={(checked) =>
                setData((d) => ({
                  ...d,
                  policies: { ...d.policies, catchAndRelease: checked },
                }))
              }
            />
            <Checkbox
              label="Child Friendly"
              checked={!!data.policies.childFriendly}
              onChange={(checked) =>
                setData((d) => ({
                  ...d,
                  policies: { ...d.policies, childFriendly: checked },
                }))
              }
            />
            <Checkbox
              label="Live Bait Provided"
              checked={!!data.policies.liveBaitProvided}
              onChange={(checked) =>
                setData((d) => ({
                  ...d,
                  policies: { ...d.policies, liveBaitProvided: checked },
                }))
              }
            />
            <Checkbox
              label="Alcohol Allowed"
              checked={!!data.policies.alcoholAllowed}
              onChange={(checked) =>
                setData((d) => ({
                  ...d,
                  policies: { ...d.policies, alcoholAllowed: checked },
                }))
              }
            />
            <Checkbox
              label="Smoking Allowed"
              checked={!!data.policies.smokingAllowed}
              onChange={(checked) =>
                setData((d) => ({
                  ...d,
                  policies: { ...d.policies, smokingAllowed: checked },
                }))
              }
            />
          </Grid>

          <Grid cols={2}>
            <NumberField
              label="Free Cancellation Until (hours before) *"
              value={data.cancellation.freeUntilHours}
              min={0}
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  cancellation: { ...d.cancellation, freeUntilHours: v },
                }))
              }
            />
            <Field
              label="After Policy Code"
              value={data.cancellation.afterPolicy || ""}
              placeholder="e.g., CXL_AFTER"
              onChange={(v) =>
                setData((d) => ({
                  ...d,
                  cancellation: { ...d.cancellation, afterPolicy: v },
                }))
              }
            />
          </Grid>
        </Card>

        <Card title="Languages & Boat">
          <TagInput
            label="Languages (e.g., BM, EN, CN)"
            items={data.languages}
            placeholder="BM"
            onAdd={(v) =>
              v.trim() &&
              setData((d) => ({ ...d, languages: [...d.languages, v.trim()] }))
            }
            onRemove={(idx) =>
              setData((d) => ({
                ...d,
                languages: d.languages.filter((_, i) => i !== idx),
              }))
            }
          />

          <Grid cols={2}>
            <Field
              label="Boat Name *"
              value={data.boat.name}
              error={serverState?.errors?.boatName}
              onChange={(v) =>
                setData((d) => ({ ...d, boat: { ...d.boat, name: v } }))
              }
            />
            <Field
              label="Boat Type *"
              value={data.boat.type}
              error={serverState?.errors?.boatType}
              onChange={(v) =>
                setData((d) => ({ ...d, boat: { ...d.boat, type: v } }))
              }
            />
            <Field
              label="Length *"
              value={data.boat.length}
              placeholder="e.g., 23 ft"
              error={serverState?.errors?.boatLength}
              onChange={(v) =>
                setData((d) => ({ ...d, boat: { ...d.boat, length: v } }))
              }
            />
            <NumberField
              label="Capacity *"
              value={data.boat.capacity}
              min={1}
              onChange={(v) =>
                setData((d) => ({ ...d, boat: { ...d.boat, capacity: v } }))
              }
            />
          </Grid>

          <TagInput
            label="Boat Features"
            items={data.boat.features}
            placeholder="e.g., GPS/Fishfinder"
            onAdd={(v) =>
              v.trim() &&
              setData((d) => ({
                ...d,
                boat: { ...d.boat, features: [...d.boat.features, v.trim()] },
              }))
            }
            onRemove={(idx) =>
              setData((d) => {
                const features = [...d.boat.features];
                features.splice(idx, 1);
                return { ...d, boat: { ...d.boat, features } };
              })
            }
          />
        </Card>

        <div className="flex items-center gap-3">
          <SubmitButton
            disabled={!!Object.keys(errors).length}
            onClick={onSubmit}
          />
          {!!Object.keys(errors).length && (
            <p className="text-sm text-red-600">
              Please fix the highlighted fields before submitting.
            </p>
          )}
        </div>

        {serverState && (
          <p
            className={[
              "text-sm",
              serverState.ok ? "text-green-600" : "text-red-600",
            ].join(" ")}
          >
            {serverState.ok
              ? "Thanks! Your charter was submitted."
              : serverState.error || "Please fix the errors and try again."}
          </p>
        )}
      </div>

      {/* Right: JSON preview */}
      {/* <div className="lg:sticky lg:top-24 h-fit rounded-2xl border border-neutral-200 p-4">
        <h3 className="text-base font-semibold">JSON Preview</h3>
        <p className="mt-1 text-xs text-neutral-500">
          This is what we’ll submit to the server action / webhook.
        </p>
        <pre className="mt-3 max-h-[520px] overflow-auto rounded-lg bg-neutral-50 p-3 text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
        <button
          type="button"
          className="mt-3 w-full rounded-md bg-[#EC2227] px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95"
          onClick={() =>
            navigator.clipboard.writeText(JSON.stringify(data, null, 2))
          }
        >
          Copy JSON
        </button>
      </div> */}
    </div>
  );
}

//add account number
//add ic copy
//related doc
//contact number
//email
//user name
