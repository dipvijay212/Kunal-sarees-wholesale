/**
 * Central Translation Dictionary & Localization System for Kunal Sarees
 * Supports: Hindi (hi) & English (en) with extensible architecture
 */

export type Language = "hi" | "en";

export interface WebsiteLanguageSettings {
  defaultLanguage: Language;
  availableLanguages: Language[];
  allowCustomerLanguageSwitch: boolean;
}

export const DEFAULT_LANGUAGE_SETTINGS: WebsiteLanguageSettings = {
  defaultLanguage: "hi",
  availableLanguages: ["hi", "en"],
  allowCustomerLanguageSwitch: true,
};

export const hi = {
  // Brand & Meta
  brand: {
    name: "Kunal Sarees",
    tagline: "प्रीमियम होलसेल साड़ियों का खूबसूरत कलेक्शन",
    location: "सूरत, गुजरात",
    wholesaleBadge: "सूरत डायरेक्ट होलसेल",
  },

  // Navigation
  nav: {
    home: "होम",
    sarees: "साड़ियां",
    newArrivals: "नई साड़ियां",
    categories: "कलेक्शन",
    about: "हमारे बारे में",
    contact: "संपर्क",
    search: "सर्च",
    orderList: "ऑर्डर लिस्ट",
    whatsapp: "WhatsApp",
    wishlist: "पसंद की साड़ियां",
    menu: "मेन्यू",
  },

  // Top Announcement Bar
  topBar: {
    brandName: "Kunal Sarees",
    qualityTag: "प्रीमियम क्वालिटी साड़ियां",
    wholesaleOnly: "सिर्फ होलसेल",
    trustBadge: "पूरे भारत में बुटीक और दुकानदारों का भरोसा",
  },

  // Homepage Hero
  hero: {
    eyebrow: "सूरत डायरेक्ट होलसेल",
    badge: "Kunal Sarees · प्रीमियम होलसेल साड़ियां",
    titleMain: "प्रीमियम होलसेल साड़ियों का",
    titleSub: "खूबसूरत कलेक्शन",
    supporting:
      "शादी, फंक्शन और हर खास मौके के लिए खूबसूरत साड़ियों का शानदार कलेक्शन। थोक में ऑर्डर करें और अपने बिज़नेस के लिए बेस्ट साड़ियां चुनें।",
    btnExplore: "साड़ियां देखें",
    btnNewArrivals: "नई साड़ियां देखें",
    btnWhatsapp: "WhatsApp पर ऑर्डर करें",
    directSupport: "सीधा होलसेल सपोर्ट और पूछताछ",
    callWhatsapp: "कॉल / WhatsApp",
    wholesaleEmail: "होलसेल ईमेल",
    photoTagSub: "सूरत डायरेक्ट होलसेल",
    photoTagTitle: "प्योर बनारसी और सिल्क साड़ियां",
    moqBadge: "कम से कम 5 पीस",
  },

  // Trust / Wholesale Highlights
  highlights: [
    {
      title: "प्रीमियम क्वालिटी",
      description: "बेहतरीन फैब्रिक और शानदार कारीगरी",
    },
    {
      title: "होलसेल कीमत",
      description: "दुकानदारों और बुटीक के लिए बेस्ट रेट्स",
    },
    {
      title: "बड़ा कलेक्शन",
      description: "पारंपरिक और नए ट्रेंडी डिजाइन्स",
    },
    {
      title: "WhatsApp पर आसान ऑर्डर",
      description: "साड़ियां चुनें और सीधा WhatsApp पर भेजें",
    },
  ],

  // Categories Section
  categories: {
    eyebrow: "खास कलेक्शन",
    title: "साड़ी के प्रकार",
    description: "दुकानदारों, बुटीक और रीसेलर्स के लिए चुनिंदा साड़ियों की खास कैटेगरी।",
    viewAll: "सभी साड़ियां देखें",
    exploreBtn: "साड़ियां देखें",
    designsCount: "डिजाइन उपलब्ध हैं",
    wholesaleCategory: "होलसेल कैटेगरी",
  },

  // Products & Cards
  products: {
    newArrivalsEyebrow: "नए डिजाइन्स",
    newArrivalsTitle: "नई साड़ियां",
    newArrivalsDesc: "इस सीजन में हमारी होलसेल लिस्ट में जोड़ी गई सबसे नई और ट्रेंडी साड़ियां।",
    allProductsEyebrow: "हमारा पूरा कलेक्शन",
    allProductsTitle: "सभी साड़ियां",
    allProductsDesc: "बनारसी, सिल्क, जॉर्जेट, कॉटन, ऑर्गेंजा और ब्राइडल साड़ियों का पूरा कलेक्शन देखें।",
    viewAllNew: "सभी नई साड़ियां देखें",
    viewAllFull: "पूरा कलेक्शन देखें",
    price: "कीमत",
    perPiece: "/ पीस",
    moq: "कम से कम",
    piece: "पीस",
    pieces: "पीस",
    inStock: "स्टॉक में है",
    lowStock: "कम स्टॉक बचा है",
    outOfStock: "स्टॉक खत्म",
    madeToOrder: "ऑर्डर पर बनेगी",
    badgeNew: "नई",
    badgeFeatured: "खास",
    addToOrder: "ऑर्डर लिस्ट में जोड़ें",
    inOrderList: "ऑर्डर लिस्ट में है",
    added: "जोड़ दिया गया",
    viewDetails: "पूरी जानकारी देखें",
    noProductsFound: "कोई साड़ी नहीं मिली",
    noProductsDesc: "अपनी सर्च या फिल्टर बदलकर दोबारा देखें।",
  },

  // Search
  search: {
    title: "साड़ी खोजें",
    placeholder: "साड़ी, फैब्रिक या कोड से खोजें...",
    button: "सर्च",
    recentSearches: "हाल ही में सर्च की गई",
    quickCategories: "लोकप्रिय कैटेगरी",
    resultsCount: "साड़ियां मिलीं",
    noResultsTitle: "कोई साड़ी नहीं मिली",
    noResultsMessage: "अपनी सर्च या फिल्टर बदलकर दोबारा देखें।",
    clear: "हटाएं",
  },

  // Filters & Sorting
  filters: {
    filterBtn: "फिल्टर",
    sortBy: "सॉर्ट करें:",
    sortOptions: {
      featured: "खास साड़ियां",
      newest: "नई साड़ियां पहले",
      priceAsc: "कम से ज्यादा कीमत",
      priceDesc: "ज्यादा से कम कीमत",
      nameAsc: "नाम (A से Z)",
    },
    category: "साड़ी का प्रकार",
    fabric: "फैब्रिक",
    color: "कलर",
    price: "कीमत",
    priceRanges: {
      under2500: "₹2,500 से कम",
      between2500And5000: "₹2,500 – ₹5,000",
      between5000And10000: "₹5,000 – ₹10,000",
      above10000: "₹10,000 से ज्यादा",
    },
    availability: "स्टॉक",
    activeFilters: "लागू फिल्टर:",
    clearAll: "सभी हटाएं",
    apply: "लागू करें",
    moreFilters: "और फिल्टर",
    showMore: "और देखें",
    showLess: "कम देखें",
  },

  // Product Details Page
  productDetails: {
    backToCatalogue: "← सभी साड़ियां",
    fabricLabel: "फैब्रिक:",
    codeLabel: "प्रोडक्ट कोड:",
    colorLabel: "कलर चुनें:",
    quantityLabel: "मात्रा (पीस):",
    minOrderNote: "कम से कम ऑर्डर:",
    specificationsTitle: "साड़ी की पूरी जानकारी",
    length: "साड़ी की लंबाई",
    blouse: "ब्लाउज पीस",
    weight: "वजन",
    washCare: "धोने की विधि",
    origin: "बनाने का स्थान",
    highlightsTitle: "खासियतें",
    directInquiry: "WhatsApp पर सीधा पूछें",
    orderViaWhatsApp: "WhatsApp पर ऑर्डर करें",
    relatedTitle: "संबंधित साड़ियां",
    relatedDesc: "इसी तरह की और खूबसूरत साड़ियां जो आपके ग्राहकों को पसंद आ सकती हैं।",
    wholesaleAssurance: "नो ऑनलाइन पेमेंट — आपका ऑर्डर कन्फर्म करने के लिए हमारी टीम सीधे WhatsApp पर संपर्क करेगी।",
  },

  // Order List & Drawer
  orderList: {
    title: "आपकी ऑर्डर लिस्ट",
    emptyTitle: "आपकी ऑर्डर लिस्ट अभी खाली है।",
    emptySubtitle: "कलेक्शन देखें और अपनी पसंद की साड़ियां जोड़ें।",
    btnBrowse: "साड़ियां देखें",
    design: "डिजाइन",
    designs: "डिजाइन",
    totalPieces: "कुल पीस",
    totalEstimated: "अनुमानित कुल कीमत",
    remove: "हटाएं",
    quantity: "मात्रा",
    decrease: "कम करें",
    increase: "बढ़ाएं",
    clearList: "लिस्ट खाली करें",
    proceedToCheckout: "ऑर्डर आगे बढ़ाएं",
    sendViaWhatsApp: "WhatsApp पर ऑर्डर भेजें",
    subtotal: "कुल कीमत",
    wholesaleNote: "कीमत में GST और डिलीवरी चार्ज अलग से जोड़े जाएंगे।",
  },

  // Checkout & Wholesale Form
  checkout: {
    title: "ऑर्डर की जानकारी",
    subtitle: "अपना ऑर्डर पूरा करने के लिए नीचे दिए गए फॉर्म में अपनी जानकारी भरें।",
    customerInfo: "आपकी जानकारी",
    name: "आपका नाम",
    namePlaceholder: "अपना पूरा नाम लिखें",
    businessName: "बिज़नेस / दुकान का नाम",
    businessNamePlaceholder: "अपनी दुकान या बुटीक का नाम लिखें",
    phone: "मोबाइल नंबर",
    phonePlaceholder: "10 अंकों का मोबाइल नंबर",
    whatsappNumber: "WhatsApp नंबर",
    whatsappPlaceholder: "WhatsApp नंबर डालें",
    email: "ईमेल (वैकल्पिक)",
    emailPlaceholder: "example@gmail.com",
    address: "पूरा पता",
    addressPlaceholder: "दुकान/घर का नंबर, गली, इलाका",
    city: "शहर",
    cityPlaceholder: "शहर का नाम",
    state: "राज्य",
    statePlaceholder: "राज्य का नाम",
    pincode: "पिन कोड",
    pincodePlaceholder: "6 अंकों का पिन कोड",
    notes: "कोई खास जानकारी हो तो बताएं",
    notesPlaceholder: "कलर, पैकिंग या डिलीवरी से जुड़ी कोई खास बात...",
    orderSummary: "आपका ऑर्डर",
    totalDesigns: "कुल साड़ियां",
    totalQuantity: "कुल पीस",
    totalAmount: "कुल कीमत",
    btnSubmit: "ऑर्डर भेजें",
    btnSubmitting: "ऑर्डर भेजा जा रहा है...",
    noPaymentNotice: "वेबसाइट पर कोई ऑनलाइन पेमेंट नहीं ली जाती। बिल और डिलीवरी की बात WhatsApp पर तय होगी।",
    alreadyHaveAccount: "पहले से अकाउंट है?",
    loginHere: "लॉगिन करें",
    loginButton: "लॉगिन करें",
    password: "पासवर्ड",
    passwordPlaceholder: "कम से कम 8 अक्षरों का पासवर्ड",
    confirmPassword: "पासवर्ड दोबारा डालें",
    confirmPasswordPlaceholder: "पासवर्ड दोबारा लिखें",
    passwordPolicyHint: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    passwordRequired: "कृपया पासवर्ड डालें।",
    passwordTooShort: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    passwordsDoNotMatch: "दोनों पासवर्ड एक जैसे होने चाहिए।",
    phoneAlreadyRegistered: "इस मोबाइल नंबर से पहले से अकाउंट बना हुआ है। कृपया लॉगिन करें।",
  },


  // Order Success Page
  orderSuccess: {
    title: "ऑर्डर सफलतापूर्वक भेज दिया गया",
    subtitle: "आपका ऑर्डर हमें मिल गया है। हमारी टीम जल्द ही आपसे WhatsApp पर संपर्क करेगी।",
    orderNumberLabel: "ऑर्डर नंबर",
    statusLabel: "स्टेटस",
    statusPending: "कन्फर्मेशन बाकी है",
    whatsappReminder: "यदि आपने WhatsApp पर मैसेज नहीं भेजा है, तो नीचे दिए गए बटन से भेज सकते हैं:",
    btnSendWhatsApp: "WhatsApp पर ऑर्डर भेजें",
    btnGoHome: "होम पर जाएं",
    btnBrowseMore: "और साड़ियां देखें",
  },

  // Wholesale Ordering Process (Steps)
  process: {
    eyebrow: "आसान होलसेल ऑर्डर",
    title: "ऑर्डर करने का आसान तरीका",
    description:
      "हमारे पास दुकानदारों और बुटीक के लिए पारदर्शी होलसेल रेट्स हैं। वेबसाइट पर कोई पेमेंट नहीं ली जाती — आपकी ऑर्डर लिस्ट सीधे WhatsApp पर Kunal Sarees को भेजी जाती है।",
    steps: [
      {
        title: "कलेक्शन देखें",
        description: "बनारसी, सिल्क, ऑर्गेंजा, जॉर्जेट और ब्राइडल साड़ियों का हमारा होलसेल कलेक्शन देखें।",
      },
      {
        title: "साड़ियां चुनें",
        description: "अपनी पसंद की साड़ियां और कलर चुनें और जरूरी मात्रा सेट करें।",
      },
      {
        title: "बिज़नेस की जानकारी भरें",
        description: "अपनी दुकान, शहर और मोबाइल नंबर की जानकारी आसानी से भरें।",
      },
      {
        title: "WhatsApp पर ऑर्डर भेजें",
        description: "एक क्लिक में अपना पूरा ऑर्डर Kunal Sarees को WhatsApp पर भेजें।",
      },
    ],
    stepOf: "स्टेप",
    ofTotal: "कुल 4 में से",
    startOrderBtn: "अपना ऑर्डर शुरू करें",
    trustNote: "वेबसाइट पर कोई पेमेंट नहीं ली जाती। बिलिंग और पार्सल भेजने की जानकारी सीधे Kunal Sarees द्वारा कन्फर्म की जाती है।",
  },

  // Why Kunal Sarees (Pillars)
  whyUs: {
    eyebrow: "होलसेल बिज़नेस का फायदा",
    title: "Kunal Sarees क्यों चुनें?",
    description:
      "हम पूरे भारत के दुकानदारों, बुटीक और रीसेलर्स के साथ मिलकर काम करते हैं ताकि उन्हें बेहतरीन साड़ियां और भरोसेमंद सर्विस मिले।",
    pillars: [
      {
        title: "प्रीमियम क्वालिटी",
        description: "हर साड़ी के फैब्रिक और फिनिशिंग की खास जांच।",
      },
      {
        title: "होलसेल फोकस",
        description: "सिर्फ बिजनेस और थोक खरीदारों के लिए स्पेशल रेट्स।",
      },
      {
        title: "बड़ा कलेक्शन",
        description: "पारंपरिक से लेकर नए ट्रेंडी डिजाइन्स एक ही जगह।",
      },
      {
        title: "आसान ऑर्डरिंग",
        description: "साड़ियां चुनें और सीधा WhatsApp पर आसानी से ऑर्डर भेजें।",
      },
    ],
    badgeTitle: "शानदार फैब्रिक और कारीगरी",
    badgeSubtitle: "दुकानदारों और बुटीक के लिए बेस्ट सिलेक्शन",
  },

  // Wholesale CTA
  cta: {
    eyebrow: "होलसेल पूछताछ",
    title: "अपने बिज़नेस के लिए सही साड़ियां ढूंढ रहे हैं?",
    description: "हमारा नया होलसेल कलेक्शन देखें या बल्क ऑर्डर के लिए सीधे Kunal Sarees से WhatsApp पर बात करें।",
    btnExplore: "साड़ियां देखें",
    btnWhatsapp: "WhatsApp पर बात करें",
  },

  // About Page
  about: {
    eyebrow: "हमारे बारे में",
    title: "Kunal Sarees — सूरत का भरोसेमंद साड़ी होलसेलर",
    intro:
      "Kunal Sarees में आपको खूबसूरत और प्रीमियम साड़ियों का शानदार कलेक्शन मिलता है। हमारा फोकस अच्छी क्वालिटी, नए डिजाइन और भरोसेमंद होलसेल सर्विस पर है।",
    storyParagraphs: [
      "Kunal Sarees की शुरुआत एक सोच के साथ हुई थी: दुकानदारों और बुटीक को ऐसा होलसेल पार्टनर मिलना चाहिए जो साड़ियों का चयन उसी तरह करे जैसे उनके ग्राहक करते हैं। सूरत की कपड़ा मंडी से, हम पूरे भारत में बनारसी, कांजीवरम और डिजाइनर साड़ियों की सप्लाई करते हैं।",
      "हमारी हर साड़ी को बारीकी से परखा जाता है — फैब्रिक की मजबूती, पल्लू और बॉर्डर की फिनिशिंग, और सबसे खास बात यह कि वह आपकी दुकान पर तेजी से बिके।",
      "आज पूरे भारत के सैकड़ों बुटीक, साड़ी शोरूम और रीसेलर्स हमसे नियमित रूप से जुड़े हुए हैं। हम पारदर्शी कीमतों और भरोसेमंद डिलीवरी के साथ काम करते हैं।",
    ],
    valuesTitle: "हमारा वादा",
    values: [
      {
        title: "हाथों से चुनी गई क्वालिटी",
        description: "हर साड़ी की बुनाई, कलर और फिनिशिंग की पूरी जांच के बाद ही उसे कलेक्शन में शामिल किया जाता है।",
      },
      {
        title: "सच्ची होलसेल कीमत",
        description: "हर साड़ी पर साफ होलसेल रेट्स, जिससे आप अपना मुनाफा पहले से प्लान कर सकें।",
      },
      {
        title: "भरोसेमंद डिलीवरी",
        description: "ऑर्डर कन्फर्म होते ही सुरक्षित पैकिंग और समय पर ट्रांसपोर्ट द्वारा डिलीवरी।",
      },
    ],
    locationTitle: "हमारी दुकान पर आएं",
    locationDesc: "सूरत आने पर हमारी शॉप पर जरूर पधारें और साड़ियों का लाइव कलेक्शन देखें।",
  },

  // Contact Page
  contact: {
    eyebrow: "हमसे संपर्क करें",
    title: "हमसे बात करें",
    subtitle: "किसी साड़ी, ऑर्डर या कलेक्शन के बारे में जानकारी चाहिए? हमसे संपर्क करें।",
    formTitle: "मैसेज भेजें",
    name: "नाम",
    namePlaceholder: "अपना नाम लिखें",
    phone: "मोबाइल नंबर",
    phonePlaceholder: "10 अंकों का मोबाइल नंबर",
    email: "ईमेल (वैकल्पिक)",
    emailPlaceholder: "example@gmail.com",
    message: "आपका मैसेज",
    messagePlaceholder: "आप किस प्रकार की साड़ियों में रुचि रखते हैं या क्या जानना चाहते हैं?",
    sendBtn: "मैसेज भेजें",
    sendingBtn: "भेजा जा रहा है...",
    successMsg: "धन्यवाद! आपका मैसेज हमें मिल गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।",
    directContact: "सीधा संपर्क",
    callUs: "कॉल करें",
    whatsappUs: "WhatsApp पर बात करें",
    emailUs: "ईमेल करें",
    visitUs: "शॉप का पता",
    workingHours: "काम का समय",
    getDirections: "रास्ता देखें (Google Maps)",
  },

  // Wholesale Terms Page
  wholesale: {
    eyebrow: "होलसेल नियम और शर्तें",
    title: "होलसेल बिज़नेस गाइड",
    subtitle: "Kunal Sarees के साथ होलसेल खरीदारी की पूरी और पारदर्शी जानकारी।",
    terms: [
      {
        title: "कम से कम ऑर्डर (MOQ)",
        description: "ब्राइडल साड़ियां 1 पीस से और बाकी साड़ियां 2 से 5 पीस के सेट में उपलब्ध हैं। हर डिजाइन पर उसका MOQ लिखा है।",
      },
      {
        title: "होलसेल कीमतें",
        description: "सभी साड़ियों पर प्रति पीस होलसेल रेट दिखाया गया है। फाइनल बिलिंग में 5% GST जोड़ा जाता है।",
      },
      {
        title: "पेमेंट का तरीका",
        description: "वेबसाइट पर कोई ऑनलाइन पेमेंट नहीं ली जाती। ऑर्डर कन्फर्मेशन के बाद बैंक ट्रांसफर (NEFT/RTGS/UPI) से पेमेंट ली जाती है।",
      },
      {
        title: "डिलीवरी और ट्रांसपोर्ट",
        description: "स्टॉक में उपलब्ध साड़ियां 2–4 दिन में डिस्पैच की जाती हैं। पूरे भारत में ट्रांसपोर्ट और कूरियर सुविधा उपलब्ध है।",
      },
    ],
    audienceTitle: "हम किसके लिए साड़ियां सप्लाई करते हैं?",
    audiences: [
      "साड़ी बुटीक और डिजाइनर स्टूडियो",
      "साड़ी की दुकानें और शोरूम",
      "ऑनलाइन और सोशल मीडिया रीसेलर्स",
      "शादी और इवेंट स्टाइलिस्ट्स",
    ],
    faqTitle: "अक्सर पूछे जाने वाले सवाल (FAQ)",
    faqs: [
      {
        question: "क्या ऑर्डर करने के लिए GST नंबर जरूरी है?",
        answer: "पक्का बिजनेस बिल बनवाने के लिए GSTIN उपयोगी है, लेकिन पूछताछ या शुरुआत करने के लिए अनिवार्य नहीं है।",
      },
      {
        question: "क्या एक ऑर्डर में अलग-अलग डिजाइन मिला सकते हैं?",
        answer: "हां, आप अपनी ऑर्डर लिस्ट में जितनी चाहें अलग-अलग साड़ियां जोड़ सकते हैं। हर साड़ी का अपना कम से कम ऑर्डर पूरा होना चाहिए।",
      },
      {
        question: "क्या ऑर्डर से पहले साड़ी का वीडियो देख सकते हैं?",
        answer: "बिल्कुल! आप WhatsApp पर किसी भी साड़ी का लाइव वीडियो या करीब से फोटो मांग सकते हैं।",
      },
      {
        question: "क्या गुजरात के बाहर डिलीवरी होती है?",
        answer: "हां, हम पूरे भारत में भरोसेमंद कूरियर और ट्रांसपोर्ट से पार्सल भेजते हैं।",
      },
      {
        question: "अगर साड़ी में कोई खराबी निकले तो?",
        answer: "डिलीवरी के 48 घंटे के भीतर पार्सल और साड़ी का फोटो/वीडियो हमें WhatsApp पर भेजें, हम तुरंत रिप्लेसमेंट या समाधान करेंगे।",
      },
    ],
  },

  // Wishlist / Saved Designs
  wishlist: {
    title: "पसंद की साड़ियां",
    subtitle: "आपकी चुनिंदा साड़ियां जिन्हें आप बाद में देखना या ऑर्डर करना चाहते हैं।",
    emptyTitle: "अभी कोई साड़ी पसंद नहीं की गई है।",
    emptySubtitle: "कलेक्शन ब्राउज करते समय दिल (Heart) आइकन पर क्लिक करके साड़ियां सेव करें।",
    btnBrowse: "साड़ियां देखें",
  },

  // Footer
  footer: {
    tagline: "प्रीमियम होलसेल साड़ियों का खूबसूरत कलेक्शन",
    locationNote: "सूरत B2B होलसेल साड़ी सप्लायर",
    quickLinksTitle: "जल्दी लिंक",
    categoriesTitle: "साड़ी के प्रकार",
    contactTitle: "हमसे संपर्क करें",
    whatsappEnquiry: "WhatsApp पर बात करें",
    copyright: "सर्वाधिकार सुरक्षित।",
  },

  // Buttons & Actions
  buttons: {
    explore: "देखें",
    viewMore: "और देखें",
    viewAll: "सभी देखें",
    search: "सर्च",
    filter: "फिल्टर",
    sort: "सॉर्ट",
    add: "जोड़ें",
    remove: "हटाएं",
    increase: "बढ़ाएं",
    decrease: "कम करें",
    proceed: "आगे बढ़ें",
    orderNow: "ऑर्डर करें",
    sendOrder: "ऑर्डर भेजें",
    confirm: "कन्फर्म करें",
    cancel: "कैंसल करें",
    close: "बंद करें",
    goBack: "वापस जाएं",
    goHome: "होम पर जाएं",
    skip: "स्किप करें",
    apply: "लागू करें",
    clear: "हटाएं",
    whatsappChat: "WhatsApp पर बात करें",
  },

  // Form Validation & Errors
  errors: {
    requiredName: "कृपया अपना नाम डालें।",
    requiredPhone: "कृपया सही 10 अंकों का मोबाइल नंबर डालें।",
    requiredAddress: "कृपया अपना पूरा पता डालें।",
    requiredCity: "कृपया अपने शहर का नाम डालें।",
    requiredState: "कृपया अपने राज्य का नाम डालें।",
    requiredPincode: "कृपया 6 अंकों का सही पिन कोड डालें।",
    requiredItems: "कृपया कम से कम एक साड़ी चुनें।",
    stockUnavailable: "इस साड़ी का स्टॉक अभी उपलब्ध नहीं है।",
    generic: "कुछ समस्या हो गई। कृपया दोबारा कोशिश करें।",
    orderFailed: "ऑर्डर भेजा नहीं जा सका। कृपया फिर से कोशिश करें।",
    notFoundTitle: "पेज नहीं मिला",
    notFoundDesc: "आप जो पेज ढूंढ रहे हैं वह मौजूद नहीं है या हटा दिया गया है।",
  },

  // Customer Auth & Authentication
  auth: {
    loginTitle: "लॉगिन करें",
    loginSubtitle: "अपना मोबाइल नंबर और पासवर्ड डालकर अपने अकाउंट में जाएं।",
    phone: "मोबाइल नंबर",
    phonePlaceholder: "10 अंकों का मोबाइल नंबर",
    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड डालें",
    confirmPassword: "पासवर्ड दोबारा डालें",
    confirmPasswordPlaceholder: "पासवर्ड दोबारा लिखें",
    btnLogin: "लॉगिन करें",
    loginButton: "लॉगिन करें",
    btnLoggingIn: "लॉगिन हो रहा है...",
    forgotPassword: "पासवर्ड भूल गए?",
    forgotPasswordNotice: "पासवर्ड रीसेट सुविधा उपलब्ध है। नीचे दिए गए लिंक पर क्लिक करें।",
    forgotPasswordTitle: "पासवर्ड रीसेट करें",
    forgotPasswordSubtitle: "अपना रजिस्टर्ड ईमेल पता डालें, हम आपको पासवर्ड रीसेट करने का सुरक्षित लिंक भेजेंगे।",
    email: "ईमेल पता",
    emailPlaceholder: "उदा. name@example.com",
    sendResetLink: "रीसेट लिंक भेजें",
    sendingResetLink: "लिंक भेजा जा रहा है...",
    backToLogin: "लॉगिन पर वापस जाएं",
    checkYourEmail: "अपना ईमेल चेक करें",
    resetEmailSentDesc: "यदि इस ईमेल से कोई अकाउंट जुड़ा है, तो हमने पासवर्ड रीसेट लिंक भेज दिया है। कृपया अपना इनबॉक्स और स्पैम फ़ोल्डर देखें।",
    didNotReceiveEmail: "ईमेल नहीं मिला?",
    resendLink: "दोबारा भेजें",
    resendIn: "सेकंड में दोबारा भेजें",
    resetPasswordTitle: "नया पासवर्ड बनाएं",
    resetPasswordSubtitle: "कृपया अपने अकाउंट के लिए एक सुरक्षित नया पासवर्ड चुनें (कम से कम 8 अक्षर)।",
    newPassword: "नया पासवर्ड",
    newPasswordPlaceholder: "कम से कम 8 अक्षर डालें",
    confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
    confirmNewPasswordPlaceholder: "वही पासवर्ड दोबारा डालें",
    btnSetNewPassword: "पासवर्ड अपडेट करें",
    btnSettingNewPassword: "पासवर्ड अपडेट हो रहा है...",
    passwordResetSuccessTitle: "पासवर्ड सफलतापूर्वक बदल गया!",
    passwordResetSuccessDesc: "अब आप अपने नए पासवर्ड से लॉगिन कर सकते हैं।",
    invalidOrExpiredTokenTitle: "अमान्य या समाप्त लिंक",
    invalidOrExpiredTokenDesc: "यह पासवर्ड रीसेट लिंक या तो समाप्त हो चुका है या पहले इस्तेमाल किया जा चुका है। कृपया नया लिंक मांगें।",
    requestNewLink: "नया लिंक मांगें",
    verifyingLink: "लिंक सत्यापित किया जा रहा है...",
    noAccountNotice: "अभी अकाउंट नहीं है? ऑर्डर करते समय अकाउंट बना सकते हैं।",
    passwordMinLength: "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।",
    passwordMismatch: "दोनों पासवर्ड एक जैसे होने चाहिए।",
    alreadyRegisteredError: "इस मोबाइल नंबर से पहले से अकाउंट बना हुआ है। कृपया लॉगिन करें।",
    loginToContinue: "लॉगिन करें",
    createPasswordTitle: "अकाउंट पासवर्ड बनाएं",
    createPasswordSubtitle: "अगली बार लॉगिन करने और अपने ऑर्डर देखने के लिए पासवर्ड बनाएं (कम से कम 8 अक्षर)।",
    alreadyHaveAccount: "पहले से अकाउंट है? लॉगिन करें",
    loggedInAs: "नमस्ते",
    switchAccount: "अकाउंट बदलें / लॉगआउट",
    logout: "लॉगआउट",
    logoutConfirm: "क्या आप लॉगआउट करना चाहते हैं?",
  },

  // Customer Account
  account: {
    title: "मेरा अकाउंट",
    subtitle: "अपने ऑर्डर, डिलीवरी पता और प्रोफ़ाइल प्रबंधित करें।",
    greeting: "नमस्ते",

    overview: "अकाउंट विवरण",
    myOrders: "मेरे ऑर्डर",
    myInfo: "मेरी जानकारी",
    myInformation: "मेरी जानकारी",
    personalDetails: "व्यक्तिगत विवरण",
    editProfile: "प्रोफ़ाइल संपादित करें",
    recentOrders: "हाल के ऑर्डर",
    noOrdersFound: "कोई ऑर्डर नहीं मिला",
    browseCatalog: "साड़ियां देखें",
    viewOrder: "ऑर्डर देखें",
    viewAllOrders: "सभी ऑर्डर देखें",
    name: "नाम",
    businessName: "बिज़नेस का नाम",
    phone: "मोबाइल नंबर",
    mobileNumber: "मोबाइल नंबर",
    whatsapp: "WhatsApp नंबर",
    whatsappNumber: "WhatsApp नंबर",
    email: "ईमेल",
    address: "पता",
    city: "शहर",
    state: "राज्य",
    pincode: "पिन कोड",
    saveChanges: "बदलाव सेव करें",
    btnSaveInfo: "जानकारी सेव करें",
    saving: "सेव हो रहा है...",
    saveSuccess: "आपकी जानकारी सफलतापूर्वक अपडेट हो गई है।",
    profileUpdatedSuccess: "आपकी जानकारी सफलतापूर्वक अपडेट हो गई है।",
    logout: "लॉगआउट करें",
  },

  // My Orders
  myOrders: {
    title: "मेरे ऑर्डर",
    subtitle: "आपके सभी पुराने और नए होलसेल ऑर्डर की लिस्ट।",
    emptyTitle: "अभी आपका कोई ऑर्डर नहीं है।",
    emptySubtitle: "हमारी खूबसूरत साड़ियों का कलेक्शन देखें और अपना पहला ऑर्डर दें।",
    btnBrowse: "साड़ियां देखें",
    orderNumber: "ऑर्डर नंबर",
    orderDate: "तारीख",
    status: "स्थिति",
    itemsCount: "कुल पीस",
    totalItems: "कुल पीस",
    totalAmount: "कुल राशि",
    viewDetails: "विवरण देखें",
    orderDetailsTitle: "ऑर्डर विवरण",
    customerDetails: "ग्राहक की जानकारी",
    shippingAddress: "डिलीवरी का पता",
    orderItems: "ऑर्डर की गई साड़ियां",
    product: "साड़ी",
    item: "साड़ी",
    price: "कीमत",
    unitPrice: "प्रति पीस",
    quantity: "मात्रा",
    qty: "मात्रा",
    subtotal: "कुल",
    summary: "ऑर्डर सारांश",
    shareOnWhatsapp: "WhatsApp पर ऑर्डर शेयर करें",
    shareOnWhatsApp: "WhatsApp पर ऑर्डर शेयर करें",
    backToOrders: "सभी ऑर्डर पर वापस जाएं",
    backToAccount: "अकाउंट पर वापस जाएं",
    notes: "नोट्स",
  },


  // Order Status Values (DB values are English, display is Hindi)
  orderStatus: {
    pending: "ऑर्डर मिला",
    confirmed: "ऑर्डर कन्फर्म हो गया",
    processing: "ऑर्डर तैयार किया जा रहा है",
    packed: "ऑर्डर पैक हो गया",
    shipped: "ऑर्डर भेज दिया गया",
    completed: "ऑर्डर पूरा हो गया",
    cancelled: "ऑर्डर कैंसल हो गया",
  },

  // Loading States
  loading: {
    default: "लोड हो रहा है...",
    products: "साड़ियां लोड हो रही हैं...",
    pleaseWait: "कृपया थोड़ा इंतज़ार करें...",
  },
};

export const en = {
  // Brand & Meta
  brand: {
    name: "Kunal Sarees",
    tagline: "Curated Weaves for Boutiques & Saree Retailers",
    location: "Surat, Gujarat",
    wholesaleBadge: "Surat Direct Wholesale",
  },

  // Navigation
  nav: {
    home: "Home",
    sarees: "Sarees",
    newArrivals: "New Arrivals",
    categories: "Collections",
    about: "About Us",
    contact: "Contact",
    search: "Search",
    orderList: "Order List",
    whatsapp: "WhatsApp",
    wishlist: "Wishlist",
    menu: "Menu",
  },

  // Top Announcement Bar
  topBar: {
    brandName: "Kunal Sarees",
    qualityTag: "Premium Quality Sarees",
    wholesaleOnly: "Wholesale Only",
    trustBadge: "Trusted by boutiques and retailers across India",
  },

  // Homepage Hero
  hero: {
    eyebrow: "Surat Direct Wholesale",
    badge: "Kunal Sarees · Premium Wholesale Sarees",
    titleMain: "Curated Weaves for",
    titleSub: "Boutiques & Retailers",
    supporting:
      "Handpicked Banarasi, Silk, Organza and Bridal sarees sourced directly from master looms. Transparent per-piece wholesale pricing for retailers across India.",
    btnExplore: "Browse Sarees",
    btnNewArrivals: "New Arrivals",
    btnWhatsapp: "Order via WhatsApp",
    directSupport: "Direct wholesale support & dispatch inquiries",
    callWhatsapp: "Call / WhatsApp",
    wholesaleEmail: "Wholesale Email",
    photoTagSub: "Surat Direct Wholesale",
    photoTagTitle: "Pure Banarasi & Silk Sarees",
    moqBadge: "Min 5 Pcs",
  },

  // Trust / Wholesale Highlights
  highlights: [
    {
      title: "Premium Quality",
      description: "Carefully inspected fabrics, motifs, and artisanal finishing",
    },
    {
      title: "Wholesale Pricing",
      description: "Direct Surat manufacturing rates tailored for retail margins",
    },
    {
      title: "Vast Collection",
      description: "Authentic heritage classics to contemporary festive designs",
    },
    {
      title: "Direct WhatsApp Order",
      description: "Build your order list and submit straight to our team on WhatsApp",
    },
  ],

  // Categories Section
  categories: {
    eyebrow: "Curated Collections",
    title: "Saree Categories",
    description: "Browse our handpicked saree varieties crafted for retailers, boutiques, and resellers.",
    viewAll: "View All Sarees",
    exploreBtn: "Explore Sarees",
    designsCount: "Designs Available",
    wholesaleCategory: "Wholesale Category",
  },

  // Products & Cards
  products: {
    newArrivalsEyebrow: "Fresh Designs",
    newArrivalsTitle: "New Arrivals",
    newArrivalsDesc: "The newest designs added to our wholesale catalogue this season.",
    allProductsEyebrow: "Our Complete Catalogue",
    allProductsTitle: "All Sarees",
    allProductsDesc: "Explore our full range of Banarasi, Silk, Georgette, Cotton, Organza and Bridal sarees.",
    viewAllNew: "View All New Arrivals",
    viewAllFull: "View Full Collection",
    price: "Price",
    perPiece: "/ piece",
    moq: "Min Order",
    piece: "pc",
    pieces: "pcs",
    inStock: "In Stock",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    madeToOrder: "Made to Order",
    badgeNew: "New",
    badgeFeatured: "Featured",
    addToOrder: "Add to Order List",
    inOrderList: "In Order List",
    added: "Added",
    viewDetails: "View Details",
    noProductsFound: "No Sarees Found",
    noProductsDesc: "Try adjusting your search or filters to find what you need.",
  },

  // Search
  search: {
    title: "Search Sarees",
    placeholder: "Search by saree name, fabric, or product code...",
    button: "Search",
    recentSearches: "Recent Searches",
    quickCategories: "Popular Categories",
    resultsCount: "Sarees Found",
    noResultsTitle: "No Sarees Found",
    noResultsMessage: "Try changing your search terms or filters.",
    clear: "Clear",
  },

  // Filters & Sorting
  filters: {
    filterBtn: "Filters",
    sortBy: "Sort By:",
    sortOptions: {
      featured: "Featured",
      newest: "Newest First",
      priceAsc: "Price: Low to High",
      priceDesc: "Price: High to Low",
      nameAsc: "Name (A to Z)",
    },
    category: "Category",
    fabric: "Fabric",
    color: "Color",
    price: "Price Range",
    priceRanges: {
      under2500: "Under ₹2,500",
      between2500And5000: "₹2,500 – ₹5,000",
      between5000And10000: "₹5,000 – ₹10,000",
      above10000: "Above ₹10,000",
    },
    availability: "Availability",
    activeFilters: "Active Filters:",
    clearAll: "Clear All",
    apply: "Apply",
    moreFilters: "More Filters",
    showMore: "Show More",
    showLess: "Show Less",
  },

  // Product Details Page
  productDetails: {
    backToCatalogue: "← All Sarees",
    fabricLabel: "Fabric:",
    codeLabel: "Product Code:",
    colorLabel: "Select Color:",
    quantityLabel: "Quantity (Pieces):",
    minOrderNote: "Minimum Order:",
    specificationsTitle: "Product Specifications",
    length: "Saree Length",
    blouse: "Blouse Piece",
    weight: "Weight",
    washCare: "Wash Care",
    origin: "Origin",
    highlightsTitle: "Highlights",
    directInquiry: "Direct WhatsApp Inquiry",
    orderViaWhatsApp: "Order via WhatsApp",
    relatedTitle: "Related Sarees",
    relatedDesc: "More curated designs your retail customers will love.",
    wholesaleAssurance: "No online payment required — our team will confirm your order details and dispatch directly on WhatsApp.",
  },

  // Order List & Drawer
  orderList: {
    title: "Your Order List",
    emptyTitle: "Your order list is empty.",
    emptySubtitle: "Explore our catalogue and add sarees to build your wholesale order.",
    btnBrowse: "Browse Sarees",
    design: "Design",
    designs: "Designs",
    totalPieces: "Total Pieces",
    totalEstimated: "Estimated Total",
    remove: "Remove",
    quantity: "Quantity",
    decrease: "Decrease",
    increase: "Increase",
    clearList: "Clear List",
    proceedToCheckout: "Proceed to Order",
    sendViaWhatsApp: "Send Order via WhatsApp",
    subtotal: "Subtotal",
    wholesaleNote: "Applicable GST (5%) and transport charges will be finalized on your official invoice.",
  },

  // Checkout & Wholesale Form
  checkout: {
    title: "Order Information",
    subtitle: "Fill in your business details below to submit your wholesale order.",
    customerInfo: "Your Details",
    name: "Your Name",
    namePlaceholder: "Enter your full name",
    businessName: "Business / Shop Name",
    businessNamePlaceholder: "Enter your shop or boutique name",
    phone: "Mobile Number",
    phonePlaceholder: "10-digit mobile number",
    whatsappNumber: "WhatsApp Number",
    whatsappPlaceholder: "Enter WhatsApp number",
    email: "Email (Optional)",
    emailPlaceholder: "example@gmail.com",
    address: "Full Address",
    addressPlaceholder: "Shop/Building No., Street, Area",
    city: "City",
    cityPlaceholder: "City name",
    state: "State",
    statePlaceholder: "State name",
    pincode: "Pincode",
    pincodePlaceholder: "6-digit pincode",
    notes: "Order Notes / Instructions",
    notesPlaceholder: "Color specifications, packing preference, or transport notes...",
    orderSummary: "Order Summary",
    totalDesigns: "Total Designs",
    totalQuantity: "Total Pieces",
    totalAmount: "Estimated Total",
    btnSubmit: "Submit Order",
    btnSubmitting: "Submitting Order...",
    noPaymentNotice: "No payment is processed on the website. Final billing and dispatch details are confirmed directly on WhatsApp.",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    loginButton: "Login",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    passwordPolicyHint: "Password must be at least 8 characters.",
    passwordRequired: "Please enter your password.",
    passwordTooShort: "Password must be at least 8 characters.",
    passwordsDoNotMatch: "Passwords do not match.",
    phoneAlreadyRegistered: "An account with this mobile number already exists. Please login.",
  },


  // Order Success Page
  orderSuccess: {
    title: "Order Submitted Successfully",
    subtitle: "We have received your order details. Our wholesale team will connect with you on WhatsApp shortly.",
    orderNumberLabel: "Order Number",
    statusLabel: "Status",
    statusPending: "Pending Confirmation",
    whatsappReminder: "If your order message was not sent automatically on WhatsApp, tap below:",
    btnSendWhatsApp: "Send Order via WhatsApp",
    btnGoHome: "Go to Homepage",
    btnBrowseMore: "Browse More Sarees",
  },

  // Wholesale Ordering Process (Steps)
  process: {
    eyebrow: "Simple Wholesale Ordering",
    title: "How to Order",
    description:
      "Direct, transparent wholesale pricing for retail shops and boutiques. No online payments — your order list is sent straight to Kunal Sarees on WhatsApp.",
    steps: [
      {
        title: "Explore Catalogue",
        description: "Browse our wholesale collection of Banarasi, Silk, Organza, Georgette, and Bridal sarees.",
      },
      {
        title: "Select Sarees & Quantities",
        description: "Choose your desired colors and set quantities meeting each design's MOQ.",
      },
      {
        title: "Enter Business Details",
        description: "Provide your shop name, city, and WhatsApp contact details.",
      },
      {
        title: "Send on WhatsApp",
        description: "Submit your complete order list directly to Kunal Sarees with a single tap.",
      },
    ],
    stepOf: "Step",
    ofTotal: "of 4",
    startOrderBtn: "Start Your Order",
    trustNote: "No online payment taken on website. Invoicing and courier/transport details are handled directly by Kunal Sarees.",
  },

  // Why Kunal Sarees (Pillars)
  whyUs: {
    eyebrow: "Wholesale Advantage",
    title: "Why Partner with Kunal Sarees?",
    description:
      "We collaborate with boutique owners, saree showrooms, and resellers across India to supply premium weaves with reliable service.",
    pillars: [
      {
        title: "Inspected Quality",
        description: "Strict quality control on every weave, zari border, and fabric finish.",
      },
      {
        title: "B2B Wholesale Focus",
        description: "Dedicated pricing and order volumes optimized for retail business margins.",
      },
      {
        title: "Extensive Variety",
        description: "Heritage handlooms to trending bridal collections under one roof.",
      },
      {
        title: "Streamlined Ordering",
        description: "Fast WhatsApp communication for live video approvals, billing, and dispatch.",
      },
    ],
    badgeTitle: "Exquisite Weaves & Craftsmanship",
    badgeSubtitle: "Curated selection for boutiques and retailers",
  },

  // Wholesale CTA
  cta: {
    eyebrow: "Wholesale Inquiries",
    title: "Looking for the Right Sarees for Your Business?",
    description: "Browse our latest wholesale catalogue or connect directly on WhatsApp for custom bulk orders.",
    btnExplore: "Browse Sarees",
    btnWhatsapp: "Chat on WhatsApp",
  },

  // About Page
  about: {
    eyebrow: "About Us",
    title: "Kunal Sarees — Surat's Trusted Wholesale Saree Supplier",
    intro:
      "Kunal Sarees is dedicated to supplying premium wholesale sarees, focused on exquisite craftsmanship, fresh designs, and dependable B2B service.",
    storyParagraphs: [
      "Kunal Sarees was established with a clear goal: retail store owners and boutique creators deserve a wholesale partner who curates sarees with the same discerning eye as their end customers. Operating from the textile center of Surat, we supply authentic Banarasi, Kanjivaram, and designer sarees across India.",
      "Every piece is closely examined — fabric strength, border integrity, zari sheen, and its commercial sell-through appeal for retail shelves.",
      "Today, hundreds of boutique owners, saree showrooms, and resellers rely on Kunal Sarees for transparent pricing and prompt logistics.",
    ],
    valuesTitle: "Our Commitment",
    values: [
      {
        title: "Handpicked Quality",
        description: "Every saree is carefully vetted for weave perfection and finishing before entering our collection.",
      },
      {
        title: "True Wholesale Pricing",
        description: "Clear, upfront per-piece pricing allowing you to plan healthy profit margins.",
      },
      {
        title: "Reliable Nationwide Logistics",
        description: "Secure packaging and prompt dispatch via trusted transport and express couriers.",
      },
    ],
    locationTitle: "Visit Our Showroom",
    locationDesc: "When in Surat, visit our wholesale showroom to experience our full catalogue in person.",
  },

  // Contact Page
  contact: {
    eyebrow: "Get in Touch",
    title: "Contact Us",
    subtitle: "Have questions about our sarees, bulk orders, or custom requirements? Reach out to our team.",
    formTitle: "Send a Message",
    name: "Name",
    namePlaceholder: "Enter your name",
    phone: "Mobile Number",
    phonePlaceholder: "10-digit mobile number",
    email: "Email (Optional)",
    emailPlaceholder: "example@gmail.com",
    message: "Your Message",
    messagePlaceholder: "Tell us which saree categories or details you are interested in...",
    sendBtn: "Send Message",
    sendingBtn: "Sending...",
    successMsg: "Thank you! We have received your message and our team will get in touch shortly.",
    directContact: "Direct Contact",
    callUs: "Call Us",
    whatsappUs: "Chat on WhatsApp",
    emailUs: "Email Us",
    visitUs: "Shop Address",
    workingHours: "Working Hours",
    getDirections: "Get Directions (Google Maps)",
  },

  // Wholesale Terms Page
  wholesale: {
    eyebrow: "Wholesale Terms & Guidelines",
    title: "Wholesale Business Guide",
    subtitle: "Complete and transparent information on ordering wholesale with Kunal Sarees.",
    terms: [
      {
        title: "Minimum Order Quantity (MOQ)",
        description: "Bridal sarees start from 1 pc; other saree designs are available in 2 to 5 pc sets. Each listing mentions its specific MOQ.",
      },
      {
        title: "Wholesale Pricing",
        description: "All catalogue prices are per-piece wholesale rates. Applicable 5% GST is added to final billing.",
      },
      {
        title: "Payment Terms",
        description: "No online payment is collected on the website. Payments are completed via NEFT/RTGS/UPI upon order confirmation.",
      },
      {
        title: "Dispatch & Transport",
        description: "In-stock orders dispatch within 2-4 business days. Safe courier and transport delivery across India.",
      },
    ],
    audienceTitle: "Who We Supply To",
    audiences: [
      "Saree Boutiques & Designer Studios",
      "Retail Saree Shops & Showrooms",
      "Online & Social Media Resellers",
      "Bridal & Event Stylists",
    ],
    faqTitle: "Frequently Asked Questions (FAQ)",
    faqs: [
      {
        question: "Is a GST number required to place an order?",
        answer: "A GSTIN is helpful for formal business tax invoicing, but not strictly mandatory for initial inquiries or orders.",
      },
      {
        question: "Can I mix different designs in a single wholesale order?",
        answer: "Yes, you can combine multiple designs in your order list as long as each item meets its listed MOQ.",
      },
      {
        question: "Can I request live videos of sarees before dispatch?",
        answer: "Absolutely! You can request close-up video clips and photos of any saree design directly on WhatsApp.",
      },
      {
        question: "Do you ship outside Gujarat?",
        answer: "Yes, we ship daily to all states, cities, and towns across India through trusted logistics partners.",
      },
      {
        question: "What if there is a defect in any saree received?",
        answer: "Notify us with unboxing photos/videos within 48 hours of delivery, and we will promptly issue a replacement or resolution.",
      },
    ],
  },

  // Wishlist / Saved Designs
  wishlist: {
    title: "Saved Sarees",
    subtitle: "Your shortlisted sarees saved for easy review and bulk ordering.",
    emptyTitle: "No sarees saved yet.",
    emptySubtitle: "Click the heart icon while browsing to save designs to your wishlist.",
    btnBrowse: "Browse Sarees",
  },

  // Footer
  footer: {
    tagline: "Curated Weaves for Boutiques & Saree Retailers",
    locationNote: "Surat B2B Wholesale Saree Supplier",
    quickLinksTitle: "Quick Links",
    categoriesTitle: "Saree Categories",
    contactTitle: "Contact Us",
    whatsappEnquiry: "WhatsApp Inquiry",
    copyright: "All rights reserved.",
  },

  // Buttons & Actions
  buttons: {
    explore: "Explore",
    viewMore: "View More",
    viewAll: "View All",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    add: "Add",
    remove: "Remove",
    increase: "Increase",
    decrease: "Decrease",
    proceed: "Proceed",
    orderNow: "Order Now",
    sendOrder: "Send Order",
    confirm: "Confirm",
    cancel: "Cancel",
    close: "Close",
    goBack: "Go Back",
    goHome: "Go to Homepage",
    skip: "Skip",
    apply: "Apply",
    clear: "Clear",
    whatsappChat: "Chat on WhatsApp",
  },

  // Form Validation & Errors
  errors: {
    requiredName: "Please enter your name.",
    requiredPhone: "Please enter a valid 10-digit mobile number.",
    requiredAddress: "Please enter your full address.",
    requiredCity: "Please enter your city.",
    requiredState: "Please enter your state.",
    requiredPincode: "Please enter a valid 6-digit pincode.",
    requiredItems: "Please select at least one saree design.",
    stockUnavailable: "This saree is currently out of stock.",
    generic: "Something went wrong. Please try again.",
    orderFailed: "Could not submit order. Please try again.",
    notFoundTitle: "Page Not Found",
    notFoundDesc: "The page you are looking for does not exist or has been moved.",
  },

  // Customer Auth & Authentication
  auth: {
    loginTitle: "Customer Login",
    loginSubtitle: "Sign in with your mobile number and password to access your account.",
    phone: "Mobile Number",
    phonePlaceholder: "10-digit mobile number",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    btnLogin: "Sign In",
    loginButton: "Sign In",
    btnLoggingIn: "Signing in...",
    forgotPassword: "Forgot password?",
    forgotPasswordNotice: "Password reset functionality is available. Click the link below to reset.",
    forgotPasswordTitle: "Reset Password",
    forgotPasswordSubtitle: "Enter your registered email address and we will send you a secure password reset link.",
    email: "Email Address",
    emailPlaceholder: "e.g. name@example.com",
    sendResetLink: "Send Reset Link",
    sendingResetLink: "Sending Link...",
    backToLogin: "Back to Login",
    checkYourEmail: "Check Your Email",
    resetEmailSentDesc: "If an account exists with this email, we have sent a password reset link. Please check your inbox and spam folder.",
    didNotReceiveEmail: "Didn't receive the email?",
    resendLink: "Resend Link",
    resendIn: "Resend in",
    resetPasswordTitle: "Set New Password",
    resetPasswordSubtitle: "Please choose a strong and secure new password for your account (at least 8 characters).",
    newPassword: "New Password",
    newPasswordPlaceholder: "Enter at least 8 characters",
    confirmNewPassword: "Confirm New Password",
    confirmNewPasswordPlaceholder: "Re-enter your new password",
    btnSetNewPassword: "Update Password",
    btnSettingNewPassword: "Updating Password...",
    passwordResetSuccessTitle: "Password Reset Successfully!",
    passwordResetSuccessDesc: "You can now sign in with your new password.",
    invalidOrExpiredTokenTitle: "Invalid or Expired Link",
    invalidOrExpiredTokenDesc: "This password reset link is invalid or has expired. Please request a new link.",
    requestNewLink: "Request New Link",
    verifyingLink: "Verifying reset link...",
    noAccountNotice: "Don't have an account yet? You can create one during checkout.",
    passwordMinLength: "Password must be at least 8 characters.",
    passwordMismatch: "Both passwords must match.",
    alreadyRegisteredError: "An account with this mobile number already exists. Please log in.",
    loginToContinue: "Log In",
    createPasswordTitle: "Create Account Password",
    createPasswordSubtitle: "Choose a password (min 8 chars) to log in later and view your orders.",
    alreadyHaveAccount: "Already have an account? Log in",
    loggedInAs: "Hello",
    switchAccount: "Switch Account / Logout",
    logout: "Logout",
    logoutConfirm: "Are you sure you want to log out?",
  },

  // Customer Account
  account: {
    title: "My Account",
    subtitle: "Manage your wholesale orders, addresses and profile.",
    greeting: "Hello",

    overview: "Overview",
    myOrders: "My Orders",
    myInfo: "My Information",
    myInformation: "My Information",
    personalDetails: "Personal Details",
    editProfile: "Edit Profile",
    recentOrders: "Recent Orders",
    noOrdersFound: "No orders found",
    browseCatalog: "Browse Sarees",
    viewOrder: "View Order",
    viewAllOrders: "View All Orders",
    name: "Name",
    businessName: "Business Name",
    phone: "Mobile Number",
    mobileNumber: "Mobile Number",
    whatsapp: "WhatsApp Number",
    whatsappNumber: "WhatsApp Number",
    email: "Email Address",
    address: "Address",
    city: "City",
    state: "State",
    pincode: "Pincode",
    saveChanges: "Save Changes",
    btnSaveInfo: "Save Information",
    saving: "Saving...",
    saveSuccess: "Your information has been successfully updated.",
    profileUpdatedSuccess: "Your profile has been successfully updated.",
    logout: "Sign Out",
  },

  // My Orders
  myOrders: {
    title: "My Orders",
    subtitle: "List of all your previous and active wholesale orders.",
    emptyTitle: "You have not placed any orders yet.",
    emptySubtitle: "Explore our wholesale collection and place your first order.",
    btnBrowse: "Browse Sarees",
    orderNumber: "Order Number",
    orderDate: "Date",
    status: "Status",
    itemsCount: "Total Pieces",
    totalItems: "Total Pieces",
    totalAmount: "Total Amount",
    viewDetails: "View Details",
    orderDetailsTitle: "Order Details",
    customerDetails: "Customer Information",
    shippingAddress: "Shipping Address",
    orderItems: "Ordered Sarees",
    product: "Saree",
    item: "Saree",
    price: "Price",
    unitPrice: "Unit Price",
    quantity: "Quantity",
    qty: "Qty",
    subtotal: "Subtotal",
    summary: "Order Summary",
    shareOnWhatsapp: "Share Order on WhatsApp",
    shareOnWhatsApp: "Share Order on WhatsApp",
    backToOrders: "Back to All Orders",
    backToAccount: "Back to Account",
    notes: "Notes",
  },


  // Order Status Values
  orderStatus: {
    pending: "Order Received",
    confirmed: "Order Confirmed",
    processing: "Processing Order",
    packed: "Packed",
    shipped: "Shipped",
    completed: "Completed",
    cancelled: "Cancelled",
  },

  // Loading States
  loading: {
    default: "Loading...",
    products: "Loading sarees...",
    pleaseWait: "Please wait a moment...",
  },
};

export const translations = {
  hi,
  en,
} as const;

export type TranslationDictionary = typeof hi;

export interface Localizable {
  [key: string]: any;
}

/**
 * Reusable helper to safely extract localized field values with fallback
 * Usage: getLocalizedValue(product, "name", language)
 */
export function getLocalizedValue<T extends Localizable>(
  item: T | null | undefined,
  field: string,
  // Kept for call-site compatibility; database content is always English.
  _lang: Language = "hi"
): string {
  if (!item) return "";

  // Catalogue data from the database is stored in English only. Choosing Hindi changes
  // the site's built-in text (dictionaries in this file), not product/category data.
  for (const key of [`${field}_en`, `${field}En`, field]) {
    const val = item[key];
    if (typeof val === "string" && val.trim().length > 0) {
      return val;
    }
  }

  return "";
}
