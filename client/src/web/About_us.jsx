import hero4 from "../assets/hero4.png";

const About_us = () => {
  return (
    <div id="About-us">
      <div className="grid sm:grid-cols-2 bg-slate-400">
        {/* Left Side */}
        <div className="min-h-[600px] bg-slate-400 shadow flex items-center justify-start">
          <img src={hero4} alt="About Us" className="object-fit w-full h-screen" />
        </div>

        {/* Right Side */}
        <div className="min-h-[600px] bg-slate-400 flex flex-col justify-center p-8 mr-20">
          <div>
            <h3 className="text-lg font-bold mb-6 text-left">
              Inspired Craftsmanship, Global Recognition
            </h3>
            <p className="text-base mb-4 text-left">
              GLEAM CERAMIC COMPLEX, an industry leader in Sri Lanka since 2020,
              invites you to experience the essence of ceramic craftsmanship.
              Our global acclaim is a testament to our commitment to redefining
              industry standards through unparalleled quality and innovation.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-6 text-right">Our Story</h2>
            <p className="text-base mb-4 text-right">
              Founded in 2020, GLEAM CERAMIC COMPLEX has swiftly become a
              benchmark for ceramic excellence. Our journey is characterized by
              a dedication to setting new standards and offering innovative
              solutions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-6 text-left">
              Design Brilliance
            </h2>
            <p className="text-base text-left">
              At GLEAM, our tiles embody a harmonious blend of superior
              materials, advanced technology, and creative brilliance. Our
              distinctive designs showcase our commitment to pushing the
              boundaries of excellence in the ceramic realm.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-6 text-right">Product Range</h2>
            <p className="text-base text-right">
              Explore our premium wall and floor tiles, each a masterpiece
              crafted with the highest quality materials and state-of-the-art
              technology. Available in various colors, sizes, and textures, our
              tiles redefine spaces with elegance and authenticity. Experience
              the future of ceramics with GLEAM CERAMIC COMPLEX. Elevate your
              spaces with our exquisite tiles, where craftsmanship meets
              innovation, and each tile tells a unique story.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About_us;
