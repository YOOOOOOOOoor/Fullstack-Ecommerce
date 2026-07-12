import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";

import API from "../API/api.js";

import Navi from "./components/Navi";
import Home from "./pages/customer/Home.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Controllers from "./pages/Admin/Controllers";
import Products from "./pages/Admin/Products.jsx";
import Add from "./pages/Admin/products/Add.jsx";
import Edit from "./pages/Admin/products/Edit.jsx";
import AdminRoute from "./pages/Admin/AdminRoute .jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import ProductsCustomer from "./pages/customer/Products.jsx";
import SinglePage from "./pages/customer/SinglePage.jsx";
import CustomerRoute from "./pages/customer/CustomerRoute.jsx";
import Cart from "./pages/customer/Cart.jsx";
// import Delete from "./pages/Admin/products/Delete.jsx";

API.defaults.withCredentials = true;
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Navi user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route
          path="/register"
          element={<Register user={user} setUser={setUser} />}
        />
        <Route
          path="/products"
          element={<ProductsCustomer user={user} setUser={setUser} />}
        />
        <Route
          path="/products/:id"
          element={<SinglePage user={user} setUser={setUser} />}
        />
        <Route
          path="/cart"
          element={
            <CustomerRoute user={user}>
              <Cart user={user} setUser={setUser} />
            </CustomerRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="products" element={<Products />} />
          <Route path="category" element={<Controllers />} />
          <Route
            path="products/add"
            element={<Add user={user} setUser={setUser} />}
          />
          <Route
            path="products/:id"
            element={<Edit user={user} setUser={setUser} />}
          />
        </Route>
        {/* 
        <Route
          path="/category"
          element={<Controllers user={user} setUser={setUser} />}
        />
        <Route
          path="/products"
          element={<Products user={user} setUser={setUser} />}
        /> */}
        /*** */
        {/* <Route
          path="/products/add"
          element={<Add user={user} setUser={setUser} />}
        />
        <Route
          path="/products/:id"
          element={<Edit user={user} setUser={setUser} />}
        /> */}
        /***** */
      </Routes>
    </Router>
  );
}

export default App;
