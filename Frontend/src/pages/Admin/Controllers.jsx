// import React from "react";
// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../API/api.js";
import Add from "./controllers/Add.jsx";
import Edit from "./controllers/Edit.jsx";
import Delete from "./controllers/Delete.jsx";

const Controllers = () => {
  const [category, setCategory] = useState([]);

  const [val, setVal] = useState(1);

  const refreshItem = async () => {
    setVal((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get("/category");
        setCategory(
          res.data.map((c) => ({
            id: c.id,
            name: c.name,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, [val]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Category Management
          </h1>

          <p className="text-gray-500 mt-2">
            Create, edit, and manage your product categories.
          </p>
        </div>

        {/* Add Category */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>

          <Add onSuccess={refreshItem} />
        </div>

        {/* Category List */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Categories</h2>

            <span className="text-sm text-gray-500">
              {category.length} categories
            </span>
          </div>

          {category.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No categories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border bg-gray-50 p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {c.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Category ID: {c.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <Edit id={c.id} onSuccess={refreshItem} />

                    <Delete id={c.id} onSuccess={refreshItem} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Controllers;
