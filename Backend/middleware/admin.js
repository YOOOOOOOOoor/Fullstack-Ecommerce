import dotenv from "dotenv";
dotenv.config();

const admin = async (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default admin;
