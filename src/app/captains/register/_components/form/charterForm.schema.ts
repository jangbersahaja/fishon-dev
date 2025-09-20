import { z } from "zod";

const isClient = typeof window !== "undefined";

const fileSchema = z
  .any()
  .refine((file) => !isClient || file instanceof File, "Upload a valid file");

const tripSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  tripType: z.string().min(1, "Select a trip type"),
  price: z
    .number({ invalid_type_error: "Enter trip price" })
    .min(0, "Price must be zero or more"),
  durationHours: z
    .number({ invalid_type_error: "Enter trip duration" })
    .int("Duration must be whole hours")
    .min(1, "At least 1 hour"),
  startTimes: z
    .array(z.string().regex(/^\d{2}:\d{2}$/u, "Use 24 hour format, e.g. 07:00"))
    .min(1, "Add at least one start time"),
  maxAnglers: z
    .number({ invalid_type_error: "Enter max anglers" })
    .int("Whole numbers only")
    .min(1, "At least 1 angler"),
  charterStyle: z.enum(["private", "shared"], {
    invalid_type_error: "Select charter style",
  }),
  description: z.string().optional(),
  targetSpecies: z.array(z.string()).default([]),
  techniques: z.array(z.string()).default([]),
});

const policiesSchema = z.object({
  licenseProvided: z.boolean(),
  catchAndKeep: z.boolean(),
  catchAndRelease: z.boolean(),
  childFriendly: z.boolean(),
  liveBaitProvided: z.boolean(),
  alcoholAllowed: z.boolean(),
  smokingAllowed: z.boolean(),
});

export const charterFormSchema = z.object({
  operator: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    displayName: z.string().min(1, "Preferred operator name is required"),
    experienceYears: z
      .number({ invalid_type_error: "Enter experience in years" })
      .int("Whole numbers only")
      .min(0, "Years must be zero or more"),
    bio: z.string().min(20, "Tell anglers about yourself (min 20 characters)"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[+]?[-\d\s()]{6,}$/u, "Enter a valid phone number"),
    avatar: fileSchema.optional(),
  }),
  charterType: z.string().min(1, "Select a charter type"),
  charterName: z.string().min(1, "Charter name is required"),
  state: z.string().min(1, "Select a state"),
  district: z.string().min(1, "Select a district"),
  startingPoint: z.string().min(1, "Starting point is required"),
  postcode: z.string().regex(/^\d{5}$/u, "Use a 5 digit postcode"),
  latitude: z
    .number({ invalid_type_error: "Enter latitude" })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number({ invalid_type_error: "Enter longitude" })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  description: z.string().min(1, "Describe your charter"),
  boat: z.object({
    name: z.string().min(1, "Boat name is required"),
    type: z.string().min(1, "Boat type is required"),
    lengthFeet: z
      .number({ invalid_type_error: "Enter boat length" })
      .positive("Length must be positive"),
    capacity: z
      .number({ invalid_type_error: "Enter passenger capacity" })
      .int("Whole numbers only")
      .min(1, "At least 1 passenger"),
    features: z.array(z.string()).min(1, "Select at least one feature"),
  }),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  policies: policiesSchema,
  pickup: z
    .object({
      available: z.boolean(),
      fee: z.number().nullable(),
      areas: z.array(z.string()),
      notes: z.string().optional(),
    })
    .superRefine((val, ctx) => {
      if (val.available && !Number.isFinite(val.fee ?? NaN)) {
        ctx.addIssue({
          path: ["fee"],
          code: z.ZodIssueCode.custom,
          message: "Enter pickup fee",
        });
      }
    }),
  trips: z.array(tripSchema).min(1, "Add at least one trip"),
  photos: z
    .array(fileSchema)
    .min(3, "Upload at least 3 photos")
    .max(15, "Maximum 15 photos"),
  videos: z.array(fileSchema).max(3, "Maximum 3 videos").optional().default([]),
  pricingModel: z.enum(["basic", "silver", "gold"], {
    errorMap: () => ({ message: "Choose a pricing plan" }),
  }),
});

export type CharterFormValues = z.infer<typeof charterFormSchema>;

export { policiesSchema, tripSchema };
