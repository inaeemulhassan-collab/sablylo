import React, { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';

const placeholderImage = 'https://images.hostinger.com/71cee7c1-d5a2-431d-a2ca-9595bd487755.png';

export const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const navigate = useNavigate();

    const variant = useMemo(() => product.variants?.[0], [product]);
    const hasSale = Boolean(variant?.sale_price_formatted);
    const price = hasSale ? variant?.sale_price_formatted : variant?.price_formatted;
    const stockOut =
        variant?.manage_inventory === true && (variant?.inventory_quantity ?? 0) <= 0;

    const handleAddToCart = useCallback(
        async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!product.variants?.length) return;
            if (product.variants.length > 1) {
                navigate(`/product/${product.id}`);
                return;
            }
            const v = product.variants[0];
            try {
                await addToCart(product, v, 1, v.inventory_quantity);
                toast({ title: 'Added to cart', description: `${product.title} is in your cart.` });
            } catch (error) {
                toast({ title: 'Could not add to cart', description: error.message });
            }
        },
        [product, addToCart, toast, navigate],
    );

    return (
        <Link to={`/product/${product.id}`} className="group block">
            <article className="relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                        src={product.image || placeholderImage}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {product.ribbon_text && (
                        <span className="absolute left-3 top-3 rounded-md bg-[#DC2626] px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                            {product.ribbon_text}
                        </span>
                    )}
                    <span className="absolute right-3 top-3 rounded-full border border-gray-200 bg-white p-2 text-gray-400 transition-colors group-hover:text-[#EF4444]">
                        <Heart size={15} />
                    </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="text-xs font-medium text-[#9CA3AF]">{product.subtitle || 'Sablylo'}</p>
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#1F2937]">
                        {product.title}
                    </h3>
                    <div className="mt-auto flex items-baseline gap-2 pt-2">
                        <span className="text-lg font-bold text-[#1F2937]">{price}</span>
                        {hasSale && (
                            <span className="text-xs text-[#9CA3AF] line-through">
                                {variant?.price_formatted}
                            </span>
                        )}
                    </div>
                    <p className={`text-xs font-semibold ${stockOut ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                        {stockOut ? 'Out of stock' : 'In stock — ready to dispatch'}
                    </p>
                    <button
                        onClick={handleAddToCart}
                        disabled={stockOut}
                        className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ShoppingCart size={16} /> Add to Cart
                    </button>
                </div>
            </article>
        </Link>
    );
};

export const ProductGrid = ({ products, columns = 'lg:grid-cols-4' }) => (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${columns}`}>
        {products.map((p) => (
            <ProductCard key={p.id} product={p} />
        ))}
    </div>
);

export const ProductsState = ({ loading, error, empty }) => {
    if (loading) {
        return (
            <div className="flex h-56 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#2563EB]" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-[#EF4444]">
                Could not load products: {error}
            </div>
        );
    }
    if (empty) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-[#6B7280]">
                No products match your filters yet.
            </div>
        );
    }
    return null;
};

const ProductsList = ({ limit }) => {
    const { products, loading, error } = useProducts();
    const shown = limit ? products.slice(0, limit) : products;

    if (loading || error || shown.length === 0) {
        return <ProductsState loading={loading} error={error} empty={shown.length === 0} />;
    }
    return <ProductGrid products={shown} />;
};

export default ProductsList;
