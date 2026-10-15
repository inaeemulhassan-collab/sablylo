import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Filter, Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductGrid, ProductsState } from '@/components/ProductsList';
import { useProducts } from '@/hooks/useProducts';
import { getCategories } from '@/api/EcommerceApi';

const SORTS = [
    { id: 'latest', label: 'Latest' },
    { id: 'low', label: 'Price: Low to High' },
    { id: 'high', label: 'Price: High to Low' },
    { id: 'name', label: 'Name: A to Z' },
    { id: 'popular', label: 'Best Selling' },
];

const PER_PAGE = [20, 40, 60];

const priceOf = (p) => p.variants?.[0]?.sale_price_in_cents ?? p.variants?.[0]?.price_in_cents ?? 0;

const stockState = (p) => {
    const v = p.variants?.[0];
    if (!v) return 'out';
    if (v.manage_inventory !== true) return 'in';
    const q = v.inventory_quantity ?? 0;
    if (q <= 0) return 'out';
    if (q <= 5) return 'low';
    return 'in';
};

const isOnSale = (p) => Boolean(p.variants?.[0]?.sale_price_in_cents);

const Checkbox = ({ checked, onChange, label, count }) => (
    <label className="flex cursor-pointer items-center justify-between gap-2 py-1.5 text-sm text-[#374151] transition hover:text-[#111827]">
        <span className="flex items-center gap-2.5">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-gray-300 text-[#2563EB] accent-[#2563EB] focus:ring-[#2563EB]"
            />
            <span>{label}</span>
        </span>
        {typeof count === 'number' && <span className="text-xs text-[#9CA3AF]">{count}</span>}
    </label>
);

const FilterSection = ({ title, children, onClear }) => (
    <div className="border-b border-gray-200 py-5 first:pt-0">
        <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
            {onClear && (
                <button onClick={onClear} className="text-xs font-medium text-[#2563EB] transition hover:text-[#1D4ED8]">
                    Clear
                </button>
            )}
        </div>
        <div className="space-y-0.5">{children}</div>
    </div>
);

const FiltersBody = ({ state }) => {
    const {
        categories, selectedCats, toggleCat, clearCats,
        brands, selectedBrands, toggleBrand, clearBrands,
        priceBounds, priceRange, setPriceRange, clearPrice,
        stockOptions, selectedStock, toggleStock, clearStock,
        onSale, setOnSale,
        productCount,
    } = state;

    return (
        <>
            <FilterSection title="Category" onClear={selectedCats.size ? clearCats : undefined}>
                {categories.length === 0 ? (
                    <p className="text-xs text-[#9CA3AF]">No categories yet.</p>
                ) : (
                    categories.map((c) => (
                        <Checkbox
                            key={c.id}
                            checked={selectedCats.has(c.id)}
                            onChange={() => toggleCat(c.id)}
                            label={c.title}
                        />
                    ))
                )}
            </FilterSection>

            <FilterSection title="Brand" onClear={selectedBrands.size ? clearBrands : undefined}>
                {brands.length === 0 ? (
                    <p className="text-xs text-[#9CA3AF]">No brands yet.</p>
                ) : (
                    brands.map((b) => (
                        <Checkbox
                            key={b.label}
                            checked={selectedBrands.has(b.label)}
                            onChange={() => toggleBrand(b.label)}
                            label={b.label}
                            count={b.count}
                        />
                    ))
                )}
            </FilterSection>

            <FilterSection title="Price Range" onClear={priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1] ? clearPrice : undefined}>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={0}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.max(0, Number(e.target.value) || 0), priceRange[1]])}
                        className="min-h-[40px] w-full rounded-md border border-gray-300 px-2 text-sm text-[#111827] outline-none focus:border-[#2563EB]"
                        aria-label="Minimum price"
                    />
                    <span className="text-[#9CA3AF]">—</span>
                    <input
                        type="number"
                        min={0}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], Number(e.target.value) || 0)])}
                        className="min-h-[40px] w-full rounded-md border border-gray-300 px-2 text-sm text-[#111827] outline-none focus:border-[#2563EB]"
                        aria-label="Maximum price"
                    />
                </div>
                <input
                    type="range"
                    min={priceBounds[0]}
                    max={priceBounds[1] || 100}
                    step={(priceBounds[1] || 100) / 100}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="mt-4 w-full accent-[#2563EB]"
                    aria-label="Maximum price slider"
                />
            </FilterSection>

            <FilterSection title="Stock Status" onClear={selectedStock.size ? clearStock : undefined}>
                {stockOptions.map((s) => (
                    <Checkbox
                        key={s.id}
                        checked={selectedStock.has(s.id)}
                        onChange={() => toggleStock(s.id)}
                        label={s.label}
                    />
                ))}
            </FilterSection>

            <FilterSection title="Availability">
                <Checkbox
                    checked={onSale}
                    onChange={() => setOnSale(!onSale)}
                    label="On Sale"
                />
            </FilterSection>

            <div className="pt-5">
                <p className="text-xs text-[#9CA3AF]">{productCount} product{productCount === 1 ? '' : 's'} match</p>
            </div>
        </>
    );
};

const ShopPage = () => {
    const { products, loading, error } = useProducts();
    const [params, setParams] = useSearchParams();
    const [categories, setCategories] = useState([]);

    const [query, setQuery] = useState(params.get('q') || '');
    const [sort, setSort] = useState('latest');
    const [perPage, setPerPage] = useState(20);
    const [page, setPage] = useState(1);

    const [selectedCats, setSelectedCats] = useState(new Set());
    const [selectedBrands, setSelectedBrands] = useState(new Set());
    const [selectedStock, setSelectedStock] = useState(new Set());
    const [onSale, setOnSale] = useState(false);
    const [priceBounds, setPriceBounds] = useState([0, 100]);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [mobileFilters, setMobileFilters] = useState(false);

    useEffect(() => {
        let active = true;
        getCategories()
            .then((res) => {
                if (active) setCategories(res.categories || []);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    // Sync search param
    useEffect(() => {
        const q = params.get('q') || '';
        setQuery(q);
    }, [params]);

    // Compute bounds once products load
    useEffect(() => {
        if (products.length === 0) return;
        const prices = products.map(priceOf);
        const max = Math.max(...prices, 100);
        const upper = Math.ceil(max / 100) * 100;
        setPriceBounds([0, upper]);
        setPriceRange([0, upper]);
    }, [products]);

    const brands = useMemo(() => {
        const map = new Map();
        products.forEach((p) => {
            const b = (p.subtitle || '').trim();
            if (!b) return;
            map.set(b, (map.get(b) || 0) + 1);
        });
        return Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([label, count]) => ({ label, count }));
    }, [products]);

    const stockOptions = useMemo(
        () => [
            { id: 'in', label: 'In Stock' },
            { id: 'low', label: 'Low Stock' },
            { id: 'out', label: 'Out of Stock' },
        ],
        [],
    );

    const toggle = (set, setSet) => (id) => {
        setSet((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
        setPage(1);
    };

    const filtered = useMemo(() => {
        let list = [...products];
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter((p) => `${p.title} ${p.subtitle || ''}`.toLowerCase().includes(q));
        }
        if (selectedCats.size > 0) {
            list = list.filter((p) => (p.collections || []).some((c) => selectedCats.has(c.collection_id)));
        }
        if (selectedBrands.size > 0) {
            list = list.filter((p) => selectedBrands.has((p.subtitle || '').trim()));
        }
        if (selectedStock.size > 0) {
            list = list.filter((p) => selectedStock.has(stockState(p)));
        }
        if (onSale) list = list.filter(isOnSale);
        if (priceRange[1] > 0) list = list.filter((p) => priceOf(p) <= priceRange[1]);
        if (priceRange[0] > 0) list = list.filter((p) => priceOf(p) >= priceRange[0]);

        if (sort === 'low') list.sort((a, b) => priceOf(a) - priceOf(b));
        else if (sort === 'high') list.sort((a, b) => priceOf(b) - priceOf(a));
        else if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
        else if (sort === 'popular') list.sort((a, b) => (a.order || 0) - (b.order || 0));
        return list;
    }, [products, query, selectedCats, selectedBrands, selectedStock, onSale, priceRange, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const safePage = Math.min(page, totalPages);
    const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

    const activeFilterCount =
        selectedCats.size + selectedBrands.size + selectedStock.size + (onSale ? 1 : 0) +
        (priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1] ? 1 : 0);

    const clearAll = () => {
        setSelectedCats(new Set());
        setSelectedBrands(new Set());
        setSelectedStock(new Set());
        setOnSale(false);
        setPriceRange([priceBounds[0], priceBounds[1]]);
        setQuery('');
        setParams({});
        setPage(1);
    };

    const filterState = {
        categories,
        selectedCats,
        toggleCat: toggle(selectedCats, setSelectedCats),
        clearCats: () => { setSelectedCats(new Set()); setPage(1); },
        brands,
        selectedBrands,
        toggleBrand: toggle(selectedBrands, setSelectedBrands),
        clearBrands: () => { setSelectedBrands(new Set()); setPage(1); },
        priceBounds,
        priceRange,
        setPriceRange: (v) => { setPriceRange(v); setPage(1); },
        clearPrice: () => { setPriceRange([priceBounds[0], priceBounds[1]]); setPage(1); },
        stockOptions,
        selectedStock,
        toggleStock: toggle(selectedStock, setSelectedStock),
        clearStock: () => { setSelectedStock(new Set()); setPage(1); },
        onSale,
        setOnSale: (v) => { setOnSale(v); setPage(1); },
        productCount: filtered.length,
    };

    const pageNumbers = useMemo(() => {
        const nums = [];
        const start = Math.max(1, safePage - 2);
        const end = Math.min(totalPages, safePage + 2);
        for (let i = start; i <= end; i++) nums.push(i);
        return nums;
    }, [safePage, totalPages]);

    return (
        <>
            <Helmet>
                <title>Shop Tech & CCTV Online in Pakistan | Sablylo.store</title>
                <meta
                    name="description"
                    content="Browse CCTV cameras, mobile LCD and OLED panels, AirPods, laptop upgrades and smart electronics with COD, JazzCash and EasyPaisa payment across Pakistan."
                />
            </Helmet>

            {/* Page header */}
            <section className="border-b border-gray-200 bg-[#FAFBFC]">
                <div className="mx-auto max-w-[90rem] px-5 py-10 lg:px-8">
                    <nav className="flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF]" aria-label="Breadcrumb">
                        <Link to="/" className="transition hover:text-[#2563EB]">Home</Link>
                        <ChevronRight size={13} />
                        <span className="text-[#6B7280]">Shop</span>
                    </nav>
                    <h1 className="mt-4 text-[28px] font-bold tracking-tight text-[#111827] md:text-[40px]">Shop All Products</h1>
                    <p className="mt-2 max-w-2xl text-sm text-[#6B7280] md:text-base">
                        Security systems, mobile repair parts, audio gear and laptop upgrades — dispatched nationwide.
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-[90rem] px-5 py-8 lg:px-8">
                {/* Search bar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setParams(e.target.value ? { q: e.target.value } : {});
                                setPage(1);
                            }}
                            placeholder="Search products, brands, models…"
                            className="min-h-[48px] w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#2563EB]"
                        />
                    </div>
                    <button
                        onClick={() => setMobileFilters(true)}
                        className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-[#111827] transition hover:border-[#2563EB] lg:hidden"
                    >
                        <Filter size={16} /> Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                    </button>
                </div>

                <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
                    {/* Desktop sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-[90px] rounded-xl border border-gray-200 bg-[#F9FAFB] p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                                    <SlidersHorizontal size={16} /> Filters
                                </span>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearAll} className="text-xs font-medium text-[#2563EB] transition hover:text-[#1D4ED8]">
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <FiltersBody state={filterState} />
                        </div>
                    </aside>

                    {/* Main */}
                    <div>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
                            <p className="text-sm text-[#6B7280]">
                                {loading ? 'Loading…' : `Showing ${filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}–${Math.min(safePage * perPage, filtered.length)} of ${filtered.length} products`}
                            </p>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                                    Sort
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="min-h-[40px] rounded-md border border-gray-300 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#2563EB]"
                                    >
                                        {SORTS.map((s) => (
                                            <option key={s.id} value={s.id}>{s.label}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                                    Show
                                    <select
                                        value={perPage}
                                        onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                                        className="min-h-[40px] rounded-md border border-gray-300 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#2563EB]"
                                    >
                                        {PER_PAGE.map((n) => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>

                        {loading || error || paged.length === 0 ? (
                            <ProductsState loading={loading} error={error} empty={paged.length === 0} />
                        ) : (
                            <ProductGrid products={paged} columns="lg:grid-cols-3 xl:grid-cols-4" />
                        )}

                        {/* Pagination */}
                        {filtered.length > 0 && (
                            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
                                <p className="text-xs text-[#9CA3AF]">
                                    Page {safePage} of {totalPages}
                                </p>
                                <nav className="flex items-center gap-1" aria-label="Pagination">
                                    <button
                                        onClick={() => setPage(safePage - 1)}
                                        disabled={safePage <= 1}
                                        className="flex h-9 items-center rounded-md border border-gray-300 px-3 text-sm font-medium text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>
                                    {pageNumbers.map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={`h-9 w-9 rounded-md text-sm font-semibold transition ${
                                                n === safePage
                                                    ? 'bg-[#2563EB] text-white'
                                                    : 'border border-gray-300 text-[#374151] hover:border-[#2563EB] hover:text-[#2563EB]'
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage(safePage + 1)}
                                        disabled={safePage >= totalPages}
                                        className="flex h-9 items-center rounded-md border border-gray-300 px-3 text-sm font-medium text-[#374151] transition hover:border-[#2563EB] hover:text-[#2563EB] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile filters drawer */}
            {mobileFilters && (
                <div className="fixed inset-0 z-[90] lg:hidden">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto bg-white p-5 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-base font-semibold text-[#111827]">
                                <Filter size={18} /> Filters
                            </span>
                            <button onClick={() => setMobileFilters(false)} aria-label="Close filters" className="rounded-md p-2 text-[#6B7280] hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </div>
                        {activeFilterCount > 0 && (
                            <button onClick={clearAll} className="mb-3 text-xs font-medium text-[#2563EB]">Clear All ({activeFilterCount})</button>
                        )}
                        <FiltersBody state={filterState} />
                        <button
                            onClick={() => setMobileFilters(false)}
                            className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#2563EB] text-sm font-semibold text-white"
                        >
                            Show {filtered.length} results
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShopPage;
