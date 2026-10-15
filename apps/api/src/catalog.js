import { z } from 'zod';

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(120).optional()
}).strict();

export function createCatalogRouter(express, pool) {
  const router = express.Router();

  router.get('/categories', async (_req, res, next) => {
    try {
      const [rows] = await pool.execute('SELECT id, name, slug, parent_id FROM categories ORDER BY name LIMIT 500');
      res.json({ categories: rows });
    } catch (e) { next(e); }
  });

  router.get('/products', async (req, res, next) => {
    try {
      const query = listQuerySchema.parse(req.query);
      const conditions = ["p.status = 'published'"];
      const params = [];
      if (query.q) {
        conditions.push('(p.title LIKE ? OR p.brand LIKE ? OR p.model LIKE ?)');
        const term = '%' + query.q.replace(/[\\%_]/g, '\\$&') + '%';
        params.push(term, term, term);
      }
      if (query.category) {
        conditions.push('EXISTS (SELECT 1 FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = p.id AND c.slug = ?)');
        params.push(query.category);
      }
      const where = conditions.join(' AND ');
      const [[countRow]] = await pool.execute('SELECT COUNT(*) AS count FROM products p WHERE ' + where, params);
      const offset = (query.page - 1) * query.limit;
      // mysql2 prepared statements require numeric bound values for LIMIT/OFFSET.
      const [rows] = await pool.execute(
        'SELECT p.id, p.title, p.slug, p.brand, p.model, p.description, p.specifications, p.created_at FROM products p WHERE ' + where +
        ' ORDER BY p.created_at DESC, p.id DESC LIMIT ? OFFSET ?',
        [...params, query.limit, offset]
      );
      res.json({ products: rows, pagination: { page: query.page, limit: query.limit, total: countRow.count } });
    } catch (e) { next(e); }
  });

  router.get('/products/:slug', async (req, res, next) => {
    try {
      const slug = z.string().min(1).max(180).parse(req.params.slug);
      const [rows] = await pool.execute(
        "SELECT id, title, slug, brand, model, description, specifications, created_at FROM products WHERE slug = ? AND status = 'published' LIMIT 1",
        [slug]
      );
      if (!rows.length) return res.status(404).json({ error: 'Product not found' });
      const [offers] = await pool.execute(
        "SELECT o.id, o.price, o.currency, o.url, o.checked_at, o.is_own_offer, s.name AS supplier FROM offers o JOIN suppliers s ON s.id=o.supplier_id WHERE o.product_id=? AND o.status='active' ORDER BY o.price ASC",
        [rows[0].id]
      );
      res.json({ product: rows[0], offers });
    } catch (e) { next(e); }
  });
  return router;
}
