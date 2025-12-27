import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { sendEmail } from '@/lib/mailer';

// POST - Send notification (email or SMS)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      notification_type, 
      recipient_type, 
      recipient_id, 
      template_id,
      template_type, // 'email' or 'sms'
      custom_variables 
    } = body;

    if (!notification_type || !recipient_type || !template_id || !template_type) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Fetch template
    const templateTable = template_type === 'email' ? 'email_templates' : 'sms_templates';
    const [templates]: any = await pool.query(
      `SELECT * FROM ${templateTable} WHERE id = ? AND is_active = TRUE`,
      [template_id]
    );

    if (!templates || templates.length === 0) {
      return NextResponse.json({ error: 'Template not found or inactive' }, { status: 404 });
    }

    const template = templates[0];

    // Fetch recipient info
    let recipientEmail = '';
    let recipientPhone = '';
    let recipientName = '';

    if (recipient_type === 'customer' && recipient_id) {
      const [customers]: any = await pool.query(
        'SELECT name, email, phone FROM customers WHERE id = ?',
        [recipient_id]
      );
      if (customers && customers.length > 0) {
        recipientName = customers[0].name;
        recipientEmail = customers[0].email;
        recipientPhone = customers[0].phone;
      }
    }

    // Replace variables in template
    let finalMessage = template_type === 'email' ? template.body : template.message;
    let finalSubject = template_type === 'email' ? template.subject : '';

    const variables = {
      customer_name: recipientName,
      email: recipientEmail,
      ...custom_variables
    };

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalMessage = finalMessage.replace(regex, value as string);
      if (template_type === 'email') {
        finalSubject = finalSubject.replace(regex, value as string);
      }
    }

    // Send notification
    let status = 'sent';
    let errorMessage = null;

    try {
      if (notification_type === 'email' && recipientEmail) {
        await sendEmail(recipientEmail, finalSubject, finalMessage);
      } else if (notification_type === 'sms' && recipientPhone) {
        // SMS sending would go here (Twilio integration)
        // For now, log it
        console.log('SMS would be sent to:', recipientPhone, 'Message:', finalMessage);
        // TODO: Implement Twilio SMS sending
      }
    } catch (error: any) {
      status = 'failed';
      errorMessage = error.message;
    }

    // Log notification
    await pool.query(
      `INSERT INTO notification_log 
       (recipient_type, recipient_id, notification_type, template_id, subject, message, status, error_message, sent_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        recipient_type,
        recipient_id || null,
        notification_type,
        template_id,
        finalSubject || null,
        finalMessage,
        status,
        errorMessage
      ]
    );

    return NextResponse.json({ 
      success: status === 'sent',
      status,
      message: status === 'sent' ? 'Notification sent successfully' : 'Notification failed',
      error: errorMessage
    });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ 
      error: 'Failed to send notification',
      details: error.message 
    }, { status: 500 });
  }
}
