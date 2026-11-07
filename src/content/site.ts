// All copy and facts, from soneva.com (checked 2026-11-06). Photographs © Soneva, taken from its official pages
// for this portfolio concept: not licensed for commercial use.

export type Media = { src: string; alt: string };
const p = (name: string, alt: string): Media => ({ src: `/media/official/${name}.webp`, alt });

export const media = {
  roof: p("x-roof", "Overwater villas seen from above, along a curving jetty over turquoise water"),
  paddle: p("x-paddle", "A paddleboard from above, on clear water beside a pale sand spit"),
  breakfast: p("x-floating-breakfast", "A wicker tray of breakfast floating on a private pool"),
  turtle: p("x-turtle", "A snorkeller swimming down towards a sea turtle over the reef"),
  cinema: p("x-cinema", "Guests on a jetty at dusk, watching a film on a screen over the lagoon"),
  crab: p("x-crab-table", "A table set among rope swings at Crab Shack, by the beach"),
  primitive: p("x-primitive", "Timber tables under a thatched roof at Primitive"),
  directors: p("x-directors", "Sushi and sashimi being glazed at Director's Cut"),
  asian: p("x-asian", "The organic garden of Asian Kitchen in the Garden, from above"),
  tipsy: p("x-tipsy", "The Tipsy cocktail tuk tuk on the beach at sunset"),
  icecream: p("x-icecream", "Scoops of ice cream with cones in a white bowl"),
  overwaterDining: p("x-bespoke", "An overwater dining deck beside the island and its thatched roofs"),
  soul: p("x-soul-arch", "The thatched roofs of Soneva Soul in the trees above the sea"),
  yoga: p("x-yoga", "Aerial yoga in an open pavilion at Soneva Soul"),
  treatment: p("x-treatment", "A treatment room under a thatched dome, open to the garden"),
  pilates: p("x-pilates", "A guest on a Pilates reformer"),
  watersports: p("x-watersports", "A small catamaran with a red striped sail on the turquoise lagoon"),
  floating: p("x-floating", "A swimmer floating in clear shallow water, from above"),
  sandbank: p("x-sandbank", "A table set for two on a white sandbank in the lagoon"),
  den: p("x-den", "The Den, a domed children's building among palms at dusk"),
  tennis: p("x-tennis", "The tennis court among the island's trees, from above"),
  jetty: p("x-jetty", "Overwater villas along a winding jetty, from above"),
  aerial105: p("x-105", "Villa 105 and its pool in front of a ring-shaped jetty"),
  day: p("x-day", "Five overwater villas along a curving boardwalk"),
  aerial28: p("reserve-28-3", "A villa with thatched roofs and a pool in deep green forest, from above"),
  pool28: p("reserve-28-4", "A blue pool winding through palms beside a villa, from above"),
  pool30: p("retreat-30-1", "A beachfront villa with a round pool and a blue slide"),
  sunset2: p("sunset-2-1", "An overwater villa and its pool, from directly above"),
} satisfies Record<string, Media>;

export const links = {
  resort: "https://soneva.com/resorts/soneva-jani/",
  villas: "https://soneva.com/resorts/soneva-jani/villas/",
  dining: "https://soneva.com/resorts/soneva-jani/dining/",
  wellness: "https://soneva.com/resorts/soneva-jani/wellness/",
  experiences: "https://soneva.com/resorts/soneva-jani/experiences/",
  journey: "https://soneva.com/resorts/soneva-jani/your-journey-soneva-jani/",
  offers: "https://soneva.com/resorts/soneva-jani/offers/",
  stewardship: "https://soneva.com/about-soneva/stewardship/",
  contact: "https://soneva.com/contact-us/",
  whatsapp: "https://wa.me/9607223378",
  maps: "https://www.google.com/maps?q=5.7216,73.4147",
};

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/soneva" },
  { label: "Facebook", href: "https://www.facebook.com/SonevaOfficial/" },
  { label: "TikTok", href: "https://www.tiktok.com/@sonevaofficial" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/soneva/" },
];

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Villas", href: "#villas" },
  { label: "Experiences", href: "#experiences" },
  { label: "Gallery", href: "#gallery" },
  { label: "Destination", href: "#destination" },
  { label: "Book Your Stay", href: "#book" },
];

export const facts = [
  ["150 acres", "of island on Medhufaru"],
  ["5 islets", "in the private archipelago, 4 left untouched"],
  ["10 villa types", "over the water and on the beach"],
  ["13 places", "to eat and drink"],
];

export const day = [
  { when: "First light", hour: 6.4, title: "Sunrise, from the water", text: "Yoga as the day begins, or a paddle out across the lagoon before anyone else is up.", image: media.paddle },
  { when: "Morning", hour: 10, title: "Breakfast floats to you", text: "It arrives in your private pool, with the slide into the sea a few steps away.", image: media.breakfast },
  { when: "Afternoon", hour: 14, title: "Under the surface", text: "Snorkel the Medhufaru lagoon reef for turtles, rays and everything that lives between them.", image: media.turtle },
  { when: "After dark", hour: 21.5, title: "Films above the lagoon", text: "Cinema Paradiso shows classic films over the water. Back at the villa, the roof rolls back to the stars.", image: media.cinema },
];

export type Villa = {
  id: string; name: string; note?: string; kind: "water" | "island"; signature?: boolean; bedrooms: number; area: number;
  sleeps: string; line: string; detail?: string; url: string; images: Media[];
};
const url = (s: string) => `https://soneva.com/villa/soneva-jani-${s}/`;
const shots = (id: string, label: string, parts: [number, string][]): Media[] => parts.map(([n, what]) => p(`${id}-${n}`, `${label}: ${what}`));
const S3 = "3 adults, or 2 adults and 2 children", S7 = "7 adults, or 6 adults and 2 children", S9 = "9 adults, or 8 adults and 2 children";

export const villas: Villa[] = [
  { id: "water-1", name: "Water Reserve with Slide", kind: "water", bedrooms: 1, area: 555, sleeps: S3, url: url("1-bedroom-water-reserve-with-slide"),
    line: "Lagoon views, a private pool, a generous deck and a slide into the sea.",
    images: shots("water-1", "1 Bedroom Water Reserve", [[1, "the villa, deck, pool and slide over the lagoon"], [3, "bedroom at sunset"], [6, "living room opening to the deck"], [2, "bed in afternoon light"], [5, "vanity"]]) },
  { id: "water-2", name: "Water Reserve with Slide", kind: "water", bedrooms: 2, area: 772, sleeps: S3, url: url("2-bedroom-water-reserve-with-slide"),
    line: "Spacious and serene, with panoramic views, wide decks, a private pool and a slide.",
    detail: "A vast deck with loungers, a swing and catamaran nets surrounds the freshwater pool. A curved slide runs straight into the lagoon, and a sunken circular lounge looks out over the ocean.",
    images: shots("water-2", "2 Bedroom Water Reserve", [[1, "pool, deck and slide"], [2, "bedroom"], [4, "living room"], [3, "outdoor bath on the deck"], [5, "daybed facing the deck"]]) },
  { id: "sunset-2", name: "Sunset Water Reserve with Slide", kind: "water", bedrooms: 2, area: 772, sleeps: S3, url: url("2-bedroom-sunset-water-reserve-with-slide"),
    line: "Turned towards the setting sun, with endless horizon views and a slide into calm water.",
    detail: "The same vast deck, swing and catamaran nets, with the sunken circular lounge facing the sunset.",
    images: shots("sunset-2", "2 Bedroom Sunset Water Reserve", [[1, "the villa from directly above"], [2, "deck and infinity pool at sunset"], [3, "bedroom"], [4, "bedroom and vanity at dusk"]]) },
  { id: "sunset-4", name: "Sunset Water Reserve with Slide", note: "Villa 105", kind: "water", signature: true, bedrooms: 4, area: 1421, sleeps: S9, url: url("4-bedroom-sunset-water-reserve-with-slide-villa-105"),
    line: "An overwater sanctuary facing the open horizon, in complete seclusion.",
    detail: "Spread across two floors, with sunset views, a private pool and a curved slide straight into the lagoon.",
    images: shots("sunset-4", "Villa 105", [[1, "the villa and its pool in the lagoon"], [5, "double-height living room at sunset"], [2, "bedroom facing the sea"], [4, "kitchen and bar"], [6, "games room"]]) },
  { id: "beach-1", name: "Beach Hideaway", kind: "island", bedrooms: 1, area: 480, sleeps: S3, url: url("1-bedroom-beach-hideaway"),
    line: "On the shoreline, with open living areas flowing to a private pool and gardens.",
    images: shots("beach-1", "1 Bedroom Beach Hideaway", [[1, "the villa and pool at dusk"], [2, "garden, swing and pool"]]) },
  { id: "retreat-2", name: "Island Retreat with Slide", kind: "island", bedrooms: 2, area: 446, sleeps: S3, url: url("2-bedroom-island-retreat-with-slide"),
    line: "Lush gardens near the shore, a private pool and a slide.",
    images: shots("retreat-2", "2 Bedroom Island Retreat", [[1, "the villa, pool and slide among trees"], [5, "lounge beside the pool"], [2, "bedroom"], [3, "outdoor bath"], [6, "terrace lounge"]]) },
  { id: "retreat-30", name: "Island Retreat with Slide", note: "Villa 30", kind: "island", bedrooms: 3, area: 755, sleeps: S7, url: url("3-bedroom-island-retreat-with-slide-villa-30"),
    line: "On soft white sand, opening to endless ocean horizons, with a slide into calm water.",
    images: shots("retreat-30", "Villa 30", [[1, "the villa, round pool and slide"], [2, "bedroom"], [5, "entrance"], [3, "bathroom"]]) },
  { id: "retreat-29", name: "Island Retreat with Slide", note: "Villa 29", kind: "island", bedrooms: 3, area: 1128, sleeps: S7, url: url("3-bedroom-island-retreat-with-slide-villa-29"),
    line: "Fringed by turquoise water, framing sweeping lagoon views from sunrise to sunset.",
    images: shots("retreat-29", "Villa 29", [[1, "the villa, pool and slide"], [2, "terrace and pool"], [3, "bedroom"], [6, "stone bath"], [5, "bedroom corridor"]]) },
  { id: "reserve-34", name: "Island Reserve with Slide", note: "Villa 34", kind: "island", signature: true, bedrooms: 3, area: 1796, sleeps: S7, url: url("3-bedroom-island-reserve-with-slide-villa-34"),
    line: "Tucked into gardens by the beach, with expansive living made for togetherness.",
    detail: "Its design follows the gentle curves found in nature, with not a straight line in sight.",
    images: shots("reserve-34", "Villa 34", [[1, "the villa and pool on the beach"], [3, "pool and slide among palms"], [2, "bedroom"], [4, "bath opening to a garden pool"], [5, "basins in the garden"]]) },
  { id: "reserve-28", name: "Island Reserve with Slide", note: "Villa 28", kind: "island", signature: true, bedrooms: 4, area: 1788, sleeps: S9, url: url("4-bedroom-island-reserve-with-slide-villa-28"),
    line: "Set back from the shore in tropical seclusion, with a signature pool and wide terraces.",
    detail: "The pool has its own water slide and a dedicated children's pool.",
    images: shots("reserve-28", "Villa 28", [[1, "the villa in the forest, from above"], [4, "the winding pool from above"], [3, "roofs and pool from above"], [6, "pool, slide and terrace"], [2, "bedroom"]]) },
];

export const inclusions = [
  "A Barefoot Butler for personalised service",
  "Children stay and dine for free",
  "Unlimited chocolates, ice creams and gourmet delicacies, day and night",
  "The Den, the award-winning kids club",
  "Complimentary wellbeing experiences",
  "Bicycles and tricycles",
];

type Tile = { name: string; what: string; image: Media };
export const discover: { id: string; title: string; lead: string; href: string; cta: string; tiles: Tile[]; more: [string, string][] }[] = [
  {
    id: "dining", title: "Dining", lead: "Sea to table and garden to plate, with breakfast served over the water.", href: links.dining, cta: "All restaurants",
    tiles: [
      { name: "Crab Shack", what: "Sri Lankan seafood and rosé, with lagoon views", image: media.crab },
      { name: "Primitive", what: "Maldivian flavours over open fire", image: media.primitive },
      { name: "Director's Cut", what: "Japanese, with teppanyaki and an irori grill", image: media.directors },
      { name: "Asian Kitchen in the Garden", what: "Asian cooking, in the garden", image: media.asian },
      { name: "Tipsy", what: "Cocktails, mixed to order and delivered by tuk tuk", image: media.tipsy },
      { name: "The Chocolate Room", what: "Handmade chocolates, ice creams and sorbets", image: media.icecream },
    ],
    more: [["SAJI", "Indonesian flavours and culinary heritage"], ["The Lagoon Club", "International"], ["Chill", "Maldivian and Peruvian"], ["The Wine Cellar", "Rare vintages, organic wines and pairings"], ["The Cheese Room", "Aged cheeses, charcuterie and preserves"]],
  },
  {
    id: "wellbeing", title: "Wellbeing", lead: "Soneva Soul brings restorative practice to the island: breath, recovery and ritual.", href: links.wellness, cta: "Soneva Soul",
    tiles: [
      { name: "Soneva Soul", what: "The island's wellbeing sanctuary", image: media.soul },
      { name: "Aerial yoga", what: "Stretching while suspended above the island", image: media.yoga },
      { name: "Blissful Marma massage", what: "Ayurvedic bodywork and energy balancing", image: media.treatment },
      { name: "Pilates reformer", what: "Personal sessions for strength and mobility", image: media.pilates },
    ],
    more: [["Sunrise and sunset yoga", "From first light to dusk"], ["Thai Tok Sen", "Traditional wooden tapping to release tension"], ["Private pranayama", "Breathwork for focus and calm"], ["Peaceful Mind meditation", "Guided mindfulness"]],
  },
  {
    id: "water", title: "On the water", lead: "From a drift across the lagoon to days at sea between atolls.", href: links.experiences, cta: "All experiences",
    tiles: [
      { name: "Medhufaru lagoon snorkelling", what: "Turtles, rays and reef life", image: media.floating },
      { name: "Water sports", what: "Paddleboards, kayaks, sailing and hydrofoil", image: media.watersports },
      { name: "Drift and Dine", what: "A private chef's picnic on a secluded stretch of sand", image: media.sandbank },
    ],
    more: [["Diving", "Coral reef dives with Soleni Dive Centre"], ["Guided snorkelling", "Reefs beyond the lagoon, led by experts"], ["Soneva in Aqua", "Private voyages between atolls, with two cabins and a crew"]],
  },
  {
    id: "island", title: "On the island", lead: "Slow afternoons, long tables, and a place for children to run the show.", href: links.experiences, cta: "All experiences",
    tiles: [
      { name: "The Den", what: "A zipline, a pirate ship and a swim-up mocktail bar", image: media.den },
      { name: "Tennis and padel", what: "At an easy pace, among the island's greenery", image: media.tennis },
      { name: "Cinema Paradiso", what: "Classic films above the lagoon", image: media.cinema },
    ],
    more: [["Cooking class", "Regional flavours with the chefs, then you eat them"], ["Wine tastings", "The stories and provenance behind the vintages"]],
  },
];

export const gallery: Media[] = [media.jetty, media.aerial105, media.sandbank, media.pool28, media.pool30, media.day, media.overwaterDining, media.sunset2];

// Coordinates: OpenStreetMap. Distances from Malé are straight lines calculated from them.
// Boxes are 4:5, the shape of the map frame, so nothing they contain can be cropped.
export const destination = {
  coords: "5°43′N 73°25′E",
  stops: [
    { id: "route", label: "From Malé", title: "About 170 km north of Malé", text: "The route from Velana International Airport runs up the chain of atolls to the Noonu Atoll, in the north of the Maldives.", box: [7, 330, 1424, 1780] },
    { id: "atoll", label: "Noonu Atoll", title: "In the Noonu Atoll", text: "Noonu lies roughly 635 km north of the equator. Maafaru International Airport is in the same atoll, 7¾ nautical miles from the resort.", box: [420, 170, 480, 600] },
    { id: "islet", label: "Medhufaru", title: "On Medhufaru", text: "A 150-acre island in a private archipelago of five islets, four of them untouched. It runs about 1.8 km from end to end.", box: [650, 471, 24, 30] },
  ],
  routes: [
    { name: "By seaplane", time: "About 40 minutes", text: "From Velana International Airport in Malé. It lands on water, so it flies only between sunrise and sunset." },
    { name: "By air and speedboat", time: "About 40 minutes", text: "A 30-minute domestic flight from Malé to Maafaru, then a 10-minute speedboat to the resort." },
    { name: "From Soneva Fushi", time: "20 to 60 minutes", text: "A seaplane in about 20 minutes, or a speedboat in about 60." },
  ],
};

export const stewardship = [
  ["Coral", "Soneva Conservation & Sustainability Maldives restores reefs using more than ten regeneration methods, from its AquaTerra base."],
  ["Waste", "Soneva states that 90% of its solid waste is recycled, with organic waste composted on the island."],
  ["Protected", "In 2026 Soneva Jani became the first Maldives resort recognised with OECM status, supporting the country's 30×30 conservation target."],
  ["Neighbours", "Soneva Namoona works with nearby Maldivian communities on reducing and recycling waste, including an Eco Centro on Maalhos."],
];

export const plan = [
  ["When should my flight land?", "To reach the resort by seaplane on the same day, your international flight should land in Malé by 15:30. Seaplanes fly in daylight only. Maafaru Airport is open around the clock, for flights into Noonu directly."],
  ["What if I arrive late?", "You can stay overnight in Malé, at Hulhule Island Hotel or Hotel Jen Malé, and take the first seaplane at 09:00 the next day."],
  ["How much luggage can I bring?", "25 kg per person on the seaplane, hand luggage included. On the domestic flight, 20 kg checked and 5 kg in the cabin. Extra luggage may follow on a later flight."],
  ["How far ahead do I book the transfer?", "At least 72 hours before you arrive, through Soneva Reservations. A Soneva representative meets you in the arrivals hall in Malé."],
  ["Who is it suitable for?", "All ages. Children stay and dine for free, The Den is there for children and teens, and villas sleep up to nine adults."],
  ["What is Soneva Unlimited?", "An optional addition to the villa rate, covering feasts with visiting Michelin-starred chefs, daily therapies and one-of-a-kind experiences. Soneva publishes current terms on its offers page."],
];
