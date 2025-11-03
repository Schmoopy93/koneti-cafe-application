import nodemailer from 'nodemailer';
import { logger } from './logger.js';
import dotenv from 'dotenv';
import DOMPurify from 'isomorphic-dompurify';

// Učitaj .env fajl
dotenv.config();

// URL do logo slike
const logoUrl = `${process.env.SERVER_URL || 'http://localhost:5000'}/koneti-logo.png`;


// --- Stilovi (osnova) ---
const baseStyle = `
  background-color: #f6f2ee;
  font-family: Arial, sans-serif;
  color: #333;
  padding: 30px 10px;
`;

const cardStyle = `
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  padding: 25px 30px;
  max-width: 600px;
  margin: 0 auto;
`;

const badgeStyle = `
  display: inline-block;
  background-color: #f3e5ab;
  color: #5a3e36;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.9rem;
  margin-top: 5px;
`;

const logoTemplate = `
  <div style="text-align:center; margin-bottom:15px;">
    <img src="${logoUrl}" alt="Koneti Café" style="width:120px; height:auto;" />
  </div>
`;

// --- HTML Email Templejti ---

const getUserConfirmationHTML = (reservation) => {
  // Sanitizuj sve user input-e
  const safeName = DOMPurify.sanitize(reservation.name || '');
  const safeDate = new Date(reservation.date).toLocaleDateString('sr-RS');
  const safeTime = DOMPurify.sanitize(reservation.time || '');
  const safeGuests = parseInt(reservation.guests) || 0;
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        ${logoTemplate}
        <h2 style="color: #5a3e36; text-align:center;">☕ Potvrda Prijema Rezervacije</h2>
        <p>Poštovani/a <strong>${safeName}</strong>,</p>
        <p>Hvala Vam što ste odabrali <strong>Koneti Café</strong>. Primili smo Vaš zahtev za rezervaciju i uskoro ćemo Vas obavestiti o statusu.</p>

        <h3 style="color:#5a3e36;">📅 Detalji Vaše Rezervacije:</h3>
        <ul style="list-style-type:none; padding:0;">
          <li><strong>Ime:</strong> ${safeName}</li>
          <li><strong>Datum:</strong> <span style="${badgeStyle}">${safeDate}</span></li>
          <li><strong>Vreme:</strong> <span style="${badgeStyle}">${safeTime}</span></li>
          <li><strong>Broj gostiju:</strong> <span style="${badgeStyle}">${safeGuests}</span></li>
        </ul>

        <p style="margin-top:20px;">Srdačan pozdrav,<br><strong>Vaš Koneti Café Tim</strong></p>
      </div>
    </div>
  `;
};

const getAdminNotificationHTML = (reservation) => {
  // Sanitizuj sve user input-e
  const safeName = DOMPurify.sanitize(reservation.name || '');
  const safeEmail = DOMPurify.sanitize(reservation.email || '');
  const safePhone = DOMPurify.sanitize(reservation.phone || '');
  const safeDate = new Date(reservation.date).toLocaleDateString('sr-RS');
  const safeTime = DOMPurify.sanitize(reservation.time || '');
  const safeGuests = parseInt(reservation.guests) || 0;
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        ${logoTemplate}
        <h2 style="color:#5a3e36; text-align:center;">📨 Nova Rezervacija Primljena</h2>
        <p>Primljena je nova rezervacija sa sledećim detaljima:</p>

        <ul style="list-style-type:none; padding:0;">
          <li><strong>ID Rezervacije:</strong> ${reservation._id}</li>
          <li><strong>Ime:</strong> ${safeName}</li>
          <li><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></li>
          <li><strong>Telefon:</strong> ${safePhone}</li>
          <li><strong>Datum:</strong> <span style="${badgeStyle}">${safeDate}</span></li>
          <li><strong>Vreme:</strong> <span style="${badgeStyle}">${safeTime}</span></li>
          <li><strong>Broj gostiju:</strong> <span style="${badgeStyle}">${safeGuests}</span></li>
        </ul>

        <p style="margin-top:15px;">Molimo Vas da pregledate i odobrite/odbijete rezervaciju u administratorskom panelu.</p>
      </div>
    </div>
  `;
};

const getApprovedEmailHTML = (reservation) => {
  const safeName = DOMPurify.sanitize(reservation.name || '');
  const safeDate = new Date(reservation.date).toLocaleDateString('sr-RS');
  const safeTime = DOMPurify.sanitize(reservation.time || '');
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        ${logoTemplate}
        <h2 style="color:#28a745; text-align:center;">✅ Vaša Rezervacija je Prihvaćena!</h2>
        <p>Poštovani/a <strong>${safeName}</strong>,</p>
        <p>Sa zadovoljstvom Vas obaveštavamo da je Vaša rezervacija za 
          <strong>${safeDate} u ${safeTime}</strong> prihvaćena.</p>

        <div style="text-align:center; margin:20px 0;">
          <span style="${badgeStyle}; background-color:#c3f7c7; color:#155724;">
            Potvrđeno
          </span>
        </div>

        <p>Radujemo se Vašem dolasku!</p>
        <p>Srdačan pozdrav,<br><strong>Vaš Koneti Café Tim</strong></p>
      </div>
    </div>
  `;
};

const getRejectedEmailHTML = (reservation) => {
  const safeName = DOMPurify.sanitize(reservation.name || '');
  const safeDate = new Date(reservation.date).toLocaleDateString('sr-RS');
  const safeTime = DOMPurify.sanitize(reservation.time || '');
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        ${logoTemplate}
        <h2 style="color:#dc3545; text-align:center;">❌ Vaša Rezervacija je Odbijena</h2>
        <p>Poštovani/a <strong>${safeName}</strong>,</p>
        <p>Nažalost, Vaša rezervacija za 
          <strong>${safeDate} u ${safeTime}</strong> nije moguća i odbijena je.</p>

        <div style="text-align:center; margin:20px 0;">
          <span style="${badgeStyle}; background-color:#f8d7da; color:#721c24;">
            Odbijeno
          </span>
        </div>

        <p>Izvinjavamo se zbog neprijatnosti i nadamo se da ćete nas posetiti neki drugi put.</p>
        <p>Srdačan pozdrav,<br><strong>Vaš Koneti Café Tim</strong></p>
      </div>
    </div>
  `;
};


// --- Konfiguracija Nodemailer Transportera ---
const transporterOptions = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

if (process.env.NODE_ENV === 'development') {
  transporterOptions.tls = { rejectUnauthorized: false };
  logger.warn('TLS certificate check is disabled in development mode for nodemailer.');
}

const transporter = nodemailer.createTransport(transporterOptions);

// --- Funkcije za Slanje Emailova ---

export const sendUserConfirmationEmail = async (reservation) => {
  if (!reservation || !reservation.email) {
    logger.warn('Skipping user confirmation email: missing reservation data or email.');
    return;
  }
  try {
    await transporter.sendMail({
      from: `Koneti Café <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: reservation.email,
      subject: 'Potvrda prijema rezervacije - Koneti Café',
      html: getUserConfirmationHTML(reservation),
    });
    logger.info(`Confirmation email sent to ${reservation.email}`);
  } catch (emailError) {
    logger.error(`Failed to send confirmation email to ${reservation.email}:`, emailError);
    throw emailError;
  }
};

export const sendAdminNotificationEmail = async (reservation) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    logger.warn('ADMIN_EMAIL not set, skipping admin notification email.');
    return;
  }
  try {
    await transporter.sendMail({
      from: `Koneti Café Notifikacije <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Nova rezervacija: ${reservation.name}`,
      html: getAdminNotificationHTML(reservation),
    });
    logger.info(`Admin notification sent for reservation ${reservation._id}`);
  } catch (adminEmailError) {
    logger.error(`Failed to send admin notification email:`, adminEmailError);
    throw adminEmailError;
  }
};

export const sendApprovedEmail = async (reservation) => {
  if (!reservation || !reservation.email) {
    logger.warn('Skipping approval email: missing reservation data or email.');
    return;
  }
  try {
    await transporter.sendMail({
      from: `Koneti Café <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: reservation.email,
      subject: 'Vaša rezervacija je prihvaćena!',
      html: getApprovedEmailHTML(reservation),
    });
    logger.info(`Approval email sent to ${reservation.email}`);
  } catch (e) {
    logger.error('Failed to send approval email:', e);
    throw e;
  }
};

export const sendRejectedEmail = async (reservation) => {
  if (!reservation || !reservation.email) {
    logger.warn('Skipping rejection email: missing reservation data or email.');
    return;
  }
  try {
    await transporter.sendMail({
      from: `Koneti Café <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: reservation.email,
      subject: 'Vaša rezervacija je odbijena',
      html: getRejectedEmailHTML(reservation),
    });
    logger.info(`Rejection email sent to ${reservation.email}`);
  } catch (e) {
    logger.error('Failed to send rejection email:', e);
    throw e;
  }
};
