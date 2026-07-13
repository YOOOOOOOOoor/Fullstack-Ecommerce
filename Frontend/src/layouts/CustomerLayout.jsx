import { Outlet } from "react-router-dom";
import Navi from "../components/customer/Navi";

const CustomerLayout = ({ user, setUser }) => {
  return (
    <>
      <Navi user={user} setUser={setUser} />
      <Outlet />
    </>
  );
};

export default CustomerLayout;
