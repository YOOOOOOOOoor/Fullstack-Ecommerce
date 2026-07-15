import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../../API/api.js";

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Menu, X } from "lucide-react";

const Navi = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="
          flex
          items-center
          justify-between
          rounded-full
          px-5
          sm:px-8
          py-3
          bg-white
          shadow-md
          border
          border-gray-200
          "
        >
          {/* Brand */}
          <Link
            to="/"
            className="
            text-xl
            sm:text-2xl
            font-bold
            text-indigo-600
            "
          >
            EthioShopping
          </Link>

          {/* Desktop Links */}
          <div
            className="
            hidden
            md:flex
            items-center
            gap-7
            "
          >
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Products
            </Link>

            {user && (
              <>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Cart
                </Link>

                <Link
                  to="/order"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Orders
                </Link>

                <Link
                  to="/wishlist"
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Wishlist
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <Link to="/admin/" className="text-purple-600 font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden mr-3" onClick={() => setOpen(!open)}>
            {open ? <X size={25} /> : <Menu size={25} />}
          </button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {user ? (
                <button
                  className="
                  w-10
                  h-10
                  rounded-full
                  overflow-hidden
                  border
                  border-gray-200
                  hover:ring-2
                  hover:ring-indigo-500
                  transition
                  cursor-pointer
                  "
                >
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="
                  bg-indigo-600
                  text-white
                  px-4
                  py-2
                  rounded-full
                  hover:bg-indigo-700
                  transition
                  "
                >
                  Login
                </button>
              )}
            </DropdownMenuTrigger>

            {user && (
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/order")}
                  >
                    Orders
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/wishlist")}
                  >
                    Wishlist
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/cart")}
                  >
                    Cart
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={logout}
                  className="
                  cursor-pointer
                  text-red-500
                  "
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>

        {/* Mobile Dropdown Links */}
        {open && (
          <div
            className="
            md:hidden
            mt-3
            bg-white
            rounded-2xl
            shadow-md
            border
            border-gray-200
            p-5
            flex
            flex-col
            gap-4
            "
          >
            <Link
              onClick={closeMenu}
              to="/"
              className="text-gray-700 hover:text-indigo-600"
            >
              Home
            </Link>

            <Link
              onClick={closeMenu}
              to="/products"
              className="text-gray-700 hover:text-indigo-600"
            >
              Products
            </Link>

            {user && (
              <>
                <Link
                  onClick={closeMenu}
                  to="/cart"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Cart
                </Link>

                <Link
                  onClick={closeMenu}
                  to="/order"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Orders
                </Link>

                <Link
                  onClick={closeMenu}
                  to="/wishlist"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Wishlist
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <Link
                onClick={closeMenu}
                to="/admin/"
                className="text-purple-600 font-medium"
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navi;
