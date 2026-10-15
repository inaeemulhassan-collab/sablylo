import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft, Check, ChevronLeft, ChevronRight, Loader2,
    Minus, Plus, Share2, ShoppingCart, Star, Truck, ShieldCheck, RotateCcw, XCircle,
} from 'lucide-react';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '@/components/ProductsList';
import { WHATSAPP_URL } from '@/lib/siteData';

const placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

const TABS = ['Description', 'Specifications', 'Compatibility', 'Reviews'];

const Assurances = [
    { Icon: Truck, title: 'Fast Delivery', text: 'Nationwide in 2–3 days' },
    { Icon: ShieldCheck, title: 'Genuine Product', text: '100% authentic, verified' },
    { Icon: RotateCcw, title: 'Easy Returns', text: '7-day return policy' },
];

function ProductDetailPage() {
    const { id } = useParams();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const { toast } = useToast();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [tab, setTab] = useState('Description');
    const [adding, setAdding] = useState(false);

    const handleAddToCart = useCallback(async () => {
        if (!product || !selectedVariant) return;
        setAdding(true);
        try {
            await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
            toast({ title: 'Added to cart', description: `${quantity} × ${product.title} added to your cart.` });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Could not add to cart', description: err.message });
        } finally {
            setAdding(false);
        }
    }, [product, selectedVariant, quantity, addToCart, toast]);

    const handleQuantityChange = useCallback((amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    }, []);

    const handleVariantSelect = useCallback((variant) => {
        setSelectedVariant(variant);
        if (variant.image_url && product?.images?.length > 0) {
            const idx = product.images.findIndex((image) => image.url === variant.image_url);
            if (idx !== -1) setCurrentImageIndex(idx);
        }
    }, [product?.images]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedProduct = await getProduct(id);
                const quantitiesResponse = await getProductQuantities({
                    fields: 'inventory_quantity',
                    product_ids: [fetchedProduct.id],
                });
                const map = new Map();
                (quantitiesResponse.variants || []).forEach((v) => map.set(v.id, v.inventory_quantity));
                const productWithQuantities = {
                    ...fetchedProduct,
                    variants: fetchedProduct.variants.map((v) => ({
                        ...v,
                        inventory_quantity: map.get(v.id) ?? v.inventory_quantity,
                    })),
                };
                setProduct(productWithQuantities);
                if (productWithQuantities.variants?.length > 0) {
                    setSelectedVariant(productWithQuantities.variants[0]);
                }
                setCurrentImageIndex(0);
                setTab('Description');
                setQuantity(1);
            } catch (err) {
                setError(err.message || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-[#2563EB]" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-3xl px-5 py-20 text-center">
                <XCircle className="mx-auto h-14 w-14 text-[#DC2626]" />
                <h1 className="mt-5 text-xl font-semibold text-[#111827]">Could not load this product</h1>
                <p className="mt-2 text-sm text-[#6B7280]">{error}</p>
                <Link to="/shop" className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#2563EB] px-6 text-sm font-semibold text-white">
                    <ArrowLeft size={16} /> Back to Shop
                </Link>
            </div>
        );
    }

    const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
    const originalPrice = selectedVariant?.price_formatted;
    const hasSale = Boolean(selectedVariant?.sale_price_in_cents);
    const availableStock = selectedVariant ? selectedVariant.inventory_quantity : 0;
    const isStockManaged = selectedVariant?.manage_inventory ?? false;
    const stockOut = isStockManaged && availableStock <= 0;
    const lowStock = isStockManaged && availableStock > 0 && availableStock <= 5;
    const canAddToCart = product.purchasable && !stockOut && (!isStockManaged || quantity <= availableStock);

    const images = product.images?.length ? product.images : [{ url: product.image || placeholderImage }];
    const currentImage = images[currentImageIndex] || images[0];
    const hasMultipleImages = images.length > 1;

    const related = products.filter((p) => p.id !== product.id).slice(0, 4);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const handleShare = (platform) => {
        const text = encodeURIComponent(`${product.title} — Sablylo.store`);
        const url = encodeURIComponent(shareUrl);
        if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard?.writeText(shareUrl);
            toast({ title: 'Link copied', description: 'Product link copied to clipboard.' });
        }
    };

    const specs = (product.additional_info || []).filter((i) => /spec|detail|feature/i.test(i.title));
    const compat = (product.additional_info || []).filter((i) => /compat|fit|model/i.test(i.title));

    return (
        <>
            <Helmet>
                <title>{product.title} | Sablylo.store</title>
                <meta name="description" content={product.subtitle || `${product.title} — available at Sablylo.store with nationwide delivery.`} />
            </Helmet>

            <div className="mx-auto max-w-[90rem] px-5 py-8 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#9CA3AF]" aria-label="Breadcrumb">
                    <Link to="/" className="transition hover:text-[#2563EB]">Home</Link>
                    <ChevronRight size={13} />
                    <Link to="/shop" className="transition hover:text-[#2563EB]">Shop</Link>
                    <ChevronRight size={13} />
                    <span className="text-[#6B7280] line-clamp-1">{product.title}</span>
                </nav>

                {/* Top section */}
                <div className="mt-6 grid gap-10 lg:grid-cols-2">
                    {/* Gallery */}
                    <div>
                        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-[#F9FAFB]">
                            <img
                                src={currentImage?.url || placeholderImage}
                                alt={product.title}
                                className="aspect-square w-full object-contain"
                            />
                            {hasSale && (
                                <span className="absolute left-4 top-4 rounded-md bg-[#DC2626] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                                    Sale
                                </span>
                            )}
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex((p) => (p === 0 ? images.length - 1 : p - 1))}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-[#374151] shadow-sm transition hover:text-[#2563EB]"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex((p) => (p === images.length - 1 ? 0 : p + 1))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-[#374151] shadow-sm transition hover:text-[#2563EB]"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                        {hasMultipleImages && (
                            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                            index === currentImageIndex ? 'border-[#2563EB]' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img src={image.url || placeholderImage} alt={`${product.title} ${index + 1}`} className="h-full w-full object-contain bg-[#F9FAFB]" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        {product.subtitle && <p className="text-sm font-medium text-[#2563EB]">{product.subtitle}</p>}
                        <h1 className="mt-1 text-[24px] font-bold leading-tight tracking-tight text-[#111827] md:text-[32px]">{product.title}</h1>

                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex items-center gap-0.5 text-[#F59E0B]" aria-label="Rating">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <Star key={i} size={15} className="fill-current" />
                                ))}
                            </div>
                            <span className="text-xs text-[#9CA3AF]">No reviews yet</span>
                        </div>

                        <div className="mt-5 flex items-baseline gap-3">
                            <span className="text-[28px] font-bold text-[#2563EB]">{price}</span>
                            {hasSale && <span className="text-base text-[#9CA3AF] line-through">{originalPrice}</span>}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {stockOut ? (
                                <span className="rounded-md bg-[#FEE2E2] px-3 py-1 text-xs font-semibold text-[#DC2626]">Out of Stock</span>
                            ) : lowStock ? (
                                <span className="rounded-md bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#B45309]">Low Stock — only {availableStock} left</span>
                            ) : (
                                <span className="rounded-md bg-[#D1FAE5] px-3 py-1 text-xs font-semibold text-[#047857]">In Stock — ready to dispatch</span>
                            )}
                            {product.ribbon_text && (
                                <span className="rounded-md bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#B45309]">{product.ribbon_text}</span>
                            )}
                        </div>

                        {/* Variants */}
                        {product.variants?.length > 1 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-[#111827]">Options</h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => handleVariantSelect(variant)}
                                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                                selectedVariant?.id === variant.id
                                                    ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                                                    : 'border-gray-300 bg-white text-[#374151] hover:border-[#2563EB]'
                                            }`}
                                        >
                                            {variant.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity + add to cart */}
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <div className="flex items-center rounded-lg border border-gray-300 bg-white">
                                <button onClick={() => handleQuantityChange(-1)} className="flex h-11 w-11 items-center justify-center text-[#374151] transition hover:text-[#2563EB]" aria-label="Decrease quantity">
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center text-sm font-semibold text-[#111827]">{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)} className="flex h-11 w-11 items-center justify-center text-[#374151] transition hover:text-[#2563EB]" aria-label="Increase quantity">
                                    <Plus size={16} />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={!canAddToCart || adding}
                                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-7 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {adding ? <Loader2 size={17} className="animate-spin" /> : <ShoppingCart size={17} />}
                                {stockOut ? 'Unavailable' : 'Add to Cart'}
                            </button>
                        </div>

                        {isStockManaged && !stockOut && canAddToCart && (
                            <p className="mt-3 flex items-center gap-2 text-xs text-[#10B981]">
                                <Check size={14} /> {availableStock} units available
                            </p>
                        )}

                        {/* Share */}
                        <div className="mt-6 flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280]"><Share2 size={14} /> Share</span>
                            <button onClick={() => handleShare('whatsapp')} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB]">WhatsApp</button>
                            <button onClick={() => handleShare('facebook')} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB]">Facebook</button>
                            <button onClick={() => handleShare('copy')} className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB]">Copy Link</button>
                        </div>

                        {/* Assurances */}
                        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-gray-200 pt-6">
                            {Assurances.map((a) => (
                                <div key={a.title} className="text-center">
                                    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                                        <a.Icon size={18} />
                                    </span>
                                    <p className="mt-2 text-xs font-semibold text-[#111827]">{a.title}</p>
                                    <p className="text-[11px] text-[#9CA3AF]">{a.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-14 border-t border-gray-200 pt-8">
                    <div className="flex flex-wrap gap-1 border-b border-gray-200">
                        {TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition ${
                                    tab === t ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="py-7">
                        {tab === 'Description' && (
                            <div className="prose max-w-3xl text-sm leading-[1.7] text-[#6B7280]" dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available yet.</p>' }} />
                        )}
                        {tab === 'Specifications' && (
                            specs.length > 0 ? (
                                <div className="max-w-3xl space-y-5">
                                    {specs.map((info) => (
                                        <div key={info.id}>
                                            <h3 className="text-sm font-semibold text-[#111827]">{info.title}</h3>
                                            <div className="prose mt-2 text-sm text-[#6B7280]" dangerouslySetInnerHTML={{ __html: info.description }} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[#6B7280]">Detailed specifications will be added for this product soon.</p>
                            )
                        )}
                        {tab === 'Compatibility' && (
                            compat.length > 0 ? (
                                <div className="max-w-3xl space-y-5">
                                    {compat.map((info) => (
                                        <div key={info.id}>
                                            <h3 className="text-sm font-semibold text-[#111827]">{info.title}</h3>
                                            <div className="prose mt-2 text-sm text-[#6B7280]" dangerouslySetInnerHTML={{ __html: info.description }} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[#6B7280]">Compatibility information will be added for this product soon.</p>
                            )
                        )}
                        {tab === 'Reviews' && (
                            <div className="max-w-2xl text-center">
                                <div className="flex items-center justify-center gap-1 text-[#F59E0B]">
                                    {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={22} className="fill-current" />)}
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-[#111827]">No reviews yet</h3>
                                <p className="mt-2 text-sm text-[#6B7280]">Be the first to share your experience with this product.</p>
                                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-[44px] items-center rounded-lg border border-gray-300 px-6 text-sm font-semibold text-[#111827] transition hover:border-[#2563EB] hover:text-[#2563EB]">
                                    Share feedback on WhatsApp
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div className="mt-10 border-t border-gray-200 pt-10">
                        <h2 className="text-xl font-bold tracking-tight text-[#111827] md:text-2xl">Related Products</h2>
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default ProductDetailPage;
