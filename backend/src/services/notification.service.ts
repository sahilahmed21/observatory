// src/services/notification.service.ts
import nodemailer from 'nodemailer';
import { AlertRule } from '@prisma/client';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmailAlert = async (rule: AlertRule, metricValue: number, userEmail: string) => {
    const mailOptions = {
        from: '"Observatory Alerts" <noreply@observatory.com>',
        to: userEmail, // In a real app, you'd get this from the project owner
        subject: `🔔 Alert Triggered: ${rule.name}`,
        text: `
      Your alert rule "${rule.name}" has been triggered.
      Condition: ${rule.metric} ${rule.operator} ${rule.threshold}
      Current Value: ${metricValue}
    `,
        html: `
      <h3>Alert Triggered: ${rule.name}</h3>
      <p>Your alert rule has been breached.</p>
      <ul>
        <li><strong>Condition:</strong> ${rule.metric} ${rule.operator} ${rule.threshold}</li>
        <li><strong>Current Value:</strong> ${metricValue}</li>
      </ul>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Notification] Email sent: ${info.messageId}`);
        // You can preview the email at the URL provided by Ethereal
        console.log(`[Notification] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
        console.error('[Notification] Error sending email:', error);
    }
};