import React from "react";
import HeroSlider from "./HeroSlider";
import Offer from "./Offer";
import WeeklyPromotions from "./WeeklyPromotions";

const Home: React.FC = () => {
  return (
    <div className="home">
      <HeroSlider />
      <Offer />
      {/* <WeeklyPromotions /> */}
    </div>
  );
};

export default Home;