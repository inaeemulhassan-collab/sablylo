import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/siteData';

const SuccessPage = () => (
    <>
        <Helmet>
            <title>Order Confirmed | Sablylo.store</title>
            <meta name="description" content="Your Sablylo.store order is confirmed. Our team will contact you on WhatsApp with dispatch details." />
        </Helmet>
        <section className="bg-[#F3F4F6]">
            <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-20 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D1FAE5] text-[#10B981]">
                    <CheckCircle2 size={44} strokeWidth={2} />
                </span>
                <h1 className="mt-7 text-[28px] font-bold tracking-tight text-[#111827] md:text-[44px]">
                    Order Confirmed
                </h1>
                <p className="mt-4 max-w-md text-sm leading-[1.7] text-[#6B7280] md:text-base">
                    Thank you for shopping with Sablylo.store. Our team will confirm your delivery details and
                    share tracking on WhatsApp. Cash on delivery orders require the advance delivery fee before dispatch.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                    <Link
                        to="/shop"
                        className="flex min-h-[48px] items-center gap-2 rounded-lg bg-[#2563EB] px-7 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.98]"
                    >
                        <ShoppingBag size={17} /> Continue Shopping
                    </Link>
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-[48px] items-center gap-2 rounded-lg border border-gray-300 bg-white px-7 text-sm font-semibold text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]"
                    >
                        <MessageCircle size={17} /> Track on WhatsApp
                    </a>
                </div>
            </div>
        </section>
    </>
);

export default SuccessPage;
