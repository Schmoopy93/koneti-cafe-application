import nodemailer from "nodemailer";
import { logger } from "./logger.js";
import dotenv from "dotenv";
import DOMPurify from "isomorphic-dompurify";

dotenv.config();

const logoUrl =
  process.env.NODE_ENV === "production"
    ? "https://koneti-cafe-application.vercel.app/koneti-logo.png"
    : "https://koneti-cafe-application.vercel.app/koneti-logo.png";

// Helper za kreiranje responsive email wrapper-a
const createEmailWrapper = (content) => `
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Koneti Café</title>
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; color: #333; }
        table { border-collapse: collapse; width: 100%; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .content { padding: 20px; }
        .header-cell { padding: 20px; text-align: center; background-color: #ffffff; border-bottom: 2px solid #f3e5ab; }
        .data-row { padding: 12px 0; border-bottom: 1px solid rgba(90,62,54,0.1); }
        .data-label { font-weight: 600; color: #5a3e36; padding-right: 10px; width: 40%; vertical-align: top; }
        .data-value { color: #555; word-wrap: break-word; }
        .badge { display: inline-block; background: #f3e5ab; color: #5a3e36; padding: 6px 12px; border-radius: 15px; border: 1px solid #5a3e36; font-size: 0.9rem; }
        .info-box { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 8px; }
        .warning-box { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 12px; margin: 15px 0; border-radius: 8px; color: #856404; }
        .success-box { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 12px; margin: 15px 0; border-radius: 8px; color: #155724; }
        .button { display: block; text-align: center; background: #f3e5ab; color: #5a3e36; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-weight: 600; border: 2px solid #5a3e36; margin: 20px auto; width: fit-content; }
        .footer-text { text-align: center; margin: 20px 0; color: #666; font-size: 0.9rem; }
        .divider { border-top: 2px solid #f3e5ab; margin: 20px 0; }
        img { max-width: 100%; height: auto; }
        @media (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 15px !important; }
            .data-label { width: 100% !important; display: block; margin-bottom: 5px; }
            .data-value { display: block; }
            .data-row { padding: 10px 0; }
            table { font-size: 0.9rem; }
            h1 { font-size: 22px !important; }
            h2 { font-size: 18px !important; }
            h3 { font-size: 16px !important; }
            .badge { display: block; margin: 5px 0; padding: 8px; text-align: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        ${content}
    </div>
</body>
</html>
`;

const logoTemplate = `
<table style="width: 100%; text-align: center; margin: 20px 0;">
    <tr>
        <td>
            <img src="${logoUrl}" alt="Koneti Café" style="width: 120px; height: auto; border-radius: 10px;">
            <h1 style="margin: 15px 0 5px 0; font-size: 28px; color: #5a3e36; font-weight: 700;">Koneti Café</h1>
            <p style="margin: 0; color: #8a6f47; font-style: italic; font-size: 0.9rem;">Vaše mesto za savršene trenutke ☕</p>
        </td>
    </tr>
</table>
`;

const getUserConfirmationHTML = (reservation) => {
  const safeName = DOMPurify.sanitize(reservation.name || "");
  const safeDate = new Date(reservation.date).toLocaleDateString("sr-RS");
  const safeTime = DOMPurify.sanitize(reservation.time || "");
  const safeEndTime = reservation.endTime
    ? DOMPurify.sanitize(reservation.endTime)
    : null;
  const safeGuests = parseInt(reservation.guests) || 0;
  const safeType =
    reservation.type === "experience" ? "Koneti Experience" : "Biznis Sastanak";

  const content = `
    <div class="content">
        <div class="header-cell">
            <h2 style="margin: 0; font-size: 24px; color: #5a3e36;">✨ Potvrda Prijema Rezervacije</h2>
        </div>
        
        ${logoTemplate}
        
        <div class="info-box">
            <p style="font-size: 18px; margin: 0 0 10px 0;">Zdravo <strong style="color: #5a3e36;">${safeName}</strong>! 👋</p>
            <p style="margin: 0; line-height: 1.6;">Hvala Vam što ste odabrali <strong>Koneti Café</strong>. Vaša rezervacija je uspešno primljena i uskoro ćemo Vas obavestiti o statusu.</p>
        </div>
        
        <h3 style="color: #5a3e36; margin: 20px 0 15px 0; text-align: center;">📅 Detalji Vaše Rezervacije</h3>
        
        <table style="width: 100%;">
            <tr class="data-row">
                <td class="data-label">👤 Ime:</td>
                <td class="data-value"><span class="badge">${safeName}</span></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">📅 Datum:</td>
                <td class="data-value"><span class="badge">${safeDate}</span></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">⏰ ${safeEndTime ? "Početak" : "Vreme"}:</td>
                <td class="data-value"><span class="badge">${safeTime}</span></td>
            </tr>
            ${
              safeEndTime
                ? `<tr class="data-row">
                <td class="data-label">⏰ Završetak:</td>
                <td class="data-value"><span class="badge">${safeEndTime}</span></td>
            </tr>`
                : ""
            }
            <tr class="data-row">
                <td class="data-label">👥 Gosti:</td>
                <td class="data-value"><span class="badge">${safeGuests}</span></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">✨ Tip:</td>
                <td class="data-value"><span class="badge">${safeType}</span></td>
            </tr>
        </table>
        
        <div class="footer-text">
            <p style="margin: 20px 0;">Bićete obavešteni email-om čim admin pregleda Vašu rezervaciju.</p>
        </div>
        
        <div class="divider"></div>
        
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin: 0; color: #5a3e36; font-size: 16px;">Srdačan pozdrav,</p>
            <p style="margin: 5px 0 0 0; font-weight: 700; color: #5a3e36; font-size: 18px;">Vaš Koneti Café Tim ☕</p>
        </div>
    </div>
  `;

  return createEmailWrapper(content);
};

const getAdminNotificationHTML = (reservation) => {
  const safeName = DOMPurify.sanitize(reservation.name || "");
  const safeEmail = DOMPurify.sanitize(reservation.email || "");
  const safePhone = DOMPurify.sanitize(reservation.phone || "");
  const safeDate = new Date(reservation.date).toLocaleDateString("sr-RS");
  const safeTime = DOMPurify.sanitize(reservation.time || "");
  const safeEndTime = reservation.endTime
    ? DOMPurify.sanitize(reservation.endTime)
    : null;
  const safeGuests = parseInt(reservation.guests) || 0;
  const safeType =
    reservation.type === "experience" ? "Koneti Experience" : "Biznis Sastanak";
  const safeSubType = reservation.subType
    ? reservation.subType.charAt(0).toUpperCase() + reservation.subType.slice(1)
    : "Basic";

  const content = `
    <div class="content">
        <div class="header-cell" style="border-bottom-color: #dc3545;">
            <h2 style="margin: 0; font-size: 24px; color: #dc3545;">🔔 Nova Rezervacija!</h2>
        </div>
        
        ${logoTemplate}
        
        <div class="warning-box">
            <p style="margin: 0; font-weight: 600;">⚠️ Nova rezervacija čeka Vašu potvrdu!</p>
        </div>
        
        <h3 style="color: #1565c0; margin: 20px 0 15px 0; text-align: center;">📋 Detalji Rezervacije</h3>
        
        <table style="width: 100%;">
            <tr class="data-row">
                <td class="data-label">🆔 ID:</td>
                <td class="data-value"><code style="background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-size: 0.9rem;">${reservation._id}</code></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">👤 Ime:</td>
                <td class="data-value"><span class="badge">${safeName}</span></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">📧 Email:</td>
                <td class="data-value"><a href="mailto:${safeEmail}" style="text-decoration: none;"><span class="badge">${safeEmail}</span></a></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">📞 Telefon:</td>
                <td class="data-value"><a href="tel:${safePhone}" style="text-decoration: none;"><span class="badge">${safePhone}</span></a></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">📅 Datum:</td>
                <td class="data-value"><span class="badge">${safeDate}</span></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">⏰ ${safeEndTime ? "Početak" : "Vreme"}:</td>
                <td class="data-value"><span class="badge">${safeTime}</span></td>
            </tr>
            ${
              safeEndTime
                ? `<tr class="data-row">
                <td class="data-label">⏰ Završetak:</td>
                <td class="data-value"><span class="badge">${safeEndTime}</span></td>
            </tr>`
                : ""
            }
            <tr class="data-row">
                <td class="data-label">👥 Gosti:</td>
                <td class="data-value"><span class="badge">${safeGuests}</span></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">✨ Tip:</td>
                <td class="data-value"><span class="badge">${safeType} - ${safeSubType}</span></td>
            </tr>
        </table>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://koneticaffee.com/admin" class="button">📊 Idi na Admin Panel</a>
        </div>
        
        <div class="info-box">
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Molimo Vas da pregledate i odobrite/odbijete rezervaciju u administratorskom panelu.</p>
        </div>
    </div>
  `;

  return createEmailWrapper(content);
};

const getApprovedEmailHTML = (reservation) => {
  const safeName = DOMPurify.sanitize(reservation.name || "");
  const safeDate = new Date(reservation.date).toLocaleDateString("sr-RS");
  const safeTime = DOMPurify.sanitize(reservation.time || "");
  const safeEndTime = reservation.endTime
    ? DOMPurify.sanitize(reservation.endTime)
    : null;

  const content = `
    <div class="content">
        ${logoTemplate}
        
        <h2 style="color: #28a745; text-align: center; margin: 20px 0;">✅ Vaša Rezervacija je Prihvaćena!</h2>
        
        <p style="margin: 15px 0;">Poštovani/a <strong>${safeName}</strong>,</p>
        <p style="margin: 15px 0;">Sa zadovoljstvom Vas obaveštavamo da je Vaša rezervacija za <strong>${safeDate} ${
    safeEndTime ? `od ${safeTime} do ${safeEndTime}` : `u ${safeTime}`
  }</strong> prihvaćena.</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <span class="badge" style="background-color: #c3f7c7; color: #155724; border-color: #28a745;">Potvrđeno ✓</span>
        </div>
        
        <p style="margin: 15px 0;">Radujemo se Vašem dolasku!</p>
        <p style="margin: 15px 0;">Srdačan pozdrav,<br><strong>Vaš Koneti Café Tim</strong></p>
    </div>
  `;

  return createEmailWrapper(content);
};

const getRejectedEmailHTML = (reservation) => {
  const safeName = DOMPurify.sanitize(reservation.name || "");
  const safeDate = new Date(reservation.date).toLocaleDateString("sr-RS");
  const safeTime = DOMPurify.sanitize(reservation.time || "");
  const safeEndTime = reservation.endTime
    ? DOMPurify.sanitize(reservation.endTime)
    : null;

  const content = `
    <div class="content">
        ${logoTemplate}
        
        <h2 style="color: #dc3545; text-align: center; margin: 20px 0;">❌ Vaša Rezervacija je Odbijena</h2>
        
        <p style="margin: 15px 0;">Poštovani/a <strong>${safeName}</strong>,</p>
        <p style="margin: 15px 0;">Nažalost, Vaša rezervacija za <strong>${safeDate} ${
    safeEndTime ? `od ${safeTime} do ${safeEndTime}` : `u ${safeTime}`
  }</strong> nije moguća i odbijena je.</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <span class="badge" style="background-color: #f8d7da; color: #721c24; border-color: #dc3545;">Odbijeno</span>
        </div>
        
        <p style="margin: 15px 0;">Izvinjavamo se zbog neprijatnosti i nadamo se da ćete nas posetiti neki drugi put.</p>
        <p style="margin: 15px 0;">Srdačan pozdrav,<br><strong>Vaš Koneti Café Tim</strong></p>
    </div>
  `;

  return createEmailWrapper(content);
};

const getCareerStatusHTML = (application, status) => {
  const safeFirstName = DOMPurify.sanitize(application.firstName || "");
  const safeLastName = DOMPurify.sanitize(application.lastName || "");
  const safePosition = DOMPurify.sanitize(application.position || "");

  const statusMessages = {
    contacted: {
      title: "📞 Kontaktiraćemo Vas uskoro!",
      message:
        "Vaša prijava je pregledana i zainteresovani smo za razgovor sa Vama.",
      description:
        "Naš tim će Vas kontaktirati u narednih nekoliko dana radi dogovaranja intervjua.",
    },
    reviewed: {
      title: "👀 Vaša prijava je pregledana",
      message: "Hvala Vam na interesovanju za rad u Koneti Café.",
      description:
        "Vaša prijava je pregledana i obavestićemo Vas o daljem toku procesa.",
    },
    rejected: {
      title: "🙏 Hvala na prijavi",
      message: "Nažalost, trenutno ne možemo da Vam ponudimo poziciju.",
      description:
        "Čuvaćemo Vašu prijavu i kontaktirati Vas ako se ukaže prilika u budućnosti.",
    },
  };

  const statusInfo = statusMessages[status] || statusMessages.reviewed;

  const content = `
    <div class="content">
        <div class="header-cell">
            <h2 style="margin: 0; font-size: 24px; color: #5a3e36;">${statusInfo.title}</h2>
        </div>
        
        ${logoTemplate}
        
        <div class="info-box">
            <p style="font-size: 18px; margin: 0 0 10px 0;">Zdravo <strong style="color: #5a3e36;">${safeFirstName} ${safeLastName}</strong>! 👋</p>
            <p style="margin: 0; line-height: 1.6;">${statusInfo.message}</p>
        </div>
        
        <div style="background: #f0f8ff; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #1565c0;">
            <h3 style="color: #5a3e36; margin: 0 0 10px 0; text-align: center;">💼 ${safePosition}</h3>
            <p style="text-align: center; margin: 0; line-height: 1.6;">${statusInfo.description}</p>
        </div>
        
        <div class="divider"></div>
        
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin: 0; color: #5a3e36; font-size: 16px;">Srdačan pozdrav,</p>
            <p style="margin: 5px 0 0 0; font-weight: 700; color: #5a3e36; font-size: 18px;">Vaš Koneti Café Tim ☕</p>
        </div>
    </div>
  `;

  return createEmailWrapper(content);
};

const getCareerConfirmationHTML = (application) => {
  const safeFirstName = DOMPurify.sanitize(application.firstName || "");
  const safeLastName = DOMPurify.sanitize(application.lastName || "");
  const safePosition = DOMPurify.sanitize(application.position || "");

  const content = `
    <div class="content">
        <div class="header-cell">
            <h2 style="margin: 0; font-size: 24px; color: #5a3e36;">✨ Potvrda Prijema Prijave</h2>
        </div>
        
        ${logoTemplate}
        
        <div class="info-box">
            <p style="font-size: 18px; margin: 0 0 10px 0;">Zdravo <strong style="color: #5a3e36;">${safeFirstName} ${safeLastName}</strong>! 👋</p>
            <p style="margin: 0; line-height: 1.6;">Hvala Vam što ste se prijavili za poziciju u <strong>Koneti Café</strong>. Vaša prijava je uspešno primljena i uskoro ćemo Vas kontaktirati.</p>
        </div>
        
        <h3 style="color: #5a3e36; margin: 20px 0 15px 0; text-align: center;">💼 Detalji Vaše Prijave</h3>
        
        <table style="width: 100%;">
            <tr class="data-row">
                <td class="data-label">👤 Kandidat:</td>
                <td class="data-value"><span class="badge">${safeFirstName} ${safeLastName}</span></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">💼 Pozicija:</td>
                <td class="data-value"><span class="badge">${safePosition}</span></td>
            </tr>
        </table>
        
        <div class="footer-text">
            <p style="margin: 20px 0;">Bićete obavešteni kada pregledam Vašu prijavu.</p>
        </div>
        
        <div class="divider"></div>
        
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin: 0; color: #5a3e36; font-size: 16px;">Srdačan pozdrav,</p>
            <p style="margin: 5px 0 0 0; font-weight: 700; color: #5a3e36; font-size: 18px;">Vaš Koneti Café Tim ☕</p>
        </div>
    </div>
  `;

  return createEmailWrapper(content);
};

const getCareerApplicationHTML = (application) => {
  const safeFirstName = DOMPurify.sanitize(application.firstName || "");
  const safeLastName = DOMPurify.sanitize(application.lastName || "");
  const safeEmail = DOMPurify.sanitize(application.email || "");
  const safePhone = DOMPurify.sanitize(application.phone || "");
  const safePosition = DOMPurify.sanitize(application.position || "");
  const safeCoverLetter = DOMPurify.sanitize(application.coverLetter || "");

  const content = `
    <div class="content">
        <div class="header-cell" style="border-bottom-color: #28a745;">
            <h2 style="margin: 0; font-size: 24px; color: #28a745;">💼 Nova Prijava za Posao!</h2>
        </div>
        
        ${logoTemplate}
        
        <div class="success-box">
            <p style="margin: 0; font-weight: 600;">📋 Nova prijava za posao je stigla!</p>
        </div>
        
        <h3 style="color: #28a745; margin: 20px 0 15px 0; text-align: center;">👤 Podaci o Kandidatu</h3>
        
        <table style="width: 100%;">
            <tr class="data-row">
                <td class="data-label">👤 Ime:</td>
                <td class="data-value"><span class="badge">${safeFirstName} ${safeLastName}</span></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">📧 Email:</td>
                <td class="data-value"><a href="mailto:${safeEmail}" style="text-decoration: none;"><span class="badge">${safeEmail}</span></a></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">📞 Telefon:</td>
                <td class="data-value"><a href="tel:${safePhone}" style="text-decoration: none;"><span class="badge">${safePhone}</span></a></td>
            </tr>
            <tr class="data-row">
                <td class="data-label">💼 Pozicija:</td>
                <td class="data-value"><span class="badge" style="background-color: #d4edda; color: #155724; border-color: #28a745;">${safePosition}</span></td>
            </tr>
        </table>
        
        <h4 style="color: #28a745; margin: 20px 0 10px 0;">📝 Propratno Pismo:</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${safeCoverLetter}</p>
        </div>
        
        <div class="info-box">
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Molimo Vas da pregledate prijavu i kontaktirate kandidata.</p>
        </div>
    </div>
  `;

  return createEmailWrapper(content);
};

// --- Konfiguracija Nodemailer Transportera ---
const transporterOptions = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === "true",
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
};

if (process.env.NODE_ENV === "development") {
  transporterOptions.tls = { rejectUnauthorized: false };
  logger.warn(
    "TLS certificate check is disabled in development mode for nodemailer."
  );
}

const transporter = nodemailer.createTransport(transporterOptions);

// --- Retry funkcija za email slanje ---
const sendEmailWithRetry = async (mailOptions, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      logger.warn(
        `Email attempt ${attempt}/${maxRetries} failed:`,
        error.message
      );

      if (attempt === maxRetries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

// --- Funkcije za Slanje Emailova ---

export const sendUserConfirmationEmail = async (reservation) => {
  if (!reservation || !reservation.email) {
    logger.warn(
      "Skipping user confirmation email: missing reservation data or email."
    );
    return;
  }
  try {
    const result = await sendEmailWithRetry({
      from: {
        name: "Koneti Café",
        address: process.env.MAIL_FROM || process.env.SMTP_USER,
      },
      to: reservation.email,
      subject: "Potvrda prijema rezervacije - Koneti Café",
      html: getUserConfirmationHTML(reservation),
    });

    logger.info(`Confirmation email sent to ${reservation.email}`);
  } catch (emailError) {
    logger.error(
      `Failed to send confirmation email to ${reservation.email}:`,
      emailError
    );
    throw emailError;
  }
};

export const sendAdminNotificationEmail = async (reservation) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    logger.warn("ADMIN_EMAIL not set, skipping admin notification email.");
    return;
  }
  try {
    const result = await sendEmailWithRetry({
      from: {
        name: "Koneti Café Notifikacije",
        address: process.env.MAIL_FROM || process.env.SMTP_USER,
      },
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
    logger.warn("Skipping approval email: missing reservation data or email.");
    return;
  }
  try {
    await sendEmailWithRetry({
      from: {
        name: "Koneti Café",
        address: process.env.MAIL_FROM || process.env.SMTP_USER,
      },
      to: reservation.email,
      subject: "Vaša rezervacija je prihvaćena!",
      html: getApprovedEmailHTML(reservation),
    });
    logger.info(`Approval email sent to ${reservation.email}`);
  } catch (e) {
    logger.error("Failed to send approval email:", e);
    throw e;
  }
};

export const sendRejectedEmail = async (reservation) => {
  if (!reservation || !reservation.email) {
    logger.warn("Skipping rejection email: missing reservation data or email.");
    return;
  }
  try {
    await sendEmailWithRetry({
      from: {
        name: "Koneti Café",
        address: process.env.MAIL_FROM || process.env.SMTP_USER,
      },
      to: reservation.email,
      subject: "Vaša rezervacija je odbijena",
      html: getRejectedEmailHTML(reservation),
    });
    logger.info(`Rejection email sent to ${reservation.email}`);
  } catch (e) {
    logger.error("Failed to send rejection email:", e);
    throw e;
  }
};

export const sendCareerApplicationEmail = async (application) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    logger.warn("ADMIN_EMAIL not set, skipping career application email.");
    return;
  }
  try {
    await sendEmailWithRetry({
      from: {
        name: "Koneti Café Karijere",
        address: process.env.MAIL_FROM || process.env.SMTP_USER,
      },
      to: adminEmail,
      subject: `Nova prijava za posao: ${application.firstName} ${application.lastName} - ${application.position}`,
      html: getCareerApplicationHTML(application),
    });
    logger.info(
      `Career application email sent for ${application.firstName} ${application.lastName}`
    );
  } catch (e) {
    logger.error("Failed to send career application email:", e);
    throw e;
  }
};

export const sendCareerConfirmationEmail = async (application) => {
  if (!application || !application.email) {
    logger.warn(
      "Skipping career confirmation email: missing application data or email."
    );
    return;
  }
  try {
    await sendEmailWithRetry({
      from: {
        name: "Koneti Café",
        address: process.env.MAIL_FROM || process.env.SMTP_USER,
      },
      to: application.email,
      subject: "Potvrda prijema prijave za posao - Koneti Café",
      html: getCareerConfirmationHTML(application),
    });
    logger.info(`Career confirmation email sent to ${application.email}`);
  } catch (e) {
    logger.error("Failed to send career confirmation email:", e);
    throw e;
  }
};

export const sendCareerStatusEmail = async (application, status) => {
  if (!application || !application.email) {
    logger.warn(
      "Skipping career status email: missing application data or email."
    );
    return;
  }
  try {
    const subject =
      status === "contacted"
        ? "Kontaktiraćemo Vas uskoro - Koneti Café"
        : `Ažuriranje statusa prijave - Koneti Café`;

    await sendEmailWithRetry({
      from: {
        name: "Koneti Café",
        address: process.env.MAIL_FROM || process.env.SMTP_USER,
      },
      to: application.email,
      subject: subject,
      html: getCareerStatusHTML(application, status),
    });
    logger.info(
      `Career status email sent to ${application.email} for status: ${status}`
    );
  } catch (e) {
    logger.error("Failed to send career status email:", e);
    throw e;
  }
};

export const sendAdminActivationEmail = async (admin, activationLink) => {
  if (!admin || !admin.email) {
    logger.warn(
      "Skipping admin activation email: missing admin data or email."
    );
    return;
  }
  try {
    const html = createEmailWrapper(`
      <div class="content">
          ${logoTemplate}
          <h2 style="color: #5a3e36; text-align: center; margin: 20px 0;">Aktivacija admin naloga</h2>
          <p style="margin: 15px 0;">Zdravo <strong>${DOMPurify.sanitize(
            admin.name || admin.email
          )}</strong>,</p>
          <p style="margin: 15px 0;">Za aktivaciju Vašeg admin naloga kliknite na sledeći link:</p>
          <div style="text-align: center; margin: 30px 0;">
              <a href="${activationLink}" class="button">Aktiviraj nalog</a>
          </div>
          <p style="margin: 15px 0; color: #888; font-size: 0.9rem;">Ako niste tražili ovaj nalog, slobodno ignorišite ovaj email.</p>
      </div>
    `);

    await sendEmailWithRetry({
      from: {
        name: "Koneti Café",
        address: process.env.MAIL_FROM || process.env.SMTP_USER,
      },
      to: admin.email,
      subject: "Aktivacija admin naloga - Koneti Café",
      html,
    });
    logger.info(`Admin activation email sent to ${admin.email}`);
  } catch (e) {
    logger.error("Failed to send admin activation email:", e);
    throw e;
  }
};