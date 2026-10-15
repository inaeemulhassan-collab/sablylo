import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ShoppingCart from '@/components/ShoppingCart';
import { WHATSAPP_URL } from '@/lib/siteData';

const SiteLayout = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    return (
        <div className="min-h-screen bg-white">
            <SiteHeader onCartOpen={() => setIsCartOpen(true)} />
            <main>
                <Outlet context={{ openCart: () => setIsCartOpen(true) }} />
            </main>
            <SiteFooter />
            <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#062012] shadow-[0_0_24px_rgba(37,211,102,0.45)] transition active:scale-95"
            >
                <MessageCircle size={26} />
            </a>
        </div>
    );
};

export default SiteLayout;
