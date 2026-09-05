import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'ZM-BAR-01',
    name: 'Minimalist RGB Magnetic Desk Light Bar',
    subtitle: 'Stepless dimming, touch switch, anti-glare asymmetrical optical design',
    tagline: 'Asymmetric Optical Design • Zero Screen Glare',
    category: 'ambient-lighting',
    categoryLabel: 'Ambient Lighting',
    brandSeries: 'ZENMART LIGHTING SERIES',
    price: 2450,
    originalPrice: 3200,
    discountPercent: 23,
    badge: 'BEST SELLER -23%',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    stockCount: 28,
    inStock: true,
    featured: true,
    rating: 4.9,
    reviewCount: 142,
    specs: {
      'Mount Type': 'Weighted Magnetic Clamp',
      'Color Temperature': '2700K - 6500K Dual Mode',
      'Power Source': 'USB Type-C (5V/2A)',
      'Material': 'Anodized Aviation Aluminum',
      'CRI': 'Ra ≥ 95 Color Rendering'
    },
    features: [
      'Asymmetric forward-projection optical design with zero screen reflection',
      'Stepless touch brightness and temperature adjustment (warm to cool white)',
      'RGB ambient backlight on the rear side for gaming and late night mood',
      'Universal clamp fits ultra-thin, curved, or thick monitors effortlessly'
    ],
    description: 'Elevate your workspace comfort with the Zenmart Magnetic Screen Bar. Specifically engineered to illuminate your keyboard and desk area without directing any glare onto your monitor screen. Reduces eye strain during extended work and night sessions.'
  },
  {
    id: 'prod-2',
    sku: 'ZM-VASE-02',
    name: 'Aesthetic Nordic Ceramic Donut Vase',
    subtitle: 'Matte stoneware ceramic finish with hollow circular center',
    tagline: 'Handcrafted Minimalist Sculptural Centerpiece',
    category: 'home-decor',
    categoryLabel: 'Home Decor',
    brandSeries: 'NORDIC MINIMALIST',
    price: 1350,
    originalPrice: 1650,
    discountPercent: 18,
    badge: 'AESTHETIC DECOR -18%',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    stockCount: 15,
    inStock: true,
    rating: 4.8,
    reviewCount: 89,
    specs: {
      'Material': 'High-fired Bisque Stoneware',
      'Finish': 'Matte Sandy Texture',
      'Dimensions': '20cm x 19cm x 5.5cm',
      'Care': 'Wipe clean with soft damp cloth',
      'Origin': 'Artisan Hand-Cast'
    },
    features: [
      'Iconic hollow geometric circle silhouette fitting contemporary Danish styling',
      'Frosted unglazed surface texture giving an authentic earthy clay sensation',
      'Ideal for dried pampas grass, eucalyptus stems, or standing as a standalone modern art piece',
      'Non-scratch padded bottom protective felt pads'
    ],
    description: 'Transform your coffee table, bookshelf, or workspace with this iconic Nordic ceramic donut vase. The frosted matte stoneware texture exudes quiet luxury, bringing soothing organic warmth into contemporary interiors.'
  },
  {
    id: 'prod-3',
    sku: 'ZM-CHG-03',
    name: 'Wireless MagSafe 3-in-1 Fast Charging Station',
    subtitle: 'Simultaneous Qi2 charging for Phone, Apple Watch, and AirPods',
    tagline: 'Declutter your nightstand with clean magnetic power',
    category: 'gadgets',
    categoryLabel: 'Gadgets',
    brandSeries: 'MAGSAFE COMPATIBLE',
    price: 3800,
    originalPrice: 4500,
    discountPercent: 15,
    badge: 'FAST CHARGE 15W -15%',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80',
    stockCount: 22,
    inStock: true,
    rating: 4.9,
    reviewCount: 116,
    specs: {
      'Phone Output': 'Up to 15W Fast Magnetic Snap',
      'Watch Output': '5W Dedicated Magnetic Puck',
      'AirPods Output': '5W Inductive Base Tray',
      'Input': 'Type-C 30W PD Required',
      'Safety': 'FOD, OVP, & Temperature Guard IC'
    },
    features: [
      'Strong N52 neodymium magnetic lock for portrait or landscape standby viewing',
      'Weighted metal base with non-slip silicone feet keeps the stand anchored firmly',
      'Subtle breathing LED status indicator that shuts off automatically in sleep mode',
      'Includes premium braided 1.2m Type-C to Type-C cable in the box'
    ],
    description: 'One charging hub to rule your entire Apple ecosystem. Charge your iPhone, Apple Watch, and AirPods simultaneously without chaotic tangles of cables. Supports iOS StandBy mode on your bedside or desk.'
  },
  {
    id: 'prod-4',
    sku: 'ZM-SUN-04',
    name: 'Sunset Projection Ambient Lamp',
    subtitle: 'Rotatable optical crystal lens with 16 color modes & remote',
    tagline: 'Golden Hour Atmosphere Any Time of the Day',
    category: 'ambient-lighting',
    categoryLabel: 'Lighting',
    brandSeries: 'MOOD AURA SERIES',
    price: 1200,
    originalPrice: 1700,
    discountPercent: 29,
    badge: '-29%',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80',
    stockCount: 34,
    inStock: true,
    rating: 4.7,
    reviewCount: 94,
    specs: {
      'Lens': 'HD Thickened Optical Glass Lens',
      'Rotation': '180° Pitch & 360° Horizontal Base',
      'Controls': 'IR Wireless Remote + Inline Switch',
      'Power': '5V 2A USB Plug',
      'Color Spectrum': 'Sunset Red, Rainbow, Warm Sun, Halo Amber'
    },
    features: [
      'Creates mesmerizing circular halo lighting for photography and video backgrounds',
      'High-refraction thickened glass lens for sharp, vivid color boundary definition',
      'Solid aluminum alloy head for efficient heat dissipation and prolonged LED life',
      'USB powered — plug directly into laptop, powerbank, or wall adapter'
    ],
    description: 'Bring the golden warmth of magic hour into your living room or study. The Zenmart Sunset Projector casts a soothing radiant halo onto walls and ceilings, crafting an instant aesthetic ambiance for content creators and cozy evenings.'
  },
  {
    id: 'prod-5',
    sku: 'ZM-KEY-05',
    name: 'Mechanical Bluetooth Compact 75% Keyboard',
    subtitle: 'Factory lubed yellow switches, multi-device wireless pairing',
    tagline: 'Acoustic Gasket-Mounted Creamy Typing Experience',
    category: 'gadgets',
    categoryLabel: 'Gadgets',
    brandSeries: 'PRO WORKSPACE',
    price: 4200,
    originalPrice: 4800,
    discountPercent: 12,
    badge: 'HOT-SWAP -12%',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    stockCount: 12,
    inStock: true,
    rating: 4.9,
    reviewCount: 167,
    specs: {
      'Switches': 'Linear Pre-lubed Yellow Switches (3-pin / 5-pin)',
      'Connectivity': 'Bluetooth 5.2 + 2.4G Wireless + Type-C Wired',
      'Keycaps': 'Thick PBT Dye-Sub OEM Profile',
      'Battery': '4000mAh Rechargeable Li-ion (Up to 200 hours)',
      'Structure': 'Multi-layer Sound Dampening EVA Foam'
    },
    features: [
      'Gasket mounting dampens resonance to deliver an ultra-clean "thocky" sound',
      'Universal hot-swappable PCB lets you swap out switches without soldering',
      'Seamless multi-pairing between Mac, Windows, iPad, and Android with 1-key toggle',
      'Customizable south-facing per-key RGB backlighting with dynamic patterns'
    ],
    description: 'Designed for tactile perfection and productivity. The Pro Workspace 75% keyboard features factory-lubricated switches and sound-dampening acoustic foams for an impeccably smooth, deep acoustic keystroke.'
  },
  {
    id: 'prod-6',
    sku: 'ZM-DIF-06',
    name: 'Aroma Essential Oil Flame Diffuser',
    subtitle: 'Simulated realistic flame light effect with ultrasonic aromatherapy',
    tagline: 'Ultrasonic Soothing Mist & Warm Amber Firelight',
    category: 'home-decor',
    categoryLabel: 'Home Decor',
    brandSeries: 'ZEN LIVING',
    price: 1850,
    originalPrice: 2300,
    discountPercent: 20,
    badge: 'AROMA WELLNESS -20%',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    stockCount: 18,
    inStock: true,
    rating: 4.8,
    reviewCount: 82,
    specs: {
      'Water Tank': '180ml Ultra-fine Atomization',
      'Mist Output': '20-30ml/h Continuous or Intermittent',
      'Noise Level': 'Below 24dB Whisper Quiet',
      'Safety': 'Auto Shut-off When Water Runs Dry',
      'Light Modes': 'Amber Flame, Indigo Blue, Soft Glow'
    },
    features: [
      'Clever combination of smart LED lights and cold ultrasonic vapor simulates a gentle fireplace flame',
      'Add 2-3 drops of essential lavender or eucalyptus oil to relieve fatigue and refresh indoor air',
      'Intelligent water sensor immediately triggers auto power-off when water level is depleted',
      'Whisper-quiet ultrasonic frequency (<24dB) ensures zero disturbance during deep sleep'
    ],
    description: 'Enjoy the calming illusion of a dancing fireplace flame combined with your favorite aromatherapy scents. The Zen Living Flame Diffuser moisturizes dry indoor air while creating an inviting, tranquil sanctuary in your bedroom or home office.'
  },
  {
    id: 'prod-7',
    sku: 'ZM-STD-07',
    name: 'Ergonomic Aluminium Laptop Stand',
    subtitle: 'Dual axis height adjustment with heavy load capacity & ventilation',
    tagline: 'End neck fatigue with rock-solid desk elevation',
    category: 'desk-setup',
    categoryLabel: 'Desk Setup',
    brandSeries: 'ERGONOMICS',
    price: 1950,
    originalPrice: 2300,
    discountPercent: 15,
    badge: '-15%',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    stockCount: 25,
    inStock: true,
    rating: 4.8,
    reviewCount: 104,
    specs: {
      'Material': 'Aviation Grade CNC Aluminum Alloy',
      'Compatibility': '10" to 17.3" Laptops & MacBooks',
      'Max Load': 'Up to 10kg Firm Load Support',
      'Adjustability': 'Dual 180° Angle Stepless Dampers',
      'Weight': '780g Foldable Structure'
    },
    features: [
      'Dual-pivot design allows you to adjust both height and viewing tilt precisely to eye level',
      'Large hollow heat-dissipation cutout prevents your laptop from thermal throttling under load',
      'Generous anti-skid rubber pads on both top and bottom ensure zero scratching and zero wobble',
      'Folds flat in seconds for easy transport in backpack or briefcase'
    ],
    description: 'Precision-machined from thick aerospace aluminum, this ergonomic riser elevates your MacBook or notebook up to eye level, relieving posture strain on your cervical spine while keeping your workspace organized.'
  },
  {
    id: 'prod-8',
    sku: 'ZM-MOON-08',
    name: 'Floating Magnetic Levitation Moon Lamp',
    subtitle: 'Silent levitation & continuous spinning 3D textured moonlight',
    tagline: 'Defy Gravity with 3D Printed Lunar Splendor',
    category: 'ambient-lighting',
    categoryLabel: 'Lighting',
    brandSeries: 'ASTRONOMY DECOR',
    price: 4900,
    originalPrice: 6200,
    discountPercent: 21,
    badge: 'PREMIUM GIFT -21%',
    image: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=800&q=80',
    stockCount: 14,
    inStock: true,
    rating: 5.0,
    reviewCount: 77,
    specs: {
      'Levitation Distance': '12mm - 15mm Above Base',
      'Base Material': 'Dark Walnut Wood Finish',
      'Moon Shell': 'Eco-PLA High-Resolution NASA 3D Scan',
      'Light Tones': 'Warm Yellow, Cool White, Natural Lunar',
      'Control': 'Invisible Base Touch Sensor'
    },
    features: [
      'Suspended in mid-air using patented electromagnetic levitation technology',
      'Rotates quietly 360° continuously without any mechanical friction or cords attached to the sphere',
      'Wireless power transfer illuminates the moon globe through inductive electromagnetic fields',
      'NASA topographic scan replica showcases accurate craters, mountain ridges, and lunar seas'
    ],
    description: 'A breathtaking conversation piece for discerning interiors. Using advanced magnetic levitation, the 3D-scanned moon sphere floats and glides silently in the air above an authentic dark walnut wooden plinth.'
  },
  // Additional items matching categories to reach total 16 items
  {
    id: 'prod-9',
    sku: 'ZM-PAD-09',
    name: 'Felt & Vegan Leather Dual Desk Mat (90x40cm)',
    subtitle: 'Spill-resistant PU leather flip side with natural Merino wool felt',
    tagline: 'Spacious & Tactile Workspace Anchor',
    category: 'desk-setup',
    categoryLabel: 'Desk Setup',
    brandSeries: 'PRO WORKSPACE',
    price: 950,
    originalPrice: 1200,
    discountPercent: 21,
    badge: 'NEW ARRIVAL',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    stockCount: 30,
    inStock: true,
    rating: 4.8,
    reviewCount: 65,
    specs: {
      'Size': '900mm x 400mm x 3mm',
      'Sides': 'Side A: Textured PU Leather / Side B: Merino Blend Felt',
      'Waterproof': 'Hydrophobic Oil & Water Repellent Coating'
    },
    features: [
      'Dual-sided reversible design to change desk aesthetics on demand',
      'Smooth optical tracking for high-DPI gaming and productivity mice',
      'Comfortable cushioned wrist rest barrier against cold desk edges'
    ],
    description: 'Protect your tabletop and define your workspace boundary with this generous 90x40cm dual-sided desk mat.'
  },
  {
    id: 'prod-10',
    sku: 'ZM-HUB-10',
    name: '8-in-1 Aluminum USB-C Hub with 4K HDMI & 100W PD',
    subtitle: 'High speed dual USB 3.0, SD/TF card reader, Gigabit LAN',
    tagline: 'Universal Expansion for M1/M2/M3 Mac & Windows',
    category: 'gadgets',
    categoryLabel: 'Gadgets',
    brandSeries: 'PRO WORKSPACE',
    price: 2600,
    originalPrice: 3100,
    discountPercent: 16,
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    stockCount: 19,
    inStock: true,
    rating: 4.9,
    reviewCount: 91,
    specs: {
      'Ports': '4K@60Hz HDMI, 100W PD Type-C, 2x USB-A 3.0, SD, MicroSD, RJ45 1Gbps',
      'Body': 'Space Grey CNC Alloy'
    },
    features: [
      'Crystal clear 4K@60Hz video streaming to external displays',
      '100W Power Delivery pass-through for charging under maximum load',
      'Smart temperature regulation prevents heat throttling'
    ],
    description: 'Transform a single USB-C port into a full workstation hub with verified 4K display output and instant gigabit connectivity.'
  },
  {
    id: 'prod-11',
    sku: 'ZM-CLOCK-11',
    name: 'Minimalist Wooden LED Digital Sound-Control Clock',
    subtitle: 'Temperature, humidity, acoustic wake-up sensor and dual alarms',
    tagline: 'Modern Scandinavian Block Aesthetic',
    category: 'home-decor',
    categoryLabel: 'Home Decor',
    brandSeries: 'NORDIC MINIMALIST',
    price: 1150,
    originalPrice: 1450,
    discountPercent: 20,
    badge: 'ESSENTIAL',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    stockCount: 20,
    inStock: true,
    rating: 4.7,
    reviewCount: 53,
    specs: {
      'Display': 'Clean White LED Invisible Through Woodgrain',
      'Power': 'Dual USB / AAA Battery Backup'
    },
    features: [
      'Acoustic sound sensor: clap hands or tap table to illuminate display',
      'Real-time indoor temperature (°C/°F) and relative humidity readings',
      'Auto-dimming feature for comfortable sleep lighting'
    ],
    description: 'A handsome timber block that reveals a crisp digital clock through natural wood veneer upon gentle touch or sound.'
  },
  {
    id: 'prod-12',
    sku: 'ZM-AUDIO-12',
    name: 'Nordic Fabric Portable HiFi Bluetooth Speaker',
    subtitle: 'Rich 360° bass, acoustic woven linen cover, 12h playtime',
    tagline: 'Acoustic Warmth & Tactile Elegance',
    category: 'gadgets',
    categoryLabel: 'Gadgets',
    brandSeries: 'ZENMART AUDIO',
    price: 2950,
    originalPrice: 3600,
    discountPercent: 18,
    badge: 'HIFI AUDIO',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    stockCount: 16,
    inStock: true,
    rating: 4.8,
    reviewCount: 68,
    specs: {
      'Audio Driver': '2x 45mm Neodymium Drivers + Passive Bass Radiator',
      'Battery': '2600mAh, up to 12 hours playtime',
      'Bluetooth': 'BT 5.3 Low Latency'
    },
    features: [
      'Custom acoustic fabric grille delivering transparent vocal clarity',
      'Punchy sub-bass radiator that stays distortion-free at high volumes',
      'Integrated tactile silicone volume buttons and carrying loop'
    ],
    description: 'Rich room-filling acoustic sound enclosed in a tactile Scandinavian fabric chassis.'
  },
  {
    id: 'prod-13',
    sku: 'ZM-STAND-13',
    name: 'Magnetic Silicone Headphone Desktop Stand',
    subtitle: 'Curved silicone cradle, weighted metal base, cable organizer',
    tagline: 'Sleek Rest for Audiophile Headsets',
    category: 'desk-setup',
    categoryLabel: 'Desk Setup',
    brandSeries: 'PRO WORKSPACE',
    price: 1100,
    originalPrice: 1400,
    discountPercent: 21,
    badge: 'DESK ESSENTIAL',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    stockCount: 27,
    inStock: true,
    rating: 4.8,
    reviewCount: 44,
    specs: {
      'Height': '260mm Ergonomic Clearance',
      'Base': 'Weighted Solid Steel Core (480g)'
    },
    features: [
      'Soft silicone arch conforms to headband contours without leaving indentations',
      'Sturdy heavy base prevents tipping even with heavy studio headsets',
      'Under-base groove conceals auxiliary cable slack'
    ],
    description: 'Keep your desk clutter-free and showcase your premium headphones in balanced poise.'
  },
  {
    id: 'prod-14',
    sku: 'ZM-LIGHT-14',
    name: 'Smart RGB Flowing Corner Floor Lamp',
    subtitle: '1.4m aluminum tower, App & Music sync, 16M dreamcolor modes',
    tagline: 'Immersive Corner Ambient Atmosphere',
    category: 'ambient-lighting',
    categoryLabel: 'Ambient Lighting',
    brandSeries: 'MOOD AURA SERIES',
    price: 3400,
    originalPrice: 4200,
    discountPercent: 19,
    badge: 'SMART APP',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    stockCount: 11,
    inStock: true,
    rating: 4.9,
    reviewCount: 88,
    specs: {
      'Height': '142cm Slim Vertical Column',
      'LEDs': 'WS2812B Addressable IC Beads',
      'Connectivity': 'WiFi + BLE + Infrared Remote'
    },
    features: [
      'Snugs seamlessly into room corners, reflecting diffuse soft light onto walls',
      'Real-time microphone sound-pickup syncs colors dynamically to music beats',
      'Schedule wake-up sunrise routines and soothing night dims via smartphone app'
    ],
    description: 'Cast stunning flowing gradients and energetic music rhythms throughout your room with minimal footprint.'
  },
  {
    id: 'prod-15',
    sku: 'ZM-DECOR-15',
    name: 'Minimalist Sandstone Thinker Sculpture Bookends',
    subtitle: 'Cast sandstone resin bookends with felt base, set of 2',
    tagline: 'Contemplative Modern Artistry',
    category: 'home-decor',
    categoryLabel: 'Home Decor',
    brandSeries: 'NORDIC MINIMALIST',
    price: 1650,
    originalPrice: 2000,
    discountPercent: 17,
    badge: 'ARTISAN',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    stockCount: 13,
    inStock: true,
    rating: 4.7,
    reviewCount: 39,
    specs: {
      'Material': 'Natural Sandstone Composite',
      'Weight': '1.4kg Pair Solid Counterweight'
    },
    features: [
      'Sculpted abstract silhouette bringing intellectual elegance to bookshelves',
      'Weighted base supports heavy hardcover photography and design monographs',
      'Velvet padded base protects fine wood surfaces from scratches'
    ],
    description: 'An evocative abstract bookend duo capturing philosophical quietude for your home library or studio desk.'
  },
  {
    id: 'prod-16',
    sku: 'ZM-GAD-16',
    name: 'Smart Electronic Air Duster & Desk Vacuum 2-in-1',
    subtitle: '100,000 RPM brushless motor, HEPA washable filter, Type-C rechargeable',
    tagline: 'Deep Clean Keyboard & Optics with Hurricane Power',
    category: 'gadgets',
    categoryLabel: 'Gadgets',
    brandSeries: 'PRO WORKSPACE',
    price: 2850,
    originalPrice: 3500,
    discountPercent: 18,
    badge: 'MUST HAVE',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
    stockCount: 24,
    inStock: true,
    rating: 4.9,
    reviewCount: 103,
    specs: {
      'Motor': '100,000 RPM Brushless Core',
      'Blowing Speed': 'Up to 33m/s Hurricane Force',
      'Battery': '6000mAh Lithium Pack'
    },
    features: [
      'Blows away microscopic debris from keycaps, PC fans, and camera lenses',
      'Flips to suction mode with crevice tool for crumb and desk dust cleanup',
      'Replaces disposable canned air cans permanently, saving money and the environment'
    ],
    description: 'A heavy-duty pocket blower and vacuum engineered specifically for electronics, mechanical keyboards, and precision optics.'
  }
];

export const INITIAL_ORDERS: import('../types').Order[] = [
  {
    id: 'ZB-9241',
    customerName: 'Tanvir Hossain',
    phone: '01712-384910',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    city: 'Dhaka',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[6],
        quantity: 1
      }
    ],
    subtotal: 4400,
    deliveryFee: 60,
    total: 4460,
    paymentMethod: 'Cash on Delivery',
    status: 'shipped',
    createdAt: '2025-09-04 14:25',
    trackingNumber: 'STDF-882914',
    notes: 'Please call before delivery'
  },
  {
    id: 'ZB-9238',
    customerName: 'Nusrat Jahan',
    phone: '01844-551928',
    address: 'Apt 5B, Green Heritage, Nasirabad, Chattogram',
    city: 'Outside Dhaka',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 2
      }
    ],
    subtotal: 2700,
    deliveryFee: 120,
    total: 2820,
    paymentMethod: 'Cash on Delivery',
    status: 'processing',
    createdAt: '2025-09-04 18:10',
    trackingNumber: 'PPFLY-449102'
  },
  {
    id: 'ZB-9235',
    customerName: 'Rashedul Karim',
    phone: '01911-002341',
    address: 'Sector 7, Road 14, Uttara, Dhaka',
    city: 'Dhaka',
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 1
      }
    ],
    subtotal: 3800,
    deliveryFee: 60,
    total: 3860,
    paymentMethod: 'bKash',
    status: 'delivered',
    createdAt: '2025-09-03 11:05',
    trackingNumber: 'STDF-881903'
  }
];
