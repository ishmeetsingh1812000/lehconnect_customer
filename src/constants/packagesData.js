// Centralized database for holiday packages to prevent duplication across components
export const PACKAGES_DATA = {
  europe: [
    {
      id: 'pkg-eur-1',
      title: 'Journey Through Iceland Hidden Treasures | Group Tour Package',
      duration: '10 days & 9 nights',
      rating: 4.3,
      reviews: 4,
      saveAmount: '1,11,540',
      originalPrice: '4,50,011',
      actualPrice: '3,38,471',
      itinerary: '2D Reykjavík • 2D Akureyri • 2D Borgarnes • 2D Vik ...+2',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1529963183134-61a90db47eaf.webp',
        '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp',
        '/images/holidays/photo-1518495973542-4542c06a5843.webp',
        '/images/holidays/photo-1517411032315-54ef2cb783bb.webp',
        '/images/holidays/photo-1489599849927-2ee91cede3ba.webp'
      ]
    },
    {
      id: 'pkg-eur-2',
      title: 'Highlights Of Iceland With Southern Shores Adventure',
      duration: '5 days & 4 nights',
      rating: 4.9,
      reviews: 427,
      saveAmount: '84,327',
      originalPrice: '3,40,359',
      actualPrice: '2,56,032',
      itinerary: '5D Reykjavík',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1517411032315-54ef2cb783bb.webp',
        '/images/holidays/photo-1489599849927-2ee91cede3ba.webp',
        '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp',
        '/images/holidays/photo-1518495973542-4542c06a5843.webp',
        '/images/holidays/photo-1529963183134-61a90db47eaf.webp'
      ]
    },
    {
      id: 'pkg-eur-3',
      title: 'Getaway To Iceland | Chasing Auroras In The Land Of Ice And Fire',
      duration: '7 days & 6 nights',
      rating: 4.5,
      reviews: 6,
      saveAmount: '78,919',
      originalPrice: '3,18,366',
      actualPrice: '2,39,447',
      itinerary: '7D Reykjavík',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1529333166437-7750a6dd5a70.webp',
        '/images/holidays/photo-1461896836934-ffe607ba8211.webp',
        '/images/holidays/photo-1517411032315-54ef2cb783bb.webp',
        '/images/holidays/photo-1489599849927-2ee91cede3ba.webp',
        '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp'
      ]
    }
  ],
  japan: [
    {
      id: 'pkg-jap-1',
      title: 'Classic Japan: Tokyo, Kyoto & Osaka Heritage Explorer',
      duration: '8 days & 7 nights',
      rating: 4.8,
      reviews: 112,
      saveAmount: '60,000',
      originalPrice: '2,80,000',
      actualPrice: '2,20,000',
      itinerary: '3D Tokyo • 3D Kyoto • 2D Osaka',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp',
        '/images/holidays/photo-1503899036084-c55cdd92da26.webp',
        '/images/holidays/photo-1490730141103-6cac27aaab94.webp',
        '/images/holidays/photo-1502086223501-7ea6ecd79368.webp',
        '/images/holidays/photo-1492691527719-9d1e07e534b4.webp'
      ]
    },
    {
      id: 'pkg-jap-2',
      title: 'Japan Winter Wonderland & Hokkaido Snow Festival Tour',
      duration: '6 days & 5 nights',
      rating: 4.9,
      reviews: 89,
      saveAmount: '45,000',
      originalPrice: '2,10,000',
      actualPrice: '1,65,000',
      itinerary: '4D Sapporo • 2D Otaru',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1502086223501-7ea6ecd79368.webp',
        '/images/holidays/photo-1492691527719-9d1e07e534b4.webp',
        '/images/holidays/photo-1493976040374-85c8e12f0c0e.webp',
        '/images/holidays/photo-1503899036084-c55cdd92da26.webp',
        '/images/holidays/photo-1490730141103-6cac27aaab94.webp'
      ]
    }
  ],
  singapore: [
    {
      id: 'pkg-sin-1',
      title: 'Singapore City Heights & Sentosa Island Fun Escape',
      duration: '5 days & 4 nights',
      rating: 4.6,
      reviews: 174,
      saveAmount: '22,500',
      originalPrice: '1,12,500',
      actualPrice: '90,000',
      itinerary: '3D Marina Bay • 2D Sentosa Island',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1525625293386-3f8f99389edd.webp',
        '/images/holidays/photo-1518391846015-55a9cc003b25.webp',
        '/images/holidays/photo-1563245372-f21724e3856d.webp',
        '/images/holidays/photo-1525625293386-3f8f99389edd.webp',
        '/images/holidays/photo-1518391846015-55a9cc003b25.webp'
      ]
    },
    {
      id: 'pkg-sin-2',
      title: 'Singapore & Malaysia Twin City Landmark Getaway',
      duration: '7 days & 6 nights',
      rating: 4.7,
      reviews: 95,
      saveAmount: '35,000',
      originalPrice: '1,65,000',
      actualPrice: '1,30,000',
      itinerary: '4D Singapore • 3D Kuala Lumpur',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1563245372-f21724e3856d.webp',
        '/images/holidays/photo-1525625293386-3f8f99389edd.webp',
        '/images/holidays/photo-1518391846015-55a9cc003b25.webp',
        '/images/holidays/photo-1563245372-f21724e3856d.webp',
        '/images/holidays/photo-1525625293386-3f8f99389edd.webp'
      ]
    }
  ],
  maldives: [
    {
      id: 'pkg-mld-1',
      title: 'Maldives Luxury Overwater Villa Honeymoon Special',
      duration: '5 days & 4 nights',
      rating: 4.9,
      reviews: 512,
      saveAmount: '90,000',
      originalPrice: '3,10,000',
      actualPrice: '2,20,000',
      itinerary: '5D Premium Island Resort Villa Stay',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1514282401047-d79a71a590e8.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/photo-1439066615861-d1af74d74000.webp',
        '/images/holidays/photo-1514282401047-d79a71a590e8.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp'
      ]
    },
    {
      id: 'pkg-mld-2',
      title: 'Maldives All-Inclusive Beach Resort Family Holiday',
      duration: '6 days & 5 nights',
      rating: 4.8,
      reviews: 320,
      saveAmount: '75,000',
      originalPrice: '2,65,000',
      actualPrice: '1,90,000',
      itinerary: '6D Beachfront Bungalow • All Meals Included',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/photo-1439066615861-d1af74d74000.webp',
        '/images/holidays/photo-1514282401047-d79a71a590e8.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/photo-1439066615861-d1af74d74000.webp'
      ]
    }
  ],
  northeastindia: [
    {
      id: 'pkg-nei-1',
      title: 'Scenic Meghalaya & Shillong Hills Wonders Tour',
      duration: '6 days & 5 nights',
      rating: 4.7,
      reviews: 98,
      saveAmount: '15,000',
      originalPrice: '65,000',
      actualPrice: '50,000',
      itinerary: '2D Shillong • 2D Cherrapunji • 2D Mawlynnong',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1508138221679-760a23a2285b.webp',
        '/images/holidays/photo-1470071459604-3b5ec3a7fe05.webp',
        '/images/holidays/photo-1441974231531-c6227db76b6e.webp',
        '/images/holidays/photo-1508009603885-50cf7c579365.webp',
        '/images/holidays/photo-1508138221679-760a23a2285b.webp'
      ]
    },
    {
      id: 'pkg-nei-2',
      title: 'Pristine Sikkim & Darjeeling Tea Gardens Escape',
      duration: '7 days & 6 nights',
      rating: 4.6,
      reviews: 142,
      saveAmount: '18,500',
      originalPrice: '78,500',
      actualPrice: '60,000',
      itinerary: '3D Gangtok • 2D Darjeeling • 2D Pelling',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1508009603885-50cf7c579365.webp',
        '/images/holidays/photo-1470071459604-3b5ec3a7fe05.webp',
        '/images/holidays/photo-1508138221679-760a23a2285b.webp',
        '/images/holidays/photo-1441974231531-c6227db76b6e.webp',
        '/images/holidays/photo-1508009603885-50cf7c579365.webp'
      ]
    }
  ],
  dubai: [
    {
      id: 'pkg-dxb-1',
      title: 'Dubai Luxury Getaway & Desert Safari Dunes Experience',
      duration: '5 days & 4 nights',
      rating: 4.7,
      reviews: 305,
      saveAmount: '35,000',
      originalPrice: '1,45,000',
      actualPrice: '1,10,000',
      itinerary: '5D Dubai Downtown Stay',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1512453979798-5ea266f8880c.webp',
        '/images/holidays/photo-1451187580459-43490279c0fa.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/photo-1512453979798-5ea266f8880c.webp',
        '/images/holidays/photo-1451187580459-43490279c0fa.webp'
      ]
    },
    {
      id: 'pkg-dxb-2',
      title: 'Dubai & Abu Dhabi Grand Theme Park & Safari Combo',
      duration: '7 days & 6 nights',
      rating: 4.8,
      reviews: 182,
      saveAmount: '45,000',
      originalPrice: '1,95,000',
      actualPrice: '1,50,000',
      itinerary: '4D Dubai • 3D Abu Dhabi Yas Island',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1451187580459-43490279c0fa.webp',
        '/images/holidays/photo-1512453979798-5ea266f8880c.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/photo-1451187580459-43490279c0fa.webp',
        '/images/holidays/photo-1512453979798-5ea266f8880c.webp'
      ]
    }
  ],
  thailand: [
    {
      id: 'pkg-tha-1',
      title: 'Best of Thailand: Bangkok, Pattaya & Phuket Explorer',
      duration: '7 days & 6 nights',
      rating: 4.6,
      reviews: 420,
      saveAmount: '25,000',
      originalPrice: '95,000',
      actualPrice: '70,000',
      itinerary: '2D Bangkok • 2D Pattaya • 3D Phuket Island',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1508009603885-50cf7c579365.webp',
        '/images/holidays/photo-1537996194471-e657df975ab4.webp',
        '/images/holidays/photo-1508009603885-50cf7c579365.webp',
        '/images/holidays/photo-1537996194471-e657df975ab4.webp',
        '/images/holidays/photo-1508009603885-50cf7c579365.webp'
      ]
    },
    {
      id: 'pkg-tha-2',
      title: 'Phuket & Krabi Luxury Resorts Island Paradise Escape',
      duration: '6 days & 5 nights',
      rating: 4.8,
      reviews: 215,
      saveAmount: '30,000',
      originalPrice: '1,15,000',
      actualPrice: '85,000',
      itinerary: '3D Phuket Island • 3D Krabi Island Villa',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1537996194471-e657df975ab4.webp',
        '/images/holidays/photo-1508009603885-50cf7c579365.webp',
        '/images/holidays/photo-1537996194471-e657df975ab4.webp',
        '/images/holidays/photo-1508009603885-50cf7c579365.webp',
        '/images/holidays/photo-1537996194471-e657df975ab4.webp'
      ]
    }
  ],
  vietnam: [
    {
      id: 'pkg-vie-1',
      title: 'Vietnam Heritage Tour: Hanoi, Halong Bay & Hoi An',
      duration: '8 days & 7 nights',
      rating: 4.8,
      reviews: 145,
      saveAmount: '30,000',
      originalPrice: '1,20,000',
      actualPrice: '90,000',
      itinerary: '3D Hanoi • 1D Halong Bay Cruise • 4D Hoi An',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1528127269322-539801943592.webp',
        '/images/holidays/photo-1555939594-58d7cb561ad1.webp',
        '/images/holidays/photo-1528127269322-539801943592.webp',
        '/images/holidays/photo-1555939594-58d7cb561ad1.webp',
        '/images/holidays/photo-1528127269322-539801943592.webp'
      ]
    },
    {
      id: 'pkg-vie-2',
      title: 'Southern Vietnam Wonders: Ho Chi Minh City & Mekong Delta',
      duration: '5 days & 4 nights',
      rating: 4.7,
      reviews: 86,
      saveAmount: '22,000',
      originalPrice: '87,000',
      actualPrice: '65,000',
      itinerary: '3D Ho Chi Minh City • 2D Mekong Delta Cruise',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1555939594-58d7cb561ad1.webp',
        '/images/holidays/photo-1528127269322-539801943592.webp',
        '/images/holidays/photo-1555939594-58d7cb561ad1.webp',
        '/images/holidays/photo-1528127269322-539801943592.webp',
        '/images/holidays/photo-1555939594-58d7cb561ad1.webp'
      ]
    }
  ],
  norway: [
    {
      id: 'pkg-nor-1',
      title: 'Norway Fjords & Magical Northern Lights Tromso Expedition',
      duration: '9 days & 8 nights',
      rating: 4.9,
      reviews: 56,
      saveAmount: '85,000',
      originalPrice: '3,95,000',
      actualPrice: '3,10,000',
      itinerary: '3D Oslo • 3D Bergen Fjords • 3D Tromso Aurora',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1527004013197-933c4bb611b3.webp',
        '/images/holidays/photo-1517411032315-54ef2cb783bb.webp',
        '/images/holidays/photo-1502784444187-359ac186c5bb.webp',
        '/images/holidays/photo-1527004013197-933c4bb611b3.webp',
        '/images/holidays/photo-1517411032315-54ef2cb783bb.webp'
      ]
    },
    {
      id: 'pkg-nor-2',
      title: 'Arctic Circle Discovery & Scenic Lofoten Islands Getaway',
      duration: '7 days & 6 nights',
      rating: 4.8,
      reviews: 41,
      saveAmount: '60,000',
      originalPrice: '2,80,000',
      actualPrice: '2,20,000',
      itinerary: '4D Lofoten Islands • 3D Bodø Transits',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1502784444187-359ac186c5bb.webp',
        '/images/holidays/photo-1527004013197-933c4bb611b3.webp',
        '/images/holidays/photo-1517411032315-54ef2cb783bb.webp',
        '/images/holidays/photo-1502784444187-359ac186c5bb.webp',
        '/images/holidays/photo-1527004013197-933c4bb611b3.webp'
      ]
    }
  ],
  rajasthan: [
    {
      id: 'pkg-raj-1',
      title: 'Royal Rajasthan Heritage Tour: Jaipur, Jodhpur & Udaipur',
      duration: '8 days & 7 nights',
      rating: 4.8,
      reviews: 215,
      saveAmount: '20,000',
      originalPrice: '80,000',
      actualPrice: '60,000',
      itinerary: '3D Jaipur Forts • 2D Jodhpur City • 3D Udaipur Lakes',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1599661046289-e31897846e41.webp',
        '/images/holidays/photo-1504609773096-104ff2c73ba4.webp',
        '/images/holidays/photo-1599661046289-e31897846e41.webp',
        '/images/holidays/photo-1504609773096-104ff2c73ba4.webp',
        '/images/holidays/photo-1599661046289-e31897846e41.webp'
      ]
    },
    {
      id: 'pkg-raj-2',
      title: 'Desert Camping Experience in Golden City Jaisalmer',
      duration: '4 days & 3 nights',
      rating: 4.9,
      reviews: 312,
      saveAmount: '12,000',
      originalPrice: '48,000',
      actualPrice: '36,000',
      itinerary: '2D Jaisalmer Fort • 2D Sam Sand Dunes Camping',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1599661046289-e31897846e41.webp',
        '/images/holidays/photo-1504609773096-104ff2c73ba4.webp',
        '/images/holidays/photo-1599661046289-e31897846e41.webp',
        '/images/holidays/photo-1504609773096-104ff2c73ba4.webp',
        '/images/holidays/photo-1599661046289-e31897846e41.webp'
      ]
    }
  ],
  kerala: [
    {
      id: 'pkg-krl-1',
      title: 'Essence of Kerala: Munnar Tea Valleys, Thekkady Safari & Alleppey Houseboat',
      duration: '5 days & 4 nights',
      rating: 4.8,
      reviews: 412,
      saveAmount: '15,500',
      originalPrice: '48,000',
      actualPrice: '32,500',
      itinerary: '2N Munnar • 1N Thekkady • 1N Alleppey Houseboat',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/kerala.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/photo-1518495973542-4542c06a5843.webp',
        '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp',
        '/images/holidays/photo-1502086223501-7ea6ecd79368.webp'
      ]
    },
    {
      id: 'pkg-krl-2',
      title: 'Romantic Kerala: Wayanad Treehouse, Munnar Hills & Kovalam Beach',
      duration: '7 days & 6 nights',
      rating: 4.9,
      reviews: 285,
      saveAmount: '22,000',
      originalPrice: '68,000',
      actualPrice: '46,000',
      itinerary: '2N Wayanad • 2N Munnar • 1N Alleppey • 1N Kovalam',
      promoText: 'MONSOON SALE!',
      images: [
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/kerala.webp',
        '/images/holidays/photo-1476514525535-07fb3b4ae5f1.webp',
        '/images/holidays/photo-1518495973542-4542c06a5843.webp',
        '/images/holidays/photo-1502086223501-7ea6ecd79368.webp'
      ]
    }
  ],
  goa: [
    {
      id: 'pkg-goa-1',
      title: 'All-Inclusive 4N Goa Beach Holiday With Flight & North Goa Tour',
      duration: '5 days & 4 nights',
      rating: 4.8,
      reviews: 450,
      saveAmount: '12,500',
      originalPrice: '42,500',
      actualPrice: '30,000',
      itinerary: '2N Calangute Beach • 2N Candolim Beach',
      promoText: 'MONSOON SALE!',
      themes: ['all', 'beach', 'lastminute'],
      images: [
        '/images/holidays/goa.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/fortune-hotel.webp',
        '/images/holidays/photo-1512453979798-5ea266f8880c.webp'
      ]
    },
    {
      id: 'pkg-goa-2',
      title: 'Romantic Goa Honeymoon Special with Candlelight Dinner & Private Pool Villa',
      duration: '4 days & 3 nights',
      rating: 4.9,
      reviews: 320,
      saveAmount: '16,000',
      originalPrice: '52,000',
      actualPrice: '36,000',
      itinerary: '3N Private Pool Villa South Goa • Sunset Cruise',
      promoText: 'HONEYMOON SPECIAL',
      themes: ['all', 'honeymoon', 'beach'],
      images: [
        '/images/holidays/photo-1512453979798-5ea266f8880c.webp',
        '/images/holidays/goa.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/fortune-hotel.webp'
      ]
    },
    {
      id: 'pkg-goa-3',
      title: 'Goa Super Saver Last Minute Escape | Calangute & Baga Beach Resort',
      duration: '4 days & 3 nights',
      rating: 4.7,
      reviews: 280,
      saveAmount: '10,000',
      originalPrice: '32,000',
      actualPrice: '22,000',
      itinerary: '3N Baga Beach Resort • Airport Transfers Included',
      promoText: 'LAST MINUTE DEAL',
      themes: ['all', 'beach', 'lastminute'],
      images: [
        '/images/holidays/fortune-hotel.webp',
        '/images/holidays/goa.webp',
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp'
      ]
    },
    {
      id: 'pkg-goa-4',
      title: 'Luxury 5-Star Beachfront Resort Stay in South Goa | All Meals Included',
      duration: '6 days & 5 nights',
      rating: 4.9,
      reviews: 195,
      saveAmount: '25,000',
      originalPrice: '85,000',
      actualPrice: '60,000',
      itinerary: '5N Beachfront Luxury Resort • Spa & Private Beach Access',
      promoText: 'SPECIAL SAVER',
      themes: ['all', 'honeymoon', 'beach', 'lastminute'],
      images: [
        '/images/holidays/photo-1507525428034-b723cf961d3e.webp',
        '/images/holidays/goa.webp',
        '/images/holidays/photo-1512453979798-5ea266f8880c.webp'
      ]
    }
  ]
};

// Curation for the "Explore" tab (trending packages across all categories)
PACKAGES_DATA.explore = [
  PACKAGES_DATA.goa[0],
  PACKAGES_DATA.europe[0],
  PACKAGES_DATA.japan[0],
  PACKAGES_DATA.kerala[0],
  PACKAGES_DATA.maldives[0],
  PACKAGES_DATA.dubai[0],
  PACKAGES_DATA.thailand[0],
  PACKAGES_DATA.vietnam[0],
  PACKAGES_DATA.norway[0],
  PACKAGES_DATA.rajasthan[0]
];

// Destination list with Font Awesome icons
export const DESTINATIONS = [
  { id: 'explore', name: 'Explore', iconClass: 'fa-solid fa-fire', trending: false },
  { id: 'goa', name: 'Goa', iconClass: 'fa-solid fa-umbrella-beach', trending: true },
  { id: 'kerala', name: 'Kerala', iconClass: 'fa-solid fa-tree', trending: true },
  { id: 'europe', name: 'Europe', iconClass: 'fa-solid fa-landmark', trending: false },
  { id: 'japan', name: 'Japan', iconClass: 'fa-solid fa-torii-gate', trending: true },
  { id: 'singapore', name: 'Singapore', iconClass: 'fa-solid fa-archway', trending: false },
  { id: 'maldives', name: 'Maldives', iconClass: 'fa-solid fa-umbrella-beach', trending: true },
  { id: 'northeastindia', name: 'North East India', iconClass: 'fa-solid fa-mountain-sun', trending: false },
  { id: 'dubai', name: 'Dubai', iconClass: 'fa-solid fa-city', trending: true },
  { id: 'thailand', name: 'Thailand', iconClass: 'fa-solid fa-gopuram', trending: false },
  { id: 'vietnam', name: 'Vietnam', iconClass: 'fa-solid fa-ship', trending: false },
  { id: 'norway', name: 'Norway', iconClass: 'fa-solid fa-snowflake', trending: false },
  { id: 'rajasthan', name: 'Rajasthan', iconClass: 'fa-solid fa-fort-awesome', trending: false }
];
