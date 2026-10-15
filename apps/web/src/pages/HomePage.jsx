import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    BadgeCheck,
    Banknote,
    Headphones,
    ShieldCheck,
    Tag,
    Truck,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';
import Seo from '@/components/Seo';
import { ProductGrid, ProductsState } from '@/components/ProductsList';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES, WHATSAPP_URL } from '@/lib/siteData';

const SLIDES = [
    {
        overline: 'Premium Tech Store',
        title: 'Premium Tech Products at Best Prices',
        text: 'CCTV Systems, Mobile Panels, Audio & Laptops — genuine products delivered nationwide with COD, JazzCash and EasyPaisa.',
        primary: { label: 'Shop Now', to: '/shop' },
        secondary: { label: 'Browse Categories', to: '/cctv' },
        image: CATEGORIES[0].image,
    },
    {
        overline: 'Mobile Repair Supply',
        title: 'Mobile Panels & Screens',
        text: 'LCD and OLED panels for iPhone, Samsung, Xiaomi, Oppo, Vivo and Tecno. All brands, all types — wholesale rates available.',
        primary: { label: 'Shop Panels', to: '/shop' },
        secondary: null,
        image: CATEGORIES[1].image,
    },
    {
        overline: 'For Businesses',
        title: 'Wholesale Pricing for Businesses',
        text: 'Bulk discounts for resellers and repair shops. Tiered per-unit rates, priority dispatch and a dedicated WhatsApp contact.',
        primary: { label: 'Learn More', to: '/wholesale' },
        secondary: null,
        image: CATEGORIES[3].image,
    },
];

const TRUST = [
    { Icon: Truck, label: 'Fast Delivery', desc: 'Nationwide dispatch' },
    { Icon: Banknote, label: 'COD Available', desc: 'Pay on delivery' },
    { Icon: ShieldCheck, label: 'Genuine Products', desc: 'Verified quality' },
    { Icon: Tag, label: 'Wholesale Rates', desc: 'Bulk discounts' },
    { Icon: Headphones, label: '24/7 Support', desc: 'WhatsApp help' },
];

const CATEGORY_CARDS = [
    { name: 'CCTV Systems', image: CATEGORIES[0].image, to: '/cctv' },
    { name: 'Mobile Panels', image: CATEGORIES[1].image, to: '/shop' },
    { name: 'Audio & Earbuds', image: CATEGORIES[2].image, to: '/shop' },
    { name: 'Laptops', image: CATEGORIES[3].image, to: '/shop' },
    { name: 'Smart Electronics', image: CATEGORIES[4].image, to: '/shop' },
    {
        name: 'Accessories',
        image: 'https://images.hostinger.com/71cee7c1-d5a2-431d-a2ca-9595bd487755.png',
        to: '/shop',
    },
];

const WHY = [
    {
        Icon: Users,
        title: 'Trusted by Thousands',
        text: 'Over 8,000 orders delivered to repair shops, installers and households across 60+ cities in Pakistan.',
    },
    {
        Icon: Wallet,
        title: 'Best Prices',
        text: 'Competitive retail pricing plus tiered wholesale rates that lower your cost per unit as you scale.',
    },
    {
        Icon: Truck,
        title: 'Fast Delivery',
        text: 'Same-day dispatch on stocked items with nationwide courier coverage and cash on delivery available.',
    },
];

const HeroSlider = () => {
    const [i, setI] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5000);
        return () => clearInterval(t);
    }, []);
    const slide = SLIDES[i];

    return (
        <section className="relative overflow-hidden bg-white">
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#DBEAFE]/70 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#DBEAFE]/50 blur-3xl" />
            <div className="relative mx-auto grid max-w-[90rem] items-center gap-10 px-5 py-16 lg:min-h-[70vh] lg:grid-cols-2 lg:px-8 lg:py-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#2563EB]">{slide.overline}</p>
                        <h1 className="mt-4 text-[28px] font-bold leading-[1.1] tracking-tight text-[#1F2937] md:text-[48px]">
                            {slide.title}
                        </h1>
                        <p className="mt-5 max-w-xl text-sm leading-[1.6] text-[#6B7280] md:text-base">
                            {slide.text}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to={slide.primary.to}
                                className="flex min-h-[48px] items-center gap-2 rounded-md bg-[#2563EB] px-7 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.98]"
                            >
                                {slide.primary.label} <ArrowRight size={16} />
                            </Link>
                            {slide.secondary && (
                                <Link
                                    to={slide.secondary.to}
                                    className="flex min-h-[48px] items-center rounded-md border border-gray-300 px-7 text-sm font-semibold text-[#1F2937] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                                >
                                    {slide.secondary.label}
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={slide.image}
                            src={slide.image}
                            alt={slide.title}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="mx-auto w-full max-w-lg rounded-xl object-contain drop-shadow-[0_20px_40px_rgba(37,99,235,0.15)]"
                        />
                    </AnimatePresence>
                </div>
            </div>

            <div className="relative mx-auto flex max-w-[90rem] items-center justify-center gap-2 px-5 pb-8 lg:px-8">
                {SLIDES.map((s, idx) => (
                    <button
                        key={s.title}
                        onClick={() => setI(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-8 bg-[#2563EB]' : 'w-2.5 bg-gray-300'}`}
                    />
                ))}
            </div>
        </section>
    );
};

const SectionHead = ({ title, linkTo, linkLabel }) => (
    <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#1F2937] md:text-[32px]">{title}</h2>
        {linkTo && (
            <Link to={linkTo} className="text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]">
                {linkLabel} →
            </Link>
        )}
    </div>
);

const HomePage = () => {
    const { products, loading, error } = useProducts();

    return (
        <div className="bg-white">
            <Helmet>
                <title>Sablylo.store — CCTV Cameras, Mobile Panels & Tech Wholesale in Pakistan</title>
                <meta
                    name="description"
                    content="Buy CCTV cameras, IP security systems, mobile LCD & OLED panels, AirPods Pro, laptops and accessories in Pakistan. COD, JazzCash & EasyPaisa with wholesale rates for resellers."
                />
            </Helmet>
            <Seo
                title="Sablylo.store — Premium Tech & Security Solutions Pakistan"
                description="CCTV systems, mobile panels, audio and laptop accessories delivered nationwide with COD, JazzCash and EasyPaisa."
                siteName="Sablylo.store"
            />

            <HeroSlider />

            {/* Trust signals */}
            <section className="border-y border-gray-200 bg-[#F8F9FA]">
                <div className="mx-auto grid max-w-[90rem] px-5 py-8 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
                    {TRUST.map((t) => (
                        <div key={t.label} className="flex items-center gap-3 px-3 py-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                                <t.Icon size={22} strokeWidth={1.8} />
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-[#1F2937]">{t.label}</p>
                                <p className="text-xs text-[#6B7280]">{t.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Category grid */}
            <section className="mx-auto max-w-[90rem] px-5 py-16 lg:px-8">
                <SectionHead title="Shop by Category" linkTo="/shop" linkLabel="Browse All" />
                <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3">
                    {CATEGORY_CARDS.map((c) => (
                        <Link
                            key={c.name}
                            to={c.to}
                            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                                <img
                                    src={c.image}
                                    alt={c.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4">
                                <h3 className="text-base font-semibold text-[#1F2937]">{c.name}</h3>
                                <span className="text-xs font-semibold text-[#2563EB] opacity-0 transition group-hover:opacity-100">Shop now →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured products */}
            <section className="bg-[#F8F9FA]">
                <div className="mx-auto max-w-[90rem] px-5 py-16 lg:px-8">
                    <SectionHead title="Featured Products" linkTo="/shop" linkLabel="View All" />
                    <div className="mt-10">
                        {loading || error || products.length === 0 ? (
                            <ProductsState loading={loading} error={error} empty={products.length === 0} />
                        ) : (
                            <ProductGrid products={products.slice(0, 4)} />
                        )}
                    </div>
                </div>
            </section>

            {/* Why choose us */}
            <section className="mx-auto max-w-[90rem] px-5 py-16 lg:px-8">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-[#1F2937] md:text-[32px]">Why Choose Sablylo</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6B7280] md:text-base">
                        A trusted technology supplier built on genuine products, fair pricing and reliable delivery.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {WHY.map((w) => (
                        <div key={w.title} className="text-center">
                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#DBEAFE] text-[#2563EB]">
                                <w.Icon size={26} strokeWidth={1.8} />
                            </span>
                            <h3 className="mt-5 text-lg font-semibold text-[#1F2937]">{w.title}</h3>
                            <p className="mx-auto mt-2 max-w-xs text-sm leading-[1.6] text-[#6B7280]">{w.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-[#F8F9FA] border-y border-gray-200">
                <div className="mx-auto max-w-2xl px-5 py-16 text-center lg:px-8">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#DBEAFE] text-[#2563EB]">
                        <BadgeCheck size={24} />
                    </span>
                    <h2 className="mt-5 text-xl font-semibold text-[#1F2937] md:text-[32px]">Stay Updated</h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-[#6B7280] md:text-base">
                        Get notified about new arrivals, restocks and exclusive wholesale offers.
                    </p>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="email"
                            required
                            placeholder="Your email address"
                            aria-label="Email address"
                            className="min-h-[48px] flex-1 rounded-md border border-gray-300 bg-white px-4 text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB]"
                        />
                        <button type="submit" className="min-h-[48px] rounded-md bg-[#2563EB] px-7 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.98]">
                            Subscribe
                        </button>
                    </form>
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
                    >
                        <Zap size={15} /> Join our WhatsApp broadcast
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
