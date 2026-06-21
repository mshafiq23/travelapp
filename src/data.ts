import { Destination, TourPackage, Hotel, Flight, Review } from './types.ts';

export const DESTINATIONS: Destination[] = [
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    description: 'Dramatic cliffs, azure waters, and pastel-colored fishing villages cascading down to the Tyrrhenian Sea.',
    longDescription: 'The Amalfi Coast is a stunning stretch of coastline on the southern edge of Italy’s Sorrentine Peninsula. It is a popular holiday destination characterized by sheer cliffs and a rugged shoreline dotted with small beaches and pastel-colored fishing villages. Characterized by coastal roads winding through lemon groves and vineyards, this UNESCO World Heritage site is the epitome of Mediterranean charm and luxury.',
    coverImage: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1520156557489-35c4217117e3?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.9,
    reviewsCount: 342,
    tags: ['Luxury', 'Romantic', 'Coastal', 'Culture'],
    lat: 40.6331,
    lng: 14.6029,
    costScore: 5,
    attractions: [
      { name: 'Duomo di Amalfi', rating: 4.8, category: 'Historic Site', description: '9th-century Roman Catholic cathedral with Romanesque-Baroque architecture.' },
      { name: 'Sentiero degli Dei (Path of the Gods)', rating: 4.9, category: 'Nature', description: 'Scenic hiking trail high above Amalfi offering breathtaking panoramic ocean views.' },
      { name: 'Villa Cimbrone Gardens', rating: 4.7, category: 'Gardens', description: 'Luxury estate in Ravello known for its beautiful cliffside gardens and Terrazza dell’Infinito.' }
    ]
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    description: 'The cultural heart of Japan, featuring thousands of classical Buddhist temples, gardens, and imperial palaces.',
    longDescription: 'Kyoto, once the capital of Japan, is a city on the island of Honshu. It is famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses. It is also known for formal traditions such as kaiseki dining, consisting of multiple courses of precise dishes, and geisha, female entertainers often found in the Gion district.',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.8,
    reviewsCount: 298,
    tags: ['Culture', 'Historic', 'Wellness', 'Temple'],
    lat: 35.0116,
    lng: 135.7681,
    costScore: 4,
    attractions: [
      { name: 'Fushimi Inari Shrine', rating: 4.9, category: 'Shrine', description: 'Famous Shinto shrine renowned for its iconic path of thousands of vibrant vermilion torii gates.' },
      { name: 'Kinkaku-ji (Golden Pavilion)', rating: 4.8, category: 'Temple', description: 'Zen Buddhist temple with the top two floors completely covered in brilliant gold leaf.' },
      { name: 'Arashiyama Bamboo Grove', rating: 4.6, category: 'Nature', description: 'Stunning natural walking path lined with towering green stalks of bamboo.' }
    ]
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    description: 'Iconic whitewashed cubic houses clinging to caldera cliffs overlooking the Aegean Sea.',
    longDescription: 'Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The giant water-filled caldera is overlooked by whitewashed houses in principal towns like Fira and Oia, which cling to cliffs above and command dramatic sunset views over deep blue waters.',
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.9,
    reviewsCount: 412,
    tags: ['Luxury', 'Romantic', 'Coastal', 'Sunset'],
    lat: 36.3932,
    lng: 25.4615,
    costScore: 5,
    attractions: [
      { name: 'Oia Sunset Point', rating: 4.9, category: 'Scenic Point', description: 'World-famous viewing spot where cascading red-and-gold sunsets silhouette iconic blue domes.' },
      { name: 'Akrotiri Archaeological Site', rating: 4.6, category: 'Historic Site', description: 'Minoan Bronze Age settlement preserved in volcanic ash, often called the Aegean Pompeii.' },
      { name: 'Red Beach', rating: 4.4, category: 'Beach', description: 'Unique volcanic beach framed by towering red monolith cliffs and deep turquoise waters.' }
    ]
  },
  {
    id: 'borabora',
    name: 'Bora Bora',
    country: 'French Polynesia',
    description: 'The jewel of the South Pacific, with overwater bungalows suspended over brilliant turquoise lagoons.',
    longDescription: 'Bora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus (islets) and a turquoise lagoon protected by a coral reef, it’s known for its scuba diving. It’s also a popular luxury resort destination where guest bungalows are perched overwater on stilts, offering direct reef-side ocean access.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.95,
    reviewsCount: 184,
    tags: ['Luxury', 'Romantic', 'Tropical', 'Island'],
    lat: -16.5004,
    lng: -151.7415,
    costScore: 5,
    attractions: [
      { name: 'Mount Otemanu', rating: 4.8, category: 'Mountain', description: 'The remnants of an ancient volcano rising sharply to 727m above the lagoon center.' },
      { name: 'Coral Gardens', rating: 4.7, category: 'Nature', description: 'An underwater coral sanctuary bustling with tropical fish, reef sharks, and manta rays.' },
      { name: 'Matira Beach', rating: 4.9, category: 'Beach', description: 'Regularly voted one of the world’s most pristine sandy beaches with gentle, shallow waters.' }
    ]
  },
  {
    id: 'iceland',
    name: 'Reykjavik & South Coast',
    country: 'Iceland',
    description: 'A land of geological drama where cascading waterfalls, black sand beaches, and hot springs meet under glaciers.',
    longDescription: 'Iceland is a Nordic island nation defined by its dramatic landscape with volcanoes, geysers, hot springs and lava fields. Massive glaciers are protected in Vatnajökull and Snæfellsjökull national parks. Most of the population lives in the capital, Reykjavik, which runs on geothermal power and features a vibrant cultural, design, and nightlife scene.',
    coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1504829857797-ddff28127792?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.75,
    reviewsCount: 220,
    tags: ['Adventure', 'Nature', 'Wellness', 'Winter'],
    lat: 64.1466,
    lng: -21.9426,
    costScore: 4,
    attractions: [
      { name: 'The Blue Lagoon', rating: 4.8, category: 'Wellness', description: 'World-famous geothermal spa containing mineral-rich milky blue waters set in ancient lava fields.' },
      { name: 'Seljalandsfoss Waterfall', rating: 4.9, category: 'Waterfall', description: 'Striking waterfall that falls form 60m cliffs, featuring a path that lets hikers walk behind the water curtain.' },
      { name: 'Reynisfjara Black Sand Beach', rating: 4.7, category: 'Beach', description: 'Dramatic volcanic black sand beach framed by gargantuan basalt sea stacks and powerful Atlantic waves.' }
    ]
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    country: 'New Zealand',
    description: 'The adventure capital of the world, sitting on Lake Wakatipu beneath awesome peak configurations.',
    longDescription: 'Queenstown, New Zealand, is situated on the shores of the South Island’s crystal-clear Lake Wakatipu against the dramatic backdrop of the Remarkables mountain range. Renowned for adventure sports, it’s also a base for exploring the region’s historic gold-mining town configurations and the legendary vineyards of Central Otago.',
    coverImage: 'https://images.unsplash.com/photo-1589871190907-5370ab63f707?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1472214222541-d510753a49e5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80'
    ],
    rating: 4.85,
    reviewsCount: 165,
    tags: ['Adventure', 'Nature', 'Alpine', 'Wine'],
    lat: -45.0312,
    lng: 168.6626,
    costScore: 4,
    attractions: [
      { name: 'Milford Sound Cruise', rating: 4.95, category: 'Fjord', description: 'Incredible cruise through majestic carved glacial valleys, sheer cliff walls, and cascading vertical waterfalls.' },
      { name: 'Skyline Queenstown Gondola', rating: 4.7, category: 'Scenic Point', description: 'Gondola ride climbing to Bob’s Peak, featuring panoramic lakeshore views and luge courses.' },
      { name: 'Gibbston Valley Wine Tour', rating: 4.6, category: 'Wine', description: 'Boutique vineyards producing premier Pinot Noir inside unique hand-carved wine cave shelters.' }
    ]
  }
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'amalfi-escapade',
    destinationId: 'amalfi',
    name: 'Amalfi Coast Luxury Voyager',
    durationDays: 7,
    description: 'An immersive private yachting and culinary journey across Positano, Capri, and Ravello with elite local guides.',
    price: 4950,
    features: ['Private speed-boating to Capri Blue Grotto', 'Michelin-starred lemon grove cooking dinner', 'VIP clifftop terrace estate access'],
    inclusions: ['Luxury boutique suites', 'All private transfers', 'Elite bilingual local guides', 'Sailing charter fees'],
    rating: 4.93,
    difficulty: 'easy',
    maxGroupSize: 8,
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'kyoto-zen',
    destinationId: 'kyoto',
    name: 'Kyoto Imperial & Zen Gardens Private Pilgrimage',
    durationDays: 6,
    description: 'A deeply meditative journey through Kyoto’s most treasured temple configurations, sacred forests, and private tea houses.',
    price: 3600,
    features: ['Private sunset tea ceremony with Geisha master', 'Zen garden architecture masterclass', 'Arashiyama custom sunrise stroll'],
    inclusions: ['Premium historic Ryokans with private Onsen', 'All temple entry permissions', 'Traditional Multi-course Kaiseki feasts', 'Bullet train high-speed access'],
    rating: 4.87,
    difficulty: 'easy',
    maxGroupSize: 6,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'greek-islands-odyssey',
    destinationId: 'santorini',
    name: 'Cycladic Sunset Yacht Expedition',
    durationDays: 8,
    description: 'Cruise the volcanic caldera lakes and sail the hidden beaches of Milos and Santorini on a bespoke catamaran.',
    price: 6100,
    features: ['Private sunset catamaran cruise with chef on-board', 'Ancient excavation private VIP archeologist guided walk', 'Bespoke Assyrtiko volcanic vineyard tastings'],
    inclusions: ['Elite panoramic cave villas with private splash pools', 'All luxury transfers', 'Gourmet daily lunches', 'Bespoke cruise charters'],
    rating: 4.96,
    difficulty: 'moderate',
    maxGroupSize: 10,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bora-bora-romance',
    destinationId: 'borabora',
    name: 'Overwater Lagoon Infinite Sanctuary',
    durationDays: 5,
    description: 'A secluded sanctuary for the senses suspended over a crystal ocean lagoon, featuring elite spa rituals and reef discoveries.',
    price: 7800,
    features: ['Helicopter peak cruise of Mount Otemanu', 'Lagoon private shark & manta ray safari', 'Private candlelit beach sand barbecue'],
    inclusions: ['Overwater bungalow retreats', 'Water taxi speedboats', 'Bespoke aquatic equipment', 'Signature premium spa massages'],
    rating: 4.98,
    difficulty: 'easy',
    maxGroupSize: 4,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  }
];

export const HOTELS: Hotel[] = [
  {
    id: 'belmond-caruso',
    name: 'Belmond Hotel Caruso',
    location: 'Ravello, Amalfi Coast',
    rating: 4.9,
    pricePerNight: 1250,
    description: 'A converted 11th-century palace perched 350m above sea level with an infinity pool that seems to drift off into the clouds.',
    amenities: ['Clifftop Infinity Pool', 'Bespoke Wellness Spa', 'Lemon Orchard dining terrace', 'Private yacht shuttle'],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { type: 'Superior Coast-View Room', price: 1250, available: true },
      { type: 'Belvedere Clifftop Palace Suite', price: 2100, available: true }
    ],
    lat: 40.6489,
    lng: 14.6111
  },
  {
    id: 'hoshinoya-kyoto',
    name: 'Hoshinoya Kyoto',
    location: 'Arashiyama, Kyoto',
    rating: 4.88,
    pricePerNight: 950,
    description: 'A majestic riverside sanctuary accessed only by custom wooden boat, offering deep Japanese tradition blended with modern state luxury.',
    amenities: ['Scenic River Boat Shuttle', 'Zen Rock Landscapes', 'Michelin cooking Kaiseki Restauraunt', 'Traditional Tatami lounge rooms'],
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { type: 'Tsukimi Riverside Pavilion Suite', price: 950, available: true },
      { type: 'Yamanoha Traditional Garden Suite', price: 1300, available: true }
    ],
    lat: 35.0131,
    lng: 135.6698
  },
  {
    id: 'grace-hotel',
    name: 'Grace Hotel Auberge Resorts',
    location: 'Imerovigli, Santorini',
    rating: 4.94,
    pricePerNight: 1400,
    description: 'An iconic cave-style cliffside boutique hotel. Offering an legendary caldera amphitheater sunset view across an infinity platform.',
    amenities: ['Caldera panoramic pool platform', 'Sunsplash sunset terraces', 'Premium Greek champagne cellar bar', 'Luxury private jet services'],
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { type: 'Premium Cave Splash Room', price: 1400, available: true },
      { type: 'Grace Clifftop Suite with Infinity Pool', price: 2400, available: false }
    ],
    lat: 36.4328,
    lng: 25.4225
  },
  {
    id: 'four-seasons-bora-bora',
    name: 'Four Seasons Resort Bora Bora',
    location: 'Private Islet, Bora Bora',
    rating: 4.97,
    pricePerNight: 1850,
    description: 'Premium overwater villas suspended above custom marine preserves, looking directly onto beautiful Mount Otemanu horizons.',
    amenities: ['Sub-surface coral preserve walks', 'Seaplane travel decks', 'Private speed boat taxi', 'Luxury aquatic beach huts'],
    coverImage: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80',
    rooms: [
      { type: 'Beachview Overwater Bungalow Villa', price: 1850, available: true },
      { type: 'Two-Bedroom Mountain-View Overwater Estate', price: 3400, available: true }
    ],
    lat: -16.4831,
    lng: -151.7011
  }
];

export const FLIGHTS: Flight[] = [
  {
    id: 'flight-v-701',
    airline: 'Emirates Luxury',
    flightNumber: 'EK-7023',
    from: 'New York (JFK)',
    to: 'Naples (NAP - Amalfi Gateway)',
    departureTime: '18:30',
    arrivalTime: '08:55 +1',
    duration: '8h 25m',
    price: 3200,
    classType: 'business'
  },
  {
    id: 'flight-v-702',
    airline: 'Singapore Airlines',
    flightNumber: 'SQ-4412',
    from: 'Los Angeles (LAX)',
    to: 'Kyoto (KIX - Kansai International)',
    departureTime: '11:15',
    arrivalTime: '15:40 +1',
    duration: '11h 25m',
    price: 4100,
    classType: 'first'
  },
  {
    id: 'flight-v-703',
    airline: 'Qatar Airways',
    flightNumber: 'QR-8951',
    from: 'London (LHR)',
    to: 'Santorini (JTR)',
    departureTime: '06:10',
    arrivalTime: '12:05',
    duration: '3h 55m',
    price: 2100,
    classType: 'business'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-01',
    user: 'Alexandra Thornton',
    rating: 5,
    comment: 'Voyago crafted the most impeccable anniversary itinerary to Amalfi. From our private helipad transfer to the clifftop wine cave tasting in Ravello, the luxury and meticulous curation was absolute fantasy. Generating itineraries with AI actually worked perfectly!',
    date: 'May 12, 2026',
    destinationName: 'Amalfi Coast'
  },
  {
    id: 'rev-02',
    user: 'Maximilian Vance',
    rating: 5,
    comment: 'The Ryokan booking Hoshinoya through Voyago changed our lives. True architectural wonder that can’t be words. Experiencing sunrise bamboo flutes in Kyoto is something we’ll remember forever. The Google Docs itinerary auto-download was super handy!',
    date: 'April 28, 2026',
    destinationName: 'Kyoto'
  },
  {
    id: 'rev-03',
    user: 'Genevieve Du Pont',
    rating: 4.8,
    comment: 'Incredible overwater lagoon trip! The level of responsiveness, customized speed boats, and diving tours matches the best physical multi-century concierge services. A flawless five-star operation.',
    date: 'June 4, 2026',
    destinationName: 'Bora Bora'
  }
];
