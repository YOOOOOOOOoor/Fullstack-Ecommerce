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

      if (!form.name || !form.email || !form.password || !form.phone) {
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
    bg-gray-50
    flex
    items-center
    justify-center
    px-6
  "
    >
      <div
        className="
      w-full
      max-w-md
      bg-white
      rounded-2xl
      shadow-lg
      border
      p-8
    "
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="
          flex
          items-center
          gap-2
          text-gray-600
          hover:text-indigo-600
          mb-6
          transition
        "
        >
          ← Go back
        </button>

        <div className="text-center mb-8">
          <h1
            className="
          text-3xl
          font-bold
        "
          >
            Create Account
          </h1>
        </div>

        {error && (
          <div
            className="
          bg-red-100
          text-red-700
          px-4
          py-3
          rounded-lg
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
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-indigo-500
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
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-indigo-500
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
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>

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
              border
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            py-3
            rounded-lg
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
        text-gray-500
        mt-6
      "
        >
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="
            text-indigo-600
            font-medium
            cursor-pointer
            ml-1
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
