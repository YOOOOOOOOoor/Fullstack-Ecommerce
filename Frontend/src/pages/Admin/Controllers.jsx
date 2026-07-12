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
    <div>
      <div>
        <h1>Category page</h1>
      </div>
      <div>
        <div>
          <Add onSuccess={refreshItem} />
        </div>
        <div className="flex  items-center">
          {category.map((c) => (
            <div
              key={c.id}
              className="flex justify-between bg-gray-300 my-10 mx-5 rounded-lg px-5 flex-col"
            >
              <p>{c.name}</p>
              <div className="flex justify-between cursor-pointer">
                <Edit id={c.id} onSuccess={refreshItem} />
                <Delete id={c.id} onSuccess={refreshItem} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Controllers;
