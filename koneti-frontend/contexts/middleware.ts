import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Dohvati token iz kolačića
  const token = request.cookies.get("adminToken")?.value;

  // Ako token ne postoji i korisnik pokušava pristupiti zaštićenoj ruti
  if (!token) {
    // Extraktuuj jezični parametar iz URL-a
    const pathname = request.nextUrl.pathname;
    const langMatch = pathname.match(/^\/(sr|en)/);
    const lang = langMatch ? langMatch[1] : 'sr'; // Default na srpski ako jezik nije pronađen
    
    // Preusmjeri ga na stranicu za prijavu sa jezičkim parametrom
    return NextResponse.redirect(new URL(`/${lang}/login`, request.url));
  }

  // Ako token postoji, dopusti pristup
  return NextResponse.next();
}

// Konfiguracija koja određuje na kojim rutama će se middleware izvršavati
export const config = {
  matcher: ["/sr/admin/:path*", "/en/admin/:path*", "/sr/menu-management/:path*", "/en/menu-management/:path*"],
};