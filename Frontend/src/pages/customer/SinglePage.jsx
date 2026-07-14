import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../../API/api.js";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const SinglePage = () => {
  const productId = useParams();

  const [user, setUser] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [canReview, setCanReview] = useState(false);

  const [product, setProduct] = useState({});

  const [quantity1, setQuantity] = useState(1);

  const [reviewForm, setReviewForm] = useState({
    id: null,
    rating: 5,
    title: "",
    comment: "",
  });

  // Get current user

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await API.get("/auth/me");

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  // Fetch product

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/customer/${productId.id}`);

      setProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Fetch reviews

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${productId.id}`);

      setReviews(res.data.reviews);

      setAverageRating(res.data.average_rating);

      setTotalReviews(res.data.total_reviews);
    } catch (error) {
      console.log(error);
    }
  };

  const checkReview = async () => {
    try {
      const res = await API.get(`/reviews/${productId.id}/can-review`);

      setCanReview(res.data.canReview);
    } catch (error) {
      setCanReview(false);
    }
  };

  useEffect(() => {
    fetchReviews();

    checkReview();
  }, [productId]);

  // Delete review

  const deleteReview = async (id) => {
    try {
      await API.delete(`/reviews/${id}`);

      fetchReviews();

      checkReview();
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  // Edit button

  const editReview = (review) => {
    setReviewForm({
      id: review.id,

      rating: review.rating,

      title: review.title || "",

      comment: review.comment,
    });
  };

  // Submit create/update

  const submitReview = async () => {
    try {
      if (reviewForm.id) {
        await API.put(`/reviews/${reviewForm.id}`, {
          rating: reviewForm.rating,

          title: reviewForm.title,

          comment: reviewForm.comment,
        });
      } else {
        await API.post("/reviews", {
          product_id: product.product_id,

          rating: reviewForm.rating,

          title: reviewForm.title,

          comment: reviewForm.comment,
        });
      }

      setReviewForm({
        id: null,

        rating: 5,

        title: "",

        comment: "",
      });

      fetchReviews();

      checkReview();
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const addCarts = async (id) => {
    try {
      await API.post("/cart/", {
        product_id: id,

        quantity: quantity1,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Product Section */}
      <div
        className="
        max-w-6xl
        mx-auto
        bg-white
        rounded-2xl
        shadow-sm
        border
        p-8
        "
      >
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}

          <div
            className="
            flex
            items-center
            justify-center
            bg-gray-100
            rounded-xl
            p-6
            "
          >
            <img
              src={product.image_url}
              alt={product.title}
              className="
              w-full
              max-h-[500px]
              object-contain
              rounded-xl
              "
            />
          </div>

          {/* Details */}

          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex justify-between items-center mb-5">
              <p className="text-3xl font-bold">${product.price}</p>

              <div
                className="
                w-8
                h-8
                rounded-full
                border-2
                "
                style={{
                  backgroundColor: product.color,
                }}
              />
            </div>

            <div className="space-y-2 mb-6">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {product.category_name}
              </p>

              <p className="text-green-600 font-medium">
                {product.stock} items available
              </p>
            </div>

            {/* Quantity */}

            <div className="flex items-center gap-5 mb-8">
              <span className="font-semibold">Quantity:</span>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  disabled={quantity1 === 1}
                  onClick={() => setQuantity(quantity1 - 1)}
                >
                  -
                </Button>

                <span className="text-xl font-semibold">{quantity1}</span>

                <Button
                  variant="outline"
                  disabled={quantity1 === product.stock}
                  onClick={() => setQuantity(quantity1 + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              className="
              w-full
              py-6
              text-lg
              bg-indigo-600
              hover:bg-indigo-700
              "
              onClick={() => addCarts(product.product_id)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}

      <div
        className="
        max-w-6xl
        mx-auto
        mt-10
        bg-white
        rounded-2xl
        shadow-sm
        border
        p-8
        "
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Reviews</h2>

          <div>
            <p className="text-xl font-semibold">⭐ {averageRating}</p>

            <p className="text-gray-500 text-sm">{totalReviews} reviews</p>
          </div>
        </div>

        {/* Review Form */}

        {(canReview || reviewForm.id) && (
          <div
            className="
            border
            rounded-xl
            p-5
            mb-8
            "
          >
            <h3 className="font-semibold text-lg mb-4">
              {reviewForm.id ? "Edit Review" : "Write a review"}
            </h3>

            {/* Rating */}

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() =>
                    setReviewForm({
                      ...reviewForm,
                      rating: star,
                    })
                  }
                  className={
                    star <= reviewForm.rating
                      ? "cursor-pointer fill-yellow-400 text-yellow-400"
                      : "cursor-pointer text-gray-300"
                  }
                />
              ))}
            </div>

            <Label>Title</Label>

            <input
              className="
              border
              rounded-lg
              w-full
              p-2
              mb-4
              "
              value={reviewForm.title}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  title: e.target.value,
                })
              }
            />

            <Label>Comment</Label>

            <Textarea
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value,
                })
              }
            />

            <div className="flex gap-3 mt-4">
              <Button onClick={submitReview}>
                {reviewForm.id ? "Update Review" : "Submit Review"}
              </Button>

              {reviewForm.id && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setReviewForm({
                      id: null,
                      rating: 5,
                      title: "",
                      comment: "",
                    })
                  }
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Reviews List */}

        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="
              border
              rounded-xl
              p-5
              "
            >
              {console.log("CURRENT USER:", user)}
              {console.log("REVIEW:", review)}
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{review.name}</h3>

                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>

              <h4 className="font-medium mt-3">{review.title}</h4>

              <p className="text-gray-600 mt-2">{review.comment}</p>

              {user?.id === review.user_id && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => editReview(review)}>
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => deleteReview(review.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePage;
