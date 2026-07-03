import { Tire, Installer, Rebate, Article } from './types';

export const TIRES: Tire[] = [
  {
    id: 'velocita-sport-as',
    brand: 'Velocita',
    brandLogo: '⚡',
    name: 'Velocita Sport A/S 4',
    type: 'Performance',
    image1: '/src/assets/images/tire_hero_banner_1782936542062.jpg',
    image2: '/src/assets/images/tire_hero_banner_1782936542062.jpg',
    rating: 4.8,
    reviewsCount: 1420,
    price: 189,
    installPrice: 20,
    promoBadge: 'Best Seller',
    isBestSeller: true,
    sizes: ['245/40R19', '225/45R18', '255/35R19', '205/55R16', '235/40R18'],
    specs: {
      utqg: '540 AA A',
      warranty: '50,000 Miles',
      loadIndex: '98Y',
      speedRating: 'Y',
      season: 'All-Season',
      sidewall: 'Black Sidewall',
      runFlat: false
    },
    description: 'The Velocita Sport A/S 4 is our flagship ultra-high performance tire, designed to deliver exceptional dry and wet grip while maintaining standard-setting all-season performance. Engineered with advanced compound technology to handle extreme lateral force while resisting tread wear.',
    features: [
      'Advanced silica compound for exceptional wet and snowy grip',
      'Asymmetric tread pattern with optimized outer shoulder block stiffness',
      'Deep circumferential grooves channels water out fast to prevent hydroplaning',
      'Dynamic Response Technology distributes forces evenly for a longer tread life'
    ]
  },
  {
    id: 'ridgerider-xt',
    brand: 'TerraCore',
    brandLogo: '⛰️',
    name: 'RidgeRider X/T Heavy Duty',
    type: 'All-Terrain',
    image1: '/src/assets/images/tire_rugged_allterrain_1782936558500.jpg',
    image2: '/src/assets/images/tire_rugged_allterrain_1782936558500.jpg',
    rating: 4.7,
    reviewsCount: 840,
    price: 249,
    installPrice: 25,
    promoBadge: 'Rugged Off-Road',
    isOnSale: true,
    savingsAmount: 40,
    sizes: ['LT265/70R17', 'LT285/70R17', 'LT275/65R18', '33X12.50R20', 'LT265/65R18'],
    specs: {
      utqg: '640 A B',
      warranty: '60,000 Miles',
      loadIndex: '121S',
      speedRating: 'S',
      season: 'All-Terrain',
      sidewall: 'Outlined White Letters',
      runFlat: false
    },
    description: 'The RidgeRider X/T is built to dominate trails, mud, gravel, and snow without sacrificing your highway manners. Features an aggressive interlocking tread design, puncture-resistant sidewalls, and stone ejectors to protect against casing damage.',
    features: [
      '3-ply CoreShield polyester construction resists sidewall punctures',
      'Staggered shoulder blocks provide extreme traction in deep mud or snow',
      'Tread block ejectors actively reject rocks and sand from the grooves',
      'Severe Snow Rated (Three-Peak Mountain Snowflake certified)'
    ]
  },
  {
    id: 'blizzardgrip-extreme',
    brand: 'NorseGrip',
    brandLogo: '❄️',
    name: 'BlizzardGrip Extreme Studless',
    type: 'Winter',
    image1: '/src/assets/images/tire_winter_snow_1782936574990.jpg',
    image2: '/src/assets/images/tire_winter_snow_1782936574990.jpg',
    rating: 4.9,
    reviewsCount: 310,
    price: 165,
    installPrice: 22,
    promoBadge: 'Winter Sale',
    isOnSale: true,
    savingsAmount: 20,
    sizes: ['215/55R17', '225/50R17', '205/60R16', '235/55R18', '195/65R15'],
    specs: {
      utqg: 'N/A (Winter)',
      warranty: 'Special Winter Warranty',
      loadIndex: '94H',
      speedRating: 'H',
      season: 'Winter / Ice',
      sidewall: 'Black Sidewall',
      runFlat: false
    },
    description: 'Unmatched control on freezing roadways. The BlizzardGrip Extreme uses a cryogenic nano-tech compound that stays flexible even in sub-zero temperatures. High-density sipes lock together under pressure for secure stopping power on sheet ice and packed snow.',
    features: [
      'Multi-cell winter compound draws moisture away from ice for better friction',
      '3D zig-zag sipes prevent block flexing to offer highly responsive braking',
      'V-shaped directional tread evacuates snow-slush and water effortlessly',
      'Approved for severe snow service with official 3PMSF certification'
    ]
  },
  {
    id: 'ecoglide-tour',
    brand: 'EcoMax',
    brandLogo: '🌱',
    name: 'EcoGlide Premium Tour',
    type: 'Touring',
    image1: '/src/assets/images/tire_hero_banner_1782936542062.jpg',
    image2: '/src/assets/images/tire_hero_banner_1782936542062.jpg',
    rating: 4.6,
    reviewsCount: 950,
    price: 135,
    installPrice: 18,
    promoBadge: 'Eco-Friendly',
    sizes: ['195/65R15', '205/55R16', '215/60R16', '225/65R17', '235/60R18'],
    specs: {
      utqg: '740 A A',
      warranty: '80,000 Miles',
      loadIndex: '91H',
      speedRating: 'H',
      season: 'All-Season',
      sidewall: 'Black Sidewall',
      runFlat: false
    },
    description: 'Designed for fuel savings and serene highway cruising. The EcoGlide Tour features a low rolling resistance compound that boosts MPG while extending the tire life to a massive 80,000 miles. Sound-absorbing inner linings ensure a near-silent ride.',
    features: [
      'Fuel-saving tread compound reduces drag for enhanced range/MPG',
      'WhisperGroove noise barriers cancel air resonance inside the tread',
      'Optimized tread pattern with 5 rib design ensures ultra-even wear',
      'Full-depth sipes remain active throughout the lifetime of the tire'
    ]
  },
  {
    id: 'pistacorsa-p1',
    brand: 'Velocita',
    brandLogo: '⚡',
    name: 'Pista Corsa P-1 Cup',
    type: 'Summer',
    image1: '/src/assets/images/tire_hero_banner_1782936542062.jpg',
    image2: '/src/assets/images/tire_hero_banner_1782936542062.jpg',
    rating: 4.9,
    reviewsCount: 180,
    price: 295,
    installPrice: 25,
    promoBadge: 'Track Ready',
    sizes: ['245/35R20', '305/30R20', '265/35R19', '295/30R19', '245/40R19'],
    specs: {
      utqg: '200 AA A',
      warranty: 'Track Wear Exclusions Apply',
      loadIndex: '101Y',
      speedRating: 'Y',
      season: 'Summer / Track',
      sidewall: 'Black Sidewall',
      runFlat: false
    },
    description: 'A street-legal track day tire that redefines cornering limits. Developed with professional racing compounds, the Pista Corsa P-1 provides extreme lateral grip, precise turn-in, and reliable braking performance under high thermal loads.',
    features: [
      'High-grip motorsport-grade compound for ultimate warm-temperature adhesive force',
      'Semi-slick outer tread ribs maximize contact area with the asphalt',
      'High-stiffness aramid reinforcement belt reduces deformation at high speeds',
      'Designed for extreme performance on sports cars and exotic track day vehicles'
    ]
  },
  {
    id: 'cargomax-hd',
    brand: 'HeavyDuty',
    brandLogo: '🚚',
    name: 'CargoMax HD commercial',
    type: 'Commercial',
    image1: '/src/assets/images/tire_rugged_allterrain_1782936558500.jpg',
    image2: '/src/assets/images/tire_rugged_allterrain_1782936558500.jpg',
    rating: 4.5,
    reviewsCount: 220,
    price: 179,
    installPrice: 22,
    promoBadge: 'Fleet Special',
    sizes: ['LT245/75R16', 'LT225/75R16', 'LT235/85R16', '235/65R16C', 'LT245/70R17'],
    specs: {
      utqg: 'N/A (Commercial Class)',
      warranty: '50,000 Commercial Miles',
      loadIndex: '115R',
      speedRating: 'R',
      season: 'All-Season Heavy Duty',
      sidewall: 'Reinforced Steel Ply',
      runFlat: false
    },
    description: 'The ultimate partner for commercial vans, delivery fleets, and heavy work trucks. Engineered to handle continuous heavy loads, stop-and-go urban curb impacts, and deliver outstanding wet traction for year-round reliability.',
    features: [
      'Dual steel belts reinforced with spirally wound nylon cords',
      'Robust curb guards protect sidewalls against scraping and scuffing',
      'Deep, blocky tread blocks ensure reliable handling on utility sites',
      'Cool-running carcass compound lowers operating costs per mile'
    ]
  },
  {
    id: 'enduratour-comfort',
    brand: 'EcoMax',
    brandLogo: '🌱',
    name: 'EnduraTour Comfort Plus',
    type: 'Touring',
    image1: '/src/assets/images/tire_hero_banner_1782936542062.jpg',
    image2: '/src/assets/images/tire_hero_banner_1782936542062.jpg',
    rating: 4.7,
    reviewsCount: 520,
    price: 145,
    installPrice: 18,
    isBestSeller: true,
    promoBadge: '80k Warranty',
    sizes: ['205/55R16', '215/60R16', '215/55R17', '225/55R17', '225/60R17'],
    specs: {
      utqg: '800 A A',
      warranty: '85,000 Miles',
      loadIndex: '95T',
      speedRating: 'T',
      season: 'All-Season Comfort',
      sidewall: 'Black Sidewall',
      runFlat: false
    },
    description: 'An elite touring option engineered for daily drivers searching for unmatched highway comfort and extensive tread life. The EnduraTour blends high silica content with specialized shock-absorbing internal cushions to smooth over potholes.',
    features: [
      'Premium shock-absorbing compounding cushions structural impacts',
      'Massive 85,000 Mile manufacturer treadwear coverage',
      'Four deep water evac channels keep hydroplaning risks near zero',
      'Highly reinforced bead wire prevents tire slip on the rim'
    ]
  }
];

export const INSTALLERS: Installer[] = [
  {
    id: 'inst-1',
    name: 'Apex Auto & Tire Center',
    address: '1420 Olympic Blvd, Los Angeles, CA 90021',
    distance: 1.8,
    rating: 4.9,
    reviewsCount: 342,
    pricePerTire: 20.00,
    nextAvailable: 'Tomorrow, 9:00 AM',
    coordinates: { lat: 34.025, lng: -118.235 },
    amenities: ['Free WiFi', 'Coffee Bar', 'Air Conditioned Waiting Area', 'Shuttle Service', 'EV Charging']
  },
  {
    id: 'inst-2',
    name: 'Elite Wheel & Fitment Labs',
    address: '8840 Santa Monica Blvd, West Hollywood, CA 90069',
    distance: 4.5,
    rating: 4.8,
    reviewsCount: 189,
    pricePerTire: 25.00,
    nextAvailable: 'Tomorrow, 2:30 PM',
    coordinates: { lat: 34.084, lng: -118.384 },
    amenities: ['Free WiFi', 'Premium Espresso', 'HDTVs', 'Wheel Alignment Rigs']
  },
  {
    id: 'inst-3',
    name: 'National Tire Discount Station',
    address: '2235 S Figueroa St, Los Angeles, CA 90007',
    distance: 2.1,
    rating: 4.5,
    reviewsCount: 1102,
    pricePerTire: 18.00,
    nextAvailable: 'Today, 4:00 PM',
    coordinates: { lat: 34.029, lng: -118.272 },
    amenities: ['Waiting Lounge', 'Beverage Machine', 'Walk-ins Welcomed']
  },
  {
    id: 'inst-4',
    name: 'Precision Alignment & Brake Clinic',
    address: '5640 Sunset Blvd, Hollywood, CA 90028',
    distance: 5.2,
    rating: 4.7,
    reviewsCount: 212,
    pricePerTire: 22.50,
    nextAvailable: 'July 3, 10:30 AM',
    coordinates: { lat: 34.098, lng: -118.312 },
    amenities: ['Free WiFi', 'Local Cafes Nearby', 'Loaner Cars Available']
  }
];

export const REBATES: Rebate[] = [
  {
    id: 'rebate-1',
    brand: 'Velocita',
    brandLogo: '⚡',
    title: 'Get up to $100 back on Velocita Tires',
    amount: 100,
    expires: 'Aug 31, 2026',
    description: 'Purchase a set of 4 qualifying Velocita ultra-high performance tires (including Velocita Sport A/S 4 and Pista Corsa) and receive a $100 prepaid MasterCard via mail-in or online submission.'
  },
  {
    id: 'rebate-2',
    brand: 'TerraCore',
    brandLogo: '⛰️',
    title: '$80 Instant Savings on RidgeRider Series',
    amount: 80,
    expires: 'Jul 31, 2026',
    description: 'Get an automatic $80 discount applied directly in your cart when you buy 4 TerraCore RidgeRider All-Terrain tires. No mail-in required, applied instantly at checkout.'
  },
  {
    id: 'rebate-3',
    brand: 'NorseGrip',
    brandLogo: '❄️',
    title: '$70 Rebate on Winter BlizzardGrip',
    amount: 70,
    expires: 'Sep 15, 2026',
    description: 'Prepare early for winter. Buy any set of 4 BlizzardGrip tires and claim a $70 digital reward card. Perfect for beating the autumn rush.'
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'guide-sizing',
    title: 'How to Read Your Tire Sidewall: The Ultimate Guide',
    excerpt: 'Confused by "245/40R19 98Y"? Learn what width, aspect ratio, construction, diameter, and speed ratings actually mean for your vehicle’s performance.',
    category: 'Tire Education',
    readTime: '4 min read',
    date: 'Jun 24, 2026',
    image: '/src/assets/images/tire_hero_banner_1782936542062.jpg'
  },
  {
    id: 'guide-winter',
    title: 'Winter Tires vs. All-Season Tires: When to Make the Switch',
    excerpt: 'Is all-season rubber enough for snowy commutes? Find out why temperatures below 45°F change the grip physics, and when dedicated tread is vital.',
    category: 'Safety & Seasons',
    readTime: '6 min read',
    date: 'May 12, 2026',
    image: '/src/assets/images/tire_winter_snow_1782936574990.jpg'
  },
  {
    id: 'guide-maintenance',
    title: '5 Tire Maintenance Habits That Save Thousands',
    excerpt: 'Unlock the maximum life of your tires. From rotation schedules to hyper-accurate PSI adjustments, simple weekly steps prevent uneven wear.',
    category: 'Car Maintenance',
    readTime: '5 min read',
    date: 'Apr 05, 2026',
    image: '/src/assets/images/installer_service_bay_1782936595149.jpg'
  }
];

// Car database for Garage and Visual selectors
export const CAR_DATABASE = {
  years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'],
  makes: {
    '2024': ['Tesla', 'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet'],
    '2025': ['Tesla', 'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet'],
    '2026': ['Tesla', 'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet'],
    '2023': ['Tesla', 'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet'],
    '2022': ['Tesla', 'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet'],
    '2021': ['Tesla', 'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet'],
    '2020': ['Tesla', 'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet'],
    '2019': ['Tesla', 'Toyota', 'Honda', 'Ford', 'BMW', 'Chevrolet']
  } as Record<string, string[]>,
  models: {
    'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
    'Toyota': ['Camry', 'RAV4', 'Tacoma', 'Prius', 'Highlander'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'],
    'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape'],
    'BMW': ['3 Series', '5 Series', 'X5', 'M3'],
    'Chevrolet': ['Silverado', 'Equinox', 'Corvette', 'Bolt EV']
  } as Record<string, string[]>,
  trims: {
    'Model 3': [
      { trim: 'Long Range (18" wheels)', size: '235/45R18' },
      { trim: 'Performance (19" wheels)', size: '245/40R19' }
    ],
    'Model Y': [
      { trim: 'Long Range (19" wheels)', size: '255/45R19' },
      { trim: 'Performance (21" wheels)', size: '255/35R21' }
    ],
    'Model S': [
      { trim: 'Plaid (21" wheels)', size: '265/35R21' },
      { trim: 'Standard (19" wheels)', size: '245/45R19' }
    ],
    'Model X': [
      { trim: 'Long Range (20" wheels)', size: '265/45R20' }
    ],
    'Camry': [
      { trim: 'LE/SE (16" wheels)', size: '205/65R16' },
      { trim: 'XSE (19" wheels)', size: '235/40R19' }
    ],
    'RAV4': [
      { trim: 'XLE (17" wheels)', size: '225/65R17' },
      { trim: 'Limited (19" wheels)', size: '235/55R19' }
    ],
    'Tacoma': [
      { trim: 'TRD Off-Road (16" wheels)', size: 'LT265/70R16' },
      { trim: 'TRD Pro (17" wheels)', size: 'LT265/70R17' }
    ],
    'Civic': [
      { trim: 'LX/EX (16" wheels)', size: '215/55R16' },
      { trim: 'Sport/Touring (18" wheels)', size: '235/40R18' }
    ],
    'Accord': [
      { trim: 'EX/Sport (19" wheels)', size: '235/40R19' }
    ],
    'F-150': [
      { trim: 'Lariat (18" wheels)', size: 'LT275/65R18' },
      { trim: 'Platinum (20" wheels)', size: '275/55R20' }
    ],
    'Mustang': [
      { trim: 'GT (19" wheels)', size: '255/40R19' },
      { trim: 'EcoBoost (18" wheels)', size: '235/50R18' }
    ],
    '3 Series': [
      { trim: '330i M Sport (19" wheels)', size: '225/40R19' },
      { trim: '330i Standard (18" wheels)', size: '225/45R18' }
    ]
  } as Record<string, { trim: string; size: string }[]>
};
