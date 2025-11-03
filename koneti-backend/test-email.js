import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Učitaj .env varijable
dotenv.config();

async function verifyConnection() {
  // Kreiraj transporter sa identičnim podešavanjima kao u aplikaciji
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true', // treba da bude false za port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // Ovo smo dodali da rešimo problem sa sertifikatom
      rejectUnauthorized: false,
    },
  });

  console.log('Pokušavam da se povežem sa sledećim podacima:');
  console.log(`Host: ${process.env.SMTP_HOST}`);
  console.log(`Port: ${process.env.SMTP_PORT}`);
  console.log(`User: ${process.env.SMTP_USER}`);
  
  // --- DODATO ZA PROVERU ---
  if (process.env.SMTP_PASS) {
    console.log(`Dužina SMTP ključa: ${process.env.SMTP_PASS.length}`);
    console.log(`SMTP ključ počinje sa: ${process.env.SMTP_PASS.substring(0, 12)}...`);
  } else {
    console.log('GREŠKA: SMTP_PASS nije pronađen u .env fajlu!');
  }
  // --- KRAJ DODATKA ---

  console.log('-------------------------------------');

  try {
    // Pokušaj verifikacije konekcije
    await transporter.verify();
    console.log('✅ Uspešna konekcija sa SMTP serverom!');
    console.log('Sve je ispravno podešeno. Možete obrisati ovaj fajl.');
  } catch (error) {
    console.error('❌ Greška prilikom povezivanja sa SMTP serverom:');
    console.error(error);
  }
}

// Pokreni test
verifyConnection();