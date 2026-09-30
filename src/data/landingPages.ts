export type LandingPage = {
  slug: string; title: string; description: string; service: string; intro: string;
  sections: { heading: string; text: string }[];
  checklist: string[]; vehicleIds: string[]; faqs: [string, string][];
};
export const landingPages: LandingPage[] = [
  {
    slug: "airport-transfer", title: "Airport Transfers from Wattala & Colombo", service: "airport",
    description: "Plan a Bandaranaike Airport pickup or drop-off with PINS Cabs. Share your flight, luggage and destination for vehicle and price confirmation.",
    intro: "Arrange your journey to or from Bandaranaike International Airport with a pickup plan that accounts for your flight and luggage. PINS Cabs is based in Wattala and accepts airport transfer enquiries for Wattala, Colombo and onward destinations.",
    sections: [
      { heading: "Arriving at the airport", text: "Include your flight number, arrival date and destination address. Tell us how many people are travelling and whether you have large suitcases, a stroller or other bulky items. Confirm the meeting point and contact arrangements directly before travelling; an arrival time alone is not a pickup agreement." },
      { heading: "Leaving for a flight", text: "Provide your pickup address, flight departure time and any stops needed along the way. Agree a pickup time that leaves room for road conditions and your airline's check-in requirements. For an early or late journey, confirm availability before relying on the arrangement." },
      { heading: "Choose for people and luggage", text: "A car may suit a small party, while a KDH van gives a larger group another option. Seat count does not guarantee space for every suitcase. Describe your bags so PINS Cabs can confirm the actual seating and luggage layout, along with any waiting or parking charges." },
    ],
    checklist: ["Flight number and arrival or departure time", "Pickup point and final address", "Passengers, suitcases and bulky items", "Meeting point, waiting and parking arrangements"],
    vehicleIds: ["alto", "aqua", "kdh-9", "kdh-14"],
    faqs: [["Can I request an airport pickup at night?", "PINS Cabs accepts enquiries around the clock. Send your date and flight details so the team can confirm vehicle availability and the pickup arrangement."], ["What if my flight changes?", "Contact PINS Cabs with the revised flight details and agree any change to the pickup time. Automatic flight tracking or free waiting is not promised by this enquiry form."]],
  },
  {
    slug: "taxi-wattala", title: "Taxi Service in Wattala", service: "city",
    description: "Request a taxi from Wattala with PINS Cabs, based on Negombo–Colombo Main Road. Plan local pickups, return journeys and airport connections.",
    intro: "Start a local taxi enquiry with a Wattala-based business. PINS Cabs is at No. 133, Negombo–Colombo Main Road, Wattala 11300. Share your exact pickup and destination to request a car or a suitable group vehicle.",
    sections: [
      { heading: "Make your local pickup easy to find", text: "For a home, shop or office pickup, select the entrance on the map rather than only entering Wattala. Add a nearby landmark or lane name where useful. If a larger van cannot stop outside, agree a convenient meeting point before the journey." },
      { heading: "One-way trips and planned returns", text: "Use a one-way enquiry for a simple drop-off. If you need to come back after an appointment, add a return date and time. Tell the team whether you need the vehicle to wait or return later, because these are different arrangements and may be priced differently." },
      { heading: "Connecting Wattala with your next stop", text: "For a journey into Colombo, include the building or venue entrance and the time you need to arrive. For an airport connection, choose the airport transfer service and add flight details. Travel beyond the local area can be discussed as an outstation enquiry." },
    ],
    checklist: ["Map pin for the pickup entrance", "Destination and appointment time", "One-way or return arrangement", "Passengers and bags"], vehicleIds: ["alto", "wagon-r", "aqua", "suzuki-every"],
    faqs: [["Where is PINS Cabs based?", "The listed address is No. 133, Negombo–Colombo Main Road, Wattala 11300. Use the Contact page for the map link and phone number."], ["Does submitting the planner dispatch a taxi?", "No. The planner prepares an enquiry for you to send on WhatsApp. PINS Cabs must confirm the vehicle, pickup and price before the booking is agreed."]],
  },
  {
    slug: "taxi-colombo", title: "Taxi Enquiries for Colombo Journeys", service: "city",
    description: "Plan a Colombo taxi journey with PINS Cabs. Specify hotel, office or venue entrances, pickup timing and return needs for a clear quote.",
    intro: "Request a Colombo pickup or drop-off through PINS Cabs in Wattala. For office visits, hotel departures and personal appointments, a precise meeting point helps the team assess the route and confirm the journey.",
    sections: [
      { heading: "Hotel and building pickups", text: "Give the hotel or building name and identify the entrance where you will wait. A street address may cover more than one access point. Share reception instructions, a landmark or a map pin, and keep a contact number available for pickup coordination." },
      { heading: "Plan around arrival times", text: "If you must reach an appointment, station or event at a particular time, include that in your requirements as well as your preferred pickup time. Road conditions and access restrictions can affect a Colombo journey; agree a practical departure time with the team." },
      { heading: "Several stops or an evening return", text: "List additional stops and their order in the enquiry notes. For a return journey, say whether you know the collection time or need to discuss it. If you are travelling to the airport rather than making a city trip, use the airport service so flight and luggage requirements are captured." },
    ], checklist: ["Hotel, office or venue name and entrance", "Preferred pickup and required arrival time", "Additional stops in order", "Return pickup details if needed"], vehicleIds: ["alto", "wagon-r", "aqua", "suzuki-every"],
    faqs: [["Does PINS Cabs have a Colombo branch?", "The business address listed on this site is in Wattala. Colombo journeys are handled by enquiry; confirm pickup availability directly."], ["Can I add stops to a Colombo trip?", "Yes, describe the stops and expected waiting in your requirements. Ask the team to confirm the full itinerary and price before booking."]],
  },
  {
    slug: "outstation-taxi", title: "Outstation Taxi & Van Enquiries", service: "outstation",
    description: "Plan an outstation journey from Wattala or Colombo. Share your itinerary, return plans and luggage needs for a suitable car or van enquiry.",
    intro: "For travel beyond the city, plan the whole journey before choosing a vehicle. PINS Cabs accepts outstation enquiries with your destinations, dates, passenger count and luggage needs, then confirms route suitability and availability.",
    sections: [
      { heading: "Describe the itinerary, not only the last stop", text: "Include the starting point, final destination and any places you want to visit on the way. For several days of travel, list the overnight stops and approximate daily plan. This gives the team a clearer basis for assessing the vehicle and quote." },
      { heading: "One-way, return or multi-day", text: "A one-way drop-off, same-day return and multi-day tour have different scheduling needs. State when you expect to return and whether the vehicle is needed between transfers. Discuss driver arrangements and any overnight requirements directly before confirming." },
      { heading: "Understand what the quote includes", text: "Ask about the agreed route, distance or time basis, waiting, additional stops, tolls and parking. Share luggage and comfort preferences, including whether you need air conditioning. A listed vehicle class is a starting point; the team confirms the exact vehicle for your itinerary." },
    ], checklist: ["Trip dates and overnight stops", "Full route and sightseeing stops", "Return time or one-way drop-off", "Luggage, comfort preferences and quote inclusions"], vehicleIds: ["aqua", "kdh-9", "kdh-14"],
    faqs: [["Can I request a multi-day journey?", "Yes. Use the requirements field to outline the dates and itinerary, then discuss vehicle and driver availability directly."], ["Are tolls and parking included?", "The website does not publish an inclusive outstation tariff. Ask PINS Cabs to specify what is included in your individual quote."]],
  },
  {
    slug: "wedding-car-hire", title: "Wedding Car Hire Enquiries", service: "wedding",
    description: "Discuss wedding car hire with PINS Cabs. Share ceremony timing, venues, decoration preferences and guest transport needs for confirmation.",
    intro: "Plan the arrival, photographs and onward journey together. A PINS Cabs wedding enquiry helps you share your schedule and preferred vehicle class before the team confirms the actual car and arrangements.",
    sections: [
      { heading: "Build the car booking around your schedule", text: "List the preparation address, ceremony venue, photography stops and reception venue. Include the times the car is needed at each point and any waiting periods. If the event spans more than one day, identify which journeys need transport." },
      { heading: "Confirm the car and presentation", text: "The luxury wedding car shown on the site illustrates a class, not a guaranteed make or model. Ask for the actual vehicle details before booking. Discuss decorations, who supplies them, setup time and any restrictions on attaching flowers or accessories." },
      { heading: "Separate the couple's car from guest transport", text: "Tell us who is travelling in the wedding car, including any accompanying family members. Larger guest groups may need KDH vans or buses with their own pickup schedules. Send the guest count and venue access details so those journeys can be coordinated separately." },
    ], checklist: ["Ceremony and reception times", "Photography stops and waiting periods", "Vehicle and decoration preferences", "Separate guest transport requirements"], vehicleIds: ["wedding-luxury"],
    faqs: [["Can I book the exact car in the picture?", "Images are illustrative. Ask the team to confirm the make, model and presentation of the available wedding car."], ["Can you discuss transport for wedding guests?", "Yes. Share guest numbers and pickup points. Vans or buses can be considered separately from the wedding car, subject to availability."]],
  },
  {
    slug: "staff-transport", title: "Staff Transport Planning & Enquiries", service: "staff",
    description: "Discuss staff transport with PINS Cabs. Provide shift times, pickup stops, working days and employee numbers for a route and vehicle proposal.",
    intro: "A useful staff transport enquiry starts with the route and working schedule. PINS Cabs can discuss regular employee journeys or one-off work trips once the pickup points, shifts and passenger numbers are clear.",
    sections: [
      { heading: "Map the employee pickup route", text: "List pickup stops in order with the expected passenger count at each stop. Use agreed meeting points where a vehicle can stop safely. Include the workplace entrance and the time employees need to arrive, rather than only a general start time." },
      { heading: "Account for shifts and working days", text: "Specify weekdays, weekends or rotating rosters and identify different outbound and return shifts. If passenger numbers vary, provide the maximum expected on each run. Confirm how schedule changes and cancellations will be communicated." },
      { heading: "Agree operational details before starting", text: "Discuss the vehicle class, seating, air conditioning, waiting policy and contact arrangements. For ongoing service, agree payment terms and what happens when the normal vehicle or schedule changes. The online enquiry does not create a recurring transport contract." },
    ], checklist: ["Workplace entrance and arrival deadline", "Pickup stops and passenger count per stop", "Shift times and working days", "Start date and regular or one-off requirement"], vehicleIds: ["non-ac-van", "kdh-14", "bus-29", "bus-35", "bus-55"],
    faqs: [["Can staff transport cover different shifts?", "Send each shift's times, route and passenger numbers. PINS Cabs will discuss whether the required schedule can be accommodated."], ["Which vehicle should we request?", "Use the maximum passenger count for the run. A van may suit a smaller team; larger groups need a bus with sufficient seats. Confirm the final layout and comfort requirements."]],
  },
  {
    slug: "bus-hire", title: "Bus Hire for Group Journeys", service: "long-trip",
    description: "Compare 29, 35 and 55-seater bus classes for outings, events and long-distance journeys. Request availability and pricing from PINS Cabs.",
    intro: "Keep a larger group's itinerary in one enquiry. PINS Cabs lists 29, 35 and 55-seater bus classes for group travel, with the exact bus, seating layout and availability confirmed before booking.",
    sections: [
      { heading: "Choose a bus by confirmed passenger count", text: "Count everyone needing a passenger seat and tell us about luggage or equipment. A 29-seater class cannot accommodate a party of 30. The planner filters buses by the number you enter, while the team checks the actual vehicle and usable space." },
      { heading: "Give the route and access details", text: "List collection points, rest stops, venues and the final return point. Tell us if a venue has a narrow entrance or limited parking. The team needs to consider the vehicle's access as well as the distance travelled." },
      { heading: "Confirm comfort and trip inclusions", text: "State whether air conditioning is required and ask which bus is available. Discuss departure and return times, waiting at the venue, tolls, parking and any driver arrangements for a long journey. Do not assume all bus classes have the same facilities." },
    ], checklist: ["Total passengers and luggage", "Pickup stops and departure time", "Venue access and bus parking", "Return time and AC preference"], vehicleIds: ["bus-29", "bus-35", "bus-55"],
    faqs: [["What bus sizes are listed?", "The site lists 29, 35 and 55-seater classes. Availability and the exact seating layout are confirmed directly."], ["What if our group has more than 55 passengers?", "Contact PINS Cabs to discuss the group as a whole and whether more than one vehicle can be arranged. Do not enter a smaller count to select a single bus."]],
  },
  {
    slug: "kdh-van-hire", title: "KDH Van Hire for Families & Groups", service: "outstation",
    description: "Explore 9-seater and 14-seater KDH van classes with PINS Cabs. Plan family trips, airport transfers and group journeys with luggage guidance.",
    intro: "Compare KDH van classes for family travel, airport journeys and small-group outings. PINS Cabs lists a 9-seater KDH and a 14-seater high-roof class, with actual seating and luggage fit confirmed before booking.",
    sections: [
      { heading: "Nine seats or fourteen?", text: "Start with the number of guests, excluding the driver. The 9-seater class suits a group within that capacity; larger parties can discuss the 14-seater high-roof option. If you need more than 14 passenger seats, consider a bus rather than exceeding a van's listed capacity." },
      { heading: "Leave room for luggage", text: "A full passenger load and several large suitcases may require a different arrangement. Tell the team the number and size of bags, plus strollers, sports equipment or other bulky items. Confirm the actual cabin and storage layout rather than relying only on the seat count." },
      { heading: "Match the van to the journey", text: "For airport transfers, include flight details and the meeting point. For an outstation trip, provide the route and return plan. Mention AC and access requirements, and ask the team to confirm the KDH class available for your dates. A separate non-AC van class is also listed on the fleet page." },
    ], checklist: ["Passenger count excluding the driver", "Bag count and bulky equipment", "Airport flight or outstation itinerary", "Preferred KDH class and travel dates"], vehicleIds: ["kdh-9", "kdh-14"],
    faqs: [["Can 15 passengers use the listed KDH vans?", "The largest KDH class listed here seats 14 guests. For 15 or more passengers, request a suitable bus or discuss separate vehicles."], ["Does a high roof guarantee enough luggage space?", "No. Seat configuration and bag sizes matter. Describe the luggage and confirm the actual vehicle layout before booking."]],
  },
  {
    slug: "lorry-transport", title: "Lorry Transport & Mini Truck Enquiries", service: "lorry",
    description: "Request a KAMA mini truck or enclosed goods lorry from PINS Cabs. Share load dimensions, weight, loading access and delivery details.",
    intro: "Arrange goods transport around the load, not a passenger count. PINS Cabs lists a KAMA 1–3T mini truck class and an enclosed goods lorry for delivery and moving enquiries, subject to load and vehicle confirmation.",
    sections: [
      { heading: "Describe what needs moving", text: "List the main items, their approximate dimensions and estimated total weight. Mention fragile pieces, items that cannot be stacked and anything that needs to remain upright. The KAMA 1–3T name is not a guaranteed payload for the vehicle assigned to your job." },
      { heading: "Open bed or enclosed body", text: "The mini truck is shown with an open cargo bed; the enclosed lorry offers a different body style. Discuss weather protection, securing the load and whether the items fit through the cargo opening. Confirm the actual body dimensions and payload before choosing." },
      { heading: "Plan loading and unloading", text: "Provide both addresses and explain gates, narrow lanes, stairs or limited stopping space. Say who will load and unload and whether you need help. Loading labour, packaging and lifting equipment should be agreed explicitly rather than assumed to be included." },
    ], checklist: ["Item list, dimensions and estimated weight", "Pickup and delivery access", "Weather protection and securing requirements", "Loading help and accompanying passenger"], vehicleIds: ["kama-mini-truck", "lorry"],
    faqs: [["Can a lorry be used for a passenger group?", "No. The listed lorries are goods vehicles, with guidance for one accompanying passenger plus the driver. Use a passenger van or bus for group travel."], ["Is loading help included?", "Loading assistance is not automatically included by this site. Describe what help or equipment you need and confirm the arrangement and price directly."]],
  },
];
export const serviceLandingLinks: Record<string, string> = { airport: "/airport-transfer/", city: "/taxi-wattala/", outstation: "/outstation-taxi/", wedding: "/wedding-car-hire/", staff: "/staff-transport/", "long-trip": "/bus-hire/", lorry: "/lorry-transport/" };
