// src/lib/services/emailService.js

/**
 * Send email to a user
 * Note: This is a placeholder implementation.
 * You should configure a real email service like:
 * - SendGrid
 * - AWS SES
 * - Nodemailer with SMTP
 * - Resend
 */
export async function sendEmailToUser(userEmail, subject, message) {
  // For now, we'll just log the email
  console.log('📧 Email Service - Sending email:');
  console.log('To:', userEmail);
  console.log('Subject:', subject);
  console.log('Message:', message);

  // TODO: Implement actual email sending
  // Example with nodemailer:
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: subject,
    html: message,
  });
  */

  // For demo purposes, we'll simulate success
  return {
    success: true,
    message: 'Email sent successfully (simulated)',
  };
}

/**
 * Send bulk emails to multiple users
 */
export async function sendBulkEmail(userEmails, subject, message) {
  const results = [];

  for (const email of userEmails) {
    try {
      const result = await sendEmailToUser(email, subject, message);
      results.push({ email, ...result });
    } catch (error) {
      results.push({ 
        email, 
        success: false, 
        error: error.message 
      });
    }
  }

  return results;
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(userEmail, userName) {
  const subject = 'Bienvenue sur la plateforme OCP';
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">Bienvenue ${userName}!</h2>
      <p>Votre compte a été créé avec succès.</p>
      <p>Vous pouvez maintenant vous connecter et commencer à utiliser la plateforme.</p>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      <br>
      <p>Cordialement,<br>L'équipe OCP</p>
    </div>
  `;

  return sendEmailToUser(userEmail, subject, message);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(userEmail, userName) {
  const subject = 'Réinitialisation de votre mot de passe';
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">Bonjour ${userName}</h2>
      <p>Votre mot de passe a été réinitialisé par un administrateur.</p>
      <p>Veuillez vous connecter et changer votre mot de passe dès que possible.</p>
      <br>
      <p>Cordialement,<br>L'équipe OCP</p>
    </div>
  `;

  return sendEmailToUser(userEmail, subject, message);
}

/**
 * Send account suspension notification
 */
export async function sendAccountSuspensionEmail(userEmail, userName) {
  const subject = 'Compte suspendu';
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Compte suspendu</h2>
      <p>Bonjour ${userName},</p>
      <p>Votre compte a été suspendu par un administrateur.</p>
      <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support.</p>
      <br>
      <p>Cordialement,<br>L'équipe OCP</p>
    </div>
  `;

  return sendEmailToUser(userEmail, subject, message);
}
