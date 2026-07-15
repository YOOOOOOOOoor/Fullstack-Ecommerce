import { Outlet } from "react-router-dom";
import Navi from "../components/customer/Navi";
import Footer from "../pages/customer/Footer";

const CustomerLayout = ({ user, setUser }) => {
  return (
    <>
      <Navi user={user} setUser={setUser} />
      <Outlet />
      <Footer />
    </>
  );
};

export default CustomerLayout;
