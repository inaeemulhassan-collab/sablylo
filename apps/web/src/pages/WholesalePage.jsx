import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Check, ChevronDown, MessageCircle, Package, Tag, Truck } from 'lucide-react';
import { TIERS, WHATSAPP_URL } from '@/lib/siteData';

const STEPS = [
    { Icon: Package, title: 'Send your list', text: 'Share the models and quantities you need on WhatsApp or through the contact form.' },
    { Icon: Tag, title: 'Get tiered pricing', text: 'We reply with per-unit rates for 10+, 50+ and custom volumes, plus stock timelines.' },
    { Icon: Truck, title: 'Confirm and dispatch', text: 'Pay via bank transfer, JazzCash or EasyPaisa. Bulk orders ship on priority dispatch.' },
];

const CATS = [
    'CCTV cameras and DVR/NVR kits',
    'Mobile LCD & OLED panels',
    'Batteries, cables and chargers',
    'TWS earbuds and audio gear',
    'SSD, RAM and laptop accessories',
    'Smartwatches and power banks',
];

const FAQS = [
    { q: 'What is the minimum wholesale order?', a: '10 units of a single item unlocks wholesale rates. 50+ units moves you to enterprise pricing.' },
    { q: 'Do you offer COD on bulk orders?', a: 'Bulk orders require advance payment or a partial advance; the balance can be COD for trusted repeat clients.' },
    { q: 'Can I mix categories to reach 10 units?', a: 'Yes for accessories and panels. Cameras and kits are quoted per model.' },
    { q: 'Do you supply outside major cities?', a: 'We ship to 60+ cities across Pakistan through partner couriers.' },
];

const FaqItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={open}
            >
                <span className="text-sm font-semibold text-[#111827] md:text-base">{q}</span>
                <ChevronDown size={18} className={`shrink-0 text-[#6B7280] transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <p className="pb-5 text-sm leading-[1.7] text-[#6B7280]">{a}</p>}
        </div>
    );
};

const WholesalePage = () => (
    <>
        <Helmet>
            <title>Wholesale Mobile Panels & CCTV Supplier Pakistan | Sablylo</title>
            <meta
                name="description"
                content="Wholesale rates on mobile panels, CCTV systems, audio and laptop accessories for repair shops, installers and resellers across Pakistan."
            />
        </Helmet>

        {/* Hero */}
        <section className="border-b border-gray-200 bg-[#EFF6FF]">
            <div className="mx-auto max-w-[90rem] px-5 py-16 lg:px-8 lg:py-24">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#2563EB]">For Businesses & Resellers</p>
                <h1 className="mt-4 max-w-3xl text-[28px] font-bold leading-tight tracking-tight text-[#111827] md:text-[48px]">
                    Wholesale Solutions for Your Business
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-[1.7] text-[#6B7280] md:text-base">
                    Bulk pricing, dedicated support, and flexible payment terms — built for repair shops,
                    CCTV installers and online resellers across Pakistan.
                </p>
                <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#2563EB] px-7 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.98]"
                >
                    Get Started
                </a>
            </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-[90rem] px-5 py-16 lg:px-8">
            <h2 className="text-center text-xl font-bold tracking-tight text-[#111827] md:text-[32px]">How it works</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
                {STEPS.map((s, i) => (
                    <div key={s.title} className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm">
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                            <s.Icon size={22} />
                        </span>
                        <span className="mt-4 block text-xs font-semibold text-[#9CA3AF]">Step 0{i + 1}</span>
                        <h3 className="mt-1 text-base font-semibold text-[#111827]">{s.title}</h3>
                        <p className="mt-2 text-sm leading-[1.7] text-[#6B7280]">{s.text}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Pricing tiers */}
        <section className="bg-[#F3F4F6]">
            <div className="mx-auto max-w-[90rem] px-5 py-16 lg:px-8">
                <h2 className="text-center text-xl font-bold tracking-tight text-[#111827] md:text-[32px]">Pricing tiers</h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[#6B7280] md:text-base">
                    Transparent per-unit rates that improve as your order volume grows.
                </p>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {TIERS.map((t) => (
                        <div
                            key={t.name}
                            className={`flex flex-col rounded-xl border bg-white p-7 shadow-sm transition hover:shadow-md ${
                                t.featured ? 'border-[#2563EB] ring-1 ring-[#2563EB]' : 'border-gray-200'
                            }`}
                        >
                            {t.featured && (
                                <span className="mb-3 w-fit rounded-full bg-[#2563EB] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                                    Most Popular
                                </span>
                            )}
                            <h3 className="text-lg font-bold text-[#111827]">{t.name}</h3>
                            <p className="mt-2 text-sm text-[#6B7280]">{t.desc}</p>
                            <ul className="mt-6 flex-1 space-y-3">
                                {t.points.map((p) => (
                                    <li key={p} className="flex items-start gap-2.5 text-sm text-[#374151]">
                                        <Check size={16} className={`mt-0.5 shrink-0 ${t.featured ? 'text-[#2563EB]' : 'text-[#10B981]'}`} />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noreferrer"
                                className={`mt-7 flex min-h-[44px] items-center justify-center rounded-lg text-sm font-semibold transition active:scale-[0.98] ${
                                    t.featured
                                        ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                                        : 'border border-gray-300 text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB]'
                                }`}
                            >
                                {t.featured ? 'Request Quote' : 'Choose ' + t.name}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-[#111827]">Available for wholesale</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {CATS.map((c) => (
                            <p key={c} className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#374151]">
                                <Check size={15} className="shrink-0 text-[#10B981]" /> {c}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-[56rem] px-5 py-16 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-[#111827] md:text-[32px]">Wholesale FAQs</h2>
            <div className="mt-6 border-t border-gray-200">
                {FAQS.map((f) => (
                    <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
            </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-[#EFF6FF]">
            <div className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8">
                <h2 className="text-xl font-bold tracking-tight text-[#111827] md:text-[28px]">
                    Ready to order in bulk?
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm text-[#6B7280] md:text-base">
                    Contact our wholesale team for a tailored quote and stock availability.
                </p>
                <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#25D366] px-7 text-sm font-semibold text-[#062012] transition hover:brightness-95 active:scale-[0.98]"
                >
                    <MessageCircle size={18} /> Chat with our wholesale team
                </a>
            </div>
        </section>
    </>
);

export default WholesalePage;
