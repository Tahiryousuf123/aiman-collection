/**
 * AIMAN COLLECTION — OFFICIAL WHATSAPP AI AGENT & WEBHOOK BOT SERVER
 * Connects the Website Owner's WhatsApp Number directly with the AI Concierge Engine.
 * 
 * Features:
 * 1. Meta WhatsApp Cloud API Webhook Integration (GET verification + POST message handler)
 * 2. Intelligent Auto-Reply Intent Engine (Order Tracking, Rida Catalog, Bespoke Sizing, Pricing)
 * 3. Fallback to Direct WhatsApp Webhook / Baileys / GreenAPI / Evolution API
 * 4. Automatic Lead Ingestion & Firestore / Local Storage Sync
 */

import http from 'http';
import { apiEngine } from './api.js';

const PORT = process.env.PORT || 4000;
const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'AIMAN_WHATSAPP_SECRET_7860';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

/**
 * Intelligent AI Intent Resolver for Incoming WhatsApp Messages
 */
function resolveWhatsAppAIResponse(userMessage, senderPhone, senderName = 'Valued Client') {
  const q = (userMessage || '').toLowerCase().trim();

  // 1. Check custom bot rules from Admin Portal / Database
  for (const rule of apiEngine.botRules) {
    if (rule.isActive && rule.keywords.some(k => q.includes(k.toLowerCase().trim()))) {
      return rule.responseEnglish;
    }
  }

  // 2. Order Tracking (e.g. "Track AC-2026-8491" or "Mera parcel kahan hai")
  if (q.includes('track') || q.includes('ac-') || q.includes('order status') || q.includes('kahan hai') || q.includes('parcel')) {
    const match = userMessage.match(/ac-\d+/i);
    if (match) {
      const orderId = match[0].toUpperCase();
      const found = apiEngine.orders.find(o => o.orderNumber.toUpperCase().includes(orderId));
      if (found) {
        return `📦 *Order Status Found: ${found.orderNumber}*\n\n` +
               `👤 *Client Name:* ${found.customerName}\n` +
               `🚚 *Courier Partner:* ${found.courier}\n` +
               `🔖 *Tracking #:* ${found.trackingNumber}\n` +
               `📍 *Status:* ${found.orderStatus}\n` +
               `💵 *Total Bill:* Rs. ${found.total.toLocaleString()}\n` +
               `🏠 *Delivery City:* ${found.city || 'Karachi'}\n\n` +
               `Aapka parcel dispatch kar diya gaya hai aur next 48 hours mein deliver ho jayega! ✨`;
      }
    }
    return `📦 *Aiman Collection Order Tracking*\n\n` +
           `Apna order track karne ke liye baraye meherbani apna *Order Number* (e.g. *AC-2026-8491*) ya order place karte waqt use kiya gaya phone number yahan type karein.`;
  }

  // 3. Custom Stitching / Measurement Consultation
  if (q.includes('custom') || q.includes('stitch') || q.includes('measurement') || q.includes('size') || q.includes('silai') || q.includes('naap')) {
    return `✨ *Aiman Collection — Bespoke Master Tailoring Guide*\n\n` +
           `Hum Dawoodi Bohra Libas & Ridas ki custom stitching exact naap ke mutabiq karte hain:\n\n` +
           `📏 *Required Measurements:*\n` +
           `1. Pardi Length (Inches)\n` +
           `2. Ghagra Length & Waist\n` +
           `3. Chest / Bust & Shoulders\n` +
           `4. Sleeves Length & Neckline preference\n\n` +
           `Aap apni measurements yahan send kar sakti hain ya hamari website par bespoke measurement form submit kar sakti hain!`;
  }

  // 4. Catalog / Prices / Best Sellers / Silk Ridas
  if (q.includes('price') || q.includes('rate') || q.includes('catalog') || q.includes('silk') || q.includes('rida') || q.includes('designs') || q.includes('bag')) {
    return `✨ *Aiman Collection — Top Haute Couture Favorites:*\n\n` +
           `1. 🌿 *Emerald Garden Silk Rida* — Rs. 5,200 (Pure Silk with Heavy Zari Border)\n` +
           `2. 👑 *Royal Velvet & Zari Bridal Rida* — Rs. 18,500 (Handcrafted Zardozi)\n` +
           `3. 🌸 *Rose Blush Soft Cotton Rida* — Rs. 3,800 (Pure Lawn & Crochet Lace)\n` +
           `4. 👜 *Suede Leather Bohra Rida Bag* — Rs. 4,800 (Spacious for Quran & Hafti)\n` +
           `5. 💄 *Dual-Deck Satin Vanity Pouch* — Rs. 1,800\n\n` +
           `Hamari complete online collection dekhne aur direct order karne ke liye website visit karein: *https://aiman-collection.pk*`;
  }

  // 5. Payment Methods & Bank Account Info
  if (q.includes('pay') || q.includes('account') || q.includes('easypaisa') || q.includes('jazzcash') || q.includes('bank') || q.includes('raast')) {
    return `💳 *Aiman Collection Official Payment Accounts:*\n\n` +
           `📱 *EasyPaisa:* 03428301490 (AIMAN COLLECTION)\n` +
           `📱 *JazzCash:* 003252005028 (AIMAN COLLECTION)\n` +
           `🏦 *Meezan Bank Raast ID:* 03452439196\n` +
           `💵 *Cash on Delivery (COD):* Available Nationwide via TCS\n\n` +
           `Payment transfer karne ke baad receipt/screenshot yahan share karein for instant confirmation!`;
  }

  // 6. Default Welcome Greeting
  return `Assalam-o-Alaikum ${senderName}! ✨\n\n` +
         `Welcome to *Aiman Collection — Luxury Dawoodi Bohra Libas, Handcrafted Ridas & Designer Bags*.\n\n` +
         `Main aapki *AI Fashion Stylist* hoon. Main aapko collections dekhne, size guide, order tracking ya payment details mein help kar sakti hoon.\n\n` +
         `Aap kya dekhna pasand karengi? (e.g. Type: *Silk Ridas*, *Bespoke Stitching*, *Track Order*, *Payment Details*)`;
}

/**
 * Send automated message via Meta WhatsApp Cloud API
 */
async function sendMetaWhatsAppMessage(toPhone, messageText) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.log(`[WhatsApp Bot Simulation] (To: ${toPhone}):\n${messageText}\n`);
    return { success: true, mode: 'SIMULATION' };
  }

  try {
    const formattedTo = toPhone.replace(/\D/g, '');
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: formattedTo,
        type: 'text',
        text: { preview_url: true, body: messageText }
      })
    });

    const data = await response.json();
    console.log('[WhatsApp Cloud API Response]:', data);
    return { success: true, data };
  } catch (error) {
    console.error('[WhatsApp Cloud API Error]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Native Node.js Webhook Server
 */
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check & Server Status
  if (url.pathname === '/' || url.pathname === '/health' || url.pathname === '/api/whatsapp/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ONLINE',
      service: 'Aiman Collection WhatsApp AI Bot Gateway',
      version: '2.0.0',
      ownerWhatsApp: '923452439196',
      activeBotRulesCount: apiEngine.botRules.length,
      metaCloudConfigured: Boolean(WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID),
      webhookEndpoint: `http://${req.headers.host}/webhook`,
      timestamp: new Date().toISOString()
    }, null, 2));
    return;
  }

  // WhatsAuto Dedicated Endpoint (POST & GET /api/whatsauto or /whatsauto)
  if (url.pathname === '/whatsauto' || url.pathname === '/api/whatsauto') {
    if (req.method === 'GET') {
      const query = url.searchParams.get('query') || url.searchParams.get('message') || '';
      const phone = url.searchParams.get('sender') || url.searchParams.get('phone') || 'Customer';
      const name = url.searchParams.get('name') || 'Valued Client';

      const reply = resolveWhatsAppAIResponse(query, phone, name);
      apiEngine.captureLead({
        name,
        phone,
        message: query,
        intentCategory: 'WHATSAUTO_GET',
        notes: `WhatsAuto GET auto-reply delivered`
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply }));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const query = payload.query || payload.message || payload.text || '';
          const phone = payload.sender || payload.phone || payload.from || 'Customer';
          const name = payload.name || payload.contact_name || 'Valued Client';

          const reply = resolveWhatsAppAIResponse(query, phone, name);

          apiEngine.captureLead({
            name,
            phone,
            message: query,
            intentCategory: 'WHATSAUTO_WEBHOOK',
            notes: `WhatsAuto instant auto-reply delivered`
          });

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid payload', reply: 'Assalam-o-Alaikum! Welcome to Aiman Collection.' }));
        }
      });
      return;
    }
  }

  // Meta Webhook Verification (GET /webhook)
  if (req.method === 'GET' && url.pathname === '/webhook') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('✅ [WhatsApp Webhook Verified Successfully with Meta Cloud API]');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(challenge);
    } else {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Verification token mismatch');
    }
    return;
  }

  // Incoming WhatsApp Messages (POST /webhook or POST /api/whatsapp/incoming)
  if (req.method === 'POST' && (url.pathname === '/webhook' || url.pathname === '/api/whatsapp/incoming')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');

        // Check if Meta Cloud API Payload structure
        if (payload.entry && payload.entry[0]?.changes && payload.entry[0].changes[0]?.value?.messages) {
          const value = payload.entry[0].changes[0].value;
          const messageObj = value.messages[0];
          const senderPhone = messageObj.from;
          const senderName = value.contacts?.[0]?.profile?.name || 'Valued Client';
          const userText = messageObj.text?.body || messageObj.button?.text || '';

          console.log(`📩 [Incoming WhatsApp from ${senderName} (${senderPhone})]: "${userText}"`);

          // Generate AI Auto-Reply
          const aiReply = resolveWhatsAppAIResponse(userText, senderPhone, senderName);

          // Ingest Lead into API Engine
          apiEngine.captureLead({
            name: senderName,
            phone: senderPhone,
            message: userText,
            intentCategory: 'WHATSAPP_AI_CONVERSATION',
            notes: `Auto-replied by AI Stylist at ${new Date().toLocaleTimeString()}`
          });

          // Send WhatsApp reply back to customer
          await sendMetaWhatsAppMessage(senderPhone, aiReply);
        } else if (payload.message && payload.phone) {
          // Direct generic webhook payload format { phone, message, name }
          const senderPhone = payload.phone;
          const senderName = payload.name || 'Valued Client';
          const userText = payload.message;

          const aiReply = resolveWhatsAppAIResponse(userText, senderPhone, senderName);

          apiEngine.captureLead({
            name: senderName,
            phone: senderPhone,
            message: userText,
            intentCategory: 'DIRECT_WEBHOOK',
            notes: `Direct webhook auto-reply dispatched`
          });

          await sendMetaWhatsAppMessage(senderPhone, aiReply);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'EVENT_RECEIVED' }));
      } catch (err) {
        console.error('[Webhook Processing Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Direct Test Endpoint for Admin Portal (POST /api/whatsapp/test-simulate)
  if (req.method === 'POST' && url.pathname === '/api/whatsapp/test-simulate') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { message, phone, name } = JSON.parse(body || '{}');
        const reply = resolveWhatsAppAIResponse(message || 'Assalam-o-Alaikum', phone || '923452439196', name || 'Admin Test');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          userMessage: message,
          aiResponse: reply,
          phone: phone || '923452439196'
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`
  ========================================================================
  💎 AIMAN COLLECTION — WHATSAPP AI BOT & WEBHOOK SERVER ACTIVE
  ========================================================================
  🚀 Server Running On: http://localhost:${PORT}
  🔗 Webhook Endpoint:  http://localhost:${PORT}/webhook
  🔑 Verify Token:     ${WEBHOOK_VERIFY_TOKEN}
  📱 Owner WhatsApp:   923452439196
  🤖 Auto-Replies:     ${apiEngine.botRules.length} Active Multilingual Rules Loaded
  ========================================================================
  `);
});
