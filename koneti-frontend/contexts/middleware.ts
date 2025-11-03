import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Dohvati token iz kolačića
  const token = request.cookies.get("adminToken")?.value;

  // Ako token ne postoji i korisnik pokušava pristupiti zaštićenoj ruti
  if (!token) {
    // Preusmjeri ga na stranicu za prijavu
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Ako token postoji, dopusti pristup
  return NextResponse.next();
}

// Konfiguracija koja određuje na kojim rutama će se middleware izvršavati
export const config = {
  matcher: ["/admin/:path*", "/menu-management/:path*"],
};