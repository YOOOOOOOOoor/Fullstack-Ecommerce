import pool from "../config/db.js";

// Dashboard overview cards
export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await pool.query(`

    SELECT

    (SELECT COUNT(*) 
     FROM products) 
     AS total_products,


    (SELECT COUNT(*) 
     FROM users
     WHERE role='customer')
     AS total_customers,


    (SELECT COUNT(*)
     FROM orders)
     AS total_orders,


    (SELECT COUNT(*)
     FROM orders
     WHERE payment_status='successful')
     AS paid_orders,


    (SELECT COUNT(*)
     FROM orders
     WHERE order_status='awaiting_payment')
     AS pending_orders,


    (SELECT COUNT(*)
     FROM products
     WHERE stock <= 5)
     AS low_stock_products,


    (SELECT COUNT(*)
     FROM products
     WHERE stock = 0)
     AS out_of_stock_products

    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Low stock products list
export const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await pool.query(`

    SELECT

    id,
    title,
    stock,
    price,
    image_url


    FROM products


    WHERE stock <= 5


    ORDER BY stock ASC


    LIMIT 10;

    `);

    res.json(products.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Recent orders
export const getRecentOrders = async (req, res, next) => {
  try {
    const orders = await pool.query(`

    SELECT

    o.id,
    o.total_price,
    o.payment_status,
    o.order_status,
    o.created_at,


    u.name,
    u.email


    FROM orders o


    JOIN users u

    ON o.user_id=u.id


    ORDER BY o.created_at DESC


    LIMIT 10;


    `);

    res.json(orders.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Revenue cards
export const getRevenue = async (req, res, next) => {
  try {
    const revenue = await pool.query(`

    SELECT


    COALESCE(
        SUM(total_price)
        FILTER(
          WHERE payment_status='successful'
        ),
        0
    ) AS total_revenue,


    COALESCE(
        SUM(total_price)
        FILTER(
          WHERE payment_status='successful'
          AND created_at >= CURRENT_DATE
        ),
        0
    ) AS today,


    COALESCE(
        SUM(total_price)
        FILTER(
          WHERE payment_status='successful'
          AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        ),
        0
    ) AS this_week,


    COALESCE(
        SUM(total_price)
        FILTER(
          WHERE payment_status='successful'
          AND created_at >= CURRENT_DATE - INTERVAL '1 month'
        ),
        0
    ) AS this_month,


    COALESCE(
        SUM(total_price)
        FILTER(
          WHERE payment_status='successful'
          AND created_at >= CURRENT_DATE - INTERVAL '1 year'
        ),
        0
    ) AS this_year


    FROM orders

    `);

    res.json(revenue.rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getRevenueChart = async (req, res, next) => {
  try {
    const chart = await pool.query(`
 
 SELECT

 TO_CHAR(
   DATE(created_at),
   'Mon DD'
 ) AS date,


 COALESCE(
   SUM(total_price),
   0
 ) AS revenue


 FROM orders


 WHERE payment_status='successful'


 AND created_at >= CURRENT_DATE - INTERVAL '30 days'


 GROUP BY DATE(created_at)


 ORDER BY DATE(created_at);


 `);

    res.json(
      chart.rows.map((item) => ({
        date: item.date,
        revenue: Number(item.revenue),
      })),
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
