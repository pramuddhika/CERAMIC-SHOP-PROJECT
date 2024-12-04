import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";

const NavbarComponent = () => {
  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        backgroundColor: "#6794A0",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          style={{
            color: "#FFFFFF",
            fontWeight: "bold",
          }}
        >
          Gleam Ceramic
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              href="#contact-us"
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? "active" : ""}`
              }
              style={{
                color: "#FFFFFF",
                transition: "color 0.3s ease",
              }}
            >
              Contact Us
            </Nav.Link>
            <Nav.Link
              href="#About-us"
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? "active" : ""}`
              }
              style={{
                color: "#FFFFFF",
                transition: "color 0.3s ease",
              }}
            >
              About Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style>
        {`
          .nav-link-custom:hover {
            color: #F7D9A8;
            text-decoration: underline;
          }
          .nav-link-custom.active {
            color: #F7D9A8;
            font-weight: bold;
          }
        `}
      </style>
      <Button
        as={NavLink}
        to="/login"
        className={({ isActive }) =>
          `nav-link-custom ${isActive ? "active" : ""}`
        }
        style={{
          backgroundColor: "transparent",
          color: "#FFFFFF",
          border: "none",
          transition: "color 0.3s ease",
          marginRight: "10px",
        }}
      >
        Login
      </Button>
    </Navbar>
  );
};

export default NavbarComponent;
