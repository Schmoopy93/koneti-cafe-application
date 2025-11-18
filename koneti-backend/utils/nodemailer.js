import nodemailer from 'nodemailer';
import { logger } from './logger.js';
import dotenv from 'dotenv';
import DOMPurify from 'isomorphic-dompurify';

// Učitaj .env fajl
dotenv.config();

// URL do logo slike - koristi Vercel frontend
const logoUrl = process.env.NODE_ENV === 'production' 
  ? 'https://koneti-cafe-application.vercel.app/koneti-logo.png'
  : 'https://koneti-cafe-application.vercel.app/koneti-logo.png'; // Uvek koristi Vercel za logo


// --- Ulepšani Stilovi ---
const baseStyle = `
  background: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  padding: 40px 20px;
  min-height: 100vh;
`;

const cardStyle = `
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(90, 62, 54, 0.15);
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid rgba(90, 62, 54, 0.1);
`;

const badgeStyle = `
  display: inline-block;
  background: #f3e5ab;
  color: #5a3e36;
  border-radius: 25px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 5px 5px 5px 0;
  border: 1px solid #5a3e36;
`;

const headerStyle = `
  background: #ffffff;
  color: #5a3e36;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  border: 2px solid #f3e5ab;
  margin-bottom: 30px;
`;

const buttonStyle = `
  display: inline-block;
  background: #f3e5ab;
  color: #5a3e36;
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  margin: 20px 0;
  border: 2px solid #5a3e36;
`;

const logoTemplate = `
  <div style="text-align:center; margin-bottom:20px;">
    <img src="${logoUrl}" alt="Koneti Café" style="width:150px; height:auto; border-radius:10px;" />
    <h1 style="margin:15px 0 5px 0; font-size:28px; color:#5a3e36; font-weight:700;">Koneti Café</h1>
    <p style="margin:0; color:#8a6f47; font-style:italic;">Vaše mesto za savršene trenutke ☕</p>
  </div>
`;

// --- HTML Email Templejti ---

const getUserConfirmationHTML = (reservation) => {
  // Sanitizuj sve user input-e
  const safeName = DOMPurify.sanitize(reservation.name || '');
  const safeDate = new Date(reservation.date).toLocaleDateString('sr-RS');
  const safeTime = DOMPurify.sanitize(reservation.time || '');
  const safeGuests = parseInt(reservation.guests) || 0;
  const safeType = reservation.type === 'koneti' ? 'Koneti Experience' : 'Biznis Sastanak';
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <h2 style="margin:0; font-size:24px;">✨ Potvrda Prijema Rezervacije</h2>
        </div>
        
        ${logoTemplate}
        
        <div style="background:#f8f9fa; padding:20px; border-radius:10px; margin:20px 0;">
          <p style="font-size:18px; margin:0 0 10px 0;">Zdravo <strong style="color:#5a3e36;">${safeName}</strong>! 👋</p>
          <p style="margin:0; line-height:1.6;">Hvala Vam što ste odabrali <strong>Koneti Café</strong>. Vaša rezervacija je uspešno primljena i uskoro ćemo Vas obavestiti o statusu.</p>
        </div>

        <div style="background:#ffffff; padding:25px; border-radius:15px; margin:25px 0; border: 2px solid #f3e5ab;">
          <h3 style="color:#5a3e36; margin:0 0 20px 0; text-align:center; font-size:20px;">📅 Detalji Vaše Rezervacije</h3>
          <div style="display:grid; gap:15px;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(90,62,54,0.1);">
              <span style="font-weight:600; color:#5a3e36;">👤 Ime:</span>
              <span style="${badgeStyle}">${safeName}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(90,62,54,0.1);">
              <span style="font-weight:600; color:#5a3e36;">📅 Datum:</span>
              <span style="${badgeStyle}">${safeDate}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(90,62,54,0.1);">
              <span style="font-weight:600; color:#5a3e36;">⏰ Vreme:</span>
              <span style="${badgeStyle}">${safeTime}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(90,62,54,0.1);">
              <span style="font-weight:600; color:#5a3e36;">👥 Gosti:</span>
              <span style="${badgeStyle}">${safeGuests}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0;">
              <span style="font-weight:600; color:#5a3e36;">✨ Tip:</span>
              <span style="${badgeStyle}">${safeType}</span>
            </div>
          </div>
        </div>

        <div style="text-align:center; margin:30px 0;">
          <p style="color:#666; font-style:italic; margin:0;">Bićete obavešteni email-om čim admin pregleda Vašu rezervaciju.</p>
        </div>

        <div style="border-top:2px solid #f3e5ab; padding-top:20px; text-align:center;">
          <p style="margin:0; color:#5a3e36; font-size:16px;">Srdačan pozdrav,</p>
          <p style="margin:5px 0 0 0; font-weight:700; color:#5a3e36; font-size:18px;">Vaš Koneti Café Tim ☕</p>
        </div>
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
  const safeType = reservation.type === 'koneti' ? 'Koneti Experience' : 'Biznis Sastanak';
  const safeSubType = reservation.subType ? reservation.subType.charAt(0).toUpperCase() + reservation.subType.slice(1) : 'Basic';
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}; border-color: #dc3545; color: #dc3545;">
          <h2 style="margin:0; font-size:24px;">🔔 Nova Rezervacija!</h2>
        </div>
        
        ${logoTemplate}
        
        <div style="background:#fff3cd; border:1px solid #ffeaa7; padding:15px; border-radius:10px; margin:20px 0;">
          <p style="margin:0; color:#856404; font-weight:600;">⚠️ Nova rezervacija čeka Vašu potvrdu!</p>
        </div>

        <div style="background:#ffffff; padding:25px; border-radius:15px; margin:25px 0; border: 2px solid #f3e5ab;">
          <h3 style="color:#1565c0; margin:0 0 20px 0; text-align:center; font-size:20px;">📋 Detalji Rezervacije</h3>
          
          <div style="background:white; padding:20px; border-radius:10px; margin-bottom:15px;">
            <div style="display:grid; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#1565c0;">🆔 ID:</span>
                <code style="background:#f8f9fa; padding:4px 8px; border-radius:4px; font-size:12px;">${reservation._id}</code>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#1565c0;">👤 Ime:</span>
                <span style="${badgeStyle}">${safeName}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#1565c0;">📧 Email:</span>
                <a href="mailto:${safeEmail}" style="${badgeStyle}; text-decoration:none; color:#5a3e36;">${safeEmail}</a>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#1565c0;">📞 Telefon:</span>
                <a href="tel:${safePhone}" style="${badgeStyle}; text-decoration:none; color:#5a3e36;">${safePhone}</a>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#1565c0;">📅 Datum:</span>
                <span style="${badgeStyle}">${safeDate}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#1565c0;">⏰ Vreme:</span>
                <span style="${badgeStyle}">${safeTime}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#1565c0;">👥 Gosti:</span>
                <span style="${badgeStyle}">${safeGuests}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0;">
                <span style="font-weight:600; color:#1565c0;">✨ Tip:</span>
                <span style="${badgeStyle}">${safeType} - ${safeSubType}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align:center; margin:30px 0;">
          <a href="https://koneti-cafe-application.vercel.app/admin" style="${buttonStyle}; text-decoration:none;">
            📊 Idi na Admin Panel
          </a>
        </div>

        <div style="background:#f8f9fa; padding:15px; border-radius:10px; text-align:center;">
          <p style="margin:0; color:#666; font-size:14px;">Molimo Vas da pregledate i odobrite/odbijete rezervaciju u administratorskom panelu.</p>
        </div>
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

const getCareerStatusHTML = (application, status) => {
  const safeFirstName = DOMPurify.sanitize(application.firstName || '');
  const safeLastName = DOMPurify.sanitize(application.lastName || '');
  const safePosition = DOMPurify.sanitize(application.position || '');
  
  const statusMessages = {
    contacted: {
      title: '📞 Kontaktiraćemo Vas uskoro!',
      message: 'Vaša prijava je pregledana i zainteresovani smo za razgovor sa Vama.',
      description: 'Naš tim će Vas kontaktirati u narednih nekoliko dana radi dogovaranja intervjua.'
    },
    reviewed: {
      title: '👀 Vaša prijava je pregledana',
      message: 'Hvala Vam na interesovanju za rad u Koneti Café.',
      description: 'Vaša prijava je pregledana i obavestićemo Vas o daljem toku procesa.'
    },
    rejected: {
      title: '🙏 Hvala na prijavi',
      message: 'Nažalost, trenutno ne možemo da Vam ponudimo poziciju.',
      description: 'Čuvaćemo Vašu prijavu i kontaktirati Vas ako se ukaže prilika u budućnosti.'
    }
  };
  
  const statusInfo = statusMessages[status] || statusMessages.reviewed;
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <h2 style="margin:0; font-size:24px;">${statusInfo.title}</h2>
        </div>
        
        ${logoTemplate}
        
        <div style="background:#f8f9fa; padding:20px; border-radius:10px; margin:20px 0;">
          <p style="font-size:18px; margin:0 0 10px 0;">Zdravo <strong style="color:#5a3e36;">${safeFirstName} ${safeLastName}</strong>! 👋</p>
          <p style="margin:0; line-height:1.6;">${statusInfo.message}</p>
        </div>

        <div style="background:#ffffff; padding:25px; border-radius:15px; margin:25px 0; border: 2px solid #f3e5ab;">
          <h3 style="color:#5a3e36; margin:0 0 20px 0; text-align:center; font-size:20px;">💼 ${safePosition}</h3>
          <p style="text-align:center; margin:0; line-height:1.6;">${statusInfo.description}</p>
        </div>

        <div style="border-top:2px solid #f3e5ab; padding-top:20px; text-align:center;">
          <p style="margin:0; color:#5a3e36; font-size:16px;">Srdačan pozdrav,</p>
          <p style="margin:5px 0 0 0; font-weight:700; color:#5a3e36; font-size:18px;">Vaš Koneti Café Tim ☕</p>
        </div>
      </div>
    </div>
  `;
};

const getCareerConfirmationHTML = (application) => {
  const safeFirstName = DOMPurify.sanitize(application.firstName || '');
  const safeLastName = DOMPurify.sanitize(application.lastName || '');
  const safePosition = DOMPurify.sanitize(application.position || '');
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}">
          <h2 style="margin:0; font-size:24px;">✨ Potvrda Prijema Prijave</h2>
        </div>
        
        ${logoTemplate}
        
        <div style="background:#f8f9fa; padding:20px; border-radius:10px; margin:20px 0;">
          <p style="font-size:18px; margin:0 0 10px 0;">Zdravo <strong style="color:#5a3e36;">${safeFirstName} ${safeLastName}</strong>! 👋</p>
          <p style="margin:0; line-height:1.6;">Hvala Vam što ste se prijavili za poziciju u <strong>Koneti Café</strong>. Vaša prijava je uspešno primljena i uskoro ćemo Vas kontaktirati.</p>
        </div>

        <div style="background:#ffffff; padding:25px; border-radius:15px; margin:25px 0; border: 2px solid #f3e5ab;">
          <h3 style="color:#5a3e36; margin:0 0 20px 0; text-align:center; font-size:20px;">💼 Detalji Vaše Prijave</h3>
          <div style="display:grid; gap:15px;">
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(90,62,54,0.1);">
              <span style="font-weight:600; color:#5a3e36;">👤 Kandidat:</span>
              <span style="${badgeStyle}">${safeFirstName} ${safeLastName}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0;">
              <span style="font-weight:600; color:#5a3e36;">💼 Pozicija:</span>
              <span style="${badgeStyle}">${safePosition}</span>
            </div>
          </div>
        </div>

        <div style="text-align:center; margin:30px 0;">
          <p style="color:#666; font-style:italic; margin:0;">Bićete obavešteni kada pregledam Vašu prijavu.</p>
        </div>

        <div style="border-top:2px solid #f3e5ab; padding-top:20px; text-align:center;">
          <p style="margin:0; color:#5a3e36; font-size:16px;">Srdačan pozdrav,</p>
          <p style="margin:5px 0 0 0; font-weight:700; color:#5a3e36; font-size:18px;">Vaš Koneti Café Tim ☕</p>
        </div>
      </div>
    </div>
  `;
};

const getCareerApplicationHTML = (application) => {
  const safeFirstName = DOMPurify.sanitize(application.firstName || '');
  const safeLastName = DOMPurify.sanitize(application.lastName || '');
  const safeEmail = DOMPurify.sanitize(application.email || '');
  const safePhone = DOMPurify.sanitize(application.phone || '');
  const safePosition = DOMPurify.sanitize(application.position || '');
  const safeCoverLetter = DOMPurify.sanitize(application.coverLetter || '');
  
  return `
    <div style="${baseStyle}">
      <div style="${cardStyle}">
        <div style="${headerStyle}; border-color: #28a745; color: #28a745;">
          <h2 style="margin:0; font-size:24px;">💼 Nova Prijava za Posao!</h2>
        </div>
        
        ${logoTemplate}
        
        <div style="background:#d4edda; border:1px solid #c3e6cb; padding:15px; border-radius:10px; margin:20px 0;">
          <p style="margin:0; color:#155724; font-weight:600;">📋 Nova prijava za posao je stigla!</p>
        </div>

        <div style="background:#ffffff; padding:25px; border-radius:15px; margin:25px 0; border: 2px solid #f3e5ab;">
          <h3 style="color:#28a745; margin:0 0 20px 0; text-align:center; font-size:20px;">👤 Podaci o Kandidatu</h3>
          
          <div style="background:white; padding:20px; border-radius:10px; margin-bottom:15px;">
            <div style="display:grid; gap:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#28a745;">👤 Ime:</span>
                <span style="${badgeStyle}">${safeFirstName} ${safeLastName}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#28a745;">📧 Email:</span>
                <a href="mailto:${safeEmail}" style="${badgeStyle}; text-decoration:none; color:#5a3e36;">${safeEmail}</a>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
                <span style="font-weight:600; color:#28a745;">📞 Telefon:</span>
                <a href="tel:${safePhone}" style="${badgeStyle}; text-decoration:none; color:#5a3e36;">${safePhone}</a>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0;">
                <span style="font-weight:600; color:#28a745;">💼 Pozicija:</span>
                <span style="${badgeStyle}; background:#d4edda; color:#155724;">${safePosition}</span>
              </div>
            </div>
          </div>
          
          <div style="background:#f8f9fa; padding:20px; border-radius:10px; margin-top:20px;">
            <h4 style="color:#28a745; margin:0 0 15px 0;">📝 Propratno Pismo:</h4>
            <p style="margin:0; line-height:1.6; white-space:pre-wrap;">${safeCoverLetter}</p>
          </div>
        </div>

        <div style="background:#f8f9fa; padding:15px; border-radius:10px; text-align:center;">
          <p style="margin:0; color:#666; font-size:14px;">Molimo Vas da pregledate prijavu i kontaktirate kandidata.</p>
        </div>
      </div>
    </div>
  `;
};


// --- Konfiguracija Nodemailer Transportera ---
const transporterOptions = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  connectionTimeout: 10000, // 10 sekundi
  greetingTimeout: 5000,     // 5 sekundi
  socketTimeout: 10000,      // 10 sekundi
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  pool: true,
  maxConnections: 1,
  maxMessages: 3
};

if (process.env.NODE_ENV === 'development') {
  transporterOptions.tls = { rejectUnauthorized: false };
  logger.warn('TLS certificate check is disabled in development mode for nodemailer.');
}

const transporter = nodemailer.createTransport(transporterOptions);

// --- Retry funkcija za email slanje ---
const sendEmailWithRetry = async (mailOptions, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      logger.warn(`Email attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Čekaj 2 sekunde pre ponovnog pokušaja
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// --- Funkcije za Slanje Emailova ---

export const sendUserConfirmationEmail = async (reservation) => {
  if (!reservation || !reservation.email) {
    logger.warn('Skipping user confirmation email: missing reservation data or email.');
    return;
  }
  try {
    console.log('[DEBUG] Sending user confirmation email to:', reservation.email);
    console.log('[DEBUG] SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER
    });
    
    const result = await sendEmailWithRetry({
      from: `Koneti Café <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: reservation.email,
      subject: 'Potvrda prijema rezervacije - Koneti Café',
      html: getUserConfirmationHTML(reservation),
    });
    
    console.log('[DEBUG] User email sent successfully:', result.messageId);
    logger.info(`Confirmation email sent to ${reservation.email}`);
  } catch (emailError) {
    console.error('[DEBUG] User email failed:', emailError);
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
    console.log('[DEBUG] Sending admin notification email to:', adminEmail);
    
    const result = await sendEmailWithRetry({
      from: `Koneti Café Notifikacije <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Nova rezervacija: ${reservation.name}`,
      html: getAdminNotificationHTML(reservation),
    });
    
    console.log('[DEBUG] Admin email sent successfully:', result.messageId);
    logger.info(`Admin notification sent for reservation ${reservation._id}`);
  } catch (adminEmailError) {
    console.error('[DEBUG] Admin email failed:', adminEmailError);
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
    await sendEmailWithRetry({
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
    await sendEmailWithRetry({
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

export const sendCareerApplicationEmail = async (application) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    logger.warn('ADMIN_EMAIL not set, skipping career application email.');
    return;
  }
  try {
    await sendEmailWithRetry({
      from: `Koneti Café Karijere <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Nova prijava za posao: ${application.firstName} ${application.lastName} - ${application.position}`,
      html: getCareerApplicationHTML(application),
    });
    logger.info(`Career application email sent for ${application.firstName} ${application.lastName}`);
  } catch (e) {
    logger.error('Failed to send career application email:', e);
    throw e;
  }
};

export const sendCareerConfirmationEmail = async (application) => {
  if (!application || !application.email) {
    logger.warn('Skipping career confirmation email: missing application data or email.');
    return;
  }
  try {
    await sendEmailWithRetry({
      from: `Koneti Café <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: application.email,
      subject: 'Potvrda prijema prijave za posao - Koneti Café',
      html: getCareerConfirmationHTML(application),
    });
    logger.info(`Career confirmation email sent to ${application.email}`);
  } catch (e) {
    logger.error('Failed to send career confirmation email:', e);
    throw e;
  }
};

export const sendCareerStatusEmail = async (application, status) => {
  if (!application || !application.email) {
    logger.warn('Skipping career status email: missing application data or email.');
    return;
  }
  try {
    const subject = status === 'contacted' 
      ? 'Kontaktiraćemo Vas uskoro - Koneti Café'
      : `Ažuriranje statusa prijave - Koneti Café`;
      
    await sendEmailWithRetry({
      from: `Koneti Café <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: application.email,
      subject: subject,
      html: getCareerStatusHTML(application, status),
    });
    logger.info(`Career status email sent to ${application.email} for status: ${status}`);
  } catch (e) {
    logger.error('Failed to send career status email:', e);
    throw e;
  }
};

export const sendAdminActivationEmail = async (admin, activationLink) => {
  if (!admin || !admin.email) {
    logger.warn('Skipping admin activation email: missing admin data or email.');
    return;
  }
  try {
    const html = `
      <div style="${baseStyle}">
        <div style="${cardStyle}">
          ${logoTemplate}
          <h2 style="color:#5a3e36; text-align:center;">Aktivacija admin naloga</h2>
          <p style="font-size:18px;">Zdravo <strong>${DOMPurify.sanitize(admin.name || admin.email)}</strong>,</p>
          <p>Za aktivaciju Vašeg admin naloga kliknite na sledeći link:</p>
          <div style="text-align:center; margin:30px 0;">
            <a href="${activationLink}" style="${buttonStyle}; text-decoration:none;">Aktiviraj nalog</a>
          </div>
          <p style="color:#888; font-size:14px;">Ako niste tražili ovaj nalog, slobodno ignorišite ovaj email.</p>
        </div>
      </div>
    `;

    await sendEmailWithRetry({
      from: `Koneti Café <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: admin.email,
      subject: 'Aktivacija admin naloga - Koneti Café',
      html,
    });
    logger.info(`Admin activation email sent to ${admin.email}`);
  } catch (e) {
    logger.error('Failed to send admin activation email:', e);
    throw e;
  }
};
