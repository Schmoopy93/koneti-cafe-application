import React from "react";
import HeroSlider from "./HeroSlider";
import Offer from "./Offer";

const Home: React.FC = () => {
  return (
    <div className="home">
      <HeroSlider />
      <Offer />
    </div>
  );
};

export default Home;