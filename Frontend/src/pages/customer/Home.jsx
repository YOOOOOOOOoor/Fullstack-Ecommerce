import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../API/api.js";
import { Button } from "@/components/ui/button";

const Home = ({ user }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get("/products/featured");
        console.log(res.data);

        setFeaturedProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}

      <section
        className="
        bg-white
        px-5
        sm:px-10
        py-12
        sm:py-20
        flex
        flex-col
        lg:flex-row
        justify-between
        items-center
        gap-10
        "
      >
        <div className="max-w-xl space-y-5 text-center lg:text-left">
          <h1
            className="
            text-3xl
            sm:text-5xl
            font-bold
            "
          >
            Discover Products You Love
          </h1>

          <p className="text-gray-600 text-base sm:text-lg">
            Find high quality products at the best prices. Shop our latest
            collection today.
          </p>

          <Link to="/products">
            <Button>Shop Now</Button>
          </Link>
        </div>

        <img
          src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=764"
          className="
          w-full
          sm:w-[450px]
          rounded-xl
          "
          alt="shopping"
        />
      </section>

      {/* Welcome */}

      <section className="p-5 sm:p-10 ">
        <h2 className="text-xl sm:text-2xl font-semibold">
          {user ? `Welcome back, ${user.name}` : "Welcome new customer"}
        </h2>
      </section>

      {/* Products */}

      <section className="px-5 sm:px-10 pb-20 ">
        <div
          className="
          flex
          flex-col
          sm:flex-row
          justify-between
          gap-3
          mb-8
          "
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Featured Products</h2>

          <Link to="/products" className="text-blue-600">
            View All
          </Link>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div
            className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
            "
          >
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="
                bg-white
                rounded-xl
                shadow
                hover:shadow-lg
                transition
                overflow-hidden
                "
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="
                  w-full
                  h-60
                  object-cover
                  "
                />

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{product.title}</h3>

                  <p className="text-sm text-gray-500">
                    {product.category_name}
                  </p>

                  <p className="font-bold">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
