import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import API from "../../../../API/api.js";
import { Switch } from "@/components/ui/switch";
const Add = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    color: "#3b82f6",
    image: "",
    category_id: "",
    status: "draft",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get("/category");
        const data = res.data.map((c) => ({
          id: c.id,
          name: c.name,
        }));
        setCategory(data);
        console.log("mapped:", data);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchCategory();
  }, []);

  const addProduct = async () => {
    try {
      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("stock", form.stock);
      data.append("color", form.color);
      data.append("status", form.status);
      data.append("category_id", form.category_id);
      data.append("image", form.image);

      const res = await API.post("/products", data);

      console.log(res.data);
      navigate("/products");
    } catch (error) {
      console.log(error, "error2");
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      return;
    }

    setPreview(URL.createObjectURL(file));

    setForm({
      ...form,
      image: file,
    });
  };

  return (
    <div className="w-[100%] flex justify-around ">
      <div className="">
        <div>
          <h1 className="text-2xl font-bold"> New product</h1>
          <p>
            Add a product to your catalogue. You can save as draft or publish
            immediately.
          </p>
        </div>
        <div>
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Details</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                      Title
                    </FieldLabel>
                    <Input
                      id="checkout-7j9-card-name-43j"
                      placeholder="Premium wireless mouse"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-optional-comments">
                      Description
                    </FieldLabel>
                    <Textarea
                      id="textarea-message"
                      placeholder="Tell your customers what they can expect from this product."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>
        <div>
          <Field>
            <FieldLabel htmlFor="picture">Picture</FieldLabel>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
            <FieldDescription>Select a picture to upload.</FieldDescription>
          </Field>
          {preview && (
            <div>
              <img
                src={preview}
                alt=""
                className="h-40 w-40 rounded-md object-cover"
              />
            </div>
          )}
        </div>
      </div>
      <div className="  w-[30%]">
        <div>
          <Button className="" onClick={addProduct}>
            Save{" "}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="publish"
            checked={form.status === "published"}
            onCheckedChange={(checked) =>
              setForm({
                ...form,
                status: checked ? "published" : "draft",
              })
            }
          />
          <Label htmlFor="publish">
            {form.status === "published" ? "Published" : "Draft"}
          </Label>
        </div>
        <div>
          <Label htmlFor="input-price">Price</Label>
          <Input
            placeholder="120"
            type={"number"}
            min={0}
            id={"input-price"}
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Label htmlFor="input-stock">Stock</Label>
          <Input
            placeholder="50"
            type={"number"}
            min={0}
            id={"input-stock"}
            required
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        <div>
          <Select
            value={form.category_id}
            onValueChange={(value) => setForm({ ...form, category_id: value })}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue>
                {category.find((c) => String(c.id) === form.category_id)
                  ?.name || "Select a Category"}
              </SelectValue>
              {/* <SelectValue placeholder="Select a Category" /> */}
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>

                {category.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div>
            <Input
              type="color"
              defaultValue="#3b82f6"
              className="h-10 w-16 p-1 cursor-pointer"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
