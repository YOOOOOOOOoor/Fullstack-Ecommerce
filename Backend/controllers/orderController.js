import pool from "../config/db.js";

export const getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const orders = await pool.query(
      `
     SELECT
    o.id,
    o.total_price,
    o.payment_status,
    o.order_status,
    o.created_at,

    p.title,
    p.image_url,

    (
        SELECT COUNT(*)
        FROM order_items
        WHERE order_id = o.id
    ) AS item_count

FROM orders o

JOIN order_items oi
ON oi.id = (
    SELECT MIN(id)
    FROM order_items
    WHERE order_id = o.id
)

JOIN products p
ON p.id = oi.product_id

WHERE o.user_id = $1

ORDER BY o.created_at DESC;
      `,
      [user_id],
    );

    const formattedOrders = orders.rows.map((order) => ({
      ...order,
      display_title:
        Number(order.item_count) > 1
          ? `${order.title} +${Number(order.item_count) - 1} more item${Number(order.item_count) - 1 > 1 ? "s" : ""}`
          : order.title,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//single order
export const getOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const order_id = req.params.id;

    const order = await pool.query(
      `
      SELECT
        o.id,
        o.total_price,
        o.payment_status,
        o.order_status,
        o.payment_method,
        o.created_at,

        p.id AS product_id,
        p.title,
        p.image_url,

        oi.quantity,
        oi.price_at_purchase

      FROM orders o

      JOIN order_items oi
        ON o.id = oi.order_id

      JOIN products p
        ON oi.product_id = p.id

      WHERE o.user_id = $1
      AND o.id = $2

      ORDER BY oi.id;
      `,
      [user_id, order_id],
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const first = order.rows[0];

    res.status(200).json({
      id: first.id,
      total_price: first.total_price,
      payment_status: first.payment_status,
      order_status: first.order_status,
      payment_method: first.payment_method,
      created_at: first.created_at,

      items: order.rows.map((item) => ({
        product_id: item.product_id,
        title: item.title,
        image_url: item.image_url,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      })),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//admin order_processing
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_status } = req.body;
    const order_id = req.params.id;
    const allowedStatuses = [
      "awaiting_payment",
      "processing",
      "shipping",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(order_status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }
    const result = await pool.query(
      `
  UPDATE orders
  SET order_status = $2
  WHERE id = $1
  RETURNING id
  `,
      [order_id, order_status],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json({ message: "Order changed  successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//admin get all
export const getOrdersAdmin = async (req, res) => {
  try {
    const user_id = req.user.id;

    const orders = await pool.query(`
SELECT
    o.id,
    o.total_price,
    o.payment_status,
    o.order_status,
    o.created_at,

    u.name,
    u.email,

    p.title,
    p.image_url,

    (
        SELECT COUNT(*)
        FROM order_items
        WHERE order_id = o.id
    ) AS item_count

FROM orders o

JOIN users u
ON o.user_id = u.id

JOIN order_items oi
ON oi.id = (
    SELECT MIN(id)
    FROM order_items
    WHERE order_id = o.id
)

JOIN products p
ON p.id = oi.product_id

ORDER BY o.created_at DESC;
`);

    const formattedOrders = orders.rows.map((order) => ({
      ...order,
      display_title:
        Number(order.item_count) > 1
          ? `${order.title} +${Number(order.item_count) - 1} more item${Number(order.item_count) - 1 > 1 ? "s" : ""}`
          : order.title,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getOrderAdmin = async (req, res) => {
  try {
    const user_id = req.user.id;
    const order_id = req.params.id;

    const order = await pool.query(
      `
      SELECT
    o.id,
    o.total_price,
    o.payment_status,
    o.order_status,
    o.payment_method,
    o.created_at,

    u.name,
    u.email,

    p.id AS product_id,
    p.title,
    p.image_url,

    oi.quantity,
    oi.price_at_purchase

FROM orders o

JOIN users u
ON o.user_id = u.id

JOIN order_items oi
ON o.id = oi.order_id

JOIN products p
ON oi.product_id = p.id

WHERE o.id = $1

ORDER BY oi.id;
      `,
      [order_id],
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const first = order.rows[0];

    res.status(200).json({
      id: first.id,
      total_price: first.total_price,
      payment_status: first.payment_status,
      order_status: first.order_status,
      payment_method: first.payment_method,
      created_at: first.created_at,

      items: order.rows.map((item) => ({
        product_id: item.product_id,
        title: item.title,
        image_url: item.image_url,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      })),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
