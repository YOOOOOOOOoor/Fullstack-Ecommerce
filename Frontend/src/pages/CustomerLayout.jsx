import { Outlet } from "react-router-dom";
import Navi from "../components/Navi";
asdf;
import Footer from "./customer/Footer";

export default function CustomerLayout({ user, setUser }) {
  return (
    <>
      <h1>CUSTOMER</h1>
      <Navi user={user} setUser={setUser} />

      <Outlet />

      <Footer />
    </>
  );
}
