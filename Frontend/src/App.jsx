import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import API from "../API/api.js";

// layouts
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

// auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import Success from "./pages/Success";

// customer
import Home from "./pages/customer/Home";
import ProductsCustomer from "./pages/customer/Products";
import SinglePage from "./pages/customer/SinglePage";
import Cart from "./pages/customer/Cart";
import CheckoutPage from "./pages/customer/CheckoutPage";
import Order from "./pages/customer/Orders";
import OrderDetails from "./pages/customer/OrderDetails";
import CustomerRoute from "./pages/customer/CustomerRoute";
import Wishlist from "./pages/customer/Wishlist";
import Settings from "./pages/customer/Settings";

// admin
import Dashboard from "./pages/Admin/Dashboard.jsx";
import AdminRoute from "./pages/Admin/AdminRoute ";
import Controllers from "./pages/Admin/Controllers";
import Products from "./pages/Admin/Products";
import Orders from "./pages/Admin/AdminOrders";
import AdminOrderDetail from "./pages/Admin/AdminOrderDetail";
import Add from "./pages/Admin/products/Add";
import Edit from "./pages/Admin/products/Edit";
import Analytics from "./pages/Admin/Analytics";

API.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Routes>
        {/* ---------- CUSTOMER LAYOUT ---------- */}

        <Route element={<CustomerLayout user={user} setUser={setUser} />}>
          <Route path="/" element={<Home user={user} />} />

          <Route
            path="/products"
            element={<ProductsCustomer user={user} setUser={setUser} />}
          />

          <Route
            path="/products/:id"
            element={<SinglePage user={user} setUser={setUser} />}
          />

          <Route
            path="/settings"
            element={
              <CustomerRoute user={user}>
                <Settings user={user} setUser={setUser} />
              </CustomerRoute>
            }
          />

          <Route path="/success" element={<Success />} />

          <Route
            path="/cart"
            element={
              <CustomerRoute user={user}>
                <Cart user={user} setUser={setUser} />
              </CustomerRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <CustomerRoute user={user}>
                <CheckoutPage user={user} setUser={setUser} />
              </CustomerRoute>
            }
          />

          <Route
            path="/order"
            element={
              <CustomerRoute user={user}>
                <Order user={user} setUser={setUser} />
              </CustomerRoute>
            }
          />

          <Route
            path="/order/:id"
            element={
              <CustomerRoute user={user}>
                <OrderDetails user={user} setUser={setUser} />
              </CustomerRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <CustomerRoute user={user}>
                <Wishlist user={user} setUser={setUser} />
              </CustomerRoute>
            }
          />
        </Route>

        {/* ---------- AUTH ---------- */}

        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />

        <Route
          path="/register"
          element={<Register user={user} setUser={setUser} />}
        />

        {/* ---------- ADMIN ---------- */}

        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="products" element={<Products />} />

          <Route
            path="products/add"
            element={<Add user={user} setUser={setUser} />}
          />

          <Route
            path="products/:id"
            element={<Edit user={user} setUser={setUser} />}
          />

          <Route path="category" element={<Controllers />} />

          <Route path="orders" element={<Orders />} />

          <Route path="orders/:id" element={<AdminOrderDetail />} />

          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
