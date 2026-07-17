import API from "../../../API/api.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ethiopiaLocations = {
  "Addis Ababa": [
    "Bole",
    "Yeka",
    "Arada",
    "Kirkos",
    "Lideta",
    "Nifas Silk-Lafto",
    "Kolfe Keranio",
    "Akaki Kaliti",
    "Gullele",
  ],

  "Dire Dawa": ["Dire Dawa"],

  Adama: ["Adama"],

  Hawassa: ["Tabor", "Menaharia", "Bahil Adarash"],

  "Bahir Dar": ["Bahir Dar"],

  Mekelle: ["Mekelle"],
};

const CheckoutPage = () => {
  const [cartAmount, setCartAmount] = useState([]);

  const [totalAmount, setTotalAmount] = useState(0);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    receiver_name: "",

    email: "",

    phone: "",

    city: "",

    sub_city: "",

    address: "",
  });

  // =========================
  // PAYMENT
  // =========================

  const handlePayment = async () => {
    try {
      if (
        !user.receiver_name ||
        !user.email ||
        !user.phone ||
        !user.city ||
        !user.sub_city ||
        !user.address
      ) {
        toast.error("Please fill in all shipping information.");

        return;
      }

      setLoading(true);

      const res = await API.post("/checkout/chapa", {
        receiver_name: user.receiver_name,

        email: user.email,

        phone: user.phone,

        city: user.city,

        sub_city: user.sub_city,

        address: user.address,
      });

      window.location.href = res.data.data.checkout_url;
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Payment failed.");

      setLoading(false);
    }
  };

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carts = await API.get("/checkout/cart");

        const total = await API.get("/checkout/total");

        const info = await API.get("/checkout/info");

        setUser({
          receiver_name: info.data.name || "",

          email: info.data.email || "",

          phone: info.data.phone || "",

          city: "",

          sub_city: "",

          address: "",
        });

        setCartAmount(carts.data);

        setTotalAmount(Number(total.data.total));
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchData();
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
        {/* HEADER */}

        <div className="mb-10">
          <h1
            className="
          text-3xl
          sm:text-4xl
          font-bold
          "
          >
            Checkout
          </h1>

          <p className="text-muted-foreground mt-2">
            Complete your information and place your order securely.
          </p>
        </div>

        <div
          className="
        grid
        lg:grid-cols-3
        gap-8
        "
        >
          {/* CHECKOUT FORM */}

          <div
            className="
          lg:col-span-2
          bg-card
          rounded-3xl
          border
          shadow-sm
          p-6
          sm:p-8
          "
          >
            <div
              className="
            flex
            items-center
            gap-3
            mb-8
            "
            >
              <div
                className="
              w-11
              h-11
              rounded-xl
              bg-emerald-100
              text-emerald-700
              flex
              items-center
              justify-center
              "
              >
                ✓
              </div>

              <div>
                <h2 className="text-xl font-bold">Delivery Information</h2>

                <p className="text-sm text-muted-foreground">
                  Enter your shipping details
                </p>
              </div>
            </div>
            <div
              className="
            grid
            sm:grid-cols-2
            gap-5
            "
            >
              {/* RECEIVER NAME */}

              <div>
                <label className="text-sm font-medium">Receiver Name</label>

                <input
                  type="text"
                  value={user.receiver_name}
                  onChange={(e) =>
                    setUser({
                      ...user,

                      receiver_name: e.target.value,
                    })
                  }
                  placeholder="Full name"
                  className="
                mt-2
                w-full
                rounded-xl
                border
                bg-background
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-primary
                "
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="text-sm font-medium">Email</label>

                <input
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({
                      ...user,

                      email: e.target.value,
                    })
                  }
                  placeholder="Email address"
                  className="
                mt-2
                w-full
                rounded-xl
                border
                bg-background
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-primary
                "
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="text-sm font-medium">Phone Number</label>

                <input
                  type="text"
                  value={user.phone}
                  onChange={(e) =>
                    setUser({
                      ...user,

                      phone: e.target.value,
                    })
                  }
                  placeholder="09xxxxxxxx"
                  className="
                mt-2
                w-full
                rounded-xl
                border
                bg-background
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-primary
                "
                />
              </div>

              {/* CITY */}

              <div>
                <label className="text-sm font-medium">City</label>

                <select
                  value={user.city}
                  onChange={(e) =>
                    setUser({
                      ...user,

                      city: e.target.value,

                      sub_city: "",
                    })
                  }
                  className="
                mt-2
                w-full
                rounded-xl
                border
                bg-background
                px-4
                py-3
                outline-none
                "
                >
                  <option value="">Select City</option>

                  {Object.keys(ethiopiaLocations).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB CITY */}

              <div>
                <label className="text-sm font-medium">Sub City</label>

                <select
                  value={user.sub_city}
                  disabled={!user.city}
                  onChange={(e) =>
                    setUser({
                      ...user,

                      sub_city: e.target.value,
                    })
                  }
                  className="
                mt-2
                w-full
                rounded-xl
                border
                bg-background
                px-4
                py-3
                outline-none
                disabled:opacity-50
                "
                >
                  <option value="">Select Sub City</option>

                  {ethiopiaLocations[user.city]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* ADDRESS / WOREDA */}

              <div
                className="
              sm:col-span-2
              "
              >
                <label className="text-sm font-medium">
                  Woreda / Detailed Address
                </label>

                <input
                  type="text"
                  value={user.address}
                  onChange={(e) =>
                    setUser({
                      ...user,

                      address: e.target.value,
                    })
                  }
                  placeholder="Example: Woreda 03, near Edna Mall"
                  className="
                mt-2
                w-full
                rounded-xl
                border
                bg-background
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-primary
                "
                />
              </div>
            </div>{" "}
            {/* PAYMENT */}
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-5">Payment Method</h2>

              <div className="flex gap-4">
                <button
                  className="
                flex-1
                border-2
                border-primary
                bg-primary
                text-primary-foreground
                rounded-xl
                py-4
                font-semibold
                "
                >
                  Chapa
                </button>

                <button
                  disabled
                  className="
                flex-1
                border
                rounded-xl
                py-4
                text-muted-foreground
                opacity-50
                cursor-not-allowed
                "
                >
                  Pay on delivery
                </button>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}

          <div
            className="
          bg-card
          rounded-3xl
          border
          shadow-sm
          p-6
          sm:p-8
          h-fit
          sticky
          top-24
          "
          >
            <div
              className="
            flex
            items-center
            justify-between
            mb-7
            "
            >
              <h2
                className="
              text-2xl
              font-bold
              "
              >
                Order Summary
              </h2>

              <span
                className="
              text-sm
              bg-emerald-100
              text-emerald-700
              px-3
              py-1
              rounded-full
              font-medium
              "
              >
                Secure
              </span>
            </div>

            {/* PRODUCTS */}

            <div
              className="
            space-y-5
            max-h-[420px]
            overflow-y-auto
            pr-2
            "
            >
              {cartAmount.map((c) => (
                <div
                  key={c.id}
                  className="
                  flex
                  gap-4
                  items-center
                  "
                >
                  <img
                    src={c.image_url}
                    alt={c.title}
                    className="
                    w-20
                    h-20
                    rounded-2xl
                    object-cover
                    border
                    "
                  />

                  <div
                    className="
                    flex-1
                    "
                  >
                    <p
                      className="
                      font-semibold
                      line-clamp-1
                      "
                    >
                      {c.title}
                    </p>

                    <p
                      className="
                      text-sm
                      text-muted-foreground
                      mt-1
                      "
                    >
                      {c.quantity} × ETB {Number(c.price).toLocaleString()}
                    </p>
                  </div>

                  <p
                    className="
                    font-bold
                    "
                  >
                    ETB {(c.quantity * Number(c.price)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="
            my-6
            border-t
            "
            />

            {/* PRICE DETAILS */}

            <div
              className="
            space-y-4
            "
            >
              <div
                className="
              flex
              justify-between
              text-sm
              "
              >
                <span
                  className="
                text-muted-foreground
                "
                >
                  Subtotal
                </span>

                <span
                  className="
                font-medium
                "
                >
                  ETB {Number(totalAmount).toLocaleString()}
                </span>
              </div>

              <div
                className="
              flex
              justify-between
              text-sm
              "
              >
                <span
                  className="
                text-muted-foreground
                "
                >
                  Shipping
                </span>

                <span
                  className="
                text-emerald-600
                font-semibold
                "
                >
                  FREE
                </span>
              </div>

              <div
                className="
              border-t
              pt-5
              flex
              justify-between
              items-center
              "
              >
                <span
                  className="
                text-xl
                font-bold
                "
                >
                  Total
                </span>

                <span
                  className="
                text-2xl
                font-bold
                "
                >
                  ETB {Number(totalAmount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* PLACE ORDER */}

            <button
              disabled={loading}
              onClick={handlePayment}
              className="
            w-full
            mt-8
            bg-primary
            text-primary-foreground
            py-4
            rounded-xl
            font-semibold
            transition
            hover:opacity-90
            disabled:opacity-50
            "
            >
              {loading ? "Redirecting..." : "Place Order"}
            </button>

            <p
              className="
            text-xs
            text-center
            text-muted-foreground
            mt-5
            "
            >
              Your payment information is processed securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
