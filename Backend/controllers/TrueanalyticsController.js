import pool from "../config/db.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const { range = "30" } = req.query;

    let dateFilter = "";

    if (range !== "all") {
      dateFilter = `AND o.created_at >= NOW() - INTERVAL '${parseInt(
        range,
      )} days'`;
    }

    // ======================
    // Summary Cards
    // ======================

    const summaryQuery = `
      SELECT
        COALESCE(SUM(o.total_price),0) AS revenue,
        COUNT(o.id) AS orders,
        COALESCE(AVG(o.total_price),0) AS average_order,
        COUNT(DISTINCT o.user_id) AS customers
      FROM orders o
      WHERE o.payment_status='successful'
      ${dateFilter}
    `;

    const summary = await pool.query(summaryQuery);

    // ======================
    // Revenue By Category
    // ======================

    const categoryQuery = `
      SELECT
        c.name,
        SUM(oi.quantity * oi.price_at_purchase) AS revenue
      FROM order_items oi
      JOIN orders o
        ON oi.order_id=o.id
      JOIN products p
        ON oi.product_id=p.id
      JOIN categories c
        ON p.category_id=c.id
      WHERE o.payment_status='successful'
      ${dateFilter}
      GROUP BY c.id,c.name
      ORDER BY revenue DESC
    `;

    const categories = await pool.query(categoryQuery);

    // ======================
    // Orders Frequency
    // ======================

    const ordersFrequencyQuery = `
      SELECT
        DATE(o.created_at) AS date,
        COUNT(*) AS orders
      FROM orders o
      WHERE o.payment_status='successful'
      ${dateFilter}
      GROUP BY DATE(o.created_at)
      ORDER BY DATE(o.created_at)
    `;

    const ordersFrequency = await pool.query(ordersFrequencyQuery);

    // ======================
    // Revenue Trend
    // ======================

    const revenueTrendQuery = `
      SELECT
        DATE(o.created_at) AS date,
        SUM(o.total_price) AS revenue
      FROM orders o
      WHERE o.payment_status='successful'
      ${dateFilter}
      GROUP BY DATE(o.created_at)
      ORDER BY DATE(o.created_at)
    `;

    const revenueTrend = await pool.query(revenueTrendQuery);

    // ======================
    // Best Selling Products
    // ======================

    const bestSellingQuery = `
      SELECT
        p.id,
        p.image_url,
        p.title,
        SUM(oi.quantity) AS sold,
        SUM(oi.quantity * oi.price_at_purchase) AS revenue
      FROM order_items oi
      JOIN orders o
        ON oi.order_id=o.id
      JOIN products p
        ON oi.product_id=p.id
      WHERE o.payment_status='successful'
      ${dateFilter}
      GROUP BY p.id,p.title
      ORDER BY sold DESC
      LIMIT 5
    `;

    const bestSellingProducts = await pool.query(bestSellingQuery);

    res.status(200).json({
      revenue: Number(summary.rows[0].revenue),
      orders: Number(summary.rows[0].orders),
      averageOrder: Number(summary.rows[0].average_order),
      customers: Number(summary.rows[0].customers),

      revenueByCategory: categories.rows,

      ordersFrequency: ordersFrequency.rows,

      revenueTrend: revenueTrend.rows,

      bestSellingProducts: bestSellingProducts.rows,
    });
  } catch (error) {
    next(error);
    res.status(500).json({
      message: "Failed to fetch analytics",
    });
  }
};
