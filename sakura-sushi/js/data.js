/* ==========================================================================
   Sakura Sushi — content data (bilingual)
   Each entry carries an `en` and `mk` block so render functions can pick the
   right language without re-fetching anything on a language switch.
   ========================================================================== */

const menuData = [
  { id: "n1", category: "nigiri", price: 5.5, veg: false, spicy: false, chefPick: false,
    allergens: ["fish"], icon: "images/icon-nigiri.svg",
    en: { name: "Salmon Nigiri", desc: "Norwegian salmon, hand-pressed rice, a touch of wasabi." },
    mk: { name: "Нигири со лосос", desc: "Норвешки лосос, рачно притиснат ориз, малку васаби." } },

  { id: "n2", category: "nigiri", price: 6.5, veg: false, spicy: false, chefPick: false,
    allergens: ["fish"], icon: "images/icon-nigiri.svg",
    en: { name: "Tuna Nigiri", desc: "Bluefin tuna loin, sliced to order." },
    mk: { name: "Нигири со туна", desc: "Филе од туна, сечено по нарачка." } },

  { id: "n3", category: "nigiri", price: 7.0, veg: false, spicy: false, chefPick: false,
    allergens: ["fish", "soy", "gluten"], icon: "images/icon-nigiri.svg",
    en: { name: "Eel Nigiri (Unagi)", desc: "Grilled freshwater eel glazed with sweet soy." },
    mk: { name: "Нигири со јагула (Унаги)", desc: "Печена слатководна јагула глазирана со слатка соја." } },

  { id: "n4", category: "nigiri", price: 5.0, veg: false, spicy: false, chefPick: false,
    allergens: ["shellfish"], icon: "images/icon-nigiri.svg",
    en: { name: "Shrimp Nigiri (Ebi)", desc: "Butterflied shrimp, lightly poached." },
    mk: { name: "Нигири со ракчиња (Еби)", desc: "Расечени ракчиња, благо варени." } },

  { id: "n5", category: "nigiri", price: 6.8, veg: false, spicy: false, chefPick: true,
    allergens: ["fish"], icon: "images/icon-nigiri.svg",
    en: { name: "Yellowtail Nigiri (Hamachi)", desc: "Buttery hamachi with a thin ribbon of citrus." },
    mk: { name: "Нигири со жолторепка (Хамачи)", desc: "Мазна хамачи со тенка лента цитрус." } },

  { id: "n6", category: "nigiri", price: 4.5, veg: true, spicy: false, chefPick: false,
    allergens: ["egg", "soy"], icon: "images/icon-nigiri.svg",
    en: { name: "Tamago Nigiri", desc: "Sweet layered egg omelette, a vegetarian classic." },
    mk: { name: "Нигири со тамаго", desc: "Слатка слоевита омлет, вегетаријанска класика." } },

  { id: "r1", category: "rolls", price: 8.5, veg: false, spicy: false, chefPick: false,
    allergens: ["shellfish", "sesame", "egg"], icon: "images/icon-roll.svg",
    en: { name: "California Roll", desc: "Crab stick, avocado, cucumber, sesame." },
    mk: { name: "Калифорниа ролат", desc: "Стапчиња од ракови, авокадо, краставица, сусам." } },

  { id: "r2", category: "rolls", price: 9.5, veg: false, spicy: true, chefPick: false,
    allergens: ["fish", "egg", "soy"], icon: "images/icon-roll.svg",
    en: { name: "Spicy Tuna Roll", desc: "Hand-chopped tuna, sriracha mayo, scallion." },
    mk: { name: "Лут ролат со туна", desc: "Рачно сецкана туна, срирача мајонез, кромид." } },

  { id: "r3", category: "rolls", price: 13.5, veg: false, spicy: false, chefPick: true,
    allergens: ["shellfish", "fish", "gluten", "soy"], icon: "images/icon-roll.svg",
    en: { name: "Dragon Roll", desc: "Tempura shrimp inside, sliced eel and avocado fanned on top." },
    mk: { name: "Змеј ролат", desc: "Темпура ракчиња внатре, сечена јагула и авокадо одозгора." } },

  { id: "r4", category: "rolls", price: 14.0, veg: false, spicy: false, chefPick: false,
    allergens: ["fish", "shellfish", "egg"], icon: "images/icon-roll.svg",
    en: { name: "Rainbow Roll", desc: "California roll topped with five kinds of sashimi." },
    mk: { name: "Виножито ролат", desc: "Калифорниа ролат покриен со пет видови сашими." } },

  { id: "r5", category: "rolls", price: 7.5, veg: true, spicy: false, chefPick: false,
    allergens: ["sesame"], icon: "images/icon-roll.svg",
    en: { name: "Vegetable Roll", desc: "Avocado, cucumber, carrot, pickled radish." },
    mk: { name: "Ролат со зеленчук", desc: "Авокадо, краставица, морков, кисела репка." } },

  { id: "r6", category: "rolls", price: 9.0, veg: false, spicy: false, chefPick: false,
    allergens: ["fish", "dairy"], icon: "images/icon-roll.svg",
    en: { name: "Philadelphia Roll", desc: "Smoked salmon, cream cheese, cucumber." },
    mk: { name: "Филаделфија ролат", desc: "Чадено лосос, крем сирење, краставица." } },

  { id: "s1", category: "sets", price: 28.0, veg: false, spicy: false, chefPick: true,
    allergens: ["fish", "shellfish", "gluten", "soy"], icon: "images/icon-set.svg",
    en: { name: "Sakura Deluxe Set", desc: "12 pieces nigiri, dragon roll, miso soup." },
    mk: { name: "Сакура Делукс Сет", desc: "12 парчиња нигири, змеј ролат, мисо супа." } },

  { id: "s2", category: "sets", price: 22.0, veg: false, spicy: false, chefPick: false,
    allergens: ["fish", "shellfish", "egg", "soy"], icon: "images/icon-set.svg",
    en: { name: "Sushi Lover's Combo", desc: "California roll, spicy tuna roll, 6 pieces nigiri." },
    mk: { name: "Комбо за љубители на суши", desc: "Калифорниа ролат, лут ролат со туна, 6 парчиња нигири." } },

  { id: "s3", category: "sets", price: 18.0, veg: true, spicy: false, chefPick: false,
    allergens: ["soy", "sesame"], icon: "images/icon-set.svg",
    en: { name: "Vegetarian Zen Set", desc: "Vegetable roll, avocado nigiri, edamame, miso soup." },
    mk: { name: "Вегетаријански Зен Сет", desc: "Ролат со зеленчук, нигири со авокадо, едамаме, мисо супа." } },

  { id: "s4", category: "sets", price: 42.0, veg: false, spicy: false, chefPick: true,
    allergens: ["fish", "shellfish", "gluten", "soy", "egg"], icon: "images/icon-set.svg",
    en: { name: "Chef's Omakase Set", desc: "Seven courses, chef's choice, changes daily." },
    mk: { name: "Шефовски Омакасе Сет", desc: "Седум тек-јадења, избор на шефот, се менува секој ден." } },

  { id: "d1", category: "drinks", price: 3.0, veg: true, spicy: false, chefPick: false,
    allergens: [], icon: "images/icon-drink.svg",
    en: { name: "Japanese Green Tea", desc: "Loose-leaf sencha, brewed to order." },
    mk: { name: "Јапонски зелен чај", desc: "Расипан лист сенча, приготвен по нарачка." } },

  { id: "d2", category: "drinks", price: 4.5, veg: true, spicy: false, chefPick: false,
    allergens: ["dairy"], icon: "images/icon-drink.svg",
    en: { name: "Iced Matcha Latte", desc: "Ceremonial-grade matcha, oat milk available." },
    mk: { name: "Ладен матча латте", desc: "Матча од церемонијален степен, достапно овесно млеко." } },

  { id: "d3", category: "drinks", price: 3.5, veg: true, spicy: false, chefPick: false,
    allergens: [], icon: "images/icon-drink.svg",
    en: { name: "Ramune Soda", desc: "Classic Japanese marble soda, original flavour." },
    mk: { name: "Рамуне сода", desc: "Класична јапонска сода со топче, оригинален вкус." } },

  { id: "d4", category: "drinks", price: 8.0, veg: true, spicy: false, chefPick: false,
    allergens: ["alcohol"], icon: "images/icon-drink.svg",
    en: { name: "Sake (Junmai)", desc: "Warm or chilled, 180ml carafe." },
    mk: { name: "Саке (Џунмаи)", desc: "Топло или ладно, карафа од 180мл." } },

  { id: "d5", category: "drinks", price: 4.0, veg: true, spicy: false, chefPick: false,
    allergens: [], icon: "images/icon-drink.svg",
    en: { name: "Yuzu Lemonade", desc: "Yuzu citrus, sparkling water, mint." },
    mk: { name: "Јузу лимонада", desc: "Јузу цитрус, газирана вода, нане." } }
];

const teamData = [
  { id: "c1", image: "images/chef-1.svg", years: 20,
    en: { name: "Hiroshi Tanaka", role: "Executive Head Chef",
      bio: "Trained in Tokyo's Tsukiji market stalls before opening Sakura Sushi in 2016. Still presses the first piece of every service himself." },
    mk: { name: "Хироши Танака", role: "Извршен шеф готвач",
      bio: "Се обучувал на штандовите на пазарот Цукиџи во Токио пред да го отвори Сакура Суши во 2016. Сè уште лично го притиска првото парче на секоја смена." } },

  { id: "c2", image: "images/chef-2.svg", years: 8,
    en: { name: "Ana Petrovska", role: "Sous Chef & Roll Specialist",
      bio: "Started as a dishwasher at sixteen and worked her way to the roll station. Designed half of our current roll menu." },
    mk: { name: "Ана Петровска", role: "Сушеф и специјалист за ролати",
      bio: "Започнала како миење садови на шеснаесет години и стигнала до станицата за ролати. Дизајнирала половина од нашето сегашно мени со ролати." } },

  { id: "c3", image: "images/chef-3.svg", years: 15,
    en: { name: "Kenji Watanabe", role: "Sashimi Master",
      bio: "Can break down a whole yellowtail in under four minutes. Teaches the knife-skills class we run twice a year." },
    mk: { name: "Кенџи Ватанабе", role: "Мајстор за сашими",
      bio: "Може да расече цела жолторепка за помалку од четири минути. Ги предава часовите за вештини со нож што ги одржуваме двапати годишно." } },

  { id: "c4", image: "images/chef-4.svg", years: 6,
    en: { name: "Maria Ilievska", role: "Pastry & Dessert Chef",
      bio: "Brings a Balkan pastry background to Japanese desserts — her matcha tiramisu outsells every roll on the menu." },
    mk: { name: "Марија Илиевска", role: "Шеф за посластичарство",
      bio: "Носи балкански пекарски бекграунд во јапонските десерти — нејзиниот матча тирамису се продава подобро од секој ролат на менито." } },

  { id: "c5", image: "images/chef-5.svg", years: 12,
    en: { name: "Daichi Yamamoto", role: "Sake Sommelier",
      bio: "Certified sake sommelier who curates every bottle on our list and pairs each set menu personally." },
    mk: { name: "Даичи Јамамото", role: "Саке сомелиер",
      bio: "Сертифициран саке сомелиер кој ја избира секоја флаша на нашата листа и лично ги спарува сетовите." } },

  { id: "c6", image: "images/chef-6.svg", years: 9,
    en: { name: "Elena Stojanovska", role: "Restaurant Manager",
      bio: "Keeps the floor running and the reservation book honest. The first face you'll see at the door." },
    mk: { name: "Елена Стојановска", role: "Менаџер на ресторан",
      bio: "Го одржува рестораниот во ред и книгата за резервации точна. Прво лице што ќе го видите на вратата." } }
];

const blogData = [
  { id: "b1", category: "guide", icon: "images/icon-blog-guide.svg", date: "2026-08-14", minutes: 4,
    en: { title: "5 Things You Didn't Know About Nigiri",
      excerpt: "Nigiri looks simple: rice, fish, done. Here's what's actually happening in those thirty seconds of pressing.",
      body: [
        "Nigiri translates loosely to \u2018two fingers\u2019 \u2014 a reference to the size a chef presses the rice into, not a strict rule. Every counter adjusts the shape slightly to its own rice and knife style.",
        "The rice is seasoned twice: once with the vinegar mix while it's still warm, and again \u2014 very lightly \u2014 right before it's pressed, to keep the top grains distinct from the ones underneath.",
        "A good piece of nigiri is built to fall apart in one bite, not two. If it holds together like a rice ball, the chef pressed too hard."
      ] },
    mk: { title: "5 работи што не ги знаевте за нигирито",
      excerpt: "Нигирито изгледа едноставно: ориз, риба, готово. Еве што всушност се случува во тие триесет секунди притискање.",
      body: [
        "Нигири во превод значи \u2018два прста\u2019 \u2014 референца кон големината до која готвачот го притиска оризот, не строго правило. Секој шанк малку го прилагодува обликот кон сопствениот ориз и стил на нож.",
        "Оризот се зачинува двапати: еднаш со мешавината од оцет додека сè уште е топол, и уште еднаш \u2014 многу лесно \u2014 веднаш пред притискањето, за горните зрна да останат одделени од оние под нив.",
        "Добро парче нигири е направено да се распадне на еден залак, не на два. Ако држи заедно како топка ориз, готвачот притиснал премногу силно."
      ] } },

  { id: "b2", category: "guide", icon: "images/icon-blog-guide.svg", date: "2026-07-02", minutes: 5,
    en: { title: "The Art of Sushi Rice: Our Secret Recipe",
      excerpt: "Rice is eighty percent of the dish and gets ten percent of the attention. We think that ratio is backwards.",
      body: [
        "We use a short-grain rice imported specifically for its starch content \u2014 too little and the grains won't hold, too much and the texture turns gummy.",
        "The vinegar mix is our one genuinely guarded recipe: rice vinegar, a little sugar, a little salt, warmed just enough to dissolve, then folded in with a wooden paddle so the grains don't bruise.",
        "Rice is cooked in small batches every ninety minutes through service. What's left at the end of a batch never makes it into tomorrow's \u2014 it goes into staff meal."
      ] },
    mk: { title: "Уметноста на суши оризот: нашиот таен рецепт",
      excerpt: "Оризот е осумдесет проценти од јадењето, а добива десет проценти од вниманието. Мислиме дека тој сооднос е обратен.",
      body: [
        "Користиме ориз со кратко зрно увезен специјално заради содржината на скроб \u2014 премалку и зрната нема да се држат, премногу и текстурата станува леплива.",
        "Мешавината од оцет е нашиот единствен навистина чуван рецепт: ориз оцет, малку шеќер, малку сол, загреани точно колку да се раствори, потоа вмешани со дрвена лопатка за зрната да не се оштетат.",
        "Оризот се готви во мали серии на секои деведесет минути во текот на услугата. Она што ќе остане на крајот на серијата никогаш не влегува во утрешната \u2014 оди во оброкот за персоналот."
      ] } },

  { id: "b3", category: "news", icon: "images/icon-blog-award.svg", date: "2026-06-20", minutes: 3,
    en: { title: "Sakura Sushi Wins \u2018Best New Counter 2026\u2019",
      excerpt: "A local food guide named us their pick of the year. We're still a little stunned at the counter.",
      body: [
        "The panel visited three times over two months, unannounced, before the decision \u2014 one lunch service, one solo dinner, and one Friday rush.",
        "The write-up singled out the tamago nigiri and the fact that the same six chefs have been behind the counter since opening week.",
        "We're grateful, and mildly worried the Friday queue is about to get longer."
      ] },
    mk: { title: "Сакура Суши ја освои наградата \u2018Најдобар нов шанк 2026\u2019",
      excerpt: "Локален гастро водич нè прогласи за избор на годината. Сè уште сме малку изненадени зад шанкот.",
      body: [
        "Комисијата посети трипати во текот на два месеци, ненајавено, пред одлуката \u2014 еден ручек, една самостојна вечера и еден петочен налет.",
        "Во написот посебно беше истакнато тамаго нигирито и фактот дека истите шест готвачи се зад шанкот уште од отворањето.",
        "Благодарни сме, и малку загрижени дека петочниот ред ќе стане уште подолг."
      ] } },

  { id: "b4", category: "guide", icon: "images/icon-blog-guide.svg", date: "2026-05-11", minutes: 4,
    en: { title: "How to Eat Sushi Like a Regular: A Short Guide",
      excerpt: "No rule here is about manners for their own sake \u2014 each one exists because it makes the food taste better.",
      body: [
        "Dip fish-side down, not rice-side. Rice soaks up soy sauce like a sponge and will fall apart before it reaches your mouth.",
        "Ginger is a palate cleanser between pieces, not a topping \u2014 eat it alone, between bites, not on the nigiri itself.",
        "Nigiri is built to be eaten in one bite. If that feels like a lot, ask for it cut \u2014 no chef will mind."
      ] },
    mk: { title: "Како да јадете суши како редовен гостин: краток водич",
      excerpt: "Ниту едно правило тука не е за манирите заради самите себе \u2014 секое постои затоа што прави храната да е поукусна.",
      body: [
        "Потопете ја рибната страна, не оризовата. Оризот впива соја како сунѓер и ќе се распадне пред да стигне до устата.",
        "Ѓумбирот е за чистење на непцето меѓу залаци, не додаток \u2014 јадете го самостојно, меѓу залаците, не врз самото нигири.",
        "Нигирито е направено да се јаде на еден залак. Ако тоа е премногу, побарајте да го исечат \u2014 ниту еден готвач нема да се навреди."
      ] } },

  { id: "b5", category: "news", icon: "images/icon-blog-news.svg", date: "2026-04-02", minutes: 3,
    en: { title: "Meet Daichi, Our New Sake Sommelier",
      excerpt: "We've added a dedicated sake pairing to every set menu \u2014 and someone to explain it properly.",
      body: [
        "Daichi trained for three years in Niigata before moving to Skopje, and spent his first month here simply tasting his way through every bottle behind the bar.",
        "He's rebuilt our list around food pairing rather than prestige \u2014 the recommendation is never automatically the most expensive bottle.",
        "Ask him for a pour with your set menu; he'll talk you through it in under a minute, not ten."
      ] },
    mk: { title: "Запознајте го Даичи, нашиот нов саке сомелиер",
      excerpt: "Додадовме посветено спарување со саке за секој сет мени \u2014 и некој да го објасни како треба.",
      body: [
        "Даичи се обучувал три години во Ниигата пред да се пресели во Скопје, а првиот месец овде едноставно го поминал дегустирајќи го секое шише зад шанкот.",
        "Ја преработи нашата листа околу спарување со храна наместо престиж \u2014 препораката никогаш не е автоматски најскапото шише.",
        "Прашајте го за чаша со вашиот сет мени; ќе ви објасни за помалку од минута, не десет."
      ] } },

  { id: "b6", category: "news", icon: "images/icon-blog-ocean.svg", date: "2026-02-18", minutes: 4,
    en: { title: "Sustainable Sourcing: Our Commitment to the Ocean",
      excerpt: "Good sushi depends on healthy oceans, so we've made a few rules for ourselves about what we'll serve and when.",
      body: [
        "We rotate species out of the menu during spawning seasons, even when customers ask for them by name.",
        "Every supplier on our list has to show us their sourcing method, not just their catch certificate.",
        "It means a shorter menu some weeks. We think that's a fair trade for a menu that still exists in twenty years."
      ] },
    mk: { title: "Одржливо снабдување: нашата посветеност кон океанот",
      excerpt: "Доброто суши зависи од здрави океани, па си поставивме неколку правила за тоа што и кога ќе служиме.",
      body: [
        "Ги отстрануваме видовите од менито во сезоните на мрестење, дури и кога гостите ги бараат по име.",
        "Секој добавувач на нашата листа мора да ни го покаже начинот на снабдување, не само сертификатот за улов.",
        "Тоа значи покус мени некои недели. Мислиме дека тоа е фер размена за мени што сè уште постои за дваесет години."
      ] } }
];
