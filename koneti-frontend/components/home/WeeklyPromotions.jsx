import { useEffect, useRef } from "react";
import "./WeeklyPromotions.scss";


const dummyPromotions = [
  { id: 1, title: "Espresso popust", description: "Uživajte u espressu sa 20% popusta.", img: "/espresso-sale.png" },
  { id: 2, title: "Cappuccino deal", description: "Cappuccino + kolač za 500 RSD.", img: "https://source.unsplash.com/300x200/?cappuccino" },
  { id: 3, title: "Latte akcija", description: "Latte napitci po specijalnoj ceni.", img: "https://source.unsplash.com/300x200/?latte" },
  { id: 4, title: "Sok dana", description: "Sveže ceđeni sokovi po sniženoj ceni.", img: "https://source.unsplash.com/300x200/?juice" },
  { id: 5, title: "Torta nedelje", description: "Probajte tortu nedelje sa popustom.", img: "https://source.unsplash.com/300x200/?cake" },
];

export default function WeeklyPromotions() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section className="weekly-promotions">
      <h2 className="section-title">Nedeljne promocije</h2>
      <div className="promotions-grid">
        {dummyPromotions.map((promo, index) => (
          <div
            key={promo.id}
            className="promo-card"
            ref={el => (cardsRef.current[index] = el)}
          >
            <img src={promo.img} alt={promo.title} />
            <div className="card-content">
              <h3>{promo.title}</h3>
              <p>{promo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
