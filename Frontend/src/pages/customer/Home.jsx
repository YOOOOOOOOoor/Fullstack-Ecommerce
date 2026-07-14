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
      {/* Hero Section */}
      <section className="bg-white px-10 py-20 flex justify-between items-center">
        <div className="max-w-xl space-y-5">
          <h1 className="text-5xl font-bold">Discover Products You Love</h1>

          <p className="text-gray-600 text-lg">
            Find high quality products at the best prices. Shop our latest
            collection today.
          </p>

          <Link to="/products">
            <Button>Shop Now</Button>
          </Link>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
            className="w-[450px] rounded-xl"
            alt="shopping"
          />
        </div>
      </section>

      {/* Welcome */}
      <section className="p-10">
        {user ? (
          <h2 className="text-2xl font-semibold">Welcome back, {user.name}</h2>
        ) : (
          <h2 className="text-2xl font-semibold">Welcome new customer</h2>
        )}
      </section>

      {/* Featured Products */}
      <section className="px-10 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>

          <Link to="/products" className="text-blue-600">
            View All
          </Link>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-60 object-cover"
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
