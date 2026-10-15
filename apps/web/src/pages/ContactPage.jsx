import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { WHATSAPP_URL } from '@/lib/siteData';

const SUBJECTS = [
    'General Inquiry',
    'Product Question',
    'Wholesale',
    'Technical Support',
    'Other',
];

const INFO = [
    { Icon: Phone, title: 'Phone', text: '+92 300 1234567' },
    { Icon: Mail, title: 'Email', text: 'support@sablylo.store' },
    { Icon: Clock, title: 'Business hours', text: 'Mon – Sat, 10:00 to 20:00 (PKT)' },
    { Icon: MapPin, title: 'Cities served', text: 'Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar + 50 more' },
];

const ContactPage = () => {
    const { toast } = useToast();
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSent(true);
            toast({ title: 'Message sent', description: 'Our team replies fastest on WhatsApp.' });
        }, 700);
    };

    return (
        <>
            <Helmet>
                <title>Contact Sablylo.store — CCTV & Mobile Parts Support Pakistan</title>
                <meta
                    name="description"
                    content="Contact Sablylo.store for CCTV quotes, mobile panel wholesale enquiries and order support. WhatsApp, email and nationwide delivery across Pakistan."
                />
            </Helmet>

            <section className="border-b border-gray-200 bg-[#FAFBFC]">
                <div className="mx-auto max-w-[90rem] px-5 py-12 lg:px-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#2563EB]">Get in touch</p>
                    <h1 className="mt-3 text-[28px] font-bold tracking-tight text-[#111827] md:text-[44px]">Talk to our team</h1>
                    <p className="mt-3 max-w-xl text-sm text-[#6B7280] md:text-base">
                        Product availability, bulk pricing, installation guidance or order tracking — we answer
                        quickly during business hours.
                    </p>
                </div>
            </section>

            <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-14 lg:grid-cols-2 lg:px-8">
                {/* Info */}
                <div>
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#25D366] px-7 text-sm font-semibold text-[#062012] transition hover:brightness-95 active:scale-[0.98]"
                    >
                        <MessageCircle size={18} /> Chat on WhatsApp
                    </a>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        {INFO.map((r) => (
                            <div key={r.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                                    <r.Icon size={18} />
                                </span>
                                <p className="mt-4 text-sm font-semibold text-[#111827]">{r.title}</p>
                                <p className="mt-1 text-sm leading-[1.6] text-[#6B7280]">{r.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="h-fit rounded-xl border border-gray-200 bg-white p-7 shadow-sm">
                    <h2 className="text-lg font-semibold text-[#111827]">Send us a message</h2>
                    <p className="mt-1 text-sm text-[#6B7280]">We typically reply within a few hours.</p>
                    <div className="mt-6 grid gap-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[#374151]" htmlFor="c-name">Name</label>
                                <input
                                    id="c-name"
                                    required
                                    type="text"
                                    placeholder="Your full name"
                                    className="min-h-[44px] rounded-md border border-gray-300 bg-white px-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-[#374151]" htmlFor="c-phone">Phone</label>
                                <input
                                    id="c-phone"
                                    required
                                    type="tel"
                                    placeholder="03xx xxxxxxx"
                                    className="min-h-[44px] rounded-md border border-gray-300 bg-white px-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB]"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#374151]" htmlFor="c-email">Email</label>
                            <input
                                id="c-email"
                                required
                                type="email"
                                placeholder="you@example.com"
                                className="min-h-[44px] rounded-md border border-gray-300 bg-white px-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB]"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#374151]" htmlFor="c-subject">Subject</label>
                            <select
                                id="c-subject"
                                defaultValue={SUBJECTS[0]}
                                className="min-h-[44px] rounded-md border border-gray-300 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#2563EB]"
                            >
                                {SUBJECTS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-[#374151]" htmlFor="c-message">Message</label>
                            <textarea
                                id="c-message"
                                required
                                rows={5}
                                placeholder="Tell us the models and quantities you need"
                                className="rounded-md border border-gray-300 bg-white p-3 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB]"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-7 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.98] disabled:opacity-60"
                        >
                            {submitting ? 'Sending…' : (<><Send size={16} /> Send Message</>)}
                        </button>
                        {sent && (
                            <p className="text-xs font-medium text-[#10B981]">
                                Thanks — your message has been received. For the fastest reply, send the same details on WhatsApp.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default ContactPage;
