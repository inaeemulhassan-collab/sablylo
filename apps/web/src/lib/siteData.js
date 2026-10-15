export const WHATSAPP_URL = 'https://wa.me/923001234567';

export const HERO_SLIDES = [
    {
        overline: 'Professional Security Solutions',
        title: 'See Everything. Miss Nothing.',
        text: 'IP, Analog & Smart CCTV systems for homes, shops, and enterprises. Professional installation support available.',
        primary: { label: 'Shop CCTV Systems', to: '/cctv' },
        secondary: { label: 'Get a Custom Quote', to: '/contact' },
        image: 'https://images.hostinger.com/9d2d928c-9111-4328-8c1c-0c7548abffd5.png',
    },
    {
        overline: 'Mobile Repair Wholesale',
        title: 'Every Screen. Every Brand.',
        text: 'LCD and OLED panels for iPhone, Samsung, Xiaomi, Oppo, Vivo, Tecno and more. Wholesale rates available.',
        primary: { label: 'Browse Panels', to: '/shop' },
        secondary: { label: 'Wholesale Pricing', to: '/wholesale' },
        image: 'https://images.hostinger.com/5e280320-34cc-404b-8267-0b7d1e648130.png',
    },
    {
        overline: 'Premium Audio Gear',
        title: 'Sound Like Never Before.',
        text: 'AirPods Pro 2, TWS earbuds, and premium audio accessories at the best prices in Pakistan.',
        primary: { label: 'Shop Audio', to: '/shop' },
        image: 'https://images.hostinger.com/ace988e4-1a28-46ac-adea-bcf88f541986.png',
    },
    {
        overline: 'Laptops & Accessories',
        title: 'Power Your Work. Upgrade Your Setup.',
        text: 'Laptops, SSD upgrades, RAM, cooling pads, and all accessories in one place.',
        primary: { label: 'Shop Laptops', to: '/shop' },
        image: 'https://images.hostinger.com/0f96b521-f26d-49d0-afc5-6b0fc052cd4d.png',
    },
];

export const CATEGORIES = [
    {
        name: 'CCTV Systems',
        count: '120+ products',
        image: 'https://images.hostinger.com/255dbf76-5fc2-4253-bc65-c9c86f1c6a2b.png',
        to: '/cctv',
        span: 'md:col-span-2 md:row-span-2',
    },
    {
        name: 'Mobile Panels',
        count: '340+ products',
        image: 'https://images.hostinger.com/5e280320-34cc-404b-8267-0b7d1e648130.png',
        to: '/shop',
        span: 'md:col-span-2',
    },
    {
        name: 'Audio & Earbuds',
        count: '90+ products',
        image: 'https://images.hostinger.com/ace988e4-1a28-46ac-adea-bcf88f541986.png',
        to: '/shop',
        span: 'md:col-span-2',
    },
    {
        name: 'Laptops',
        count: '60+ products',
        image: 'https://images.hostinger.com/0f96b521-f26d-49d0-afc5-6b0fc052cd4d.png',
        to: '/shop',
        span: '',
    },
    {
        name: 'Smart Electronics',
        count: '150+ products',
        image: 'https://images.hostinger.com/71cee7c1-d5a2-431d-a2ca-9595bd487755.png',
        to: '/shop',
        span: '',
    },
];

export const PANELS = [
    { name: 'iPhone 14 Pro OLED Panel', brand: 'iPhone', type: 'OLED', price: 'PKR 6,500', stock: 'In Stock' },
    { name: 'Samsung Galaxy S23 LCD', brand: 'Samsung', type: 'LCD', price: 'PKR 4,200', stock: 'In Stock' },
    { name: 'Xiaomi Redmi Note 12 Panel', brand: 'Xiaomi', type: 'LCD', price: 'PKR 2,800', stock: 'Low Stock' },
    { name: 'Oppo A54 LCD Screen', brand: 'Oppo', type: 'LCD', price: 'PKR 2,100', stock: 'In Stock' },
    { name: 'Vivo Y33s Display', brand: 'Vivo', type: 'LCD', price: 'PKR 1,900', stock: 'Low Stock' },
    { name: 'Tecno Spark 10 Panel', brand: 'Tecno', type: 'LCD', price: 'PKR 1,700', stock: 'In Stock' },
];

export const PANEL_BRANDS = ['All', 'iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Tecno', 'Other'];

export const TIERS = [
    {
        name: 'Retail',
        desc: 'Standard pricing for individual buyers',
        points: ['Minimum 1 unit', 'Cash on Delivery available', 'Standard delivery'],
        featured: false,
    },
    {
        name: 'Wholesale',
        desc: 'Bulk pricing for shops and resellers',
        points: ['Minimum 10 units', 'Discounted rates', 'Priority dispatch', 'Dedicated support'],
        featured: true,
    },
    {
        name: 'Enterprise',
        desc: 'Custom quotes for large-scale procurement',
        points: ['Minimum 50+ units', 'Maximum discounts', 'Custom delivery', 'Account manager'],
        featured: false,
    },
];

export const REVIEWS = [
    {
        name: 'Bilal Ahmed',
        city: 'Rawalpindi',
        quote: 'Ordered a 4-camera DVR kit for my shop. Dispatched same day and the installation guidance on WhatsApp was spot on.',
    },
    {
        name: 'Hira Saleem',
        city: 'Karachi',
        quote: 'I run a mobile repair shop and buy panels in bulk every month. Wholesale rates are the best I have found online.',
    },
    {
        name: 'Usman Tariq',
        city: 'Faisalabad',
        quote: 'Genuine AirPods Pro 2, paid via EasyPaisa, delivered in two days. Packaging was sealed and proper.',
    },
];

export const FOOTER_COLUMNS = [
    {
        title: 'CCTV & Security',
        links: ['IP Cameras', 'Analog Cameras', 'Smart AI Cameras', 'DVR/NVR Systems', 'Security Accessories'],
    },
    {
        title: 'Mobile & Audio',
        links: ['Mobile Panels', 'Batteries & Parts', 'AirPods & Earbuds', 'Cables & Chargers', 'Screen Protectors'],
    },
    {
        title: 'Laptops & More',
        links: ['Laptops', 'Laptop Accessories', 'Smart Electronics', 'Power Banks', 'USB Hubs'],
    },
    {
        title: 'Support',
        links: ['Track My Order', 'WhatsApp Support', 'Wholesale Enquiry', 'FAQs', 'Contact Us'],
    },
];
