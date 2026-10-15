import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Music2, Youtube, Zap } from 'lucide-react';
import { FOOTER_COLUMNS, WHATSAPP_URL } from '@/lib/siteData';

const SiteFooter = () => (
    <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 lg:grid-cols-5 lg:px-8">
            <div>
                <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2563EB]">
                        <Zap size={16} className="text-white" />
                    </span>
                    <span className="text-xl font-extrabold text-[#1F2937]">Sablylo</span>
                </div>
                <p className="mt-3 max-w-xs text-sm leading-[1.7] text-[#6B7280]">
                    Premium tech and security solutions — serving Pakistan nationwide with genuine products, fast delivery and wholesale rates.
                </p>
                <div className="mt-5 flex gap-3">
                    {[Music2, Instagram, MessageCircle, Youtube].map((Icon, i) => (
                        <a
                            key={i}
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Sablylo social channel"
                            className="rounded-md border border-gray-200 p-2 text-[#6B7280] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                        >
                            <Icon size={17} />
                        </a>
                    ))}
                </div>
            </div>
            {FOOTER_COLUMNS.map((col) => (
                <div key={col.title}>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#1F2937]">{col.title}</p>
                    <ul className="mt-4 space-y-2.5">
                        {col.links.map((l) => (
                            <li key={l}>
                                <Link to="/shop" className="text-sm text-[#6B7280] transition hover:text-[#2563EB]">
                                    {l}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
        <div className="border-t border-gray-200">
            <div className="mx-auto flex max-w-[90rem] flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-[#9CA3AF] sm:flex-row lg:px-8">
                <p>© 2025 Sablylo.store — All Rights Reserved</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {['JazzCash', 'EasyPaisa', 'Bank Transfer', 'COD'].map((p) => (
                        <span key={p} className="rounded-md border border-gray-200 px-2.5 py-1 font-semibold text-[#6B7280]">
                            {p}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default SiteFooter;
