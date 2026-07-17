import pool from "../config/db.js";

export const getCustomers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";

    const role = req.query.role || "all";

    const offset = (page - 1) * limit;

    let queryParams = [`%${search}%`];

    let roleFilter = "";

    if (role !== "all") {
      roleFilter = `
        AND role=$2
      `;

      queryParams.push(role);
    }

    const customers = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        avatar,
        role,
        created_at

      FROM users

      WHERE
        (
          name ILIKE $1
          OR email ILIKE $1
        )

      ${roleFilter}

      ORDER BY created_at DESC

      LIMIT $${queryParams.length + 1}

      OFFSET $${queryParams.length + 2}

      `,
      [...queryParams, limit, offset],
    );

    const total = await pool.query(
      `
      SELECT COUNT(*)

      FROM users

      WHERE
        (
          name ILIKE $1
          OR email ILIKE $1
        )

      ${roleFilter}

      `,
      queryParams,
    );

    res.json({
      users: customers.rows,

      total: Number(total.rows[0].count),

      page,

      pages: Math.ceil(Number(total.rows[0].count) / limit),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "customer"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await pool.query(
      `
      UPDATE users
      SET
        role=$1,
        updated_at=NOW()
      WHERE id=$2
      RETURNING *
      `,
      [role, id],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Role updated successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own account.",
      });
    }

    const deleted = await pool.query(
      `
      DELETE FROM users
      WHERE id=$1
      RETURNING *
      `,
      [id],
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
