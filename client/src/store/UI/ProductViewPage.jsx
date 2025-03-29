import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Badge, Row, Col, Card } from "react-bootstrap";
import { IoArrowBack, IoCartOutline } from "react-icons/io5";
import { BsHandbag } from "react-icons/bs";
import { useState } from "react";
import "./ProductViewPage.css";
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
    const data = {
      productCode: product.PRODUCT_CODE,
      quantity: 1,
    }
    console.log("Buy Now", data);
  }

  return (
    <Container className="py-4 product-view-container">
      <Button
        variant="outline-secondary"
        className="mb-4 back-button flex items-center"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack className="me-2" />
        Back
      </Button>

      <Card className="border-0 shadow-sm">
        <Row className="g-0">
          <Col md={6}>
            <div className="position-relative product-image-container">
              <div
                className={`image-wrapper ${isZoomed ? "zoomed" : ""}`}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={`http://localhost:8080/images/${product.IMAGE}`}
                  alt={product.NAME}
                  className="product-image"
                />
              </div>
              {product.QUANTITY === 0 && currentUser?.role === "customer" && (
                <Badge bg="danger" className="sold-out-badge">
                  Sold Out
                </Badge>
              )}
            </div>
          </Col>
          <Col md={6}>
            <Card.Body className="p-4 product-details">
              <h1 className="product-title">{product.NAME}</h1>
              <h2 className="product-price">
                Rs. {product.PRICE.toLocaleString()}
              </h2>
              <h4>({product.PRODUCT_CODE})</h4>
              <div className="mb-4">
                <p className="mb-2">
                  {product.CATAGORY_NAME}
                  {" ---> "}
                  {product.SUB_CATAGORY_NAME}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="h5 mb-3">Description</h3>
                <p className="product-description">{product.DESCRIPTION}</p>
              </div>
              <div className="action-buttons">
                {product.QUANTITY > 0 && currentUser?.role === "customer" && (
                  <>
                    <Button
                      variant="outline-primary"
                      className="cart-button"
                      onClick={() => handaleAddToCart()}
                    >
                      <IoCartOutline className="me-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="primary"
                      className="buy-button"
                      onClick={() => handleBuyNow()}
                    >
                      <BsHandbag className="me-2" />
                      Buy Now
                    </Button>
                  </>
                )}
                {currentUser?.role === "Whole Customer" && (
                  <>
                    <Button
                      variant="outline-primary"
                      className="cart-button"
                      onClick={() => console.log("Add to cart")}
                    >
                      <IoCartOutline className="me-2" />
                      Add to Cart
                    </Button>
                  </>
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
