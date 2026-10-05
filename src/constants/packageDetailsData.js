// Centralized package details database providing authentic destination-specific hotels, transfers, and day-by-day itineraries

export const getDestinationHotels = (cat, pkg) => {
  const category = (cat || '').toLowerCase();
  const pkgId = (pkg?.id || '').toLowerCase();

  // 1. EUROPE / ICELAND
  if (category === 'europe' || pkgId.includes('eur')) {
    return [
      {
        id: 'grand-reykjavik',
        name: 'Grand Hotel Reykjavík',
        rating: 4,
        userRating: 4.4,
        userRatingLabel: 'Superb',
        reviewsCount: 640,
        location: 'Sigtún 38, 105 Reykjavík | Near Laugardalur Park & City Center',
        guestsNote: '1 Room | 2 Adults',
        timingNote: '10 Nights Luxury Nordic Stay',
        aiSummary: 'First-class Nordic hotel offering spacious rooms, Icelandic culinary dining at Grand Brasserie, spa access, and convenient aurora viewing tours departing right from the lobby.',
        roomType: 'Superior Nordic Double Room',
        mealsIncluded: 'Scandinavian Buffet Breakfast Included',
        complimentaryNote: 'Complimentary Nordic Breakfast & WiFi',
        hasBreakfast: true,
        starRating: 4,
        propertyType: 'Hotel',
        priceDiff: 0,
        isDefault: true,
        img: '/images/booking/hotel-luxury-resort.webp',
        thumbnails: [
          '/images/booking/hotel-luxury-resort.webp',
          '/images/holidays/photo-1529963183134-61a90db47eaf.webp',
          '/images/booking/hotel-mountain-view.webp',
          '/images/booking/hotel-deluxe-comfort.webp'
        ],
        roomOptions: [
          { name: 'Superior Nordic Double Room', desc: '28 sqm • City & Mountain View • King Bed', price: 0, img: '/images/booking/hotel-luxury-resort.webp' },
          { name: 'Executive Suite with Volcano Vista', desc: '45 sqm • Top Floor Panoramic View • Lounge Access', price: 9800, img: '/images/booking/hotel-mountain-view.webp' },
          { name: 'Aurora View Penthouse Suite', desc: '60 sqm • Private Balcony & Jacuzzi Tub', price: 16500, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      },
      {
        id: 'hotel-vik-myrdal',
        name: 'Hotel Vík í Mýrdal',
        rating: 4,
        userRating: 4.6,
        userRatingLabel: 'Exceptional',
        reviewsCount: 420,
        location: 'Klettsvegur 1-3, Vík í Mýrdal | 5 mins walk to Reynisfjara Black Sand Beach',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'South Coast Glacier & Ocean Views',
        aiSummary: 'Spectacular coastal design hotel nestled beneath sea cliffs with sweeping ocean panoramas and modern minimalist Scandinavian aesthetics.',
        roomType: 'Ocean & Cliff View Deluxe Room',
        mealsIncluded: 'Buffet Breakfast Included',
        complimentaryNote: 'Complimentary Icelandic Breakfast',
        hasBreakfast: true,
        starRating: 4,
        propertyType: 'Hotel',
        priceDiff: 4200,
        isDefault: false,
        img: '/images/booking/hotel-mountain-view.webp',
        thumbnails: [
          '/images/booking/hotel-mountain-view.webp',
          '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp',
          '/images/booking/hotel-deluxe-comfort.webp',
          '/images/booking/hotel-luxury-resort.webp'
        ],
        roomOptions: [
          { name: 'Ocean & Cliff View Deluxe Room', desc: '30 sqm • Atlantic Ocean View', price: 0, img: '/images/booking/hotel-mountain-view.webp' },
          { name: 'Black Beach Panorama Suite', desc: '48 sqm • Free Standing Bathtub & Sea View', price: 7500, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      },
      {
        id: 'fosshotel-glacier-lagoon',
        name: 'Fosshotel Glacier Lagoon',
        rating: 4,
        userRating: 4.7,
        userRatingLabel: 'Exceptional',
        reviewsCount: 512,
        location: 'Hnappavellir, Vatnajökull National Park | Near Jökulsárlón Iceberg Lagoon',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Direct views of Europe\'s largest glacier Vatnajökull',
        aiSummary: 'Luxury contemporary wilderness hotel surrounded by dramatic glacier mountains, offering floor-to-ceiling glass windows for prime Aurora Borealis sightings.',
        roomType: 'Delacier View Room with Balcony',
        mealsIncluded: 'Organic Icelandic Breakfast Included',
        complimentaryNote: 'Complimentary Breakfast & Northern Lights Wake-up Call',
        hasBreakfast: true,
        starRating: 4,
        propertyType: 'Resort',
        priceDiff: 6500,
        isDefault: false,
        img: '/images/booking/hotel-grand-dragon-resort.webp',
        thumbnails: [
          '/images/booking/hotel-grand-dragon-resort.webp',
          '/images/holidays/photo-1518495973542-4542c06a5843.webp',
          '/images/booking/hotel-luxury-resort.webp',
          '/images/booking/hotel-mountain-view.webp'
        ],
        roomOptions: [
          { name: 'Glacier View Room with Balcony', desc: '32 sqm • Glacier Panorama', price: 0, img: '/images/booking/hotel-grand-dragon-resort.webp' },
          { name: 'Vatnajökull Master Suite', desc: '55 sqm • Living Lounge & Sauna Access', price: 11200, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      },
      {
        id: 'berjaya-reykjavik-marina',
        name: 'Berjaya Reykjavik Marina Hotel',
        rating: 4,
        userRating: 4.5,
        userRatingLabel: 'Superb',
        reviewsCount: 780,
        location: 'Mýrargata 2, 101 Reykjavík | Historic Old Harbour District',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Walking distance to Harpa Concert Hall & Whale Watching',
        aiSummary: 'Trendy waterfront hotel right on the slipway of Reykjavík old harbour, renowned for maritime chic interiors and vibrant Slippbarinn cocktail lounge.',
        roomType: 'Harbour Marina View Room',
        mealsIncluded: 'Breakfast Included',
        complimentaryNote: 'Complimentary Fresh Nordic Buffet',
        hasBreakfast: true,
        starRating: 4,
        propertyType: 'Hotel',
        priceDiff: 2800,
        isDefault: false,
        img: '/images/booking/hotel-deluxe-comfort.webp',
        thumbnails: [
          '/images/booking/hotel-deluxe-comfort.webp',
          '/images/holidays/photo-1517411032315-54ef2cb783bb.webp',
          '/images/booking/hotel-luxury-resort.webp',
          '/images/booking/hotel-mountain-view.webp'
        ],
        roomOptions: [
          { name: 'Harbour Marina View Room', desc: '26 sqm • Maritime Views', price: 0, img: '/images/booking/hotel-deluxe-comfort.webp' },
          { name: 'Studio Suite with Harbour Balcony', desc: '40 sqm • Balcony overlooking yachts', price: 6200, img: '/images/booking/hotel-luxury-resort.webp' }
        ]
      }
    ];
  }

  // 2. GOA
  if (category === 'goa' || pkgId.includes('goa')) {
    return [
      {
        id: 'taj-holiday-village-goa',
        name: 'Taj Holiday Village Resort & Spa, Candolim',
        rating: 5,
        userRating: 4.8,
        userRatingLabel: 'Exceptional',
        reviewsCount: 890,
        location: 'Sinquerim Beach, Candolim, Goa | Direct Beachfront Access',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Luxury Coastal Beachfront Stay',
        aiSummary: 'Sprawling 28-acre terracotta-roofed Portuguese village resort fronting the Arabian Sea, featuring manicured gardens, sunken pool bar, and Jiva Spa.',
        roomType: 'Superior Heritage Cottage Garden View',
        mealsIncluded: 'Goan & Continental Breakfast Included',
        complimentaryNote: 'Complimentary Buffet Breakfast',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 0,
        isDefault: true,
        img: '/images/holidays/fortune-hotel.webp',
        thumbnails: [
          '/images/holidays/fortune-hotel.webp',
          '/images/holidays/goa.webp',
          '/images/booking/hotel-luxury-resort.webp',
          '/images/booking/hotel-deluxe-comfort.webp'
        ],
        roomOptions: [
          { name: 'Superior Heritage Cottage Garden View', desc: '38 sqm • Private Sit-out', price: 0, img: '/images/holidays/fortune-hotel.webp' },
          { name: 'Sea View Premium Villa with Lawn', desc: '52 sqm • Direct Beach Access', price: 5500, img: '/images/booking/hotel-taj-palace.webp' },
          { name: 'Sunset Pool Villa with Private Plunge Pool', desc: '75 sqm • Private Pool & Butler', price: 12000, img: '/images/booking/hotel-radisson-blu.webp' }
        ]
      },
      {
        id: 'caravela-beach-resort',
        name: 'Caravela Beach Resort, South Goa',
        rating: 5,
        userRating: 4.7,
        userRatingLabel: 'Superb',
        reviewsCount: 650,
        location: 'Varca Beach, South Goa | Pristine White Sand Shoreline',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Direct access to quiet Varca Beach',
        aiSummary: 'World-class 5-star beachfront haven with an 83-foot high atrium, 9-hole golf course, multiple oceanfront dining pavilions, and serene white sands.',
        roomType: 'Deluxe Ocean View Room',
        mealsIncluded: 'Breakfast Included',
        complimentaryNote: 'Complimentary Breakfast & High Tea',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 2400,
        isDefault: false,
        img: '/images/holidays/goa.webp',
        thumbnails: [
          '/images/holidays/goa.webp',
          '/images/holidays/fortune-hotel.webp',
          '/images/booking/hotel-mountain-view.webp',
          '/images/booking/hotel-luxury-resort.webp'
        ],
        roomOptions: [
          { name: 'Deluxe Ocean View Room', desc: '35 sqm • Sea Facing Balcony', price: 0, img: '/images/holidays/goa.webp' },
          { name: 'Oceanfront Presidential Suite', desc: '68 sqm • Panoramic Arabian Sea', price: 8000, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      },
      {
        id: 'fortune-miramar-goa',
        name: 'Fortune Miramar Goa, Panjim',
        rating: 4,
        userRating: 4.4,
        userRatingLabel: 'Very Good',
        reviewsCount: 410,
        location: 'Miramar Beach Road, Panaji, Goa | 5 mins to Mandovi River Cruise',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Central Panaji & Beach Promenade',
        aiSummary: 'Modern stylish business & leisure hotel near Miramar beach and historic Fontainhas Latin Quarter, featuring rooftop pool and 24-hr cafe.',
        roomType: 'Fortune Deluxe City Room',
        mealsIncluded: 'Breakfast Included',
        complimentaryNote: 'Complimentary Daily Breakfast',
        hasBreakfast: true,
        starRating: 4,
        propertyType: 'Hotel',
        priceDiff: -1500,
        isDefault: false,
        img: '/images/holidays/fortune-hotel.webp',
        thumbnails: [
          '/images/holidays/fortune-hotel.webp',
          '/images/booking/hotel-deluxe-comfort.webp',
          '/images/booking/hotel-luxury-resort.webp',
          '/images/holidays/goa.webp'
        ],
        roomOptions: [
          { name: 'Fortune Deluxe City Room', desc: '30 sqm • Modern Interiors', price: 0, img: '/images/holidays/fortune-hotel.webp' },
          { name: 'Executive Suite', desc: '48 sqm • Separate Living Room', price: 3200, img: '/images/booking/hotel-deluxe-comfort.webp' }
        ]
      },
      {
        id: 'hard-rock-hotel-goa',
        name: 'Hard Rock Hotel Goa, Calangute',
        rating: 5,
        userRating: 4.6,
        userRatingLabel: 'Superb',
        reviewsCount: 530,
        location: 'Bishop Alex Dias Rd, Calangute, Goa | Vibrant Nightlife Hub',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Surrounded by Calangute & Baga Beach Clubs',
        aiSummary: 'Vibrant musical haven boasting Goa\'s longest swimming pool, live music sessions, Fender guitar room delivery, and exquisite coastal dining.',
        roomType: 'Deluxe Courtyard Pool View',
        mealsIncluded: 'Rockin\' Breakfast Included',
        complimentaryNote: 'Complimentary Rockin\' Breakfast',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 1800,
        isDefault: false,
        img: '/images/booking/hotel-luxury-resort.webp',
        thumbnails: [
          '/images/booking/hotel-luxury-resort.webp',
          '/images/holidays/goa.webp',
          '/images/holidays/fortune-hotel.webp',
          '/images/booking/hotel-deluxe-comfort.webp'
        ],
        roomOptions: [
          { name: 'Deluxe Courtyard Pool View', desc: '34 sqm • Pool View Balcony', price: 0, img: '/images/booking/hotel-luxury-resort.webp' },
          { name: 'Rock Star Suite with Balcony', desc: '58 sqm • VIP Lounge Access', price: 6800, img: '/images/booking/hotel-radisson-blu.webp' }
        ]
      }
    ];
  }

  // 3. JAPAN
  if (category === 'japan' || pkgId.includes('jap')) {
    return [
      {
        id: 'keio-plaza-tokyo',
        name: 'Keio Plaza Hotel Tokyo, Shinjuku',
        rating: 5,
        userRating: 4.6,
        userRatingLabel: 'Superb',
        reviewsCount: 920,
        location: '2-2-1 Nishi-Shinjuku, Tokyo | 5 mins walk to Shinjuku Station',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Panoramic Shinjuku Skyscraper Views',
        aiSummary: 'Iconic Tokyo luxury hotel with panoramic skyline views, traditional tea ceremony room, 11 award-winning restaurants, and direct shuttle to Tokyo Disneyland.',
        roomType: 'Premier Grand City View Room',
        mealsIncluded: 'Japanese & Western Buffet Included',
        complimentaryNote: 'Complimentary International Buffet Breakfast',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Hotel',
        priceDiff: 0,
        isDefault: true,
        img: '/images/booking/hotel-luxury-resort.webp',
        thumbnails: ['/images/booking/hotel-luxury-resort.webp', '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp', '/images/booking/hotel-mountain-view.webp'],
        roomOptions: [
          { name: 'Premier Grand City View Room', desc: '36 sqm • Tokyo Skyscraper View', price: 0, img: '/images/booking/hotel-luxury-resort.webp' },
          { name: 'Club Lounge Suite with Mt. Fuji Vista', desc: '55 sqm • Club Floor Benefits', price: 8500, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      },
      {
        id: 'kyoto-century-hotel',
        name: 'Kyoto Century Hotel, Historic Kyoto',
        rating: 4,
        userRating: 4.7,
        userRatingLabel: 'Exceptional',
        reviewsCount: 540,
        location: 'Shimogyo Ward, Kyoto | 2 mins walk to Kyoto Central Station',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Easy access to Fushimi Inari & Gion',
        aiSummary: 'Timeless Japanese elegance with tranquil bamboo garden aesthetics, heritage dining, and unmatched proximity to Kyoto bullet trains.',
        roomType: 'Kyoto Heritage Deluxe Room',
        mealsIncluded: 'Traditional Kyoto Breakfast Included',
        complimentaryNote: 'Complimentary Kyoto Morning Buffet',
        hasBreakfast: true,
        starRating: 4,
        propertyType: 'Hotel',
        priceDiff: 3200,
        isDefault: false,
        img: '/images/booking/hotel-deluxe-comfort.webp',
        thumbnails: ['/images/booking/hotel-deluxe-comfort.webp', '/images/holidays/photo-1503899036084-c55cdd92da26.webp'],
        roomOptions: [
          { name: 'Kyoto Heritage Deluxe Room', desc: '32 sqm • Tatami Accents', price: 0, img: '/images/booking/hotel-deluxe-comfort.webp' }
        ]
      }
    ];
  }

  // 4. MALDIVES
  if (category === 'maldives' || pkgId.includes('mld')) {
    return [
      {
        id: 'adaaran-prestige-vadoo',
        name: 'Adaaran Prestige Vadoo Overwater Villas',
        rating: 5,
        userRating: 4.9,
        userRatingLabel: 'Exceptional',
        reviewsCount: 710,
        location: 'South Malé Atoll, Maldives | 15 mins luxury speedboat from Malé Airport',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Direct Ocean Lagoon Access from Villa Deck',
        aiSummary: 'World-renowned private overwater villa retreat with personal 24-hour butler, glass floor bathroom viewports, private plunge pool, and coral reef snorkeling.',
        roomType: 'Sunrise Overwater Villa with Private Plunge Pool',
        mealsIncluded: 'All-Inclusive Dine Around Meals',
        complimentaryNote: 'All Meals & Unlimited Premium Beverages Included',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 0,
        isDefault: true,
        img: '/images/holidays/photo-1514282401047-d79a71a590e8.webp',
        thumbnails: ['/images/holidays/photo-1514282401047-d79a71a590e8.webp', '/images/holidays/photo-1507525428034-b723cf961d3e.webp', '/images/holidays/photo-1439066615861-d1af74d74000.webp'],
        roomOptions: [
          { name: 'Sunrise Overwater Villa with Private Plunge Pool', desc: '91 sqm • Lagoon Deck & Pool', price: 0, img: '/images/holidays/photo-1514282401047-d79a71a590e8.webp' },
          { name: 'Sunset Overwater Villa with Jacuzzi', desc: '105 sqm • Sunset Ocean Vista', price: 12500, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      },
      {
        id: 'sun-siyam-olhuveli',
        name: 'Sun Siyam Olhuveli Maldives',
        rating: 5,
        userRating: 4.8,
        userRatingLabel: 'Exceptional',
        reviewsCount: 840,
        location: 'South Malé Atoll, Maldives | Over 3 Tropical Islands Connected by Bridges',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Manta Point & PADI 5-Star Dive Center',
        aiSummary: 'Expansive multi-island resort paradise offering infinity ocean pools, 14 culinary bars & restaurants, water sports, and nightly manta ray viewings.',
        roomType: 'Deluxe Beachfront Villa',
        mealsIncluded: 'All Meals Included',
        complimentaryNote: 'Complimentary Buffet Meals & Snorkeling Gear',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 4500,
        isDefault: false,
        img: '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        thumbnails: ['/images/holidays/photo-1507525428034-b723cf961d3e.webp', '/images/holidays/photo-1514282401047-d79a71a590e8.webp'],
        roomOptions: [
          { name: 'Deluxe Beachfront Villa', desc: '80 sqm • Direct Beach Steps', price: 0, img: '/images/holidays/photo-1507525428034-b723cf961d3e.webp' }
        ]
      }
    ];
  }

  // 5. DUBAI
  if (category === 'dubai' || pkgId.includes('dxb')) {
    return [
      {
        id: 'jw-marriott-marquis-dubai',
        name: 'JW Marriott Marquis Hotel Dubai',
        rating: 5,
        userRating: 4.7,
        userRatingLabel: 'Superb',
        reviewsCount: 1100,
        location: 'Sheikh Zayed Rd, Business Bay, Dubai | Overlooking Dubai Water Canal',
        guestsNote: '1 Room | 2 Adults',
        timingNote: '5 mins to Dubai Mall & Burj Khalifa',
        aiSummary: 'One of the tallest 5-star hotels in the world, featuring 12 award-winning restaurants, lavish Saray Spa, heated outdoor swimming pool, and breathtaking Burj Khalifa views.',
        roomType: 'Deluxe Corner Canal View Room',
        mealsIncluded: 'International Buffet Breakfast Included',
        complimentaryNote: 'Complimentary Daily Buffet Breakfast',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Hotel',
        priceDiff: 0,
        isDefault: true,
        img: '/images/holidays/photo-1512453979798-5ea266f8880c.webp',
        thumbnails: ['/images/holidays/photo-1512453979798-5ea266f8880c.webp', '/images/holidays/photo-1451187580459-43490279c0fa.webp', '/images/booking/hotel-luxury-resort.webp'],
        roomOptions: [
          { name: 'Deluxe Corner Canal View Room', desc: '44 sqm • Dubai Canal Vista', price: 0, img: '/images/holidays/photo-1512453979798-5ea266f8880c.webp' },
          { name: 'Executive Burj Khalifa View Suite', desc: '65 sqm • High Floor Landmark View', price: 6500, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      },
      {
        id: 'atlantis-the-palm-dubai',
        name: 'Atlantis The Palm, Dubai',
        rating: 5,
        userRating: 4.9,
        userRatingLabel: 'Exceptional',
        reviewsCount: 1540,
        location: 'Crescent Rd, The Palm Jumeirah, Dubai | Private White Sand Shore',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Unlimited Aquaventure Waterpark Access',
        aiSummary: 'Legendary Palm Jumeirah icon with world-class celebrity chef restaurants, Lost Chambers Aquarium, pristine private beach, and premier dolphin encounters.',
        roomType: 'Ocean King View Room',
        mealsIncluded: 'Half Board (Breakfast & Dinner) Included',
        complimentaryNote: 'Complimentary Breakfast, Dinner & Waterpark Access',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 14500,
        isDefault: false,
        img: '/images/holidays/photo-1451187580459-43490279c0fa.webp',
        thumbnails: ['/images/holidays/photo-1451187580459-43490279c0fa.webp', '/images/holidays/photo-1512453979798-5ea266f8880c.webp'],
        roomOptions: [
          { name: 'Ocean King View Room', desc: '47 sqm • Arabian Gulf View', price: 0, img: '/images/holidays/photo-1451187580459-43490279c0fa.webp' }
        ]
      }
    ];
  }

  // 6. THAILAND
  if (category === 'thailand' || pkgId.includes('tha')) {
    return [
      {
        id: 'amari-watergate-bangkok',
        name: 'Amari Watergate Bangkok & Phuket Resort',
        rating: 5,
        userRating: 4.6,
        userRatingLabel: 'Superb',
        reviewsCount: 680,
        location: 'Petchburi Rd, Pratunam, Bangkok & Patong Beach Phuket',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Twin Destination Luxury Stay',
        aiSummary: 'Prime luxury city and beach resort combo with rooftop infinity pool, Breeze Spa, and world-class hospitality in the heart of shopping and seaside paradise.',
        roomType: 'Grand Deluxe City Room',
        mealsIncluded: 'Buffet Breakfast Included',
        complimentaryNote: 'Complimentary International Buffet Breakfast',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 0,
        isDefault: true,
        img: '/images/holidays/photo-1537996194471-e657df975ab4.webp',
        thumbnails: ['/images/holidays/photo-1537996194471-e657df975ab4.webp', '/images/holidays/photo-1508009603885-50cf7c579365.webp'],
        roomOptions: [
          { name: 'Grand Deluxe City Room', desc: '40 sqm • Bangkok Skyline', price: 0, img: '/images/holidays/photo-1537996194471-e657df975ab4.webp' }
        ]
      }
    ];
  }

  // 7. RAJASTHAN
  if (category === 'rajasthan' || pkgId.includes('raj')) {
    return [
      {
        id: 'itc-rajputana-jaipur',
        name: 'ITC Rajputana, A Luxury Collection Hotel, Jaipur',
        rating: 5,
        userRating: 4.8,
        userRatingLabel: 'Exceptional',
        reviewsCount: 820,
        location: 'Palace Road, Jaipur | 10 mins to City Palace & Hawa Mahal',
        guestsNote: '1 Room | 2 Adults',
        timingNote: 'Royal Haveli Architecture & Heritage Dining',
        aiSummary: 'Palatial architecture echoing Rajasthan\'s royal heritage, featuring traditional courtyards, grand chandeliers, royal Rajasthani thali dining, and outdoor pool oasis.',
        roomType: 'Rajputana Heritage Chamber',
        mealsIncluded: 'Royal Rajasthani & Continental Breakfast',
        complimentaryNote: 'Complimentary Royal Buffet Breakfast',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Hotel',
        priceDiff: 0,
        isDefault: true,
        img: '/images/holidays/photo-1599661046289-e31897846e41.webp',
        thumbnails: ['/images/holidays/photo-1599661046289-e31897846e41.webp', '/images/holidays/photo-1504609773096-104ff2c73ba4.webp'],
        roomOptions: [
          { name: 'Rajputana Heritage Chamber', desc: '42 sqm • Fort Courtyard View', price: 0, img: '/images/holidays/photo-1599661046289-e31897846e41.webp' },
          { name: 'Royal Rajputana Suite', desc: '72 sqm • Private Butler & Jharokha Balcony', price: 7500, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      }
    ];
  }

  // 8. KERALA (ORIGINAL FULL DATA)
  if (category === 'kerala' || pkgId.includes('krl')) {
    return [
      {
        id: 'broad-bean',
        name: 'Broad Bean Resort & Spa',
        rating: 5,
        userRating: 4.1,
        userRatingLabel: 'Very Good',
        reviewsCount: 358,
        location: 'Chithirapuram , Munnar | 2.8 km drive to Prakrithi Multi Cuisine Restaurant',
        guestsNote: '1 Room | 2 Adults',
        timingNote: '11th Sep 2 PM - 13th Sep 11 AM, 2 Nights',
        aiSummary: 'Premium luxury experience with spacious rooms, jacuzzi villas, and a beautiful ambiance that guests love. Great facilities including a swimming pool, pedal boating, and lush valley views.',
        roomType: 'Superior Club Room',
        mealsIncluded: 'Breakfast is included',
        complimentaryNote: 'Complimentary Breakfast',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 0,
        isDefault: true,
        img: '/images/booking/hotel-luxury-resort.webp',
        thumbnails: [
          '/images/booking/hotel-luxury-resort.webp',
          '/images/booking/hotel-mountain-view.webp',
          '/images/booking/hotel-deluxe-comfort.webp',
          '/images/booking/hotel-grand-dragon-resort.webp'
        ],
        roomOptions: [
          { name: 'Superior Club Room', desc: '35 sqm • Mountain View • King Bed', price: 0, img: '/images/booking/hotel-luxury-resort.webp' },
          { name: 'Jacuzzi Villa with Private Balcony', desc: '55 sqm • Private Jacuzzi • Garden View', price: 4200, img: '/images/booking/hotel-taj-palace.webp' },
          { name: 'Presidential Pool Villa', desc: '85 sqm • Private Infinity Pool • Butler Service', price: 9500, img: '/images/booking/hotel-radisson-blu.webp' }
        ]
      },
      {
        id: 'southern-panorama',
        name: 'Southern Panorama Indriya Resorts',
        rating: 4,
        userRating: 4.3,
        userRatingLabel: 'Excellent',
        reviewsCount: 512,
        location: 'Pottankadu , Munnar | 4.1 km drive to Rivulet Resort | Luxury 4 Star Resorts in Munnar',
        guestsNote: '1 Room | 2 Adults',
        timingNote: '11th Sep 2 PM - 13th Sep 11 AM, 2 Nights',
        aiSummary: 'Nestled in quiet spice plantations with wooden cottages, bird-watching trails, and serene misty river streams.',
        roomType: 'Wooden Cottage',
        mealsIncluded: 'Room Only is included',
        complimentaryNote: 'No meals included',
        hasBreakfast: false,
        starRating: 4,
        propertyType: 'Resort',
        priceDiff: 3272,
        isDefault: false,
        img: '/images/booking/hotel-deluxe-comfort.webp',
        thumbnails: [
          '/images/booking/hotel-deluxe-comfort.webp',
          '/images/booking/hotel-mountain-view.webp',
          '/images/booking/hotel-homestay-cozy.webp',
          '/images/booking/hotel-luxury-resort.webp'
        ],
        roomOptions: [
          { name: 'Wooden Cottage', desc: '32 sqm • Pine Wood Forest View', price: 0, img: '/images/booking/hotel-deluxe-comfort.webp' },
          { name: 'Luxury Treehouse Suite', desc: '48 sqm • Tree Canopy View', price: 3800, img: '/images/booking/hotel-mountain-view.webp' }
        ]
      },
      {
        id: 'fog-munnar',
        name: 'The Fog Munnar Resort & Spa',
        rating: 5,
        userRating: 4.5,
        userRatingLabel: 'Superb',
        reviewsCount: 720,
        location: 'Chithirapuram, Munnar | 360° Tea Plantation Canopy View',
        guestsNote: '1 Room | 2 Adults',
        timingNote: '11th Sep 2 PM - 13th Sep 11 AM, 2 Nights',
        aiSummary: 'Top-rated panoramic mountain resort with heated infinity swimming pool, authentic Ayurvedic rejuvenation spa, and campfire dining.',
        roomType: 'Deluxe Valley View Room with Balcony',
        mealsIncluded: 'Breakfast & Dinner Included',
        complimentaryNote: 'Daily Buffet Breakfast & Dinner',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Resort',
        priceDiff: 1500,
        isDefault: false,
        img: '/images/booking/hotel-mountain-view.webp',
        thumbnails: [
          '/images/booking/hotel-mountain-view.webp',
          '/images/booking/hotel-luxury-resort.webp',
          '/images/booking/hotel-grand-dragon-resort.webp',
          '/images/booking/hotel-singge-palace.webp'
        ],
        roomOptions: [
          { name: 'Deluxe Valley View Room with Balcony', desc: '38 sqm • Private Balcony', price: 0, img: '/images/booking/hotel-mountain-view.webp' },
          { name: 'Private Villa Suite with Jacuzzi', desc: '65 sqm • Private Garden', price: 6500, img: '/images/booking/hotel-luxury-resort.webp' }
        ]
      },
      {
        id: 'blanket-luxury',
        name: 'Blanket Hotel & Luxury Spa',
        rating: 5,
        userRating: 4.8,
        userRatingLabel: 'Exceptional',
        reviewsCount: 890,
        location: 'Attukad Waterfalls, Munnar | Directly Facing Attukad Waterfall',
        guestsNote: '1 Room | 2 Adults',
        timingNote: '11th Sep 2 PM - 13th Sep 11 AM, 2 Nights',
        aiSummary: 'Direct private views of the cascading Attukad Waterfall, infinity pool overlooking mist-clad ravines, and 5-star fine dining.',
        roomType: 'Premier Waterfall View Suite',
        mealsIncluded: 'Breakfast & High Tea Included',
        complimentaryNote: 'Complimentary Buffet Breakfast & High Tea',
        hasBreakfast: true,
        starRating: 5,
        propertyType: 'Hotel',
        priceDiff: 5450,
        isDefault: false,
        img: '/images/booking/hotel-grand-dragon-resort.webp',
        thumbnails: [
          '/images/booking/hotel-grand-dragon-resort.webp',
          '/images/booking/hotel-taj-palace.webp',
          '/images/booking/hotel-radisson-blu.webp',
          '/images/booking/hotel-luxury-resort.webp'
        ],
        roomOptions: [
          { name: 'Premier Waterfall View Suite', desc: '45 sqm • Direct Waterfall Vista', price: 0, img: '/images/booking/hotel-grand-dragon-resort.webp' },
          { name: 'Presidential Waterfall Balcony Suite', desc: '70 sqm • Private Jacuzzi & Waterfall View', price: 8200, img: '/images/booking/hotel-taj-palace.webp' }
        ]
      }
    ];
  }

  // 9. DEFAULT WORLD-CLASS RESORT HOTEL (Universal fallback)
  return [
    {
      id: 'heritage-grand-resort',
      name: `${(cat || 'Destination').toUpperCase()} Grand Palace Resort & Spa`,
      rating: 5,
      userRating: 4.7,
      userRatingLabel: 'Superb',
      reviewsCount: 520,
      location: `Prime Tourism Hub, ${cat || 'Destination'} | City Center & Scenic Landmark Access`,
      guestsNote: '1 Room | 2 Adults',
      timingNote: 'Full Stay Verified Luxury Accommodation',
      aiSummary: 'Top-tier luxury hotel with spacious scenic view suites, outdoor heated swimming pool, award-winning multi-cuisine dining, and 24x7 trip concierge.',
      roomType: 'Deluxe Grand Panoramic Room',
      mealsIncluded: 'Buffet Breakfast Included',
      complimentaryNote: 'Complimentary International Breakfast & High-speed WiFi',
      hasBreakfast: true,
      starRating: 5,
      propertyType: 'Hotel',
      priceDiff: 0,
      isDefault: true,
      img: '/images/booking/hotel-luxury-resort.webp',
      thumbnails: [
        '/images/booking/hotel-luxury-resort.webp',
        '/images/booking/hotel-mountain-view.webp',
        '/images/booking/hotel-deluxe-comfort.webp',
        '/images/booking/hotel-grand-dragon-resort.webp'
      ],
      roomOptions: [
        { name: 'Deluxe Grand Panoramic Room', desc: '38 sqm • Scenic Landscape Vista', price: 0, img: '/images/booking/hotel-luxury-resort.webp' },
        { name: 'Royal Executive Suite', desc: '60 sqm • Separate Lounge & Balcony', price: 5800, img: '/images/booking/hotel-taj-palace.webp' }
      ]
    },
    {
      id: 'heritage-boutique-villa',
      name: `${(cat || 'Destination').toUpperCase()} Boutique Heritage Villa`,
      rating: 4,
      userRating: 4.5,
      userRatingLabel: 'Very Good',
      reviewsCount: 390,
      location: `Scenic Enclave, ${cat || 'Destination'} | Near Cultural Spots`,
      guestsNote: '1 Room | 2 Adults',
      timingNote: 'Cozy Boutique Experience',
      aiSummary: 'Charming boutique property featuring tranquil landscaped gardens, customized local cuisine, and personalized service.',
      roomType: 'Boutique Garden View Cottage',
      mealsIncluded: 'Breakfast Included',
      complimentaryNote: 'Complimentary Fresh Breakfast',
      hasBreakfast: true,
      starRating: 4,
      propertyType: 'Resort',
      priceDiff: 2100,
      isDefault: false,
      img: '/images/booking/hotel-deluxe-comfort.webp',
      thumbnails: ['/images/booking/hotel-deluxe-comfort.webp', '/images/booking/hotel-mountain-view.webp'],
      roomOptions: [
        { name: 'Boutique Garden View Cottage', desc: '32 sqm • Private Veranda', price: 0, img: '/images/booking/hotel-deluxe-comfort.webp' }
      ]
    }
  ];
};

export const getDestinationTransfers = (cat, pkg) => {
  const category = (cat || '').toLowerCase();
  const pkgId = (pkg?.id || '').toLowerCase();

  // Europe / Iceland
  if (category === 'europe' || pkgId.includes('eur')) {
    return [
      {
        id: 'nordic-4x4-suv',
        name: 'Premium 4x4 Nordic SUV / Coach',
        category: 'All-Weather Glacier & Ring Road Certified 4WD',
        carModels: 'Toyota Land Cruiser 4x4, Land Rover Defender, Mercedes Sprinter 4WD',
        img: '/images/fleet/cab-toyota-fortuner.webp',
        facilities: ['Heated Seats', 'Climate AC', 'Free Onboard WiFi', 'Arctic Studded Snow Tires', 'USB Fast Chargers'],
        routes: 'Full Ring Road Intercity Highway, Golden Circle & Glacier Excursions Included',
        priceDiff: 0,
        isDefault: true,
        specs: {
          seating: 'Ergonomic heated leather seating with generous legroom and panorama windows',
          ac: 'Multi-zone Climate Heating & AC designed for extreme sub-zero comfort',
          luggage: 'Large thermal luggage compartment accommodating full Nordic winter gear',
          fuelTolls: '100% Fuel, All Ring Road & Tunnel Tolls, National Park Entry Permits Included',
          amenities: 'Complimentary Icelandic Glacier Mineral Water, High-Speed WiFi hotspot',
          driver: 'Certified English-speaking Icelandic Arctic tourist chauffeur & aurora guide'
        }
      },
      {
        id: 'nordic-vip-van',
        name: 'Executive Mercedes-Benz VIP Minicoach',
        category: 'Luxury Group Touring / High View Windows',
        carModels: 'Mercedes-Benz Sprinter Executive, VW Crafter VIP',
        img: '/images/fleet/cab-toyota-innova.webp',
        facilities: ['12-16 Recliner Seats', 'Dual Heating/AC', 'Panoramic Sky Windows', 'Microphone System', 'WiFi'],
        routes: 'Comprehensive Airport Transfers & Complete 10-Day Group Sightseeing',
        priceDiff: 4500,
        isDefault: false,
        specs: {
          seating: 'VIP Captain Recliner seats with individual USB ports and overhead reading lights',
          ac: 'Advanced Nordic HVAC climate control system',
          luggage: 'Spacious dedicated rear luggage room',
          fuelTolls: 'All fuel, tolls, and parking included',
          amenities: 'Daily bottled water, warm blankets, Aurora alerts system',
          driver: 'Senior Icelandic tour director'
        }
      }
    ];
  }

  // Goa
  if (category === 'goa' || pkgId.includes('goa')) {
    return [
      {
        id: 'goa-sedan',
        name: 'AC Tourist Sedan (Swift Dzire / Etios)',
        category: 'Private AC Sedan - Airport & Beach Sightseeing',
        carModels: 'Maruti Suzuki Dzire, Toyota Etios, Hyundai Aura',
        img: '/images/fleet/cab-sedan-dzire.webp',
        facilities: ['3 Seater', 'Chilled AC', '2 Luggage Bags', 'Daily Water Bottles'],
        routes: 'Dabolim/Mopa Airport Transfers + North & South Goa Sightseeing Included',
        priceDiff: 0,
        isDefault: true,
        specs: {
          seating: '3 Adults comfortable seating with ample legroom',
          ac: 'Powerful Air Conditioner with climate cooling',
          luggage: '2 Large Bags + 2 Handbags (380L Boot)',
          fuelTolls: 'All Tolls, Parking Fees, Fuel & Driver Allowance 100% Included',
          amenities: 'Daily Bottled Water, Fast Mobile USB Charger',
          driver: 'Verified English & Hindi speaking Goan tourist driver'
        }
      },
      {
        id: 'goa-innova',
        name: 'Innova Crysta Luxury',
        category: 'Premium Family Tourist MUV',
        carModels: 'Toyota Innova Crysta, Toyota Hycross',
        img: '/images/fleet/cab-toyota-innova.webp',
        facilities: ['6 Seater', 'Dual AC', 'Captain Recliner Seats', '4 Luggage Bags'],
        routes: 'Private Dedicated Vehicle for all Airport, Beach & Dudhsagar Transfers',
        priceDiff: 2200,
        isDefault: false,
        specs: {
          seating: '6 VIP Passenger seats with Captain Recliners',
          ac: 'Triple-zone Automatic Climate Control',
          luggage: '4 Large Suitcases + 4 Handbags',
          fuelTolls: 'All Tolls, Airport Parking, Fuel Included',
          amenities: 'Premium Water Bottles, Tissue Dispensers, Fast Multi-Chargers',
          driver: 'Executive Goan Chauffeur'
        }
      }
    ];
  }

  // Universal Default (Dzire / Innova / Fortuner)
  return [
    {
      id: 'pro-sedan',
      name: 'Pro Sedan (or Similar)',
      category: 'Private Transfer/Signature AC Sedan',
      carModels: 'Honda City, Hyundai Verna, Maruti Ciaz',
      img: '/images/fleet/cab-honda-city.webp',
      facilities: ['3 Seater', 'AC', '2 Luggage Bags', 'Daily Water Bottle', 'Mobile Charger'],
      routes: 'Airport Transfers & All Itinerary Sightseeing Transfers Included',
      priceDiff: 0,
      isDefault: true,
      specs: {
        seating: '3-4 Adults with extra legroom & ergonomic seats',
        ac: 'Automatic Climate Control AC throughout',
        luggage: '2 Large Bags + 2 Handbags',
        fuelTolls: 'All Tolls, State Border Permits, Parking & Fuel 100% Included',
        amenities: 'Daily Sealed Mineral Water, Fast Mobile USB Charger, First Aid',
        driver: 'Uniformed, background-verified tourist chauffeur'
      }
    },
    {
      id: 'innova-crysta',
      name: 'Innova Crysta (or Similar)',
      category: 'Private Transfer/Premium MUV',
      carModels: 'Toyota Innova Crysta, Toyota Hycross',
      img: '/images/fleet/cab-toyota-innova.webp',
      facilities: ['6 Seater', 'Dual AC', '4 Luggage Bags', 'Captain Recliner Seats'],
      routes: 'Intercity Highway Transfers & Sightseeing Included',
      priceDiff: 2450,
      isDefault: false,
      specs: {
        seating: '6 Passengers with plush Captain Recliner seats',
        ac: 'Triple-zone Automatic Climate Control',
        luggage: '4 Large Suitcases + 4 Handbags',
        fuelTolls: 'All Tolls, Parking, Fuel Included',
        amenities: 'Daily Water Bottles, Multi-Phone Fast Chargers',
        driver: 'Top-rated Executive Chauffeur'
      }
    }
  ];
};

export const getDestinationFlights = (cat, pkg, fromCity = 'New Delhi') => {
  const category = (cat || '').toLowerCase();
  const pkgId = (pkg?.id || '').toLowerCase();
  const origin = fromCity || 'New Delhi';

  // 1. EUROPE / ICELAND (pkg-eur-1, pkg-eur-2, pkg-eur-3)
  if (category === 'europe' || pkgId.includes('eur')) {
    return [
      {
        id: 'flt-eur-1',
        airline: 'Finnair',
        flightNo: 'AY 122 / AY 991',
        code: 'AY',
        color: '#0b1560',
        badge: 'Recommended • Best Connection',
        onward: {
          flightNumber: 'AY 122 + AY 991',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '07:30 AM',
          arrivalAirport: 'Reykjavík (KEF)',
          arrivalCode: 'KEF',
          arrivalTime: '16:45 PM',
          duration: '13h 45m',
          stops: '1 Stop via Helsinki (HEL 2h 10m layover)',
          aircraft: 'Airbus A350-900 / A321'
        },
        returnFlight: {
          flightNumber: 'AY 992 + AY 121',
          departureAirport: 'Reykjavík (KEF)',
          departureCode: 'KEF',
          departureTime: '09:15 AM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '05:45 AM (+1 Day)',
          duration: '14h 30m',
          stops: '1 Stop via Helsinki (HEL 2h 20m layover)',
          aircraft: 'Airbus A321 / A350-900'
        },
        baggage: '7 kg Cabin + 23 kg Check-in Included',
        meals: 'Nordic Gourmet Hot Meals & Soft Drinks Included',
        seatPitch: '31-32 inch Ergonomic Seats',
        refundPolicy: 'Partially Refundable (₹3,000 cancellation fee)',
        basePrice: 68500,
        priceDiff: 0,
        isDefault: true
      },
      {
        id: 'flt-eur-2',
        airline: 'Lufthansa',
        flightNo: 'LH 761 / LH 856',
        code: 'LH',
        color: '#05164d',
        badge: 'Star Alliance • Premium Service',
        onward: {
          flightNumber: 'LH 761 + LH 856',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '03:15 AM',
          arrivalAirport: 'Reykjavík (KEF)',
          arrivalCode: 'KEF',
          arrivalTime: '13:40 PM',
          duration: '14h 55m',
          stops: '1 Stop via Frankfurt (FRA 2h 50m layover)',
          aircraft: 'Boeing 747-8 / Airbus A320neo'
        },
        returnFlight: {
          flightNumber: 'LH 857 + LH 760',
          departureAirport: 'Reykjavík (KEF)',
          departureCode: 'KEF',
          departureTime: '14:35 PM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '08:30 AM (+1 Day)',
          duration: '13h 25m',
          stops: '1 Stop via Frankfurt (FRA 2h 10m layover)',
          aircraft: 'Airbus A320neo / Boeing 747-8'
        },
        baggage: '8 kg Cabin + 23 kg Check-in Included',
        meals: 'Multi-course International Dining & Bar Service',
        seatPitch: '32 inch Comfortable Seating with In-seat Screens',
        refundPolicy: 'Standard Refundable',
        basePrice: 72700,
        priceDiff: 4200,
        isDefault: false
      },
      {
        id: 'flt-eur-3',
        airline: 'Qatar Airways',
        flightNo: 'QR 571 / QR 149',
        code: 'QR',
        color: '#5c0632',
        badge: 'World\'s Best Airline • 30kg Baggage',
        onward: {
          flightNumber: 'QR 571 + QR 149',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '10:00 AM',
          arrivalAirport: 'Reykjavík (KEF)',
          arrivalCode: 'KEF',
          arrivalTime: '19:15 PM',
          duration: '14h 15m',
          stops: '1 Stop via Doha (DOH 1h 45m layover)',
          aircraft: 'Boeing 777-300ER / Airbus A350'
        },
        returnFlight: {
          flightNumber: 'QR 150 + QR 570',
          departureAirport: 'Reykjavík (KEF)',
          departureCode: 'KEF',
          departureTime: '08:00 AM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '02:15 AM (+1 Day)',
          duration: '13h 45m',
          stops: '1 Stop via Doha (DOH 2h 15m layover)',
          aircraft: 'Airbus A350 / Boeing 777-300ER'
        },
        baggage: '7 kg Cabin + 30 kg Check-in Included (Extra Baggage)',
        meals: 'Chef-crafted Gourmet Meals & Unlimited Refreshments',
        seatPitch: 'Oryx One 4,000+ Entertainment Channels',
        refundPolicy: 'Flexible Booking • Low Rescheduling Fee',
        basePrice: 76300,
        priceDiff: 7800,
        isDefault: false
      },
      {
        id: 'flt-eur-4',
        airline: 'Air France',
        flightNo: 'AF 225 / AF 1404',
        code: 'AF',
        color: '#002157',
        badge: 'Budget Friendly • European Carrier',
        onward: {
          flightNumber: 'AF 225 + AF 1404',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '02:00 AM',
          arrivalAirport: 'Reykjavík (KEF)',
          arrivalCode: 'KEF',
          arrivalTime: '15:10 PM',
          duration: '16h 10m',
          stops: '1 Stop via Paris (CDG 3h 20m layover)',
          aircraft: 'Boeing 787 Dreamliner / A321'
        },
        returnFlight: {
          flightNumber: 'AF 1405 + AF 226',
          departureAirport: 'Reykjavík (KEF)',
          departureCode: 'KEF',
          departureTime: '16:00 PM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '10:15 AM (+1 Day)',
          duration: '14h 45m',
          stops: '1 Stop via Paris (CDG 2h 15m layover)',
          aircraft: 'Airbus A321 / Boeing 787'
        },
        baggage: '7 kg Cabin + 23 kg Check-in Included',
        meals: 'French Cuisine & Complimentary Wine / Beverages',
        seatPitch: 'Standard Economy Seating',
        refundPolicy: 'Non-Refundable Saver Fare',
        basePrice: 66400,
        priceDiff: -2100,
        isDefault: false
      }
    ];
  }

  // 2. GOA (pkg-goa-1 .. pkg-goa-4)
  if (category === 'goa' || pkgId.includes('goa')) {
    return [
      {
        id: 'flt-goa-1',
        airline: 'IndiGo',
        flightNo: '6E 2415',
        code: '6E',
        color: '#001b94',
        badge: 'Non-Stop • Most Punctual',
        onward: {
          flightNumber: '6E 2415 (Non-stop)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '09:45 AM',
          arrivalAirport: 'Goa Mopa (GOX)',
          arrivalCode: 'GOX',
          arrivalTime: '12:20 PM',
          duration: '2h 35m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A321neo'
        },
        returnFlight: {
          flightNumber: '6E 2416 (Non-stop)',
          departureAirport: 'Goa Mopa (GOX)',
          departureCode: 'GOX',
          departureTime: '18:15 PM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '20:55 PM',
          duration: '2h 40m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A321neo'
        },
        baggage: '7 kg Cabin + 15 kg Check-in Included',
        meals: 'Snack & Beverage available for purchase on-board',
        seatPitch: 'Standard Legroom',
        refundPolicy: 'Refundable with standard airline fee',
        basePrice: 7800,
        priceDiff: 0,
        isDefault: true
      },
      {
        id: 'flt-goa-2',
        airline: 'Air India',
        flightNo: 'AI 883',
        code: 'AI',
        color: '#d91d2a',
        badge: 'Complimentary Hot Meal • Non-stop',
        onward: {
          flightNumber: 'AI 883 (Non-stop)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '06:15 AM',
          arrivalAirport: 'Goa Dabolim (GOI)',
          arrivalCode: 'GOI',
          arrivalTime: '08:50 AM',
          duration: '2h 35m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A320neo'
        },
        returnFlight: {
          flightNumber: 'AI 884 (Non-stop)',
          departureAirport: 'Goa Dabolim (GOI)',
          departureCode: 'GOI',
          departureTime: '19:40 PM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '22:15 PM',
          duration: '2h 35m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A320neo'
        },
        baggage: '7 kg Cabin + 15 kg Check-in Included',
        meals: 'Complimentary Fresh Indian Hot Meals & Tea/Coffee',
        seatPitch: 'Generous 31 inch Legroom',
        refundPolicy: 'Refundable Fare',
        basePrice: 9000,
        priceDiff: 1200,
        isDefault: false
      },
      {
        id: 'flt-goa-3',
        airline: 'Akasa Air',
        flightNo: 'QP 1374',
        code: 'QP',
        color: '#ff6600',
        badge: 'Best Value • Brand New Boeing Fleet',
        onward: {
          flightNumber: 'QP 1374 (Non-stop)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '11:20 AM',
          arrivalAirport: 'Goa Mopa (GOX)',
          arrivalCode: 'GOX',
          arrivalTime: '14:00 PM',
          duration: '2h 40m',
          stops: 'Direct / Non-stop',
          aircraft: 'Boeing 737 MAX 8'
        },
        returnFlight: {
          flightNumber: 'QP 1375 (Non-stop)',
          departureAirport: 'Goa Mopa (GOX)',
          departureCode: 'GOX',
          departureTime: '14:45 PM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '17:25 PM',
          duration: '2h 40m',
          stops: 'Direct / Non-stop',
          aircraft: 'Boeing 737 MAX 8'
        },
        baggage: '7 kg Cabin + 15 kg Check-in Included',
        meals: 'Cafe Akasa Gourmet options available',
        seatPitch: 'Ultra-quiet modern cabin with USB power',
        refundPolicy: 'Standard Cancellation Fees Apply',
        basePrice: 7000,
        priceDiff: -800,
        isDefault: false
      }
    ];
  }

  // 3. JAPAN (pkg-jap-1, pkg-jap-2)
  if (category === 'japan' || pkgId.includes('jap')) {
    return [
      {
        id: 'flt-jap-1',
        airline: 'All Nippon Airways (ANA)',
        flightNo: 'NH 838',
        code: 'NH',
        color: '#1a3375',
        badge: '5-Star Airline • Non-Stop Direct',
        onward: {
          flightNumber: 'NH 838 (Direct Non-stop)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '18:15 PM',
          arrivalAirport: 'Tokyo Haneda (HND)',
          arrivalCode: 'HND',
          arrivalTime: '05:55 AM (+1 Day)',
          duration: '8h 10m',
          stops: 'Direct / Non-stop',
          aircraft: 'Boeing 787-9 Dreamliner'
        },
        returnFlight: {
          flightNumber: 'NH 837 (Direct Non-stop)',
          departureAirport: 'Tokyo Haneda (HND)',
          departureCode: 'HND',
          departureTime: '11:10 AM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '16:45 PM',
          duration: '9h 05m',
          stops: 'Direct / Non-stop',
          aircraft: 'Boeing 787-9 Dreamliner'
        },
        baggage: '10 kg Cabin + 2 x 23 kg (46 kg) Check-in Included',
        meals: 'Authentic Japanese Bento & International Cuisine Included',
        seatPitch: 'Generous 34 inch Legroom with HD screen',
        refundPolicy: 'Flexible Booking with Date Change Allowed',
        basePrice: 58000,
        priceDiff: 0,
        isDefault: true
      },
      {
        id: 'flt-jap-2',
        airline: 'Japan Airlines (JAL)',
        flightNo: 'JL 740',
        code: 'JL',
        color: '#c8102e',
        badge: 'Award-winning Economy Seat • Non-stop',
        onward: {
          flightNumber: 'JL 740 (Non-stop)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '19:05 PM',
          arrivalAirport: 'Tokyo Narita (NRT)',
          arrivalCode: 'NRT',
          arrivalTime: '06:55 AM (+1 Day)',
          duration: '8h 20m',
          stops: 'Direct / Non-stop',
          aircraft: 'Boeing 787-8'
        },
        returnFlight: {
          flightNumber: 'JL 749 (Non-stop)',
          departureAirport: 'Tokyo Narita (NRT)',
          departureCode: 'NRT',
          departureTime: '11:30 AM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '17:30 PM',
          duration: '9h 30m',
          stops: 'Direct / Non-stop',
          aircraft: 'Boeing 787-8'
        },
        baggage: '10 kg Cabin + 2 x 23 kg Check-in Included',
        meals: 'Michelin Star Chef Curated Dining',
        seatPitch: 'JAL SKY WIDER Seating',
        refundPolicy: 'Partially Refundable',
        basePrice: 61500,
        priceDiff: 3500,
        isDefault: false
      }
    ];
  }

  // 4. MALDIVES (pkg-mld-1, pkg-mld-2)
  if (category === 'maldives' || pkgId.includes('mld')) {
    return [
      {
        id: 'flt-mld-1',
        airline: 'IndiGo',
        flightNo: '6E 1785',
        code: '6E',
        color: '#001b94',
        badge: 'Non-stop Direct to Malé • Fastest',
        onward: {
          flightNumber: '6E 1785 (Direct)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '08:50 AM',
          arrivalAirport: 'Malé Velana (MLE)',
          arrivalCode: 'MLE',
          arrivalTime: '12:30 PM',
          duration: '4h 10m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A321neo'
        },
        returnFlight: {
          flightNumber: '6E 1786 (Direct)',
          departureAirport: 'Malé Velana (MLE)',
          departureCode: 'MLE',
          departureTime: '13:30 PM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '18:10 PM',
          duration: '4h 10m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A321neo'
        },
        baggage: '7 kg Cabin + 20 kg Check-in Included',
        meals: 'Pre-booked Snack & Soft Drinks Included',
        seatPitch: 'Standard Economy',
        refundPolicy: 'Standard Refundable',
        basePrice: 24500,
        priceDiff: 0,
        isDefault: true
      },
      {
        id: 'flt-mld-2',
        airline: 'Air India',
        flightNo: 'AI 267',
        code: 'AI',
        color: '#d91d2a',
        badge: 'Hot Meals Included • Prime Afternoon Arrival',
        onward: {
          flightNumber: 'AI 267 (Direct)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '10:15 AM',
          arrivalAirport: 'Malé Velana (MLE)',
          arrivalCode: 'MLE',
          arrivalTime: '14:05 PM',
          duration: '4h 20m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A320neo'
        },
        returnFlight: {
          flightNumber: 'AI 268 (Direct)',
          departureAirport: 'Malé Velana (MLE)',
          departureCode: 'MLE',
          departureTime: '15:10 PM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '19:55 PM',
          duration: '4h 15m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A320neo'
        },
        baggage: '7 kg Cabin + 25 kg Check-in Included',
        meals: 'Complimentary Indian Meals & Drinks',
        seatPitch: 'Comfortable Legroom',
        refundPolicy: 'Refundable Fare',
        basePrice: 26300,
        priceDiff: 1800,
        isDefault: false
      }
    ];
  }

  // 5. DUBAI (pkg-dxb-1, pkg-dxb-2)
  if (category === 'dubai' || pkgId.includes('dxb')) {
    return [
      {
        id: 'flt-dxb-1',
        airline: 'Emirates',
        flightNo: 'EK 511',
        code: 'EK',
        color: '#d71921',
        badge: 'World-Class 5-Star Experience • 30kg Baggage',
        onward: {
          flightNumber: 'EK 511 (Non-stop)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '10:35 AM',
          arrivalAirport: 'Dubai International (DXB)',
          arrivalCode: 'DXB',
          arrivalTime: '13:00 PM',
          duration: '3h 55m',
          stops: 'Direct / Non-stop',
          aircraft: 'Boeing 777-300ER'
        },
        returnFlight: {
          flightNumber: 'EK 514 (Non-stop)',
          departureAirport: 'Dubai International (DXB)',
          departureCode: 'DXB',
          departureTime: '15:30 PM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '20:30 PM',
          duration: '3h 30m',
          stops: 'Direct / Non-stop',
          aircraft: 'Boeing 777-300ER'
        },
        baggage: '7 kg Cabin + 30 kg Check-in Included',
        meals: 'Multi-course Gourmet Dining with Ice Cream & Beverages',
        seatPitch: 'ice TV with 6,500 channels & in-seat power',
        refundPolicy: 'Flexible Booking with Date Change',
        basePrice: 22000,
        priceDiff: 0,
        isDefault: true
      },
      {
        id: 'flt-dxb-2',
        airline: 'Air India',
        flightNo: 'AI 995',
        code: 'AI',
        color: '#d91d2a',
        badge: 'Hot Meal Included • Convenient Timings',
        onward: {
          flightNumber: 'AI 995 (Non-stop)',
          departureAirport: `${origin} (DEL)`,
          departureCode: 'DEL',
          departureTime: '20:15 PM',
          arrivalAirport: 'Dubai International (DXB)',
          arrivalCode: 'DXB',
          arrivalTime: '22:45 PM',
          duration: '4h 00m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A320neo'
        },
        returnFlight: {
          flightNumber: 'AI 996 (Non-stop)',
          departureAirport: 'Dubai International (DXB)',
          departureCode: 'DXB',
          departureTime: '00:05 AM',
          arrivalAirport: `${origin} (DEL)`,
          arrivalCode: 'DEL',
          arrivalTime: '04:55 AM',
          duration: '3h 20m',
          stops: 'Direct / Non-stop',
          aircraft: 'Airbus A320neo'
        },
        baggage: '7 kg Cabin + 25 kg Check-in Included',
        meals: 'Complimentary Hot Meals Included',
        seatPitch: 'Standard Legroom',
        refundPolicy: 'Refundable Fare',
        basePrice: 20500,
        priceDiff: -1500,
        isDefault: false
      }
    ];
  }

  // 6. UNIVERSAL DEFAULT FLIGHTS (Thailand, Rajasthan, Kerala, Vietnam, Norway, etc.)
  return [
    {
      id: 'flt-gen-1',
      airline: 'Premium Scheduled Carrier',
      flightNo: 'FL 402 / FL 403',
      code: 'FL',
      color: '#0061ae',
      badge: 'Recommended • Guaranteed Departures',
      onward: {
        flightNumber: 'Direct / 1-Stop Scheduled Flight',
        departureAirport: `${origin}`,
        departureCode: 'DEP',
        departureTime: '08:30 AM',
        arrivalAirport: `${pkg.itinerary?.split('•')[0]?.replace(/\d+[ND]/g, '')?.trim() || 'Destination Airport'}`,
        arrivalCode: 'ARR',
        arrivalTime: '13:45 PM',
        duration: '5h 15m',
        stops: 'Optimized Connection',
        aircraft: 'Modern Jet Aircraft'
      },
      returnFlight: {
        flightNumber: 'Return Scheduled Flight',
        departureAirport: `${pkg.itinerary?.split('•')[0]?.replace(/\d+[ND]/g, '')?.trim() || 'Destination Airport'}`,
        departureCode: 'ARR',
        departureTime: '15:30 PM',
        arrivalAirport: `${origin}`,
        arrivalCode: 'DEP',
        arrivalTime: '20:45 PM',
        duration: '5h 15m',
        stops: 'Optimized Connection',
        aircraft: 'Modern Jet Aircraft'
      },
      baggage: '7 kg Cabin + 20 kg Check-in Included',
      meals: 'In-flight Meals & Refreshments Included',
      seatPitch: 'Standard Ergonomic Seating',
      refundPolicy: 'Standard Refund Policy applies',
      basePrice: 18500,
      priceDiff: 0,
      isDefault: true
    },
    {
      id: 'flt-gen-2',
      airline: 'Full-Service Flagship Carrier',
      flightNo: 'FS 801 / FS 802',
      code: 'FS',
      color: '#1a3375',
      badge: 'Premium Baggage • Prime Slots',
      onward: {
        flightNumber: 'Prime Morning Departure',
        departureAirport: `${origin}`,
        departureCode: 'DEP',
        departureTime: '06:00 AM',
        arrivalAirport: `${pkg.itinerary?.split('•')[0]?.replace(/\d+[ND]/g, '')?.trim() || 'Destination Airport'}`,
        arrivalCode: 'ARR',
        arrivalTime: '11:00 AM',
        duration: '5h 00m',
        stops: 'Fastest Route',
        aircraft: 'Airbus / Boeing Fleet'
      },
      returnFlight: {
        flightNumber: 'Prime Evening Return',
        departureAirport: `${pkg.itinerary?.split('•')[0]?.replace(/\d+[ND]/g, '')?.trim() || 'Destination Airport'}`,
        departureCode: 'ARR',
        departureTime: '18:00 PM',
        arrivalAirport: `${origin}`,
        arrivalCode: 'DEP',
        arrivalTime: '23:00 PM',
        duration: '5h 00m',
        stops: 'Fastest Route',
        aircraft: 'Airbus / Boeing Fleet'
      },
      baggage: '8 kg Cabin + 25 kg Check-in Included',
      meals: 'Multi-course Meal & Beverage Service',
      seatPitch: 'Extra Legroom Seating',
      refundPolicy: 'Flexible Rescheduling',
      basePrice: 22000,
      priceDiff: 3500,
      isDefault: false
    }
  ];
};

export const getDestinationDetails = (cat, pkg, selectedHotel, selectedTransfer) => {
  const category = (cat || '').toLowerCase();
  const pkgId = (pkg?.id || '').toLowerCase();

  // --------------------------------------------------------------------------
  // 1. ICELAND 10 DAYS (pkg-eur-1: Journey Through Iceland Hidden Treasures)
  // --------------------------------------------------------------------------
  if (pkgId === 'pkg-eur-1') {
    return {
      cities: [
        { name: 'Reykjavík', nights: '1 Night', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' },
        { name: 'Vík í Mýrdal', nights: '2 Nights', img: '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp' },
        { name: 'Höfn & Glacier', nights: '1 Night', img: '/images/holidays/photo-1518495973542-4542c06a5843.webp' },
        { name: 'Lake Mývatn', nights: '1 Night', img: '/images/holidays/photo-1517411032315-54ef2cb783bb.webp' },
        { name: 'Siglufjörður', nights: '1 Night', img: '/images/holidays/photo-1489599849927-2ee91cede3ba.webp' },
        { name: 'Borgarnes', nights: '1 Night', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' },
        { name: 'Reykjavík City', nights: '2 Nights', img: '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp' }
      ],
      highlights: [
        'Complete 10-day Ring Road expedition encircling Iceland\'s most awe-inspiring natural wonders',
        'Iconic Golden Circle: Thingvellir National Park, exploding Strokkur Geysir & Gullfoss Golden Waterfall',
        'Majestic South Coast: Seljalandsfoss walking cave waterfall, Skógafoss & Reynisfjara Black Sand Beach',
        'Jökulsárlón Glacier Lagoon Amphibian Boat Tour navigating floating electric-blue icebergs & Diamond Beach',
        'Crystal Blue Ice Cave Exploration inside Vatnajökull - Europe\'s largest glacier with crampons & glacier guides',
        'Geothermal wonders of Lake Mývatn, Dimmuborgir volcanic lava castles, and Godafoss Waterfall of the Gods',
        'Charming coastal fjords of Siglufjörður, Tröllaskagi Peninsula, and Kirkjufell Mountain on Snæfellsnes',
        'Relaxing thermal soak in the world-famous Blue Lagoon geothermal spa with silica mud mask',
        'Nightly Aurora Borealis / Northern Lights chasing with experienced expedition guides & warm cocoa'
      ],
      hotel: selectedHotel,
      transfer: selectedTransfer,
      activities: [
        { name: 'Blue Lagoon Geothermal Spa Comfort Ticket with Silica Mud Mask', tag: 'Wellness', duration: '3 Hours', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp', included: true },
        { name: 'Golden Circle Tour: Thingvellir, Strokkur Geysir & Gullfoss Falls', tag: 'Sightseeing', duration: 'Full Day', img: '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp', included: true },
        { name: 'Vatnajökull Glacier Crystal Blue Ice Cave Guided Hike', tag: 'Adventure', duration: '4 Hours', img: '/images/holidays/photo-1518495973542-4542c06a5843.webp', included: true },
        { name: 'Jökulsárlón Glacier Lagoon Boat Cruise & Diamond Beach Walk', tag: 'Highlight', duration: '2.5 Hours', img: '/images/holidays/photo-1517411032315-54ef2cb783bb.webp', included: true },
        { name: 'Lake Mývatn Geothermal Area & Dimmuborgir Lava Formations', tag: 'Nature', duration: '3 Hours', img: '/images/holidays/photo-1489599849927-2ee91cede3ba.webp', included: true },
        { name: 'Northern Lights Hunt with Professional Astrophotographer', tag: 'Aurora Chase', duration: '3.5 Hours', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp', included: true }
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival at Keflavík Airport (KEF) & Reykjavík | Blue Lagoon Geothermal Spa Experience',
          desc: 'Land at Keflavík International Airport (KEF) where you will be warmly greeted by your expedition leader and private Nordic vehicle. Head directly to the legendary Blue Lagoon nestled within a dramatic black lava field. Soak in the 38°C mineral-rich milky blue waters, apply rejuvenating silica mud masks, and enjoy a complimentary welcome drink. Continue to your luxury hotel in Reykjavík, check in, and enjoy an orientation dinner with fellow travelers.',
          timing: 'Afternoon & Evening',
          meals: ['Welcome Dinner Included'],
          activities: [
            { name: 'Keflavík Airport to Reykjavík Nordic Chauffeur Transfer', tag: 'Transfer', duration: '50 mins', img: selectedTransfer.img, isTransfer: true },
            { name: 'Blue Lagoon Comfort Entry & Silica Mud Mask Experience', tag: 'Highlight', duration: '3 Hours', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' },
            { name: `Check-in at ${selectedHotel.name}`, tag: 'Stay', duration: 'Flexible', img: selectedHotel.img, isHotel: true }
          ]
        },
        {
          day: 2,
          title: 'The Iconic Golden Circle: Thingvellir National Park, Strokkur Geysir & Gullfoss',
          desc: 'Embark on the world-renowned Golden Circle. Visit Thingvellir National Park, a UNESCO World Heritage Site where the North American and Eurasian tectonic plates drift apart. Witness the erupting Strokkur Geysir shooting boiling water 30 meters into the sky every few minutes. Marvel at Gullfoss (Golden Falls) as the mighty glacial river plunges 32 meters into a roaring canyon. Evening aurora alert and guided night sky viewing.',
          timing: 'Full Day (08:30 AM - 05:30 PM)',
          meals: ['Scandinavian Buffet Breakfast Included'],
          activities: [
            { name: 'Thingvellir Continental Drift Walk & Law Rock Exploration', tag: 'Sightseeing', duration: '2 Hours', img: '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp' },
            { name: 'Strokkur Geysir & Haukadalur Geothermal Field', tag: 'Geothermal', duration: '1.5 Hours', img: '/images/holidays/photo-1518495973542-4542c06a5843.webp' },
            { name: 'Gullfoss Two-Tiered Roaring Waterfall Panorama', tag: 'Highlight', duration: '1.5 Hours', img: '/images/holidays/photo-1517411032315-54ef2cb783bb.webp' }
          ]
        },
        {
          day: 3,
          title: 'South Coast Wonders: Seljalandsfoss, Skógafoss & Reynisfjara Black Sand Beach in Vík',
          desc: 'Drive along Iceland\'s dramatic southern coastline. Walk behind the cascading curtain of water at Seljalandsfoss and stand in awe of the 60-meter roar of Skógafoss. Continue to the famous Reynisfjara Black Sand Beach near Vík, featuring towering basalt sea stacks, powerful Atlantic surf, and hexagonal columnar cliff formations. Check into your hotel in Vík for 2 nights.',
          timing: 'Full Day (09:00 AM - 06:00 PM)',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Seljalandsfoss Walking Behind the Waterfall Experience', tag: 'Sightseeing', duration: '1 Hour', img: '/images/holidays/photo-1489599849927-2ee91cede3ba.webp' },
            { name: 'Skógafoss 60m Waterfall & Staircase Viewpoint', tag: 'Sightseeing', duration: '1.5 Hours', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' },
            { name: 'Reynisfjara Black Sand Beach & Reynisdrangar Basalt Stacks', tag: 'Highlight', duration: '2 Hours', img: '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp' }
          ]
        },
        {
          day: 4,
          title: 'Vík to Skaftafell & Vatnajökull: Crystal Blue Ice Cave Tour & Glacier Exploration',
          desc: 'Equip with crampons and helmets as specialized Super Jeeps drive you to the edge of Vatnajökull, Europe\'s grandest ice cap. Step inside a naturally formed Crystal Blue Ice Cave, surrounded by thousands-year-old translucent sapphire-blue glacial ice sculpted by seasonal melting. Explore the glacier tongues and deep crevasses with our certified mountain guides.',
          timing: 'Full Day (08:30 AM - 05:00 PM)',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Super Jeep 4x4 Glacier Transit to Vatnajökull Ice Cap', tag: 'Adventure', duration: '1.5 Hours', img: selectedTransfer.img, isTransfer: true },
            { name: 'Crystal Blue Ice Cave Guided Expedition with Crampons', tag: 'Highlight', duration: '3.5 Hours', img: '/images/holidays/photo-1518495973542-4542c06a5843.webp' }
          ]
        },
        {
          day: 5,
          title: 'Jökulsárlón Glacier Lagoon Boat Tour & Diamond Beach to East Coast Höfn',
          desc: 'Arrive at the breathtaking Jökulsárlón Glacier Lagoon. Board an amphibious boat and cruise directly among massive 1,000-year-old floating blue and black icebergs calved from the Breiðamerkurjökull glacier. Across the road, visit the world-famous Diamond Beach where stranded crystal icebergs sparkle brilliantly against pure black volcanic sands. Drive to Höfn, Iceland\'s lobster capital.',
          timing: 'Full Day (09:00 AM - 06:30 PM)',
          meals: ['Breakfast Included', 'Traditional Langoustine Dinner Included'],
          activities: [
            { name: 'Jökulsárlón Glacier Lagoon Amphibian Boat Cruise', tag: 'Highlight', duration: '2 Hours', img: '/images/holidays/photo-1517411032315-54ef2cb783bb.webp' },
            { name: 'Diamond Beach Iceberg Walk & Seal Spotting', tag: 'Nature', duration: '1.5 Hours', img: '/images/holidays/photo-1489599849927-2ee91cede3ba.webp' }
          ]
        },
        {
          day: 6,
          title: 'Höfn through the Rugged East Fjords to Lake Mývatn Geothermal Wonderland',
          desc: 'Wind through narrow fjord passes lined by vertical peaks dropping straight into the Arctic ocean. Pass tranquil fishing villages including Djúpivogur. Ascend to northern Iceland and enter the surreal geothermal region of Lake Mývatn. Walk through the Dimmuborgir "Dark Castles" volcanic labyrinth and watch boiling sulfur mud pots and steaming fumaroles at Námaskarð Pass.',
          timing: 'Full Day (08:30 AM - 07:00 PM)',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'East Fjords Scenic Coastal Mountain Highway Cruise', tag: 'Transfer', duration: '4 Hours', img: selectedTransfer.img, isTransfer: true },
            { name: 'Námaskarð Geothermal Boiling Mud Pots & Fumaroles', tag: 'Geothermal', duration: '1 Hour', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' },
            { name: 'Dimmuborgir Volcanic Lava Caves & Pillars Walk', tag: 'Sightseeing', duration: '1.5 Hours', img: '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp' }
          ]
        },
        {
          day: 7,
          title: 'Godafoss Waterfall of the Gods to Akureyri & Historic Herring Town Siglufjörður',
          desc: 'Visit Godafoss, where chieftain Thorgeir cast his pagan Norse idols into the rushing waters upon adopting Christianity in 1000 AD. Explore Akureyri, Iceland\'s charming northern capital with its historic wooden houses and Arctic botanical gardens. Drive along the spectacular Tröllaskagi (Troll Peninsula) mountains to Siglufjörður, Iceland\'s northernmost town.',
          timing: 'Full Day (09:00 AM - 05:30 PM)',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Goðafoss "Waterfall of the Gods" Canyon Viewpoint', tag: 'Highlight', duration: '1.5 Hours', img: '/images/holidays/photo-1518495973542-4542c06a5843.webp' },
            { name: 'Akureyri Old Town & Arctic Botanical Garden Walk', tag: 'Cultural', duration: '2 Hours', img: '/images/holidays/photo-1517411032315-54ef2cb783bb.webp' },
            { name: 'Siglufjörður Herring Era Maritime Harbor Exploration', tag: 'Sightseeing', duration: '1.5 Hours', img: '/images/holidays/photo-1489599849927-2ee91cede3ba.webp' }
          ]
        },
        {
          day: 8,
          title: 'Siglufjörður to Borgarfjörður: Deildartunguhver Hot Springs & Hraunfossar Waterfalls',
          desc: 'Journey south toward West Iceland. Visit Deildartunguhver, Europe\'s most powerful hot spring pumping 180 liters of boiling water every second. Marvel at Hraunfossar, where hundreds of pristine turquoise springs emerge directly from beneath a vast porous lava field and tumble into the Hvítá glacial river. Check into your hotel in Borgarnes.',
          timing: 'Full Day (09:00 AM - 06:00 PM)',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Deildartunguhver Hot Springs & Krauma Geothermal Baths', tag: 'Geothermal', duration: '2 Hours', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' },
            { name: 'Hraunfossar & Barnafoss Lava Cascade Waterfalls', tag: 'Sightseeing', duration: '1.5 Hours', img: '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp' }
          ]
        },
        {
          day: 9,
          title: 'Snæfellsnes Peninsula: Kirkjufell Arrowhead Mountain & Return to Reykjavík',
          desc: 'Spend the morning discovering the mythical Snæfellsnes Peninsula, dominated by the glacier-capped Snæfellsjökull volcano made famous by Jules Verne. Photograph iconic Kirkjufell Mountain and Kirkjufellsfoss waterfall. In the afternoon, return to Reykjavík. Stroll along Laugavegur shopping street and enjoy a special farewell Nordic banquet.',
          timing: 'Full Day (08:30 AM - 07:00 PM)',
          meals: ['Breakfast Included', 'Farewell Icelandic Dinner Included'],
          activities: [
            { name: 'Kirkjufell Mountain & Triple Waterfall Photo Excursion', tag: 'Highlight', duration: '2 Hours', img: '/images/holidays/photo-1518495973542-4542c06a5843.webp' },
            { name: 'Return Highway Drive to Reykjavík City Center', tag: 'Transfer', duration: '2.5 Hours', img: selectedTransfer.img, isTransfer: true },
            { name: 'Reykjavík Evening Northern Lights Hunt & Astrophotography', tag: 'Aurora Chase', duration: '3 Hours', img: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' }
          ]
        },
        {
          day: 10,
          title: 'Reykjavík City Tour: Hallgrímskirkja & Harpa | Departure to Keflavík Airport (KEF)',
          desc: 'Savor your final Scandinavian buffet breakfast. Take a guided walking tour of Reykjavík featuring the soaring Hallgrímskirkja church tower with 360-degree city views, the shimmering glass Harpa Concert Hall, and the Sun Voyager Viking ship sculpture. Transfer smoothly to Keflavík International Airport (KEF) with fond memories of the Land of Fire and Ice.',
          timing: 'Morning & Afternoon',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Hallgrímskirkja Tower Viewpoint & Harpa Concert Hall', tag: 'Cultural', duration: '2 Hours', img: '/images/holidays/photo-1517411032315-54ef2cb783bb.webp' },
            { name: 'Private Nordic Transfer to Keflavík International Airport (KEF)', tag: 'Transfer', duration: '50 mins', img: selectedTransfer.img, isTransfer: true }
          ]
        }
      ],
      inclusions: [
        `9 Nights Luxury Hotel Accommodations in Iceland (${selectedHotel.name} & Verified Ring Road Lodges)`,
        'Daily Scandinavian Buffet Breakfast at all hotels',
        '2 Special Nordic Multi-Course Dinners (Welcome Dinner + Lobster Feast/Farewell Banquet)',
        `Dedicated Private All-Weather 4x4 Nordic Vehicle (${selectedTransfer.name}) with WiFi & heated seats`,
        'Blue Lagoon Comfort Entrance with Silica Mud Mask & Welcome Drink',
        'Certified Vatnajökull Crystal Blue Ice Cave Guided Expedition with Crampons & Helmet',
        'Jökulsárlón Amphibious Glacier Lagoon Boat Cruise Tour',
        'Complete Golden Circle Tour: Thingvellir, Strokkur Geysir & Gullfoss',
        'Nightly Aurora Borealis / Northern Lights guided chase alerts with warm cocoa',
        'All road tolls, Hvalfjörður tunnel passes, national park entry permits & fuel 100% included',
        '24x7 Dedicated LehConnect On-Trip Support Manager & Iceland Trip Concierge'
      ],
      exclusions: [
        'International Airfare to and from Keflavík (KEF)',
        'Schengen Tourist Visa (Assistance available upon checkout)',
        'Personal expenses such as alcoholic drinks, laundry, and shopping',
        'Optional extra activities like snowmobiling or whale watching'
      ],
      reviews: [
        { name: 'Ananya S.', date: 'August 2026', content: 'Iceland was the trip of a lifetime! The 10-day itinerary covered every single highlight without feeling rushed. Walking inside the Vatnajökull ice cave and seeing the Northern Lights dance over Kirkjufell was unreal. LehConnect team handled everything seamlessly!', rating: 5, avatar: '/images/holidays/photo-1529963183134-61a90db47eaf.webp' },
        { name: 'Rohan K.', date: 'September 2026', content: 'The 4x4 Nordic SUV and hotels were top-notch. Our driver was extremely knowledgeable about Iceland\'s geology and drove safely on all terrains. Worth every single rupee!', rating: 5, avatar: '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 2. GOA PACKAGES (pkg-goa-1, pkg-goa-2, pkg-goa-3, pkg-goa-4)
  // --------------------------------------------------------------------------
  if (category === 'goa' || pkgId.includes('goa')) {
    const is4Day = pkg.duration?.includes('4');
    const is6Day = pkg.duration?.includes('6');

    return {
      cities: [
        { name: 'North Goa (Calangute & Baga)', nights: is4Day ? '2 Nights' : '3 Nights', img: '/images/holidays/goa.webp' },
        { name: 'South Goa (Varca & Colva)', nights: is6Day ? '3 Nights' : '2 Nights', img: '/images/holidays/fortune-hotel.webp' }
      ],
      highlights: [
        `Luxury stay at ${selectedHotel.name} with direct beach access and swimming pool`,
        'Private chauffeur-driven AC vehicle for airport pickup, drop-off, and full sightseeing tours',
        'North Goa Beach Circuit: Calangute, Baga, Anjuna, and Vagator Beach photo points',
        'Historic 17th-century Fort Aguada and lighthouse overlooking the Arabian Sea',
        'Mandovi River Sunset Luxury Cruise with live Goan folk dance & DJ music',
        'South Goa Heritage Tour: Basilica of Bom Jesus & Se Cathedral in Old Goa',
        'Thrilling excursion to cascading Dudhsagar Waterfalls and aromatic spice plantation'
      ],
      hotel: selectedHotel,
      transfer: selectedTransfer,
      activities: [
        { name: 'North Goa Beach Hopping: Calangute, Baga & Anjuna Beach', tag: 'Beach Tour', duration: '4 Hours', img: '/images/holidays/goa.webp', included: true },
        { name: 'Fort Aguada & 1864 Portuguese Lighthouse Tour', tag: 'Heritage', duration: '2 Hours', img: '/images/holidays/fortune-hotel.webp', included: true },
        { name: 'Mandovi River Sunset Cruise with Cultural Performance', tag: 'Highlight', duration: '2 Hours', img: '/images/holidays/photo-1512453979798-5ea266f8880c.webp', included: true },
        { name: 'Old Goa Heritage Churches: Basilica of Bom Jesus', tag: 'UNESCO', duration: '2.5 Hours', img: '/images/holidays/photo-1507525428034-b723cf961d3e.webp', included: true }
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival at Goa Airport (GOI/GOX) | Private Chauffeur Pickup & Resort Check-in',
          desc: 'Arrive at Goa Airport (Dabolim or Mopa) or Madgaon Railway Station. Meet your dedicated chauffeur holding a LehConnect welcome board. Enjoy a scenic coastal drive to your luxury beach resort. Check in, enjoy a refreshing kokum welcome drink, and spend the afternoon lounging by the swimming pool or walking on the golden beach sands.',
          timing: 'Afternoon & Evening',
          meals: ['Welcome Drink Included'],
          activities: [
            { name: 'Goa Airport to Beach Resort Private AC Cab Transfer', tag: 'Transfer', duration: '1 Hour', img: selectedTransfer.img, isTransfer: true },
            { name: `Check-in at ${selectedHotel.name}`, tag: 'Stay', duration: 'Flexible', img: selectedHotel.img, isHotel: true }
          ]
        },
        {
          day: 2,
          title: 'North Goa Coastal Explorer: Fort Aguada, Calangute, Baga & Vagator Beach',
          desc: 'After a hearty buffet breakfast, embark on a comprehensive North Goa tour. Visit historic Fort Aguada, built in 1612 to protect against Dutch invaders. Stroll along Calangute and Baga beaches, vibrant with shacks and water sports. Stop by the dramatic red cliffs of Vagator Beach overlooking Chapora Fort.',
          timing: 'Full Day (09:30 AM - 06:00 PM)',
          meals: ['Buffet Breakfast Included'],
          activities: [
            { name: 'Fort Aguada & Lighthouse Guided Heritage Walk', tag: 'Heritage', duration: '1.5 Hours', img: '/images/holidays/fortune-hotel.webp' },
            { name: 'Baga & Calangute Beach Watersports & Shacks Tour', tag: 'Beach Tour', duration: '3 Hours', img: '/images/holidays/goa.webp' },
            { name: 'Sunset Vista at Vagator Beach & Chapora Viewpoint', tag: 'Sunset', duration: '1.5 Hours', img: '/images/holidays/photo-1507525428034-b723cf961d3e.webp' }
          ]
        },
        {
          day: 3,
          title: 'South Goa Heritage, Old Goa UNESCO Churches & Mandovi River Sunset Cruise',
          desc: 'Explore the cultural soul of Goa. Visit Old Goa to marvel at the UNESCO World Heritage Basilica of Bom Jesus, preserving the sacred remains of St. Francis Xavier, and the grand Se Cathedral. In the evening, board an illuminated 1-hour luxury cruise on the Mandovi River featuring live Goan Dekhni and Fugdi folk dance performances.',
          timing: 'Full Day (10:00 AM - 07:30 PM)',
          meals: ['Buffet Breakfast Included'],
          activities: [
            { name: 'Basilica of Bom Jesus & Se Cathedral Heritage Guided Tour', tag: 'UNESCO', duration: '2 Hours', img: '/images/holidays/photo-1512453979798-5ea266f8880c.webp' },
            { name: 'Panaji Latin Quarter (Fontainhas) Photo Walk', tag: 'Cultural', duration: '1.5 Hours', img: '/images/holidays/goa.webp' },
            { name: 'Mandovi River Sunset Luxury Cruise with Live Music & DJ', tag: 'Highlight', duration: '1.5 Hours', img: '/images/holidays/fortune-hotel.webp' }
          ]
        },
        {
          day: 4,
          title: is4Day ? 'Leisure Morning & Private Chauffeur Drop-off at Goa Airport' : 'Dudhsagar Waterfalls & Spice Plantation Safari',
          desc: is4Day
            ? 'Enjoy a leisurely tropical breakfast at the resort. Spend your final morning shopping for Goan feni, cashew nuts, and handicrafts in Panjim or taking one last beach swim. Your chauffeur will escort you smoothly to Goa Airport for your onward flight.'
            : 'Take a thrilling open-jeep jungle safari through Mollem National Park to the roaring four-tiered Dudhsagar Waterfalls. Enjoy swimming in the freshwater pool beneath the falls. Visit an organic spice plantation for a traditional Goan buffet lunch served on banana leaves.',
          timing: is4Day ? 'Morning & Afternoon' : 'Full Day (08:30 AM - 05:30 PM)',
          meals: is4Day ? ['Buffet Breakfast Included'] : ['Buffet Breakfast Included', 'Traditional Goan Lunch Included'],
          activities: is4Day
            ? [
                { name: 'Private AC Transfer to Goa Airport (GOI / GOX)', tag: 'Transfer', duration: '1 Hour', img: selectedTransfer.img, isTransfer: true }
              ]
            : [
                { name: 'Dudhsagar Waterfalls 4x4 Jeep Jungle Safari', tag: 'Adventure', duration: '3.5 Hours', img: '/images/holidays/photo-1507525428034-b723cf961d3e.webp' },
                { name: 'Spice Plantation Tour with Traditional Goan Feast', tag: 'Experience', duration: '2 Hours', img: '/images/holidays/goa.webp' }
              ]
        },
        ...(is4Day ? [] : [
          {
            day: 5,
            title: is6Day ? 'South Goa Pristine White Beaches: Colva, Benaulim & Palolem' : 'Leisure Morning & Private Chauffeur Drop-off at Goa Airport',
            desc: is6Day
              ? 'Discover South Goa\'s peaceful white-sand beaches. Relax under swaying palms at Benaulim and Palolem Beach, take an optional dolphin spotting boat ride, and enjoy fresh seafood at beachside cafes.'
              : 'Enjoy a leisurely breakfast and check out from your hotel. Your private chauffeur will drive you to Goa Airport for your scheduled return flight.',
            timing: 'Morning & Afternoon',
            meals: ['Buffet Breakfast Included'],
            activities: [
              { name: is6Day ? 'South Goa Beach Leisure & Dolphin Spotting' : 'Private AC Transfer to Goa Airport (GOI / GOX)', tag: is6Day ? 'Nature' : 'Transfer', duration: is6Day ? '3 Hours' : '1 Hour', img: is6Day ? '/images/holidays/goa.webp' : selectedTransfer.img, isTransfer: !is6Day }
            ]
          }
        ]),
        ...(is6Day ? [
          {
            day: 6,
            title: 'Souvenir Shopping in Panjim & Private Chauffeur Drop-off at Airport',
            desc: 'Savor your final Goan breakfast. Pick up local cashews, bebinca sweets, and Mario Miranda souvenirs. Your chauffeur transfers you promptly to Goa Airport for your departure.',
            timing: 'Morning & Afternoon',
            meals: ['Buffet Breakfast Included'],
            activities: [
              { name: 'Private AC Chauffeur Drop at Goa Airport (GOI / GOX)', tag: 'Transfer', duration: '1 Hour', img: selectedTransfer.img, isTransfer: true }
            ]
          }
        ] : [])
      ],
      inclusions: [
        `${pkg.duration} Luxury Resort Stay at ${selectedHotel.name}`,
        'Daily Buffet Breakfast at Resort Restaurant',
        `Dedicated Private AC Cab (${selectedTransfer.name}) for all pickups, drops, and sightseeing`,
        'North Goa Beach Tour (Fort Aguada, Calangute, Baga, Vagator)',
        'South Goa Heritage Tour (Basilica of Bom Jesus, Se Cathedral, Miramar Beach)',
        'Mandovi River Sunset Cruise Tickets included',
        'All toll charges, parking fees, and driver allowances included'
      ],
      exclusions: [
        'Airfare / Train tickets to and from Goa',
        'Personal water sports activities like parasailing or jet ski',
        'Any personal expenses and meals not listed in itinerary'
      ],
      reviews: [
        { name: 'Priya N.', date: 'September 2026', content: 'Our Goa trip was pure relaxation! The resort was right by the beach and our driver was always polite and on time. Booking with LehConnect was effortless.', rating: 5, avatar: '/images/holidays/goa.webp' },
        { name: 'Amit Verma', date: 'August 2026', content: 'Awesome hotel and great sightseeing balance. Sunset cruise was a big highlight for my family!', rating: 5, avatar: '/images/holidays/fortune-hotel.webp' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 3. JAPAN PACKAGES (pkg-jap-1: 8 Days, pkg-jap-2: 6 Days)
  // --------------------------------------------------------------------------
  if (category === 'japan' || pkgId.includes('jap')) {
    return {
      cities: [
        { name: 'Tokyo Metropolis', nights: '3 Nights', img: '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp' },
        { name: 'Historic Kyoto', nights: '3 Nights', img: '/images/holidays/photo-1503899036084-c55cdd92da26.webp' },
        { name: 'Osaka Gourmet', nights: '1 Night', img: '/images/holidays/photo-1490730141103-6cac27aaab94.webp' }
      ],
      highlights: [
        `Luxury stay in Tokyo & Kyoto (${selectedHotel.name})`,
        'Shinkansen Bullet Train Experience racing at 320 km/h between Tokyo and Kyoto',
        'Mt. Fuji 5th Station & Lake Kawaguchiko scenic panoramic cruise',
        'Historic Tokyo: Senso-ji Temple in Asakusa and Shibuya Crossing',
        'Kyoto Zen Wonders: Kinkaku-ji (Golden Pavilion) & Fushimi Inari 10,000 Torii Gates',
        'Arashiyama Bamboo Grove walking path & traditional rickshaw experience',
        'Osaka Castle exploration and culinary street food walk through vibrant Dotonbori'
      ],
      hotel: selectedHotel,
      transfer: selectedTransfer,
      activities: [
        { name: 'Mt. Fuji 5th Station & Lake Kawaguchiko Panoramic Ropeway', tag: 'Highlight', duration: 'Full Day', img: '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp', included: true },
        { name: 'Fushimi Inari Shrine 10,000 Red Torii Gates Walk', tag: 'Cultural', duration: '2.5 Hours', img: '/images/holidays/photo-1503899036084-c55cdd92da26.webp', included: true },
        { name: 'Arashiyama Bamboo Forest & Tenryu-ji Temple', tag: 'Nature', duration: '3 Hours', img: '/images/holidays/photo-1502086223501-7ea6ecd79368.webp', included: true }
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Tokyo (HND/NRT) | Airport Meet & Greet and Hotel Check-in',
          desc: 'Arrive at Tokyo Haneda or Narita International Airport. Meet our representative and transfer to your luxury hotel in central Tokyo. Rest and enjoy your evening exploring nearby illuminated city streets.',
          timing: 'Evening',
          meals: ['Dinner Included'],
          activities: [
            { name: 'Tokyo Airport to Hotel Private Transfer', tag: 'Transfer', duration: '1 Hour', img: selectedTransfer.img, isTransfer: true },
            { name: `Check-in at ${selectedHotel.name}`, tag: 'Stay', duration: 'Flexible', img: selectedHotel.img, isHotel: true }
          ]
        },
        {
          day: 2,
          title: 'Tokyo Highlights: Asakusa Senso-ji, Meiji Shrine & Iconic Shibuya Crossing',
          desc: 'Visit Tokyo\'s oldest temple Senso-ji, walk down Nakamise shopping street, find serenity at Meiji Shinto Shrine, and experience the energy of world-famous Shibuya Scramble Crossing.',
          timing: 'Full Day',
          meals: ['Japanese & Western Breakfast Included'],
          activities: [
            { name: 'Asakusa Senso-ji Temple & Nakamise Dori Tour', tag: 'Cultural', duration: '2.5 Hours', img: '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp' },
            { name: 'Shibuya Crossing & Hachiko Statue Landmark Visit', tag: 'Sightseeing', duration: '1.5 Hours', img: '/images/holidays/photo-1503899036084-c55cdd92da26.webp' }
          ]
        },
        {
          day: 3,
          title: 'Majestic Mt. Fuji 5th Station & Lake Kawaguchiko Cruise',
          desc: 'Travel to Mt. Fuji, ascending to the 5th Station for panoramic views above the clouds. Cruise serene Lake Kawaguchiko with postcard reflections of Japan\'s sacred peak.',
          timing: 'Full Day',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Mt. Fuji 5th Station & Mt. Fuji Heritage Center', tag: 'Highlight', duration: '3 Hours', img: '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp' }
          ]
        },
        {
          day: 4,
          title: 'Tokyo to Kyoto via Shinkansen Bullet Train | Fushimi Inari Torii Gates',
          desc: 'Board the iconic Japanese Shinkansen bullet train to Kyoto. In the afternoon, hike through the mystical tunnel of 10,000 vermilion Torii gates at Fushimi Inari Taisha.',
          timing: 'Full Day',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Shinkansen Bullet Train Transit to Kyoto (320 km/h)', tag: 'Transfer', duration: '2 Hours 15 mins', img: selectedTransfer.img, isTransfer: true },
            { name: 'Fushimi Inari 10,000 Red Torii Shrine Walk', tag: 'Cultural', duration: '2.5 Hours', img: '/images/holidays/photo-1503899036084-c55cdd92da26.webp' }
          ]
        },
        {
          day: 5,
          title: 'Kyoto Zen Heritage: Kinkaku-ji (Golden Pavilion) & Arashiyama Bamboo Grove',
          desc: 'Marvel at Kinkaku-ji, the temple covered in authentic gold leaf reflecting upon its mirror pond. Walk beneath the towering green canopies of Arashiyama Bamboo Grove and visit the historic Togetsukyo Bridge.',
          timing: 'Full Day',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Kinkaku-ji Golden Pavilion & Zen Garden Tour', tag: 'UNESCO', duration: '2 Hours', img: '/images/holidays/photo-1490730141103-6cac27aaab94.webp' },
            { name: 'Arashiyama Bamboo Forest & Tenryu-ji Temple', tag: 'Nature', duration: '2.5 Hours', img: '/images/holidays/photo-1502086223501-7ea6ecd79368.webp' }
          ]
        },
        {
          day: 6,
          title: 'Kyoto Gion Geisha District to Osaka | Dotonbori Street Food Feast',
          desc: 'Stroll through historic Gion with preserved wooden machiya merchant houses. Transit to energetic Osaka. In the evening, explore dazzling neon-lit Dotonbori, tasting takoyaki and okonomiyaki.',
          timing: 'Full Day',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Gion Historic Geisha District Walking Tour', tag: 'Heritage', duration: '2 Hours', img: '/images/holidays/photo-1503899036084-c55cdd92da26.webp' },
            { name: 'Osaka Dotonbori Street Food & Glico Man Photo Tour', tag: 'Gourmet', duration: '2.5 Hours', img: '/images/holidays/photo-1492691527719-9d1e07e534b4.webp' }
          ]
        },
        {
          day: 7,
          title: 'Grand Osaka Castle Exploration & Umeda Sky Building Observatory',
          desc: 'Explore the grand 16th-century Osaka Castle with its massive stone ramparts and museum. Take in 360-degree aerial views of Osaka from the open-air rooftop observatory of Umeda Sky Building.',
          timing: 'Full Day',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Osaka Castle & Surrounding Nishinomaru Garden Tour', tag: 'Sightseeing', duration: '2.5 Hours', img: '/images/holidays/photo-1490730141103-6cac27aaab94.webp' }
          ]
        },
        {
          day: 8,
          title: 'Departure from Kansai International Airport (KIX) / Tokyo',
          desc: 'Enjoy your final Japanese breakfast. Chauffeur transfer to Kansai International Airport (KIX) for your scheduled flight home with unforgettable memories of Japan.',
          timing: 'Morning',
          meals: ['Breakfast Included'],
          activities: [
            { name: 'Private AC Transfer to Kansai Airport (KIX)', tag: 'Transfer', duration: '50 mins', img: selectedTransfer.img, isTransfer: true }
          ]
        }
      ],
      inclusions: [
        '7 Nights luxury hotel stay in Tokyo, Kyoto and Osaka',
        'Daily Japanese and International buffet breakfast',
        'Shinkansen Bullet Train Tokyo to Kyoto reserved seat tickets',
        'Mt. Fuji 5th Station & Lake Kawaguchiko day tour',
        'All entrance tickets to Kinkaku-ji, Senso-ji, and Osaka Castle',
        'Private airport transfers on arrival and departure'
      ],
      exclusions: [
        'International Airfare to and from Japan',
        'Japan Visa fees',
        'Personal expenses and lunches'
      ],
      reviews: [
        { name: 'Aditi M.', date: 'September 2026', content: 'Japan was pure magic! Everything ran with clockwork precision. Shinkansen was incredible and hotels in Tokyo and Kyoto were superb.', rating: 5, avatar: '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp' }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // 4. UNIVERSAL DYNAMIC PLAN GENERATOR (Handles all other 10 destinations)
  // --------------------------------------------------------------------------
  const durationMatch = (pkg.duration || '5 days').match(/(\d+)\s*day/i);
  const totalDays = durationMatch ? parseInt(durationMatch[1], 10) : 5;

  const itineraryCities = (pkg.itinerary || cat || 'Scenic Destination')
    .split(/•|➔|,|\.\.\./)
    .map(s => s.replace(/\d+[ND]/g, '').trim())
    .filter(Boolean);

  const primaryCity = itineraryCities[0] || cat || 'Landmark City';

  const defaultDays = Array.from({ length: totalDays }, (_, idx) => {
    const dayNum = idx + 1;
    const isFirst = dayNum === 1;
    const isLast = dayNum === totalDays;
    const city = itineraryCities[(idx) % itineraryCities.length] || primaryCity;

    let title = `${city} Sightseeing & Iconic Landmarks`;
    let desc = `Explore premier scenic highlights, cultural monuments, and local heritage in ${city}. Enjoy guided walks, leisure time for authentic culinary tastings, and photography stops.`;

    if (isFirst) {
      title = `Arrival & Welcome to ${city} | Check-in at ${selectedHotel.name}`;
      desc = `Arrive at the airport / terminal where your private chauffeur awaits with a name board. Transfer smoothly to ${selectedHotel.name}, check in, and spend a relaxing evening enjoying the hotel amenities.`;
    } else if (isLast) {
      title = `Farewell ${city} | Souvenir Shopping & Departure Transfer`;
      desc = `Enjoy a delicious buffet breakfast. Check out from your hotel with assisted luggage service. Your chauffeur will transfer you punctually to the departure terminal for your onward journey.`;
    } else if (dayNum === 2) {
      title = `Full-Day Highlights Tour of ${city}`;
      desc = `Embark on an extensive sightseeing day covering the top attractions, scenic viewpoints, and heritage landmarks of ${city} with your private driver.`;
    }

    return {
      day: dayNum,
      title,
      desc,
      timing: isFirst ? 'Afternoon & Evening' : isLast ? 'Morning & Afternoon' : 'Full Day (09:00 AM - 05:30 PM)',
      meals: isFirst ? ['Welcome Dinner Included'] : ['Buffet Breakfast Included'],
      activities: isFirst
        ? [
            { name: `Airport to Hotel Private AC Transfer`, tag: 'Transfer', duration: '45 mins', img: selectedTransfer.img, isTransfer: true },
            { name: `Check-in at ${selectedHotel.name}`, tag: 'Stay', duration: 'Flexible', img: selectedHotel.img, isHotel: true }
          ]
        : isLast
        ? [
            { name: `Hotel Checkout & Departure Chauffeur Transfer`, tag: 'Transfer', duration: '1 Hour', img: selectedTransfer.img, isTransfer: true }
          ]
        : [
            { name: `${city} Guided Landmark & Cultural Tour`, tag: 'Sightseeing', duration: '3.5 Hours', img: pkg.images?.[(dayNum) % (pkg.images?.length || 1)] || '/images/holidays/photo-1529963183134-61a90db47eaf.webp' }
          ]
    };
  });

  return {
    cities: itineraryCities.map(c => ({
      name: c,
      nights: 'Scenic Stay',
      img: pkg.images?.[0] || '/images/holidays/photo-1529963183134-61a90db47eaf.webp'
    })),
    highlights: [
      `${pkg.duration} fully guided premium tour of ${primaryCity}`,
      `Handpicked luxury stay at ${selectedHotel.name} with daily breakfast`,
      `Dedicated private AC vehicle (${selectedTransfer.name}) for all sightseeing transfers`,
      'All iconic attractions, scenic viewpoints, and heritage landmarks included',
      'All toll taxes, parking permits, and driver allowances 100% covered',
      '24x7 LehConnect On-Trip Support Manager'
    ],
    hotel: selectedHotel,
    transfer: selectedTransfer,
    activities: [
      { name: `${primaryCity} Premier Sightseeing Tour`, tag: 'Highlight', duration: 'Full Day', img: pkg.images?.[0] || '/images/holidays/photo-1529963183134-61a90db47eaf.webp', included: true },
      { name: `Cultural Heritage & Landmark Exploration`, tag: 'Cultural', duration: '3 Hours', img: pkg.images?.[1] || '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp', included: true }
    ],
    itinerary: defaultDays,
    inclusions: [
      `${pkg.duration} accommodation at ${selectedHotel.name}`,
      'Daily delicious buffet breakfast included',
      `Dedicated private AC vehicle (${selectedTransfer.name}) throughout`,
      'All sightseeing excursions as detailed in the day plan',
      'Tolls, parking, and driver allowances 100% included'
    ],
    exclusions: [
      'Airfare / Train tickets to departure city',
      'Personal expenses and optional activities'
    ],
    reviews: [
      { name: 'Rahul S.', date: 'August 2026', content: `Unbelievable holiday experience! The team at LehConnect planned every single detail to perfection. Highly recommended!`, rating: 5, avatar: pkg.images?.[0] || '/images/holidays/photo-1529963183134-61a90db47eaf.webp' }
    ]
  };
};
