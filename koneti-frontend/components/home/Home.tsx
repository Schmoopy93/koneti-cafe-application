import React from "react";
import HeroSlider from "./HeroSlider";
import Offer from "./Offer";
import Testimonials from "./Testimonials";

const Home: React.FC = () => {
  return (
    <div className="home">
      <HeroSlider />
      <Offer />
      {/* <Testimonials /> */}
    </div>
  );
};

export default Home;