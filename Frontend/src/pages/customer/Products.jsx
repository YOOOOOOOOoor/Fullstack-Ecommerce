import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Spinner } from "@/components/ui/spinner";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useState, useEffect } from "react";
import API from "../../../API/api.js";

import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [imageStyle, setImageStyle] = useState({});
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    search: "",
    color: "",
    price: "all",
  });

  // const [cart, setCart] = useEffect({
  //   product_id: "",
  //   quantity: "",
  // });

  const addCarts = async (id, quantity) => {
    const product_id = id;

    if (quantity == null) {
      quantity = 1;
    }

    try {
      const res = await API.post("/cart", {
        product_id,
        quantity,
      });

      toast.success(res.data.message || "Product added to cart successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart.",
      );
    }
  };

  const addWishList = async (id) => {
    const product_id = id;

    try {
      const res = await API.post("/wishlist", {
        product_id,
      });

      toast.success(
        res.data.message || "Product added to wishlist successfully.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to wishlist.",
      );
    }
  };

  const [category, setCategory] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get("/category");
        const data = res.data.map((c) => ({
          id: c.id,
          name: c.name,
        }));
        setCategory(data);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchCategory();
  }, []);

  const [color, setColor] = useState([]);
  useEffect(() => {
    const fetchColor = async () => {
      try {
        const res = await API.get("/products/color");
        const data = res.data.map((c) => ({
          id: c.id,
          color: c.color,
        }));
        setColor(data);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchColor();
  }, []);

  const [products, setProducts] = useState([]);
  // const [val, setVal] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await API.get("/products/customer", {
          params: {
            ...form,
            page,
            limit: 5,
          },
        });

        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, form]);

  return (
    <div
      className="
    min-h-screen
    bg-background
    px-4
    sm:px-6
    lg:px-10
    py-8
    sm:py-12
    "
    >
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner className="size-8" />

            <p className="mt-4 text-sm text-muted-foreground">
              Loading products...
            </p>
          </div>
        ) : (
          <>
            <h1
              className="
        text-3xl
        sm:text-4xl
        font-bold
        text-foreground
        tracking-tight
        "
            >
              Products
            </h1>

            <p
              className="
        mt-2
        text-sm
        sm:text-base
        text-muted-foreground
        "
            >
              Explore our collection and find something you love.
            </p>
          </>
        )}
      </div>

      {/* Filters */}

      <div
        className="
      max-w-7xl
      mx-auto
      bg-card
      border
      rounded-2xl
      shadow-sm
      p-5
      sm:p-7
      mb-10
      "
      >
        <div
          className="
        grid
        md:grid-cols-4
        gap-5
        sm:gap-6
        "
        >
          {/* Search */}

          <div className="md:col-span-2">
            <Field>
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>

                <InputGroupInput
                  placeholder="Search products..."
                  onChange={(e) =>
                    setForm({
                      ...form,
                      search: e.target.value,
                    })
                  }
                />
              </InputGroup>
            </Field>
          </div>

          {/* Price */}

          <div className="flex items-center gap-3">
            <span
              className="
    text-sm
    font-medium
    text-muted-foreground
    whitespace-nowrap
    "
            >
              Price
            </span>

            <Select
              value={String(form.price)}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  price: value,
                })
              }
            >
              <SelectTrigger
                className="
      flex-1
      h-11
      rounded-xl
      "
              >
                <SelectValue placeholder="All Prices" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="5000">Under 5,000</SelectItem>
                <SelectItem value="10000">Under 10,000</SelectItem>
                <SelectItem value="25000">Under 25,000</SelectItem>
                <SelectItem value="50000">Under 50,000</SelectItem>
                <SelectItem value="100000">Under 100,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}

          <div className="flex items-center gap-3">
            <span
              className="
    text-sm
    font-medium
    text-muted-foreground
    whitespace-nowrap
    "
            >
              Category
            </span>

            <Select
              value={form.category}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  category: value,
                })
              }
            >
              <SelectTrigger
                className="
      flex-1
      h-11
      rounded-xl
      "
              >
                <SelectValue placeholder="All Categories">
                  {category.find((c) => String(c.id) === form.category)?.name}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                {category.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Colors */}

        <div
          className="
        mt-7
        flex
        items-center
        gap-3
        flex-wrap
        "
        >
          <span
            className="
          text-sm
          font-medium
          text-muted-foreground
          mr-2
          "
          >
            Colors
          </span>

          <button
            onClick={() =>
              setForm({
                ...form,
                color: "all",
              })
            }
            className={`
  border
  rounded-full
  px-4
  py-1.5
  text-sm
  transition

  ${
    form.color === "all"
      ? "ring-2 ring-primary ring-offset-2"
      : "hover:bg-muted"
  }
  `}
          >
            All
          </button>

          {color.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setForm({
                  ...form,
                  color: c.color,
                })
              }
              className={`

              w-8
              h-8
              rounded-full
              border-2
              transition

              ${
                form.color === c.color
                  ? "ring-2 ring-primary ring-offset-2"
                  : "hover:ring-2 hover:ring-muted"
              }

              `}
              style={{
                backgroundColor: c.color,
              }}
            />
          ))}
        </div>
      </div>

      {/* Products */}

      <div className="max-w-7xl mx-auto">
        <div
          className="
        grid
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-5
        sm:gap-6
        "
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="
              group
              bg-card
              border
              rounded-2xl
              overflow-hidden
              shadow-sm
              hover:shadow-md
              transition-all
              duration-300
              "
            >
              {/* Image */}

              {/* Image */}

              <div
                onClick={() => navigate(`/products/${p.id}`)}
                className="
  cursor-pointer
  overflow-hidden
  bg-muted
  flex
  items-center
  justify-center
  h-60
  sm:h-64
  "
              >
                <img
                  src={p.image_url}
                  alt={p.title}
                  onLoad={(e) => {
                    const img = e.currentTarget;

                    const ratio = img.naturalWidth / img.naturalHeight;

                    let style = "object-cover";

                    if (ratio < 0.8) {
                      // very tall image
                      style = "object-contain";
                    } else if (ratio > 1.5) {
                      // very wide image
                      style = "object-cover";
                    } else {
                      // normal image
                      style = "object-cover";
                    }

                    setImageStyle((prev) => ({
                      ...prev,
                      [p.id]: style,
                    }));
                  }}
                  className={`
    w-full
    h-full
    transition
    duration-300
    group-hover:scale-105

    ${imageStyle[p.id] || "object-cover"}
  `}
                />
              </div>
              {/* Content */}
              <div
                className="
                p-4
                sm:p-5
                space-y-4
                "
              >
                <h2
                  className="
                  text-lg
                  font-semibold
                  truncate
                  "
                >
                  {p.title}
                </h2>

                <p
                  className="
                  text-sm
                  text-muted-foreground
                  line-clamp-2
                  min-h-[40px]
                  "
                >
                  {p.description}
                </p>

                {/* Price + Color */}

                <div
                  className="
                  flex
                  items-center
                  justify-between
                  "
                >
                  <span
                    className="
                    text-xl
                    sm:text-2xl
                    font-bold
                    "
                  >
                    ${p.price}
                  </span>

                  <div
                    className="
                    w-7
                    h-7
                    rounded-full
                    border
                    "
                    style={{
                      backgroundColor: p.color,
                    }}
                  />
                </div>

                {/* Stock */}

                <div>
                  <span
                    className="
                    inline-flex
                    rounded-full
                    bg-muted
                    px-3
                    py-1
                    text-xs
                    text-muted-foreground
                    "
                  >
                    {p.stock} available
                  </span>
                </div>

                {/* Buttons */}

                <div
                  className="
                  flex
                  gap-3
                  pt-2
                  "
                >
                  <Button
                    className="
                    flex-1
                    rounded-xl
                    "
                    onClick={() => addCarts(p.id)}
                  >
                    Add Cart
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="
                    rounded-xl
                    "
                    onClick={() => addWishList(p.id)}
                  >
                    ♡
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}

        <div
          className="
        mt-10
        sm:mt-14
        flex
        justify-center
        "
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (page > 1) setPage(page - 1);
                  }}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={page === index + 1}
                    onClick={(e) => {
                      e.preventDefault();

                      setPage(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (page < totalPages) setPage(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Products;
