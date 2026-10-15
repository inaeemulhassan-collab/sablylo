import { useEffect, useState } from 'react';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getProducts();
                const list = res?.products ?? [];
                if (list.length === 0) {
                    if (active) setProducts([]);
                    return;
                }
                const quantities = await getProductQuantities({
                    fields: 'inventory_quantity',
                    product_ids: list.map((p) => p.id),
                });
                const map = new Map();
                (quantities?.variants ?? []).forEach((v) => map.set(v.id, v.inventory_quantity));
                const merged = list.map((p) => ({
                    ...p,
                    variants: (p.variants ?? []).map((v) => ({
                        ...v,
                        inventory_quantity: map.get(v.id) ?? v.inventory_quantity,
                    })),
                }));
                if (active) setProducts(merged);
            } catch (err) {
                if (active) setError(err.message || 'Failed to load products');
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    return { products, loading, error };
}

export default useProducts;
