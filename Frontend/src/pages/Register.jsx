import { useEffect, useState } from "react";
import API from "../../API/api.js";
import { useNavigate } from "react-router-dom";

const Register = ({ user, setUser }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (!form.name || !form.email || !form.password) {
        setError("Please fill in all fields");
        return;
      }

      setLoading(true);

      const res = await API.post("/auth/register", form);

      setUser(res.data.user);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    min-h-screen
    bg-background
    flex
    items-center
    justify-center
    px-4
    sm:px-6
    "
    >
      <div
        className="
      w-full
      max-w-md
      bg-card
      border
      rounded-3xl
      shadow-sm
      p-6
      sm:p-8
      "
      >
        {/* Back Button */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="
        flex
        items-center
        gap-2
        text-muted-foreground
        hover:text-primary
        transition
        mb-8
        "
        >
          ← Go back
        </button>

        {/* Header */}

        <div className="text-center mb-8">
          <div
            className="
          mx-auto
          w-14
          h-14
          rounded-2xl
          bg-primary
          text-primary-foreground
          flex
          items-center
          justify-center
          font-bold
          text-xl
          mb-5
          "
          >
            E
          </div>

          <h1
            className="
          text-3xl
          font-bold
          text-foreground
          "
          >
            Create Account
          </h1>

          <p
            className="
          text-muted-foreground
          mt-2
          "
          >
            Join EthioShopping today
          </p>
        </div>

        {error && (
          <div
            className="
          bg-red-50
          text-red-600
          border
          border-red-200
          px-4
          py-3
          rounded-xl
          mb-5
          text-sm
          "
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="
            mt-2
            w-full
            border
            rounded-xl
            px-4
            py-3
            bg-background
            outline-none
            focus:ring-2
            focus:ring-primary
            "
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="
            mt-2
            w-full
            border
            rounded-xl
            px-4
            py-3
            bg-background
            outline-none
            focus:ring-2
            focus:ring-primary
            "
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="
            mt-2
            w-full
            border
            rounded-xl
            px-4
            py-3
            bg-background
            outline-none
            focus:ring-2
            focus:ring-primary
            "
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Phone Number</label>

              <span className="text-xs text-muted-foreground italic">
                Optional
              </span>
            </div>

            <input
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
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
      focus:ring-2
      focus:ring-primary
    "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
          w-full
          bg-primary
          hover:opacity-90
          text-primary-foreground
          h-12
          rounded-xl
          font-semibold
          transition
          disabled:opacity-50
          "
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p
          className="
        text-center
        text-sm
        text-muted-foreground
        mt-6
        "
        >
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="
          text-primary
          font-medium
          cursor-pointer
          ml-1
          hover:underline
          "
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
