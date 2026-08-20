/**
 * WhatsApp Cloud API Integration Utility
 */

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function sendWhatsAppNotification(
  recipientPhone: string,
  messageText: string
): Promise<{ success: boolean; fallbackUrl?: string; error?: string }> {
  // Graceful fallback if credentials are not provided
  if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    const encodedMessage = encodeURIComponent(messageText);
    // Remove '+' or any non-numeric characters for wa.me link
    const cleanPhone = recipientPhone.replace(/\D/g, '');
    const fallbackUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    console.warn("WhatsApp API credentials missing. Falling back to wa.me link.");
    return { success: false, fallbackUrl };
  }

  const url = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: "text",
        text: {
          body: messageText,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WhatsApp API Error:", errorData);
      return { success: false, error: "Failed to send WhatsApp message via API." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("WhatsApp API Fetch Error:", error);
    return { success: false, error: error.message };
  }
}
