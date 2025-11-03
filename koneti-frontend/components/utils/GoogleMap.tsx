"use client";
import { useEffect, useState } from "react";
import "./GoogleMap.scss";

export default function GoogleMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="google-map-section">
      <h4>📍 Bulevar Oslobođenja 97, Novi Sad</h4>
      <div className="google-map-frame">
        <iframe
          src="https://maps.google.com/maps?q=Koneti%20Café%2C%20Bulevar%20Oslobođenja%2097%2C%20Novi%20Sad&z=17&output=embed"
          width="100%"
          height="250"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Koneti Café lokacija"
        ></iframe>
      </div>
    </div>
  );
}
