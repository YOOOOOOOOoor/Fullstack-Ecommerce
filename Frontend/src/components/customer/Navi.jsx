// import React from "react";
import { Link } from "react-router-dom";
import API from "../../../API/api.js";
import { useNavigate } from "react-router-dom";

const Navi = ({ user, setUser }) => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <nav className="bg-gray-500 flex justify-between items-center p-4 gap-4">
      <div className=" flex justify-around p-4 gap-4  w-[20%]">
        <Link to="/" className="text-white ">
          Home
        </Link>
        <Link to="/products" className="text-white">
          Products Customer
        </Link>

        {user ? (
          <div className="flex gap-4">
            <button className="text-gray-300 bg-red-600" onClick={logout}>
              Logout
            </button>
            <Link to="/cart" className="text-white">
              Cart
            </Link>
            <Link to="/order" className="text-white">
              Orders
            </Link>
          </div>
        ) : (
          <div className="text-white">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
        {user && user.role === "admin" && (
          <Link to="/admin/products" className="text-white">
            Admin Dashboard
          </Link>
        )}
      </div>
      <div>
        <button>
          <img
            src={user?.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full bg-white"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navi;
