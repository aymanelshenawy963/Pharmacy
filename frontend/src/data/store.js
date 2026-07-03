export const featuredCategories = [
    { name: 'Medicines', iconKey: 'Pill', slug: 'Medicines', description: 'Everyday care from trusted brands.' },
    { name: 'Vitamins & Supplements', iconKey: 'Sparkles', slug: 'Vitamins & Supplements', description: 'Daily wellness support for energy, immunity, and recovery.' },
    { name: 'Personal Care', iconKey: 'Sparkles', slug: 'Personal Care', description: 'Skin, hygiene, and grooming essentials for the whole family.' },
    { name: 'Baby Care', iconKey: 'Baby', slug: 'Baby Care', description: 'Gentle products selected for infants and young children.' },
    { name: 'Diabetic Care', iconKey: 'Droplets', slug: 'Diabetic Care', description: 'Monitoring and support products for routine diabetic care.' },
    { name: 'Surgical Supplies', iconKey: 'Bandage', slug: 'Surgical Supplies', description: 'Practical supplies for home care and clinical use.' },
];

export const trustBadges = [
    { title: 'Licensed Pharmacy', iconKey: 'ShieldCheck' },
    { title: '100% Genuine Medicines', iconKey: 'BadgeCheck' },
    { title: 'Same-Day Delivery', iconKey: 'Truck' },
    { title: 'Expert Consultation', iconKey: 'Stethoscope' },
];

export const howItWorksSteps = [
    {
        title: 'Browse Products',
        text: 'Explore our wide range of medicines, healthcare products, and wellness essentials with smart filters.',
        iconKey: 'Search',
    },
    {
        title: 'Choose Your Items',
        text: 'Select products, compare options, and add them to your cart with confidence.',
        iconKey: 'ShoppingCart',
    },
    {
        title: 'Secure Checkout',
        text: 'Enter your shipping details and complete payment securely with multiple options.',
        iconKey: 'ShieldCheck',
    },
    {
        title: 'Order Confirmation',
        text: 'Receive instant confirmation and track your order status in real time.',
        iconKey: 'ClipboardList',
    },
    {
        title: 'Fast Delivery',
        text: 'Your order is carefully packed and delivered directly to your doorstep.',
        iconKey: 'Truck',
    },
];

export const ownerProfile = {
    name: 'James Mitchell',
    title: 'Proprietor, Medical Store',
    quote: 'Serving your family with steady advice, authentic products, and careful attention to every order.',
    years: 15,
    bio:
        'James Mitchell has built Medical Store around one simple idea: a pharmacy should feel accurate, calm, and human. The store balances quick service with careful verification so every customer can order with confidence.',
    qualifications: ['Retail pharmacy experience', 'Product guidance and counseling'],
};

export const storeInfo = {
    address: 'Medical Store, Dhawari, Satna, Lamtara, Madhya Pradesh 485001',
    phone: '+91 97528 80806',
    email: 'support@medicalstore.in',
    whatsapp: 'https://wa.me/919752880806',
    hours: 'Monday to Sunday, 8:00 AM to 10:00 PM',
    mapEmbedUrl: 'https://www.google.com/maps?q=24.5556833,80.8192739&z=18&output=embed',
};

export const socialLinks = [
    { name: 'WhatsApp', href: 'https://wa.me/919752880806' },
    { name: 'Instagram', href: 'https://www.instagram.com/' },
    { name: 'Facebook', href: 'https://www.facebook.com/' },
    { name: 'X', href: 'https://x.com/' },
];

export const footerLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'About', to: '/about' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact', to: '/contact' },
];

export const milestones = [
    { year: '2010', title: 'Store opened', text: 'Medical Store began serving the neighborhood with a small, dependable pharmacy counter.' },
    { year: '2016', title: 'Home delivery added', text: 'The store expanded delivery support for recurring medicines and urgent requests.' },
    { year: '2020', title: 'Digital ordering', text: 'WhatsApp ordering became part of the daily workflow.' },
    { year: '2026', title: 'Modern online storefront', text: 'The pharmacy now ships with a polished multi-page shopping experience.' },
];

export const valueCards = [
    { title: 'Genuine Products', text: 'We source from trusted distributors and maintain a careful receiving process.', iconKey: 'ShieldCheck' },
    { title: 'Patient First', text: 'Our recommendations are designed to be practical, clear, and respectful.', iconKey: 'HeartPulse' },
    { title: 'Affordable Healthcare', text: 'We balance quality with pricing so regular essentials remain accessible.', iconKey: 'BadgeCheck' },
    { title: 'Expert Advice', text: 'A pharmacist-friendly support flow keeps orders accurate and easy to follow.', iconKey: 'Stethoscope' },
];

export const testimonialItems = [
    {
        name: 'Priya Sharma',
        rating: 5,
        text: 'The order reached us the same evening. The packaging was neat and reassuring.',
    },
    {
        name: 'Amit Verma',
        rating: 5,
        text: 'Clear communication, genuine products, and a team that answers quickly on WhatsApp. That combination matters.',
    },
    {
        name: 'Neha Patil',
        rating: 4,
        text: 'I liked how the site makes it easy to find wellness products and compare prices without clutter.',
    },
];

export const faqItems = [
    {
        question: 'How fast is delivery?',
        answer: 'Orders are prepared as quickly as possible and same-day delivery is available in select local areas when stock and timing allow.',
    },
    {
        question: 'Can I return medicines?',
        answer: 'Returns are handled according to product condition, storage safety, and pharmacy policy. Please contact the store before sending anything back.',
    },
    {
        question: 'What payment methods are supported?',
        answer: 'Cash on delivery, UPI, and standard card or wallet payment options are accepted where available.',
    },
    {
        question: 'How do you verify product authenticity?',
        answer: 'Products are sourced through regular pharmacy channels and packed only after internal verification.',
    },
    {
        question: 'Can I order through WhatsApp?',
        answer: 'Yes. You can place a quick order or ask a follow-up question using the WhatsApp button.',
    },
];

export const contactSubjects = [
    'General inquiry',
    'Order status',
    'Product availability',
    'Delivery support',
    'Other',
];

// No backend API exists for delivery methods — these are static/fallback values.
export const deliveryMethods = [
    {
        id: 1,
        name: 'Fast Delivery',
        description: 'Get your order in 1-2 days',
        price: 9.99,
        deliveryTime: '1-2 days',
    },
    {
        id: 2,
        name: 'Standard Delivery',
        description: 'Get your order in 3-5 days',
        price: 4.99,
        deliveryTime: '3-5 days',
    },
    {
        id: 3,
        name: 'Economy Delivery',
        description: 'Get your order in 5-7 days',
        price: 2.99,
        deliveryTime: '5-7 days',
    },
];

export const collectionCards = [
    {
        title: 'Medicines',
        description: 'Comprehensive pharmaceutical care, sourced strictly from certified global manufacturers.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD49expR2znvOL7qB6D50TlQBdUgtizsNudzj-6pxZGO_xZrwBSXCI1tLClB139tPjeUY_6-RSdQsD2yhhpf6tFZUFPtMIZcmQ3iUjYJeTAecFa620xx8QxFyaHHsMNNf3AonnjuGpd0y77rbEOkY7l7F50mTmls8pk6ZxEDa7fE9AnmeJB696HS79j8t4SKKfVK3E9iARcmCICR6Wg7twzL2tpHP2awMzcL4kiuvmSHTqft11KiDbtkgPbSfVIqFLIWaG7FLo1xN4',
        large: true,
    },
    {
        title: 'Vitamins',
        description: 'Daily nutritional support.',
        image: import.meta.env.BASE_URL + 'images/vitamins.webp',
    },
    {
        title: 'Personal Care',
        description: 'Premium hygiene essentials.',
        image: import.meta.env.BASE_URL + 'images/personalcare.webp',
    },
    {
        title: 'Baby Care',
        description: 'Gentle pediatric solutions.',
        image: import.meta.env.BASE_URL + 'images/babycare.webp',
    },
    {
        title: 'Diabetic Care',
        description: 'Monitoring and management.',
        image: import.meta.env.BASE_URL + 'images/diabeticcare.webp',
    },
    {
        title: 'Cough & Cold',
        description: 'Relief for coughs, colds, and respiratory discomfort.',
        image: import.meta.env.BASE_URL + 'images/coughandcold.webp',
    },
];
