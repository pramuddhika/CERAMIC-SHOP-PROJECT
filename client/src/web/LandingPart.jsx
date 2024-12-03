import Image1 from "../assets/hero1.png";
import Image2 from "../assets/hero2.png";
import Image3 from "../assets/hero3.png";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";

const LandingPart = () => {
  return (
    <>
      <div id="home">
        <div
          style={{
            position: "relative",
            color: "white",
            textAlign: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
          >
            <h1 style={{ fontSize: "4rem", fontWeight: "bold" }}>
              GLEAM CERAMIC COMPLEX
            </h1>
            <h6>Crafting Tomorrow&apos;s Spaces Today</h6>
            <Button
              className="mt-3 p-4"
              style={{
                backgroundColor: "#6794A0",
                border: "none",
                borderRadius: "18px",
              }}
            >
              <h3 style={{ margin: 0 }}> Our Collection {">>>"} </h3>
            </Button>
          </div>

          <Carousel
            data-bs-theme="dark"
            style={{ height: "100%", position: "relative", zIndex: 1 }}
          >
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={Image1}
                alt="First slide"
                style={{ height: "100vh", objectFit: "cover" }}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={Image2}
                alt="Second slide"
                style={{ height: "100vh", objectFit: "cover" }}
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={Image3}
                alt="Third slide"
                style={{ height: "100vh", objectFit: "cover" }}
              />
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default LandingPart;
