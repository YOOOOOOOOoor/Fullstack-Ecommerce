import dotenv from "dotenv";
import pool from "../config/db.js";
import axios from "axios";
dotenv.config();

export const TotalAmount = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const cart = await pool.query(
      `
      SELECT id
      FROM carts
      WHERE user_id = $1
      `,
      [user_id],
    );

    if (cart.rows.length === 0) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cart_id = cart.rows[0].id;

    const totalAmount = await pool.query(
      `
      SELECT COALESCE(SUM(products.price * cart_items.quantity), 0) AS total
      FROM cart_items
      JOIN products
        ON cart_items.product_id = products.id
      WHERE cart_items.cart_id = $1
      `,
      [cart_id],
    );

    res.status(200).json(totalAmount.rows[0]);
  } catch (error) {
    next(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
export const showCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    // Get user's cart
    const cart = await pool.query(
      `
      SELECT id
      FROM carts
      WHERE user_id = $1
      `,
      [user_id],
    );

    if (cart.rows.length === 0) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const cart_id = cart.rows[0].id;

    // Get cart items
    const cartItems = await pool.query(
      `
      SELECT
        cart_items.id,
        cart_items.quantity,
        products.stock,
        products.id AS product_id,
        products.title,
        products.description,
        products.price,
        products.image_url
      FROM cart_items
      JOIN products
        ON cart_items.product_id = products.id
      WHERE cart_items.cart_id = $1
      ORDER BY cart_items.id ASC
      `,
      [cart_id],
    );

    if (cartItems.rows.length === 0) {
      return res.status(404).json({
        message: "Cart is empty",
      });
    }

    res.status(200).json(cartItems.rows);
  } catch (error) {
    next(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const displayInfo = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const user = await pool.query(
      `
      SELECT
        name,
        email,
        phone
      FROM users
      WHERE id = $1
      `,
      [user_id],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user.rows[0]);
  } catch (error) {
    next(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//chapa payment
export const chapaPayment = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const { receiver_name, phone, city, sub_city, address, notes } = req.body;

    // Validate shipping information
    if (!receiver_name || !phone || !city || !sub_city || !address) {
      return res.status(400).json({
        message: "Please fill in all shipping information.",
      });
    }

    // 1. Get user information
    const user = await pool.query(
      `
      SELECT 
        name,
        email
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
      SELECT 
        COALESCE(
          SUM(products.price * cart_items.quantity),
          0
        ) AS total
      FROM cart_items
      JOIN products
        ON cart_items.product_id = products.id
      WHERE cart_items.cart_id=$1
      `,
      [cart_id],
    );

    const amount = total.rows[0].total;

    if (amount <= 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // 4. Save shipping address

    const savedAddress = await pool.query(
      `
      INSERT INTO addresses
      (
        user_id,
        receiver_name,
        phone,
        city,
        sub_city,
        address
      )
      VALUES
      ($1,$2,$3,$4,$5,$6)
      RETURNING id
      `,
      [user_id, receiver_name, phone, city, sub_city, address],
    );

    const address_id = savedAddress.rows[0].id;

    // 5. Create transaction reference

    const tx_ref = `order-${Date.now()}`;

    // 6. Create order

    const order = await pool.query(
      `
      INSERT INTO orders
      (
        user_id,
        address_id,
        payment_method,
        payment_status,
        order_status,
        total_price,
        notes,
        tx_ref,
        expires_at
      )
      VALUES
      (
        $1,
        $2,
        'chapa',
        'pending',
        'awaiting_payment',
        $3,
        $4,
        $5,
        NOW() + INTERVAL '30 minutes'
      )
      RETURNING id
      `,
      [user_id, address_id, amount, notes || null, tx_ref],
    );

    const order_id = order.rows[0].id;

    // 7. Create payment record

    await pool.query(
      `
      INSERT INTO payments
      (
        order_id,
        method,
        status,
        tx_ref
      )
      VALUES
      (
        $1,
        'chapa',
        'pending',
        $2
      )
      `,
      [order_id, tx_ref],
    );

    // 8. Initialize Chapa payment
    console.log({
      name,
      email,
      amount,
    });

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
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Payment initialization failed",
    });
  }
};
export const verifyPayment = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { tx_ref } = req.params;

    // 1. Verify payment with Chapa

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

    // Start database transaction

    await client.query("BEGIN");

    // 2. Get existing order

    const existingOrder = await client.query(
      `
      SELECT 
        id,
        payment_status,
        user_id
      FROM orders
      WHERE tx_ref=$1
      FOR UPDATE
      `,
      [tx_ref],
    );

    if (existingOrder.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Order not found",
      });
    }

    const orderData = existingOrder.rows[0];

    // Already completed

    if (orderData.payment_status === "successful") {
      await client.query("ROLLBACK");

      return res.json({
        success: true,
        message: "Payment already verified",
        order_id: orderData.id,
      });
    }

    // 3. Update order status

    const order = await client.query(
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

    const order_id = order.rows[0].id;

    // 4. Update payments table

    await client.query(
      `
      UPDATE payments
      SET
        status='successful',
        paid_at=NOW()
      WHERE tx_ref=$1
      `,
      [tx_ref],
    );

    // 5. Get user's cart

    const cart = await client.query(
      `
      SELECT id
      FROM carts
      WHERE user_id=$1
      `,
      [orderData.user_id],
    );

    if (cart.rows.length > 0) {
      const cart_id = cart.rows[0].id;

      // Get cart items

      const cartItems = await client.query(
        `
        SELECT
          cart_items.product_id,
          cart_items.quantity,
          products.price,
          products.stock
        FROM cart_items
        JOIN products
          ON cart_items.product_id = products.id
        WHERE cart_items.cart_id=$1
        FOR UPDATE
        `,
        [cart_id],
      );

      // 6. Create order items and decrease stock

      for (const item of cartItems.rows) {
        // Check stock before reducing

        if (item.stock < item.quantity) {
          throw new Error(`Not enough stock for product ${item.product_id}`);
        }

        // Save order item

        await client.query(
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
          [order_id, item.product_id, item.quantity, item.price],
        );

        // Reduce stock

        await client.query(
          `
          UPDATE products
          SET stock = stock - $1
          WHERE id=$2
          `,
          [item.quantity, item.product_id],
        );
      }

      // 7. Clear cart

      await client.query(
        `
        DELETE FROM cart_items
        WHERE cart_id=$1
        `,
        [cart_id],
      );
    }

    // Finish transaction

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Payment verified",
      order_id,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  } finally {
    client.release();
  }
};
