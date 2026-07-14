import { Link, useNavigate } from "react-router-dom";
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
    <nav className="sticky top-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="
            flex
            items-center
            justify-between
            rounded-full
            px-8
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
              text-2xl
              font-bold
              text-indigo-600
            "
          >
            ShopVerse
          </Link>

          {/* Links */}

          <div
            className="
              flex
              items-center
              gap-7
            "
          >
            <Link
              to="/"
              className="
                text-gray-700
                hover:text-indigo-600
                transition
              "
            >
              Home
            </Link>

            <Link
              to="/products"
              className="
                text-gray-700
                hover:text-indigo-600
                transition
              "
            >
              Products
            </Link>

            {user && (
              <>
                <Link
                  to="/cart"
                  className="
                    text-gray-700
                    hover:text-indigo-600
                    transition
                  "
                >
                  Cart
                </Link>

                <Link
                  to="/order"
                  className="
                    text-gray-700
                    hover:text-indigo-600
                    transition
                  "
                >
                  Orders
                </Link>

                <Link
                  to="/wishlist"
                  className="
                    text-gray-700
                    hover:text-indigo-600
                    transition
                  "
                >
                  Wishlist
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin/products"
                className="
                  text-purple-600
                  font-medium
                "
              >
                Admin
              </Link>
            )}
          </div>

          {/* Profile */}

          <DropdownMenu>
            <DropdownMenuTrigger>
              {user ? (
                <div
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
                    className="
        w-full
        h-full
        object-cover
      "
                  />
                </div>
              ) : (
                <Link
                  to="/login"
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
                </Link>
              )}
            </DropdownMenuTrigger>

            {user && (
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>

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
                </DropdownMenuGroup>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navi;
