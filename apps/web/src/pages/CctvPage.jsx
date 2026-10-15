import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ProductGrid, ProductsState } from '@/components/ProductsList';
import { useProducts } from '@/hooks/useProducts';
import { HERO_SLIDES } from '@/lib/siteData';

const TABS = ['All', 'IP Cameras', 'Analog', 'Smart', 'DVR Kits', 'Accessories'];

const GUIDE = [
    {
        title: 'Match resolution to distance',
        text: '2MP analog covers small shops. For number plates or faces beyond 10 meters, choose 4MP or 4K IP cameras.',
    },
    {
        title: 'Plan storage before recording',
        text: 'A 4-camera 2MP setup recording 24/7 needs roughly 2TB per month of continuous footage. Motion recording extends this.',
    },
    {
        title: 'Indoor dome vs outdoor bullet',
        text: 'Domes are discreet for interiors; weatherproof bullets with IR handle gates, boundary walls and parking areas.',
    },
];

const CctvPage = () => {
    const { products, loading, error } = useProducts();
    const [tab, setTab] = useState('All');

    const list = useMemo(() => {
        const cctv = products.filter((p) => /camera|cctv|dvr|nvr|surveillance|security/i.test(`${p.title} ${p.subtitle || ''}`));
        const base = cctv.length ? cctv : products;
        if (tab === 'All') return base;
        const map = {
            'IP Cameras': /ip |network|4k|2k|5mp|4mp/i,
            Analog: /analog|ahd|hd-cvi|hd-tvi/i,
            Smart: /smart|ai|wifi|wireless/i,
            'DVR Kits': /dvr|nvr|kit|recorder/i,
            Accessories: /cable|mount|bracket|power|adapter|connector/i,
        };
        const re = map[tab];
        return re ? base.filter((p) => re.test(`${p.title} ${p.subtitle || ''}`)) : base;
    }, [products, tab]);

    return (
        <>
            <Helmet>
                <title>CCTV Camera Price in Pakistan | IP & Analog Security Systems | Sablylo</title>
                <meta
                    name="description"
                    content="Professional CCTV systems in Pakistan: 4K IP cameras, analog HD kits, smart AI cameras and DVR/NVR bundles with wholesale rates for installers."
                />
            </Helmet>

            {/* Hero */}
            <section className="border-b border-gray-200 bg-[#FAFBFC]">
                <div className="mx-auto grid max-w-[90rem] items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:px-8">
                    <div>
                        <nav className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF]" aria-label="Breadcrumb">
                            <Link to="/" className="transition hover:text-[#2563EB]">Home</Link>
                            <ChevronRight size={13} />
                            <span className="text-[#6B7280]">CCTV Systems</span>
                        </nav>
                        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">Surveillance</p>
                        <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-[#111827] md:text-[44px]">
                            Professional Surveillance Solutions
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-[1.7] text-[#6B7280] md:text-base">
                            Cameras, recorders and accessories for homes, shops and enterprise sites — with
                            installation guidance from our technical team.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                to="/shop"
                                className="flex min-h-[48px] items-center rounded-lg bg-[#2563EB] px-7 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.98]"
                            >
                                Browse Products
                            </Link>
                            <Link
                                to="/contact"
                                className="flex min-h-[48px] items-center rounded-lg border border-gray-300 bg-white px-7 text-sm font-semibold text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                            >
                                Get a Custom Quote
                            </Link>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#DBEAFE]/60 blur-3xl" />
                        <img
                            src={HERO_SLIDES[0].image}
                            alt="CCTV security camera"
                            className="relative mx-auto w-full max-w-md rounded-xl object-contain drop-shadow-[0_20px_40px_rgba(37,99,235,0.15)]"
                        />
                    </div>
                </div>
            </section>

            {/* Tabs + products */}
            <div className="mx-auto max-w-[90rem] px-5 py-12 lg:px-8">
                <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                tab === t
                                    ? 'bg-[#2563EB] text-white'
                                    : 'border border-gray-200 bg-white text-[#374151] hover:border-[#2563EB] hover:text-[#2563EB]'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="mt-8">
                    {loading || error || list.length === 0 ? (
                        <ProductsState loading={loading} error={error} empty={list.length === 0} />
                    ) : (
                        <ProductGrid products={list} columns="lg:grid-cols-3 xl:grid-cols-4" />
                    )}
                </div>
            </div>

            {/* Buying guide */}
            <section className="bg-[#F3F4F6]">
                <div className="mx-auto max-w-[90rem] px-5 py-16 lg:px-8">
                    <h2 className="text-xl font-bold tracking-tight text-[#111827] md:text-[32px]">
                        How to choose the right CCTV system
                    </h2>
                    <div className="mt-8 grid gap-5 md:grid-cols-3">
                        {GUIDE.map((g, i) => (
                            <div key={g.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <span className="text-2xl font-bold text-[#2563EB]">0{i + 1}</span>
                                <h3 className="mt-3 text-base font-semibold text-[#111827]">{g.title}</h3>
                                <p className="mt-2 text-sm leading-[1.7] text-[#6B7280]">{g.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default CctvPage;
