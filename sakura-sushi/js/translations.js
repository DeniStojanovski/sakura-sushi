/* ==========================================================================
   Sakura Sushi — i18n engine
   Supports English (en) and Macedonian (mk). Language choice persists in
   localStorage so it carries across every page of the site.
   ========================================================================== */

const translations = {
  en: {
    nav: { home: "Home", menu: "Menu", team: "Our Chefs", blog: "Journal", contact: "Contact" },
    hero: {
      badge: "Since 2016 — Skopje",
      title: 'Handcrafted sushi, served with <em>quiet precision</em>.',
      subtitle: "Sakura Sushi is a small counter of eight seats and twenty years of training behind it. Every piece is pressed to order, never pre-made.",
      ctaMenu: "View the menu",
      ctaReserve: "Reserve a seat"
    },
    about: {
      eyebrow: "Our story",
      title: "A counter built on one idea",
      p1: "Sakura Sushi opened in 2016 in the heart of Skopje with a simple belief: sushi is a craft measured in years, not recipes. Our rice is seasoned by hand, our fish is inspected each morning, and nothing leaves the counter that a chef wouldn't serve their own family.",
      p2: "Two decades of training in Tokyo, Osaka and Skopje sit behind every plate. We kept the ritual and softened the formality — this is a neighbourhood sushi bar first, a fine one second.",
      quote: "Rice is eighty percent of the nigiri. If the rice is wrong, nothing else matters.",
      quoteAuthor: "Hiroshi Tanaka, Executive Head Chef",
      statYears: "Years of craft",
      statIngredients: "Weekly seafood deliveries",
      statDishes: "Dishes on the menu",
      statGuests: "Guests served"
    },
    features: {
      eyebrow: "Why the counter",
      title: "What twenty years of training looks like on a plate",
      f1title: "Pressed to order",
      f1desc: "No piece is made until you order it. What reaches your plate was rice and knife work minutes earlier.",
      f2title: "Trained hands",
      f2desc: "Every chef behind the counter trained a minimum of five years before touching a guest's plate.",
      f3title: "Morning market runs",
      f3desc: "Fish arrives six mornings a week. What sells out, sells out — we don't freeze to fill gaps.",
      f4title: "Delivered within the hour",
      f4desc: "Order ahead and your rolls travel the way they were built — upright, chilled, forty minutes or less."
    },
    featuredMenu: { eyebrow: "A short taste", title: "From tonight's counter", cta: "See the full menu" },
    testimonials: {
      eyebrow: "Regulars say",
      title: "Notes left at the counter",
      t1: "The nigiri rice is warmer than anywhere else in the city — that alone is worth the visit.",
      t2: "Ordered delivery on a whim. The roll still had crunch after thirty minutes. Rare.",
      t3: "Booked the counter for a birthday. Chef Kenji talked us through every piece without making it a show."
    },
    cta: { title: "Hungry already?", subtitle: "Order online and we'll have it at your door within the hour.", button: "Start an order" },
    footer: {
      aboutText: "A small sushi counter in Skopje, open since 2016. Eight seats, one philosophy.",
      linksTitle: "Explore",
      contactTitle: "Visit",
      hoursTitle: "Hours",
      hours1: "Tue–Sun · 12:00–23:00",
      hours2: "Closed Mondays",
      followTitle: "Follow",
      rights: "All rights reserved.",
      madeFor: "A student project built for a university web development course."
    },
    menuPage: {
      eyebrow: "The full spread",
      title: "Our menu",
      subtitle: "Filter by course, or search for something specific. Prices include tax.",
      searchPlaceholder: "Search the menu…",
      searchLabel: "Search the menu",
      filterAll: "All",
      filterNigiri: "Nigiri",
      filterRolls: "Rolls",
      filterSets: "Sets",
      filterDrinks: "Drinks",
      filterVeg: "Vegetarian",
      filterSpicy: "Spicy",
      noResults: "Nothing matches those filters — try clearing one.",
      allergensLabel: "Contains:",
      addToCart: "Add",
      added: "Added",
      chefPick: "Chef's pick"
    },
    allergens: { gluten: "Gluten", fish: "Fish", shellfish: "Shellfish", sesame: "Sesame", soy: "Soy", dairy: "Dairy", egg: "Egg", alcohol: "Alcohol" },
    cart: {
      title: "Your order",
      empty: "Your cart is empty. Add something from the menu.",
      subtotal: "Subtotal",
      delivery: "Delivery",
      total: "Total",
      checkout: "Checkout",
      continue: "Continue browsing",
      close: "Close cart",
      freeDeliveryNote: "Free delivery over $40",
      remove: "Remove"
    },
    checkout: {
      title: "Delivery details",
      name: "Full name",
      phone: "Phone number",
      email: "Email",
      address: "Delivery address",
      city: "City",
      notes: "Notes for the rider (optional)",
      paymentTitle: "Payment method",
      cash: "Cash on delivery",
      card: "Card on delivery",
      wallet: "Mobile wallet",
      summaryTitle: "Order summary",
      placeOrder: "Place order",
      close: "Close",
      errorRequired: "This field is required.",
      errorEmail: "Enter a valid email address.",
      errorPhone: "Enter a valid phone number.",
      emptyCartNote: "Add items to your cart before checking out."
    },
    confirmation: {
      title: "Order confirmed",
      orderIdLabel: "Order ID",
      eta: "Estimated arrival",
      etaValue: "35–45 minutes",
      thanks: "We've started plating. A confirmation was sent to your email.",
      totalPaid: "Total charged",
      continue: "Continue browsing",
      print: "Print receipt"
    },
    team: {
      eyebrow: "Behind the counter",
      title: "Our master chefs",
      subtitle: "Six people, five countries of training, one counter.",
      years: "years of experience",
      joinTitle: "Join the counter",
      joinText: "We take on one apprentice a year. If you can hold a knife steady and a service line calm, write to us.",
      joinButton: "Get in touch"
    },
    blog: {
      eyebrow: "From the kitchen",
      title: "Sushi journal",
      subtitle: "Guides, news, and the occasional excuse to talk about rice.",
      categoryGuide: "Guide",
      categoryNews: "News",
      readMore: "Read the full story",
      minRead: "min read",
      close: "Close article",
      subscribeTitle: "Get the next post",
      subscribeText: "One email a month, no more. Mostly rice.",
      subscribePlaceholder: "you@email.com",
      subscribeButton: "Subscribe",
      subscribeSuccess: "You're on the list.",
      subscribeErrorEmail: "Enter a valid email address."
    },
    contact: {
      eyebrow: "Say hello",
      title: "Get in touch",
      subtitle: "Questions, private events, or feedback about tonight's dinner — all welcome.",
      addressLabel: "Address",
      addressValue: "12 Makedonija St, 1000 Skopje",
      phoneLabel: "Phone",
      emailLabel: "Email",
      hoursLabel: "Hours",
      formTitle: "Send a message",
      formName: "Name",
      formEmail: "Email",
      formSubject: "Subject",
      subjReservation: "Reservation",
      subjGeneral: "General question",
      subjFeedback: "Feedback",
      subjOther: "Other",
      formMessage: "Message",
      formMessagePlaceholder: "Tell us a little about what you need…",
      formSubmit: "Send message",
      formSuccess: "Thanks — we read every message and reply within a day.",
      errorRequired: "This field is required.",
      errorEmail: "Enter a valid email address.",
      errorMinLength: "Say a little more — at least 10 characters.",
      faqTitle: "Before you write",
      q1: "Do you take walk-ins?",
      a1: "The first four counter seats are always held for walk-ins. Everything else is reservation-only after 6pm.",
      q2: "Is there a vegetarian menu?",
      a2: "Yes — look for the green dot on the menu page. Our Vegetable Roll and Zen Set are both fully plant-based.",
      q3: "Do you deliver outside the city centre?",
      a3: "We deliver within a 6 km radius of the restaurant. Enter your address at checkout and we'll confirm.",
      q4: "Can I book the whole counter for a private event?",
      a4: "Yes, for up to eight guests. Send us a message with the date and we'll get back to you within a day."
    },
    cookies: {
      text: "We use a few cookies to remember your language and cart — nothing is sold to third parties.",
      accept: "Accept all",
      preferences: "Preferences",
      prefTitle: "Cookie preferences",
      necessary: "Necessary",
      necessaryDesc: "Required for the cart and language settings to work. Always on.",
      analytics: "Analytics",
      analyticsDesc: "Helps us understand which pages are useful. Anonymous.",
      marketing: "Marketing",
      marketingDesc: "Used for the occasional newsletter. Off by default.",
      save: "Save preferences"
    }
  },

  mk: {
    nav: { home: "Почетна", menu: "Мени", team: "Нашите готвачи", blog: "Дневник", contact: "Контакт" },
    hero: {
      badge: "Од 2016 — Скопје",
      title: 'Рачно изработено суши, сервирано со <em>тивка прецизност</em>.',
      subtitle: "Сакура Суши е мал шанк со осум седишта и дваесет години обука зад него. Секое парче се притиска по нарачка, никогаш однапред.",
      ctaMenu: "Погледни го менито",
      ctaReserve: "Резервирај маса"
    },
    about: {
      eyebrow: "Нашата приказна",
      title: "Шанк изграден на една идеја",
      p1: "Сакура Суши отвори во 2016 година во срцето на Скопје со едно едноставно верување: сушито е занает мерен во години, а не во рецепти. Нашиот ориз се зачинува рачно, рибата се проверува секое утро, и ништо не го напушта шанкот што готвачот не би го послужил на своето семејство.",
      p2: "Две децении обука во Токио, Осака и Скопје стојат зад секој тањир. Го задржавме ритуалот, а ја омекнавме формалноста — ова е пред сè соседски суши бар, а потоа фин ресторан.",
      quote: "Оризот е осумдесет проценти од нигирито. Ако оризот не е како што треба, ништо друго не е важно.",
      quoteAuthor: "Хироши Танака, извршен шеф готвач",
      statYears: "Години занает",
      statIngredients: "Неделни достави свежа риба",
      statDishes: "Јадења на менито",
      statGuests: "Послужени гости"
    },
    features: {
      eyebrow: "Зошто шанкот",
      title: "Како изгледаат дваесет години обука на тањир",
      f1title: "Притиснато по нарачка",
      f1desc: "Ниту едно парче не се прави пред да го нарачате. Она што стигнува на тањирот пред неколку минути беше само ориз и работа со нож.",
      f2title: "Обучени раце",
      f2desc: "Секој готвач зад шанкот се обучувал минимум пет години пред да допре тањир на гостин.",
      f3title: "Утрински пазар",
      f3desc: "Рибата пристигнува шест утра неделно. Она што ќе се распродаде, се распродава — не замрзнуваме за да пополниме празнини.",
      f4title: "Достава за еден час",
      f4desc: "Нарачајте однапред и вашите ролати патуваат онака како што се направени — исправени, изладени, за четириесет минути или помалку."
    },
    featuredMenu: { eyebrow: "Кратка проба", title: "Од вечерашниот шанк", cta: "Целото мени" },
    testimonials: {
      eyebrow: "Гостите велат",
      title: "Забелешки оставени на шанкот",
      t1: "Оризот за нигири е потопол отколку кај било кого во градот — само тоа ја вреди посетата.",
      t2: "Нарачав достава без размислување. Ролатот сè уште беше свеж по триесет минути. Реткост.",
      t3: "Резервиравме шанк за роденден. Готвачот Кенџи ни раскажуваше за секое парче без да го претвори во претстава."
    },
    cta: { title: "Веќе огладневте?", subtitle: "Нарачајте онлајн и ќе биде на вашата врата за еден час.", button: "Започни нарачка" },
    footer: {
      aboutText: "Мал суши шанк во Скопје, отворен од 2016. Осум седишта, една филозофија.",
      linksTitle: "Истражи",
      contactTitle: "Посети нè",
      hoursTitle: "Работно време",
      hours1: "Вт–Нед · 12:00–23:00",
      hours2: "Понеделник затворено",
      followTitle: "Следете нè",
      rights: "Сите права задржани.",
      madeFor: "Студентски проект изработен за универзитетски курс по веб-развој."
    },
    menuPage: {
      eyebrow: "Целосна понуда",
      title: "Нашето мени",
      subtitle: "Филтрирајте по категорија, или пребарајте нешто конкретно. Цените го вклучуваат данокот.",
      searchPlaceholder: "Пребарај го менито…",
      searchLabel: "Пребарај го менито",
      filterAll: "Сите",
      filterNigiri: "Нигири",
      filterRolls: "Ролати",
      filterSets: "Сетови",
      filterDrinks: "Пијалаци",
      filterVeg: "Вегетаријанско",
      filterSpicy: "Луто",
      noResults: "Ништо не одговара на филтрите — обидете се да отстраните некој.",
      allergensLabel: "Содржи:",
      addToCart: "Додади",
      added: "Додадено",
      chefPick: "Избор на шефот"
    },
    allergens: { gluten: "Глутен", fish: "Риба", shellfish: "Школки", sesame: "Сусам", soy: "Соја", dairy: "Млечни производи", egg: "Јајце", alcohol: "Алкохол" },
    cart: {
      title: "Вашата нарачка",
      empty: "Кошничката е празна. Додадете нешто од менито.",
      subtotal: "Меѓузбир",
      delivery: "Достава",
      total: "Вкупно",
      checkout: "Плати",
      continue: "Продолжи со прегледување",
      close: "Затвори кошничка",
      freeDeliveryNote: "Бесплатна достава над $40",
      remove: "Отстрани"
    },
    checkout: {
      title: "Детали за достава",
      name: "Име и презиме",
      phone: "Телефонски број",
      email: "Е-пошта",
      address: "Адреса за достава",
      city: "Град",
      notes: "Забелешки за курирот (опционално)",
      paymentTitle: "Начин на плаќање",
      cash: "Плаќање при достава",
      card: "Картичка при достава",
      wallet: "Мобилен паричник",
      summaryTitle: "Преглед на нарачката",
      placeOrder: "Потврди нарачка",
      close: "Затвори",
      errorRequired: "Ова поле е задолжително.",
      errorEmail: "Внесете важечка е-пошта.",
      errorPhone: "Внесете важечки телефонски број.",
      emptyCartNote: "Додадете производи во кошничката пред плаќање."
    },
    confirmation: {
      title: "Нарачката е потврдена",
      orderIdLabel: "Број на нарачка",
      eta: "Очекувано пристигнување",
      etaValue: "35–45 минути",
      thanks: "Веќе почнавме со подготовка. Потврда е испратена на вашата е-пошта.",
      totalPaid: "Наплатен износ",
      continue: "Продолжи со прегледување",
      print: "Испечати сметка"
    },
    team: {
      eyebrow: "Зад шанкот",
      title: "Нашите мајстор готвачи",
      subtitle: "Шест луѓе, пет земји на обука, еден шанк.",
      years: "години искуство",
      joinTitle: "Придружи се на шанкот",
      joinText: "Примаме еден практикант годишно. Ако можете да држите нож стабилно и услуга смирена, пишете ни.",
      joinButton: "Контактирај нè"
    },
    blog: {
      eyebrow: "Од кујната",
      title: "Суши дневник",
      subtitle: "Водичи, вести и понекогаш повод да зборуваме за ориз.",
      categoryGuide: "Водич",
      categoryNews: "Вести",
      readMore: "Прочитај ја целата статија",
      minRead: "мин. читање",
      close: "Затвори статија",
      subscribeTitle: "Добиј го следниот текст",
      subscribeText: "Едно писмо месечно, не повеќе. Најчесто за ориз.",
      subscribePlaceholder: "ти@email.com",
      subscribeButton: "Пријави се",
      subscribeSuccess: "Сте на листата.",
      subscribeErrorEmail: "Внесете важечка е-пошта."
    },
    contact: {
      eyebrow: "Јавете се",
      title: "Контакт",
      subtitle: "Прашања, приватни настани, или коментар за вечерашната вечера — сè е добредојдено.",
      addressLabel: "Адреса",
      addressValue: "ул. Македонија бр. 12, 1000 Скопје",
      phoneLabel: "Телефон",
      emailLabel: "Е-пошта",
      hoursLabel: "Работно време",
      formTitle: "Испрати порака",
      formName: "Име",
      formEmail: "Е-пошта",
      formSubject: "Тема",
      subjReservation: "Резервација",
      subjGeneral: "Општо прашање",
      subjFeedback: "Повратна информација",
      subjOther: "Друго",
      formMessage: "Порака",
      formMessagePlaceholder: "Кажете ни малку повеќе за она што ви треба…",
      formSubmit: "Испрати",
      formSuccess: "Ви благодариме — ги читаме сите пораки и одговараме во рок од еден ден.",
      errorRequired: "Ова поле е задолжително.",
      errorEmail: "Внесете важечка е-пошта.",
      errorMinLength: "Напишете малку повеќе — најмалку 10 карактери.",
      faqTitle: "Пред да пишувате",
      q1: "Примате ли гости без резервација?",
      a1: "Првите четири седишта на шанкот секогаш се чуваат за гости без резервација. Сè останато бара резервација по 18 часот.",
      q2: "Дали има вегетаријанско мени?",
      a2: "Да — побарајте ја зелената точка на страницата со менито. Нашиот Ролат со зеленчук и Зен Сетот се целосно растителни.",
      q3: "Дали доставувате надвор од центарот?",
      a3: "Доставуваме во радиус од 6 км од ресторанот. Внесете ја адресата при плаќање и ќе потврдиме.",
      q4: "Можам ли да го резервирам целиот шанк за приватен настан?",
      a4: "Да, за до осум гости. Испратете ни порака со датумот и ќе ви одговориме во рок од еден ден."
    },
    cookies: {
      text: "Користиме неколку колачиња за да го запомниме вашиот јазик и кошничка — ништо не се продава на трети страни.",
      accept: "Прифати ги сите",
      preferences: "Преференци",
      prefTitle: "Преференци за колачиња",
      necessary: "Неопходни",
      necessaryDesc: "Потребни за да функционираат кошничката и јазичните поставки. Секогаш вклучени.",
      analytics: "Аналитика",
      analyticsDesc: "Ни помага да разбереме кои страници се корисни. Анонимно.",
      marketing: "Маркетинг",
      marketingDesc: "Се користи за понекогаш билтен. Стандардно исклучено.",
      save: "Зачувај преференци"
    }
  }
};

const pageTitles = {
  en: {
    home: "Sakura Sushi — Handcrafted Sushi in Skopje",
    menu: "Menu — Sakura Sushi",
    team: "Our Chefs — Sakura Sushi",
    blog: "Journal — Sakura Sushi",
    contact: "Contact — Sakura Sushi"
  },
  mk: {
    home: "Сакура Суши — Рачно изработено суши во Скопје",
    menu: "Мени — Сакура Суши",
    team: "Нашите готвачи — Сакура Суши",
    blog: "Дневник — Сакура Суши",
    contact: "Контакт — Сакура Суши"
  }
};

const LANG_KEY = "sakura_lang";

function getLang() {
  return localStorage.getItem(LANG_KEY) === "mk" ? "mk" : "en";
}

function t(key, lang) {
  lang = lang || getLang();
  const parts = key.split(".");
  let node = translations[lang];
  for (const p of parts) {
    if (node == null) break;
    node = node[p];
  }
  if (node == null && lang !== "en") {
    // graceful fallback to English if a key is missing in a translation
    node = translations.en;
    for (const p of parts) {
      if (node == null) break;
      node = node[p];
    }
  }
  return node == null ? key : node;
}

function applyTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"), lang);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"), lang);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"), lang));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label"), lang));
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
  });

  const page = document.body.getAttribute("data-page");
  if (page && pageTitles[lang][page]) {
    document.title = pageTitles[lang][page];
  }

  document.dispatchEvent(new CustomEvent("sakura:langchange", { detail: { lang } }));
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang === "mk" ? "mk" : "en");
  applyTranslations();
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang")));
  });
});
