import "./Gallery.scss";

const images = [
  "/images/cafe1.jpg",
  "/images/cafe2.jpg",
  "/images/cafe3.jpg",
  "/images/cafe4.jpg",
  "/images/cafe5.jpg",
  "/images/cafe6.jpg",
];

export default function Gallery() {
  return (
    <div className="gallery-wrapper">
      <h2 className="gallery-title">Galerija Koneti</h2>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <div key={index} className="gallery-item">
            <img src={src} alt={`Koneti ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
