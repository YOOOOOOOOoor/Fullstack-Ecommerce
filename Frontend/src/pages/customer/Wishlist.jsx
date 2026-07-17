import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../API/api.js";
import { toast } from "sonner";

const Wishlist = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const addCarts = async (id, quantity) => {
    let product_id = id;

    if (quantity == null) {
      quantity = 1;
    }

    try {
      const res = await API.post("/cart", {
        product_id,
        quantity,
      });

      toast.success(res.data.message || "Product added to cart successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart.",
      );
    }
  };

  const remove = async (id) => {
    try {
      await API.delete(`/wishlist/${id}`);

      toast.success("Product removed from wishlist.");

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove product from wishlist.",
      );
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/wishlist/");

      setOrders(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load wishlist.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div
      className="
    min-h-screen
    bg-background
    px-4
    sm:px-6
    py-8
    sm:py-12
    "
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <div
            className="
          flex
          items-center
          gap-3
          "
          >
            <div>
              <h1
                className="
              text-3xl
              sm:text-4xl
              font-bold
              "
              >
                My Wishlist
              </h1>

              <p className="text-muted-foreground mt-1">
                Products you saved for later
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div
            className="
          bg-card
          border
          rounded-3xl
          shadow-sm
          p-10
          sm:p-16
          text-center
          "
          >
            <h2
              className="
            text-2xl
            font-bold
            mt-6
            "
            >
              Your wishlist is empty
            </h2>

            <p
              className="
            text-muted-foreground
            mt-3
            "
            >
              Save products you love and come back anytime.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="
            mt-8
            bg-primary
            text-primary-foreground
            px-8
            py-3
            rounded-xl
            font-semibold
            hover:opacity-90
            transition
            "
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div
            className="
          grid
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-6
          "
          >
            {orders.map((order) => (
              <div
                key={order.id}
                className="
              bg-card
              border
              rounded-3xl
              shadow-sm
              overflow-hidden
              hover:shadow-lg
              transition
              "
              >
                {/* Image */}

                <div
                  onClick={() => navigate(`/products/${order.product_id}`)}
                  className="
                cursor-pointer
                bg-secondary
                "
                >
                  <img
                    src={order.image_url}
                    alt={order.title}
                    className="
                  w-full
                  h-56
                  object-cover
                  "
                  />
                </div>

                {/* Content */}

                <div className="p-5">
                  <h2
                    className="
                  text-lg
                  font-bold
                  truncate
                  "
                  >
                    {order.title}
                  </h2>

                  <p
                    className="
                  text-sm
                  text-muted-foreground
                  mt-2
                  line-clamp-2
                  "
                  >
                    {order.description}
                  </p>

                  <div
                    className="
                  flex
                  justify-between
                  items-center
                  mt-4
                  "
                  >
                    <p
                      className="
                    text-xl
                    font-bold
                    "
                    >
                      {order.price} ETB
                    </p>

                    <span
                      className="
                    text-sm
                    text-green-600
                    font-medium
                    "
                    >
                      {order.stock} left
                    </span>
                  </div>

                  <div
                    className="
                  grid
                  grid-cols-2
                  gap-2
                  mt-5
                  "
                  >
                    <button
                      onClick={() => addCarts(order.product_id)}
                      className="
                    col-span-2
                    bg-primary
                    text-primary-foreground
                    py-2.5
                    rounded-xl
                    font-medium
                    hover:opacity-90
                    transition
                    "
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => navigate(`/products/${order.product_id}`)}
                      className="
                    border
                    py-2
                    rounded-xl
                    hover:bg-secondary
                    transition
                    "
                    >
                      View
                    </button>

                    <button
                      onClick={() => remove(order.product_id)}
                      className="
                    border
                    text-red-600
                    bg-red-50
                    py-2
                    rounded-xl
                    hover:bg-red-100
                    transition
                    "
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
