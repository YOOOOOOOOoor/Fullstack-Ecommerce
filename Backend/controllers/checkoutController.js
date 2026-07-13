import dotenv from "dotenv";
import pool from "../config/db.js";
import axios from "axios";
dotenv.config();

export const TotalAmount = async (req, res) => {
  try {
    const user_id = req.user.id;

    const cart = await pool.query(
      `SELECT id FROM carts
        WHERE user_id = $1`,
      [user_id],
    );

    if (cart.rows.length === 0) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }
    const cart_id = cart.rows[0].id;

    const totalAmount = await pool.query(
      `select COALESCE(SUM(price * quantity), 0) as total from cart_items join products on cart_items.product_id=products.id where cart_id=$1`,
      [cart_id],
    );

    res.status(200).json(totalAmount.rows[0]);
  } catch (error) {
    console.error(error);
  }
};
export const showCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    // 1. Get user's cart id
    const cart = await pool.query(
      `SELECT id FROM carts
        WHERE user_id = $1`,
      [user_id],
    );

    if (cart.rows.length === 0) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cart_id = cart.rows[0].id;

    // 2. Get cart items
    const cartItems = await pool.query(
      `SELECT cart_items.id, cart_items.quantity,products.stock,products.id AS product_id,   products.title, products.description, products.price, products.image_url
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        WHERE cart_items.cart_id = $1 ORDER BY cart_items.id ASC`,
      [cart_id],
    );
    if (cartItems.rows.length === 0) {
      return res.status(404).json({
        message: "Cart is empty",
      });
    }

    res.status(200).json(cartItems.rows);
  } catch (error) {
    console.error(error);
  }
};

export const displayInfo = async (req, res) => {
  try {
    const user_id = req.user.id;

    const user = await pool.query(
      `
            select name,email from users where id=$1`,
      [user_id],
    );
    res.status(200).json(user.rows[0]);
  } catch (error) {
    console.error(error);
  }
};

//chapa payment
export const chapaPayment = async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1. Get user information
    const user = await pool.query(
      `
      SELECT name, email
      FROM users
      WHERE id=$1
      `,
      [user_id],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, email } = user.rows[0];

    // 2. Get cart id
    const cart = await pool.query(
      `
      SELECT id
      FROM carts
      WHERE user_id=$1
      `,
      [user_id],
    );

    if (cart.rows.length === 0) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cart_id = cart.rows[0].id;

    // 3. Calculate total
    const total = await pool.query(
      `
      SELECT COALESCE(SUM(products.price * cart_items.quantity),0) AS total
      FROM cart_items
      JOIN products
      ON cart_items.product_id = products.id
      WHERE cart_id=$1
      `,
      [cart_id],
    );

    const amount = total.rows[0].total;

    if (amount <= 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // 4. Create transaction reference
    const tx_ref = `order-${Date.now()}`;

    const order = await pool.query(
      `
INSERT INTO orders
(
 user_id,
 payment_method,
 payment_status,
 order_status,
 total_price,
 tx_ref
)
VALUES
(
 $1,
 'chapa',
 'pending',
 'awaiting_payment',
 $2,
 $3
)
RETURNING id
`,
      [user_id, amount, tx_ref],
    );

    // 5. Initialize Chapa
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        email,
        first_name: name,
        tx_ref,

        return_url: `http://localhost:5173/success?tx_ref=${tx_ref}`,

        customization: {
          title: "My Store",
          description: "Order Payment",
        },

        meta: {
          hide_receipt: "true",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "Payment initialization failed",
    });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    // 1. Verify with Chapa
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      },
    );

    const payment = response.data;

    if (payment.status !== "success") {
      return res.json({
        success: false,
        message: "Payment not completed",
      });
    }

    // 2. Update order
    // 2. Check current order status first
    const existingOrder = await pool.query(
      `
SELECT id, payment_status, user_id
FROM orders
WHERE tx_ref=$1
`,
      [tx_ref],
    );

    if (existingOrder.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const orderData = existingOrder.rows[0];

    // Already processed
    if (orderData.payment_status === "successful") {
      return res.json({
        success: true,
        message: "Payment already verified",
        order_id: orderData.id,
      });
    }
    const order = await pool.query(
      `
UPDATE orders
SET
 payment_status='successful',
 order_status='processing'
WHERE tx_ref=$1
RETURNING id
`,
      [tx_ref],
    );

    if (order.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // 3. Clear user's cart

    // get user from order
    const user = await pool.query(
      `
      SELECT user_id
      FROM orders
      WHERE tx_ref=$1
      `,
      [tx_ref],
    );

    const user_id = user.rows[0].user_id;

    const cart = await pool.query(
      `
      SELECT id
      FROM carts
      WHERE user_id=$1
      `,
      [user_id],
    );

    if (cart.rows.length > 0) {
      if (cart.rows.length > 0) {
        const cartItems = await pool.query(
          `
    SELECT 
      cart_items.product_id,
      cart_items.quantity,
      products.price
    FROM cart_items
    JOIN products
    ON cart_items.product_id = products.id
    WHERE cart_id=$1
    `,
          [cart.rows[0].id],
        );

        // Move cart items into order_items
        for (const item of cartItems.rows) {
          await pool.query(
            `
      INSERT INTO order_items
      (
        order_id,
        product_id,
        quantity,
        price_at_purchase
      )
      VALUES
      ($1,$2,$3,$4)
      `,
            [order.rows[0].id, item.product_id, item.quantity, item.price],
          );
        }

        // Clear cart after saving order history
        await pool.query(
          `
    DELETE FROM cart_items
    WHERE cart_id=$1
    `,
          [cart.rows[0].id],
        );
      }
    }

    res.json({
      success: true,
      message: "Payment verified",
      order_id: order.rows[0].id,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};
