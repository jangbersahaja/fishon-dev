// <Field
//   label="Select your pricing plan"
//   error={fieldError("pricingModel")}
//   className="mt-8"
// >
//   <div className="grid gap-4 sm:grid-cols-3">
//     {pricingCards.map((card) => (
//       <button
//         key={card.id}
//         type="button"
//         onClick={() =>
//           setValue("pricingModel", card.id, { shouldValidate: true })
//         }
//         className={clsx(
//           "flex h-full flex-col justify-between rounded-2xl border px-5 py-4 text-left transition",
//           watch("pricingModel") === card.id
//             ? "border-transparent text-white"
//             : "border-neutral-200 bg-white text-slate-700 hover:border-slate-300"
//         )}
//         style={
//           watch("pricingModel") === card.id
//             ? {
//                 borderColor: ACCENT,
//                 backgroundColor: ACCENT_TINT,
//               }
//             : undefined
//         }
//       >
//         <div>
//           <span className="text-3xl font-bold text-slate-900">
//             {card.percentage}
//           </span>
//           <h3 className="mt-2 text-base font-semibold text-slate-800">
//             {card.title}
//           </h3>
//           <ul className="mt-3 space-y-1 text-sm text-slate-700">
//             {card.features.map((feature) => (
//               <li key={`${card.id}-${feature}`}>• {feature}</li>
//             ))}
//           </ul>
//         </div>
//         <span
//           className={clsx(
//             "mt-4 inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold",
//             watch("pricingModel") === card.id
//               ? "text-white"
//               : "border-neutral-200 text-slate-600"
//           )}
//           style={
//             watch("pricingModel") === card.id
//               ? { borderColor: ACCENT, backgroundColor: ACCENT }
//               : undefined
//           }
//         >
//           {watch("pricingModel") === card.id ? "Selected" : "Select"}
//         </span>
//       </button>
//     ))}
//   </div>
// </Field>;
