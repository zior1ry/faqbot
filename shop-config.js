// shop-config.js
// This is the ONLY file you need to edit to reconfigure this bot for a different shop.
// Fill in real info for whichever café/shop you're demoing or deploying for.

const SHOP_CONFIG = {
  name: "Kopi & Co",
  tagline: "Your neighbourhood kopitiam, since forever.",

  hours: {
    "Mon–Fri": "7:30am – 6:00pm",
    "Sat–Sun": "8:00am – 3:00pm",
    "Public holidays": "Closed"
  },

  location: "12, Jalan Kopi, George Town, Penang",

  contact: {
    phone: "+60 12-345 6789",
    whatsapp: "+60 12-345 6789"
  },

  menu: [
    { item: "Kopi O", price: "RM 2.50", note: "Black coffee, sweetened" },
    { item: "Kopi C", price: "RM 3.00", note: "With evaporated milk" },
    { item: "Teh Tarik", price: "RM 3.00", note: "Pulled milk tea" },
    { item: "Kaya Toast Set", price: "RM 5.50", note: "Toast, kaya, butter, 2 soft-boiled eggs" },
    { item: "Roti Bakar", price: "RM 4.00", note: "Grilled bread with kaya" },
    { item: "Nasi Lemak", price: "RM 6.50", note: "Available until 11am only" }
  ],

  extraFacts: [
    "We accept cash, DuitNow QR, and Touch 'n Go eWallet.",
    "There is limited street parking outside; a public car park is 2 minutes' walk away.",
    "We are halal-friendly but not certified.",
    "Dine-in and takeaway both available. No delivery yet.",
    "WiFi password is available on request at the counter."
  ]
};

// Do not edit below this line — used to build the system prompt.
module.exports = { SHOP_CONFIG };
