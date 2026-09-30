# Vehicle suggestions

Implemented one shared rule set for the home fleet, vehicles page and ride planner.

- 1–4 guests: fitting cars and compact vans; 5–14: fitting group/KDH vans; 15–55: fitting buses. The current largest van seats 14, so a party of 15 also needs a bus.
- Explicit bus hire: fitting buses regardless of group size.
- Wedding parties of up to three: wedding car; larger parties: passenger transport by group size.
- Goods transport: enclosed lorry or KAMA 1–3T mini truck, with at most one accompanying passenger. Drivers are excluded from passenger counts.
- Invalid counts produce no suggestions and allow an assisted enquiry. Never suggest an undersized vehicle.
- Reconcile vehicle choices centrally whenever requirements change. Validate again before leaving vehicle selection.
- Keep luggage/load suitability subject to operator confirmation; do not invent luggage or payload capacities. Collect cargo requirements through the enquiry notes.
- KAMA uses an explicitly illustrative SVG pending availability of the supplied photo as a local asset. The 1–3T product name is not a guaranteed payload.

Verification: boundary counts, service isolation, selection invalidation, enquiry naming, build, lint and browser interaction.
