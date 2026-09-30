# WhatsApp Morning Brief

Use Meta's official WhatsApp Business Platform / Cloud API after a Meta business portfolio, WhatsApp Business Account, and business phone are configured.

Official Meta collection:
https://www.postman.com/meta/whatsapp-business-platform/overview

n8n can send a morning report through an HTTP Request node to:
`POST https://graph.facebook.com/{Version}/{Phone-Number-ID}/messages`
with a Bearer access token and a WhatsApp message body.

Target schedule: 09:00 Asia/Kolkata.
