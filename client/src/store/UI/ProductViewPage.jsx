import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Badge, Row, Col, Card } from "react-bootstrap";
import { IoArrowBack, IoCartOutline } from "react-icons/io5";
import { BsHandbag } from "react-icons/bs";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const [isZoomed, setIsZoomed] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("User"));

  if (!product) {
    return <p>Product not found.</p>;
  }

  const handaleAddToCart = async() => { 
    const data = {
      userId: currentUser.id,
      productCode: product.PRODUCT_CODE,
      quantity: 1,
    }
    try {
      const response = await axios.post('/api/shopdata/addCartData', data,)
      toast.success(response.data.message ?? "Item added to cart successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Failed to add item to cart.");
      console.error("Error adding to cart:", error.message);
    }
  }

  const handleBuyNow = () => {
    const checkoutItems = [{
      PRODUCT_CODE: product.PRODUCT_CODE,
      NAME: product.NAME,
      PRICE: product.PRICE,
      IMAGE: product.IMAGE,
      QUANTITY: 1,
    }]
    navigate("/ceramic/checkout", { state: { checkoutItems } });
  }

  return (
    <Container className="py-4 max-w-[1200px] mx-auto">
      <Button
        variant="outline-secondary"
        className="mb-4 flex items-center transition-all duration-300 ease-in-out hover:-translate-x-1"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack className="me-2" />
        Back
      </Button>

      <Card className="border-0 shadow-sm">
        <Row className="g-0">
          <Col md={6}>
            <div className="relative overflow-hidden rounded-lg shadow-md">
              <div
                className={`relative h-[500px] transition-transform duration-300 ease-in-out ${isZoomed ? 'scale-110' : ''}`}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={`http://localhost:8080/images/${product.IMAGE}`}
                  alt={product.NAME}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.QUANTITY === 0 && currentUser?.role === "customer" && (
                <Badge bg="danger" className="absolute top-5 right-5 px-5 py-2.5 text-lg animate-fadeIn">
                  Sold Out
                </Badge>
              )}
            </div>
          </Col>
          <Col md={6}>
            <Card.Body className="p-4 h-full flex flex-col">
              <h1 className="text-4xl font-semibold mb-4 text-slate-800">{product.NAME}</h1>
              <h2 className="text-3xl text-red-500 mb-6">
                Rs. {product.PRICE.toLocaleString()}
              </h2>
              <h4 className="mb-4">({product.PRODUCT_CODE})</h4>
              <div className="mb-4">
                <p className="mb-2">
                  {product.CATAGORY_NAME}
                  {" ---> "}
                  {product.SUB_CATAGORY_NAME}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-medium mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{product.DESCRIPTION}</p>
              </div>
              <div className="mt-auto flex gap-4">
                {product.QUANTITY > 0 && currentUser?.role === "customer" && (
                  <>
                    <Button
                      variant="outline-primary"
                      className="flex-1 flex items-center justify-center py-3 px-6 text-lg border-2 border-slate-500 text-slate-500 hover:bg-slate-500 hover:text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
                      onClick={() => handaleAddToCart()}
                    >
                      <IoCartOutline className="me-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1 flex items-center justify-center py-3 px-6 text-lg bg-slate-700 hover:bg-slate-600 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
                      onClick={() => handleBuyNow()}
                    >
                      <BsHandbag className="me-2" />
                      Buy Now
                    </Button>
                  </>
                )}
                {currentUser?.role === "Whole Customer" && (
                  <Button
                    variant="outline-primary"
                    className="flex-1 flex items-center justify-center py-3 px-6 text-lg border-2 border-slate-500 text-slate-500 hover:bg-slate-500 hover:text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => handaleAddToCart()}
                  >
                    <IoCartOutline className="me-2" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

ProductViewPage.propTypes = {
  product: PropTypes.shape({
    NAME: PropTypes.string.isRequired,
    CATAGORY_NAME: PropTypes.string.isRequired,
    PRICE: PropTypes.number.isRequired,
    QUANTITY: PropTypes.number.isRequired,
    IMAGE: PropTypes.string.isRequired,
    CATAGORY_code: PropTypes.string.isRequired,
    DESCRIPTIOn: PropTypes.string.isRequired,
    PRODUCT_CODE: PropTypes.string.isRequired,
    SUB_CATAGORY_NAME: PropTypes.string.isRequired,
  }),
};

export default ProductViewPage;
