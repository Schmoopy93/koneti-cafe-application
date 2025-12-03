import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://koneticaffee.com';
  
  const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${baseUrl}/sr</loc>
    <video:video>
      <video:title>Koneti Café - Promo Video</video:title>
      <video:description>Upoznajte Koneti Café - premium kafić u Novom Sadu sa specialty kafi, brunchom i prostorom za Events</video:description>
      <video:thumbnail_loc>${baseUrl}/koneti-hero-poster.jpg</video:thumbnail_loc>
      <video:content_loc>${baseUrl}/koneti-promo.mp4</video:content_loc>
      <video:player_loc allow_embed="yes">${baseUrl}/sr?video=promo</video:player_loc>
      <video:duration>30</video:duration>
      <video:publication_date>${new Date().toISOString().split('T')[0]}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:tag>kafić</video:tag>
      <video:tag>specialty coffee</video:tag>
      <video:tag>brunch</video:tag>
      <video:tag>proslave</video:tag>
    </video:video>
  </url>
  <url>
    <loc>${baseUrl}/en</loc>
    <video:video>
      <video:title>Koneti Café - Promo Video</video:title>
      <video:description>Discover Koneti Café - premium café in Novi Sad with specialty coffee, brunch and space for Events</video:description>
      <video:thumbnail_loc>${baseUrl}/koneti-hero-poster.jpg</video:thumbnail_loc>
      <video:content_loc>${baseUrl}/koneti-promo.mp4</video:content_loc>
      <video:player_loc allow_embed="yes">${baseUrl}/en?video=promo</video:player_loc>
      <video:duration>30</video:duration>
      <video:publication_date>${new Date().toISOString().split('T')[0]}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:tag>café</video:tag>
      <video:tag>specialty coffee</video:tag>
      <video:tag>brunch</video:tag>
      <video:tag>events</video:tag>
    </video:video>
  </url>
</urlset>`;

  return new NextResponse(videoSitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
