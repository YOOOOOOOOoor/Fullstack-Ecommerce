import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../API/api.js";

const Success = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verify = async () => {
      const tx_ref = searchParams.get("tx_ref");

      const res = await API.get(`/checkout/verify/${tx_ref}`);

      if (res.data.success) {
        setStatus(`Payment Successful 🎉 Order #${res.data.order_id}`);
      } else {
        setStatus("Payment Failed ❌");
      }
    };

    verify();
  }, []);

  return (
    <div>
      <h1>{status}</h1>
    </div>
  );
};

export default Success;
