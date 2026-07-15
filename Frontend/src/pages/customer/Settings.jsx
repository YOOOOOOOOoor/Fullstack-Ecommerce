import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import API from "../../../API/api.js";

const Settings = () => {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preview, setPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchInfo = async () => {
    try {
      const response = await API.get("/settings");
      setSettings(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (
        passwords.newPassword &&
        passwords.newPassword !== passwords.confirmPassword
      ) {
        return alert("New passwords do not match.");
      }

      const formData = new FormData();

      formData.append("name", settings.name);
      formData.append("email", settings.email);
      formData.append("phone", settings.phone);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      if (passwords.currentPassword) {
        formData.append("currentPassword", passwords.currentPassword);
      }

      if (passwords.newPassword) {
        formData.append("newPassword", passwords.newPassword);
      }

      const response = await API.put("/settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSettings(response.data);

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setAvatarFile(null);
      setPreview("");

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile */}

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Profile</h2>

        <Input
          placeholder="Name"
          value={settings.name}
          onChange={(e) =>
            setSettings({
              ...settings,
              name: e.target.value,
            })
          }
        />

        <Input
          placeholder="Email"
          type="email"
          value={settings.email}
          onChange={(e) =>
            setSettings({
              ...settings,
              email: e.target.value,
            })
          }
        />

        <Input
          placeholder="Phone"
          value={settings.phone}
          onChange={(e) =>
            setSettings({
              ...settings,
              phone: e.target.value,
            })
          }
        />

        <Field>
          <FieldLabel>Profile Picture</FieldLabel>

          <Input type="file" accept="image/*" onChange={handleImageChange} />

          <FieldDescription>
            Upload a new image if you want to replace the current one.
          </FieldDescription>
        </Field>

        {(preview || settings.avatar) && (
          <img
            src={preview || settings.avatar}
            alt={settings.name}
            className="h-40 w-40 rounded-xl object-cover border"
          />
        )}
      </div>

      {/* Security */}

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Security</h2>

        <Input
          type="password"
          name="currentPassword"
          placeholder="Current password"
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
        />

        <Input
          type="password"
          name="newPassword"
          placeholder="New password"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
        />

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Repeat new password"
          value={passwords.confirmPassword}
          onChange={handlePasswordChange}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
