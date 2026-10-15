import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingCart, User, X, Zap } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { WHATSAPP_URL } from '@/lib/siteData';

const NAV = [
    { label: 'CCTV Systems', to: '/cctv' },
    { label: 'Mobile Parts', to: '/shop?category=panels' },
    { label: 'Audio', to: '/shop?category=audio' },
    { label: 'Laptops', to: '/shop?category=laptops' },
    { label: 'Wholesale', to: '/wholesale' },
    { label: 'Contact', to: '/contact' },
];

const SearchOverlay = ({ open, onClose }) => {
    const navigate = useNavigate();
    const [q, setQ] = useState('');
    const submit = (e) => {
        e.preventDefault();
        onClose();
        navigate(`/shop?q=${encodeURIComponent(q)}`);
    };
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] bg-white/95 backdrop-blur-md"
                >
                    <div className="mx-auto flex h-full max-w-3xl flex-col justify-center px-6">
                        <button onClick={onClose} aria-label="Close search" className="absolute right-6 top-6 text-gray-400 hover:text-gray-700">
                            <X size={26} />
                        </button>
                        <form onSubmit={submit}>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">Search the store</p>
                            <input
                                autoFocus
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search cameras, panels, AirPods, laptops…"
                                className="w-full border-b border-gray-200 bg-transparent pb-4 text-2xl text-gray-800 outline-none placeholder:text-gray-300 focus:border-[#2563EB] md:text-4xl"
                            />
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SiteHeader = ({ onCartOpen }) => {
    const { cartItems } = useCart();
    const [menu, setMenu] = useState(false);
    const [search, setSearch] = useState(false);
    const count = cartItems.reduce((n, i) => n + i.quantity, 0);

    useEffect(() => {
        document.body.style.overflow = menu ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [menu]);

    return (
        <>
            <header className="sticky top-0 z-[70] border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto flex h-[70px] max-w-[90rem] items-center gap-6 px-5 lg:px-8">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2563EB]">
                            <Zap size={16} className="text-white" />
                        </span>
                        <span className="text-xl font-extrabold tracking-tight text-[#1F2937]">Sablylo</span>
                    </Link>

                    <nav className="ml-auto hidden items-center gap-7 lg:flex">
                        {NAV.map((n) => (
                            <NavLink
                                key={n.label}
                                to={n.to}
                                className={({ isActive }) =>
                                    `group relative py-2 text-sm font-medium transition-colors hover:text-[#2563EB] ${
                                        isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'
                                    }`
                                }
                            >
                                {n.label}
                                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#2563EB] transition-all duration-300 group-hover:w-full" />
                            </NavLink>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-1 lg:ml-0">
                        <button onClick={() => setSearch(true)} aria-label="Search" className="rounded-md p-2 text-[#6B7280] transition hover:bg-gray-100 hover:text-[#2563EB]">
                            <Search size={19} />
                        </button>
                        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Wishlist" className="hidden rounded-md p-2 text-[#6B7280] transition hover:bg-gray-100 hover:text-[#2563EB] sm:block">
                            <Heart size={19} />
                        </a>
                        <Link to="/contact" aria-label="Account" className="hidden rounded-md p-2 text-[#6B7280] transition hover:bg-gray-100 hover:text-[#2563EB] sm:block">
                            <User size={19} />
                        </Link>
                        <button onClick={onCartOpen} aria-label="Open cart" className="relative rounded-md p-2 text-[#1F2937] transition hover:bg-gray-100">
                            <ShoppingCart size={19} />
                            {count > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white">
                                    {count}
                                </span>
                            )}
                        </button>
                        <button onClick={() => setMenu(true)} aria-label="Open menu" className="rounded-md p-2 text-[#1F2937] lg:hidden">
                            <Menu size={21} />
                        </button>
                    </div>
                </div>
            </header>

            <SearchOverlay open={search} onClose={() => setSearch(false)} />

            <AnimatePresence>
                {menu && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="fixed inset-0 z-[90] bg-white px-6 py-6"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-extrabold text-[#1F2937]">Sablylo</span>
                            <button onClick={() => setMenu(false)} aria-label="Close menu" className="p-2 text-[#1F2937]">
                                <X size={24} />
                            </button>
                        </div>
                        <nav className="mt-10 flex flex-col divide-y divide-gray-100 border-y border-gray-100">
                            {NAV.map((n) => (
                                <Link
                                    key={n.label}
                                    to={n.to}
                                    onClick={() => setMenu(false)}
                                    className="py-4 text-lg font-semibold text-[#1F2937]"
                                >
                                    {n.label}
                                </Link>
                            ))}
                        </nav>
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-8 flex min-h-[48px] items-center justify-center rounded-md bg-[#25D366] font-bold text-[#062012]"
                        >
                            WhatsApp Order
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SiteHeader;
