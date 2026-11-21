/* =========================================================
   GTA VI FunPage – skrypty
   Nieoficjalna strona fanowska
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Bezpieczny localStorage (tryb prywatny / zablokowane dane) */
  const store = {
    get(k, def) { try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* brak zapisu */ } }
  };

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  /* =========================================================
     DANE
     ========================================================= */

  // Ciekawostki: type = fakt | egg | spolecznosc ; status = confirmed | spec
  const TRIVIA = [
    { type: "fakt", status: "confirmed", icon: "90M", title: "Rekordowy pierwszy trailer",
      text: "Pierwszy trailer GTA VI zebrał w ciągu 24 godzin ponad 90 mln wyświetleń na YouTube – Guinness World Records uznał to za rekord wśród filmów niemuzycznych." },
    { type: "fakt", status: "confirmed", icon: "-1D", title: "Premiera trailera dzień wcześniej",
      text: "Trailer 1 miał zadebiutować 5 grudnia 2023, ale po wycieku do sieci Rockstar opublikował go już wieczorem 4 grudnia." },
    { type: "fakt", status: "confirmed", icon: "♫", title: "Muzyka z trailerów",
      text: "W pierwszym trailerze słychać „Love Is a Long Road” Toma Petty'ego, a w drugim „Hot Together” zespołu The Pointer Sisters." },
    { type: "fakt", status: "confirmed", icon: "PS5", title: "Drugi trailer nagrany na PS5",
      text: "Rockstar podał, że drugi trailer został w całości zarejestrowany na PlayStation 5 i łączy ujęcia z rozgrywki oraz przerywników filmowych." },
    { type: "fakt", status: "confirmed", icon: "475M", title: "Drugi trailer też bił rekordy",
      text: "Według Rockstara drugi trailer (maj 2025) w ciągu pierwszych 24 godzin zebrał łącznie około 475 mln wyświetleń na wszystkich platformach." },
    { type: "fakt", status: "confirmed", icon: "VC", title: "Powrót do Vice City",
      text: "To pierwszy powrót serii do Vice City od GTA: Vice City Stories z 2006 roku. Tym razem miasto jest częścią całego stanu Leonida." },
    { type: "fakt", status: "confirmed", icon: "2×", title: "Dwoje protagonistów",
      text: "Gra stawia na duet Lucia i Jason. Lucia jest pierwszą kobietą w roli głównej protagonistki w trójwymiarowej erze serii." },
    { type: "fakt", status: "confirmed", icon: "⌛", title: "Dwa przesunięcia premiery",
      text: "Pierwotnie GTA VI miało wyjść jesienią 2025. Najpierw przesunięto premierę na 26 maja 2026, a potem na 19 listopada 2026." },
    { type: "fakt", status: "confirmed", icon: "200M", title: "Ogromne oczekiwania",
      text: "Poprzednia odsłona, GTA V (2013), sprzedała się według Take-Two w ponad 200 mln egzemplarzy – to jedna z najlepiej sprzedających się gier w historii." },
    { type: "egg", status: "spec", icon: "🐊", title: "„Florida Man” w Leonidzie",
      text: "Pierwszy trailer pokazuje viralowe nagrania z mediów społecznościowych w Leonidzie – gracze od razu skojarzyli je z memami o „Florida Man”. To interpretacja fanów, nie oficjalne nawiązanie." },
    { type: "egg", status: "spec", icon: "B&C", title: "Bonnie i Clyde",
      text: "Duet przestępców-kochanków od dawna kojarzy się z Bonnie i Clyde'em. W 2023 r. pojawiły się doniesienia mediów, że to inspiracja – Rockstar tego nie skomentował." },
    { type: "egg", status: "spec", icon: "#", title: "Parodia social mediów",
      text: "Seria zawsze parodiowała internet. W trailerach widać fikcyjne transmisje i nagrania z telefonów – fani spodziewają się pełnej parodii platform społecznościowych w grze." },
    { type: "spolecznosc", status: "confirmed", icon: "👁", title: "Klatka po klatce",
      text: "Po każdym trailerze społeczność analizowała nagrania klatka po klatce – porównując ulice Vice City z prawdziwym Miami i szukając znanych marek z uniwersum GTA." },
    { type: "spolecznosc", status: "spec", icon: "🗺", title: "Fanowskie mapy",
      text: "Jeszcze przed premierą gracze składali fanowskie mapy Leonidy z ujęć z trailerów i screenów. Ich dokładność to wciąż spekulacja aż do porównania z grą." },
    { type: "spolecznosc", status: "confirmed", icon: "⚠", title: "Wyciek z 2022 roku",
      text: "We wrześniu 2022 r. do sieci trafiło ponad 90 nagrań z wczesnej wersji gry. Rockstar potwierdził wyciek i zapewnił, że nie wpłynie on na rozwój produkcji." },
  ];

  // Galeria: zdjęcia z folderu img/galeria. Nowe dodajesz tak:
  // { src: "img/galeria/8.webp", title: "Tytuł", caption: "Opis", cat: "postacie" }   (cat: postacie | akcja | grafiki)
  // Obiekt z polem scene zamiast src rysuje fanowską ilustrację SVG (scene: beach | skyline | keys | swamp | highway | mountain | port, pal: 0-8).
  const GALLERY = [
    { src: "img/galeria/5.webp", title: "Przejażdżka kabrioletem", caption: "Wieżowce w tle i słońce Leonidy", cat: "postacie" },
    { src: "img/galeria/2.webp", title: "Popołudnie na ganku", caption: "Drewniany dom, okulary i upał", cat: "postacie" },
    { src: "img/galeria/4.webp", title: "Rozmowa przy pick-upie", caption: "Ulica w słoneczny dzień", cat: "postacie" },
    { src: "img/galeria/1.webp", title: "Pistolety w górę", caption: "Napięta scena w zadymionym wnętrzu", cat: "akcja" },
    { src: "img/galeria/3.webp", title: "Przy okienku kasy", caption: "Kasjer za kratą i szybą", cat: "akcja" },
    { src: "img/galeria/6.webp", title: "Powitanie na ulicy", caption: "Złote łańcuchy i żółwik", cat: "postacie" },
    { src: "img/galeria/7.webp", title: "Kolaż Leonidy", caption: "Grafika z motywami GTA VI", cat: "grafiki" },
  ];

  const LOCATIONS = {
    vice: { name: "Vice City", type: "Metropolia · wybrzeże", status: "confirmed",
      desc: "Serce Leonidy i najbardziej rozpoznawalne miejsce gry. Słoneczne plaże, luksusowe jachty i kluby kontrastują z ulicami, na których toczy się zupełnie inne życie.",
      facts: [["Inspiracja", "Miami i okolice"], ["W serii", "GTA Vice City (2002) i Vice City Stories (2006)"], ["Klimat", "neony, plaże, nocne życie"]] },
    beach: { name: "Vice Beach", type: "Wyspa · plaże", status: "confirmed",
      desc: "Wyspa po wschodniej stronie zatoki, połączona z centrum Vice City groblami. Od strony oceanu ciągną się plaże.",
      facts: [["Na mapie", "Ocean Beach, Washington Beach"], ["Sąsiedztwo", "Starfish Island, Catalan Island, Dalton Island"], ["Klimat", "plaża, ocean, kurorty"]] },
    vcia: { name: "VCIA", type: "Lotnisko", status: "confirmed",
      desc: "Vice City International Airport – międzynarodowe lotnisko na zachód od centrum miasta, z kilkoma pasami startowymi.",
      facts: [["Pełna nazwa", "Vice City International Airport"], ["Dojazd", "trasy 404 i 97"], ["Okolice", "Salton, Little Cuba, Bluegrass"]] },
    hamlet: { name: "Hamlet", type: "Miejscowość · południe", status: "confirmed",
      desc: "Miejscowość na południowym skraju aglomeracji, przy trasie 35. Tuż obok leży zakład karny.",
      facts: [["Na mapie", "Hamlet Correctional Institution"], ["Sąsiedztwo", "South Vice-Dale, Grassrivers"], ["Dojazd", "trasa 35"]] },
    capri: { name: "Capri", type: "Miasto · zachodnie wybrzeże", status: "confirmed",
      desc: "Miasto na zachodnim wybrzeżu, na końcu trasy 183 prowadzącej przez mokradła od strony Vice City.",
      facts: [["Dojazd", "trasa 183"], ["Sąsiedztwo", "Bobcat Key, Bobcat Bight"], ["Klimat", "zatoka, mokradła, wybrzeże"]] },
    keys: { name: "Leonida Keys", type: "Archipelag · mosty", status: "confirmed",
      desc: "Łańcuch wysp połączonych długimi mostami. To tu Jason osiadł po służbie w armii i pracuje dla miejscowych przemytników.",
      facts: [["Inspiracja", "Florida Keys"], ["Postacie", "Jason, Brian Heder, Cal Hampton"], ["Klimat", "łodzie, wyspy, turkusowa woda"]] },
    grass: { name: "Grassrivers", type: "Mokradła · dzika przyroda", status: "confirmed",
      desc: "Rozległe bagna i trzciny pełne dzikich zwierząt. Idealne miejsce, żeby zniknąć – albo żeby coś ukryć.",
      facts: [["Inspiracja", "Everglades"], ["Atrakcje", "łodzie ślizgowe, aligatory"], ["Klimat", "mgła, cisza, niebezpieczeństwo"]] },
    port: { name: "Port Gellhorn", type: "Miasto portowe", status: "confirmed",
      desc: "Podupadłe nadmorskie miasteczko, które swoje najlepsze lata ma dawno za sobą. Opustoszałe atrakcje i ludzie, którzy nie mają już wiele do stracenia.",
      facts: [["Inspiracja", "północno-zachodnia Floryda (opinia fanów)"], ["Na mapie", "poza pokazanym fragmentem"], ["Klimat", "rdza, pustka, nadmorski wiatr"]] },
    ambrosia: { name: "Ambrosia", type: "Miasto przemysłowe", status: "confirmed",
      desc: "Przemysłowe serce regionu z rafinerią i fabrykami. Teren lokalnych gangów motocyklowych i ludzi ciężkiej pracy.",
      facts: [["Charakter", "przemysł, rafineria"], ["Na mapie", "poza pokazanym fragmentem"], ["Klimat", "dym, stal, motocykle"]] },
    kalaga: { name: "Mount Kalaga National Park", type: "Park narodowy", status: "confirmed",
      desc: "Dzika, zalesiona północ Leonidy: szlaki, rzeki i tereny do wypraw w głąb lasu.",
      facts: [["Charakter", "lasy, góry, szlaki"], ["Na mapie", "poza pokazanym fragmentem"], ["Klimat", "spokój z dala od miasta"]] },
  };

  const NEWS = [
    { date: "2022-02-04", cat: "news", status: "confirmed", title: "Rockstar potwierdza prace nad nowym GTA",
      text: "W krótkim wpisie Rockstar ogłosił, że trwają prace nad kolejną główną częścią serii Grand Theft Auto." },
    { date: "2022-09-18", cat: "news", status: "confirmed", title: "Wielki wyciek materiałów",
      text: "W sieci pojawiło się ponad 90 nagrań z wczesnej wersji gry. Rockstar potwierdził wyciek i podkreślił, że nie wpłynie on na prace." },
    { date: "2023-11-08", cat: "trailer", status: "confirmed", title: "Zapowiedź trailera na grudzień",
      text: "Rockstar ogłosił, że pierwszy trailer nowego GTA pojawi się na początku grudnia 2023 r." },
    { date: "2023-12-04", cat: "trailer", status: "confirmed", title: "Trailer 1 – Welcome to Leonida",
      text: "Po wycieku trailer trafił do sieci dzień przed planem. Oficjalnie: GTA VI, Vice City, Lucia i premiera zapowiedziana na 2025 rok." },
    { date: "2025-05-02", cat: "data", status: "confirmed", title: "Pierwsze opóźnienie: 26 maja 2026",
      text: "Rockstar przesunął premierę z jesieni 2025 na 26 maja 2026, tłumacząc to potrzebą dopracowania gry." },
    { date: "2025-05-06", cat: "trailer", status: "confirmed", title: "Trailer 2 i nowe postacie",
      text: "Niezapowiedziany drugi trailer pokazał Jasona, nowe lokacje i postacie drugoplanowe. Rockstar opublikował też opisy bohaterów i regionów Leonidy." },
    { date: "2025-11-06", cat: "data", status: "confirmed", title: "Drugie opóźnienie: 19 listopada 2026",
      text: "Premierę przesunięto ponownie – tym razem na 19 listopada 2026." },
    { date: "2026-11-19", cat: "data", status: "confirmed", hl: true, title: "Premiera GTA VI",
      text: "Grand Theft Auto VI trafia na PlayStation 5 i Xbox Series X|S. Wersja na PC ma pojawić się później – bez podanej daty." },
    { date: "2026-11-20", cat: "news", status: "confirmed", title: "Rekordowa sprzedaż w dniu premiery",
      text: "Według doniesień medialnych powołujących się na Take-Two pierwszy dzień sprzedaży przyniósł ok. 3,79 mld dolarów – wydawca nazwał to największą premierą w historii rozrywki." },
    { date: "2027", cat: "news", status: "spec", title: "GTA Online i wersja PC",
      text: "Nowe GTA Online nie ma jeszcze daty. Media spodziewają się go w 2027 roku – to na razie przewidywania, nie zapowiedź Rockstara." },
  ];

  const QUIZ = [
    { q: "Jak nazywa się główna bohaterka GTA VI?", a: ["Lucia Caminos", "Maria Vega", "Lucia Duval", "Elena Cruz"], c: 0,
      e: "Lucia Caminos to jedna z dwojga protagonistów gry." },
    { q: "Jak nazywa się fikcyjny stan, w którym toczy się akcja?", a: ["San Andreas", "Leonida", "Liberty State", "Vicetown"], c: 1,
      e: "Akcja toczy się w stanie Leonida, wzorowanym na Florydzie." },
    { q: "Na jakim prawdziwym stanie USA wzorowana jest Leonida?", a: ["Kalifornia", "Teksas", "Floryda", "Luizjana"], c: 2,
      e: "Leonida to fikcyjna wersja Florydy." },
    { q: "Jaki utwór słychać w pierwszym trailerze?", a: ["„Hot Together”", "„Love Is a Long Road”", "„Free Fallin'”", "„Africa”"], c: 1,
      e: "W trailerze 1 słychać „Love Is a Long Road” Toma Petty'ego." },
    { q: "Kiedy GTA VI miało premierę?", a: ["26 maja 2026", "17 września 2025", "19 listopada 2026", "5 grudnia 2025"], c: 2,
      e: "Po dwóch przesunięciach gra zadebiutowała 19 listopada 2026." },
    { q: "Jak nazywa się partner Lucii?", a: ["Jason Duval", "Cal Hampton", "Brian Heder", "Raul Bautista"], c: 0,
      e: "Drugim protagonistą jest Jason Duval." },
    { q: "Gdzie Lucia trafiła, walcząc o rodzinę?", a: ["Do wojska", "Do Leonida Penitentiary", "Do Liberty City", "Do szpitala"], c: 1,
      e: "Według opisu Rockstara walka o rodzinę zaprowadziła ją do Leonida Penitentiary." },
    { q: "W jakiej formacji służył Jason, zanim trafił do Keys?", a: ["W policji", "W marynarce handlowej", "W armii", "W straży przybrzeżnej"], c: 2,
      e: "Jason próbował uciec od trudnej młodości, wstępując do armii." },
    { q: "Na jakich platformach GTA VI wyszło w dniu premiery?", a: ["PC i PS5", "PS5 i Xbox Series X|S", "PS4 i PS5", "Tylko PS5"], c: 1,
      e: "Na premierę: PlayStation 5 i Xbox Series X|S. PC – później." },
    { q: "Kiedy opublikowano pierwszy trailer?", a: ["Grudzień 2023", "Wrzesień 2022", "Maj 2025", "Luty 2022"], c: 0,
      e: "Trailer 1 pojawił się 4 grudnia 2023 – dzień przed planem, po wycieku." },
    { q: "Jaki utwór słychać w drugim trailerze?", a: ["„Love Is a Long Road”", "„Running Up That Hill”", "„Hot Together”", "„Vice City Nights”"], c: 2,
      e: "W trailerze 2 słychać „Hot Together” The Pointer Sisters." },
    { q: "Jak nazywa się łańcuch wysp, na których mieszka Jason?", a: ["Vice Islands", "Leonida Keys", "Grassrivers", "Port Gellhorn"], c: 1,
      e: "Jason pracuje i mieszka w Leonida Keys." },
    { q: "W którym roku wyszło GTA V?", a: ["2011", "2013", "2015", "2008"], c: 1,
      e: "GTA V zadebiutowało we wrześniu 2013 roku." },
    { q: "Który region Leonidy to odpowiednik Everglades?", a: ["Ambrosia", "Mount Kalaga", "Grassrivers", "Port Gellhorn"], c: 2,
      e: "Grassrivers to rozległe mokradła – odpowiednik Everglades." },
    { q: "Kto jest kumplem Jasona przekonanym, że jest inwigilowany?", a: ["Boobie Ike", "Cal Hampton", "Dre'Quan Priest", "Brian Heder"], c: 1,
      e: "Cal Hampton woli siedzieć w domu i nie ufa nikomu." },
    { q: "Ile mniej więcej wyświetleń zebrał pierwszy trailer w 24 godziny na YouTube?", a: ["Ok. 10 mln", "Ok. 30 mln", "Ponad 90 mln", "Ponad 1 mld"], c: 2,
      e: "Ponad 90 mln – rekord Guinnessa wśród filmów niemuzycznych." },
  ];

  /* =========================================================
     MOTYW
     ========================================================= */
  const root = document.documentElement;
  const savedTheme = store.get("gta6fp-theme", "dark");
  root.dataset.theme = savedTheme === "light" ? "light" : "dark";
  $("#themeToggle").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    store.set("gta6fp-theme", next);
    document.querySelector('meta[name="theme-color"]').content = next === "dark" ? "#0b0614" : "#fff6fb";
    toast(next === "dark" ? "Motyw: Vice City Night" : "Motyw: Leonida Sunset");
  });

  /* =========================================================
     NAWIGACJA
     ========================================================= */
  const header = $("#siteHeader");
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  const indicator = $("#navIndicator");
  const links = $$(".nav-link");
  const sections = $$("[data-section]");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");

  function closeMenu() {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Otwórz menu");
  }
  burger.addEventListener("click", () => {
    const open = !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  });
  links.forEach((l) => l.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("open") && !navLinks.contains(e.target) && !burger.contains(e.target)) closeMenu();
  });

  function moveIndicator(link) {
    if (!link || getComputedStyle(burger).display !== "none") { indicator.style.opacity = 0; return; }
    const r = link.getBoundingClientRect();
    const pr = navLinks.getBoundingClientRect();
    indicator.style.width = r.width + "px";
    indicator.style.transform = `translateX(${r.left - pr.left}px)`;
    indicator.style.opacity = 1;
  }

  let activeId = "";
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    header.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 900);

    let current = sections[0].id;
    const line = innerHeight * 0.35;
    for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
    if (current !== activeId) {
      activeId = current;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
      moveIndicator(links.find((l) => l.classList.contains("active")));
    }
  }
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", () => moveIndicator(links.find((l) => l.classList.contains("active"))));
  links.forEach((l) => {
    l.addEventListener("mouseenter", () => moveIndicator(l));
    l.addEventListener("focus", () => moveIndicator(l));
  });
  navLinks.addEventListener("mouseleave", () => moveIndicator(links.find((l) => l.classList.contains("active"))));

  /* =========================================================
     ANIMACJE WEJŚCIA
     ========================================================= */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  function observeReveal(scope = document) {
    $$(".reveal:not(.in)", scope).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  }

  /* ---------- Paralaksa hero ---------- */
  const heroSun = $(".hero-sun"), heroSky = $(".hero-skyline"), heroPalms = $(".hero-palms");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    window.addEventListener("scroll", () => {
      const y = Math.min(window.scrollY, innerHeight);
      heroSky.style.transform = `translateY(${y * 0.15}px)`;
      heroPalms.style.transform = `translateY(${y * 0.05}px)`;
      heroSun.style.translate = `0 ${y * 0.3}px`;
    }, { passive: true });
  }

  /* ---------- Efekt 3D kart bohaterów ---------- */
  if (!reduceMotion && matchMedia("(hover: hover)").matches) {
    $$(".hero-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* =========================================================
     ZAKŁADKI POSTACI
     ========================================================= */
  $$(".tabs").forEach((tabs) => {
    const card = tabs.closest(".hero-card-body");
    $$(".tab", tabs).forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".tab", tabs).forEach((t) => { t.classList.toggle("active", t === tab); t.setAttribute("aria-selected", String(t === tab)); });
        $$(".tab-panel", card).forEach((p) => p.classList.toggle("active", p.id === tab.dataset.tab));
      });
    });
  });

  /* =========================================================
     GENERATOR ILUSTRACJI (SVG)
     ========================================================= */
  const PALETTES = [
    { sky: ["#2b0a3d", "#ff2e88", "#ffb347"], sun: "#ffd23f", water: "#3b1a5a", ink: "#14061f" },
    { sky: ["#05020c", "#1a0b33", "#3a0f4f"], sun: "#ff2e88", water: "#0b1a2a", ink: "#06030c" },
    { sky: ["#0b5f8a", "#4fd1c5", "#ffe29a"], sun: "#fff3b0", water: "#0aa6b5", ink: "#073b4c" },
    { sky: ["#0b1a1f", "#1f4a4a", "#7aa89a"], sun: "#e8f6ef", water: "#15302f", ink: "#081413" },
    { sky: ["#1b0933", "#7b2cff", "#ff8a00"], sun: "#ffd23f", water: "#2a0f45", ink: "#12051f" },
    { sky: ["#0e2a2a", "#2f7d6d", "#ffcf8a"], sun: "#fff1c1", water: "#164a43", ink: "#0a1d1a" },
    { sky: ["#3a1c71", "#d76d77", "#ffaf7b"], sun: "#fff0c9", water: "#4a2a6a", ink: "#21103a" },
    { sky: ["#020617", "#0f172a", "#312e81"], sun: "#e0e7ff", water: "#0b1033", ink: "#01030b" },
    { sky: ["#3b2a1a", "#a0522d", "#ffb36b"], sun: "#ffe0a3", water: "#3a2a20", ink: "#1a110a" },
  ];

  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  function palm(x, base, h, ink, lean = 0) {
    const tx = x + lean, ty = base - h;
    let d = `<path d="M${x} ${base} Q${x + lean * 0.3} ${base - h * 0.5} ${tx} ${ty}" stroke="${ink}" stroke-width="${h * 0.045}" fill="none" stroke-linecap="round"/>`;
    const fronds = [[-1, -0.3], [-0.9, 0.25], [-0.4, 0.5], [0.4, 0.5], [0.9, 0.25], [1, -0.3], [0, -0.45]];
    fronds.forEach(([fx, fy]) => {
      const ex = tx + fx * h * 0.42, ey = ty + fy * h * 0.42 + h * 0.08;
      d += `<path d="M${tx} ${ty} Q${tx + fx * h * 0.25} ${ty - h * 0.12} ${ex} ${ey}" stroke="${ink}" stroke-width="${h * 0.035}" fill="none" stroke-linecap="round"/>`;
    });
    return d;
  }

  function sceneSVG(item, idx) {
    const W = 800, H = item.scene === "skyline" || item.scene === "mountain" ? 1000 : 560;
    const p = PALETTES[item.pal % PALETTES.length];
    const r = rng(idx * 97 + 13);
    const id = "g" + idx;
    let body = "";
    const horizon = H * 0.62;

    // niebo + słońce
    let defs = `<linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".6" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient>
      <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[2]}" stop-opacity=".55"/><stop offset="1" stop-color="${p.water}"/></linearGradient>
      <radialGradient id="${id}g"><stop offset="0" stop-color="${p.sun}" stop-opacity=".9"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient>`;
    body += `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>`;

    // gwiazdy dla ciemnych palet
    if ([1, 7, 3].includes(item.pal % PALETTES.length)) {
      for (let i = 0; i < 70; i++) body += `<circle cx="${r() * W}" cy="${r() * horizon * 0.8}" r="${r() * 1.6 + 0.3}" fill="#fff" opacity="${r() * 0.8 + 0.2}"/>`;
    }
    const sunX = W * (0.3 + r() * 0.4), sunY = horizon - H * 0.08, sunR = H * 0.15;
    body += `<circle cx="${sunX}" cy="${sunY}" r="${sunR * 2.4}" fill="url(#${id}g)"/>`;
    body += `<circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${p.sun}"/>`;
    // paski na słońcu (retro)
    for (let i = 1; i <= 4; i++) body += `<rect x="${sunX - sunR}" y="${sunY + sunR * (i * 0.18 - 0.05)}" width="${sunR * 2}" height="${sunR * 0.05 * i}" fill="${p.sky[1]}"/>`;

    switch (item.scene) {
      case "beach": {
        body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#${id}w)"/>`;
        for (let i = 0; i < 9; i++) body += `<rect x="${sunX - 70 + r() * 20 - i * 6}" y="${horizon + 8 + i * 10}" width="${140 - i * 10 + r() * 30}" height="3" fill="${p.sun}" opacity="${0.7 - i * 0.07}"/>`;
        body += `<path d="M0 ${H * 0.86} Q${W * 0.3} ${H * 0.8} ${W * 0.55} ${H * 0.88} T${W} ${H * 0.84} V${H} H0 Z" fill="${p.ink}"/>`;
        body += palm(W * 0.1, H * 0.9, H * 0.55, p.ink, 30) + palm(W * 0.2, H * 0.92, H * 0.4, p.ink, -20) + palm(W * 0.88, H * 0.9, H * 0.6, p.ink, -40);
        break;
      }
      case "skyline": {
        body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#${id}w)"/>`;
        let x = 0;
        const neon = ["#ff2e88", "#00e5d4", "#ffd23f", "#7b2cff"];
        while (x < W) {
          const bw = 40 + r() * 70, bh = H * (0.15 + r() * 0.4);
          body += `<rect x="${x}" y="${horizon - bh}" width="${bw}" height="${bh + 2}" fill="${p.ink}"/>`;
          if (r() > 0.6) body += `<rect x="${x + bw / 2 - 2}" y="${horizon - bh - 30}" width="4" height="30" fill="${p.ink}"/>`;
          for (let wy = horizon - bh + 12; wy < horizon - 10; wy += 16)
            for (let wx = x + 8; wx < x + bw - 8; wx += 12)
              if (r() > 0.55) body += `<rect x="${wx}" y="${wy}" width="5" height="7" fill="${neon[(r() * 4) | 0]}" opacity="${0.5 + r() * 0.5}"/>`;
          if (r() > 0.7) body += `<rect x="${x + 6}" y="${horizon - bh + 4}" width="${bw - 12}" height="4" fill="${neon[(r() * 4) | 0]}"/>`;
          x += bw + 4;
        }
        for (let i = 0; i < 24; i++) body += `<rect x="${r() * W}" y="${horizon + 6 + r() * (H - horizon - 10)}" width="${10 + r() * 40}" height="2" fill="${neon[(r() * 4) | 0]}" opacity=".5"/>`;
        body += palm(W * 0.05, H, H * 0.35, "#000", 25) + palm(W * 0.95, H, H * 0.3, "#000", -25);
        break;
      }
      case "keys": {
        body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#${id}w)"/>`;
        const by = horizon + 30;
        body += `<rect x="0" y="${by}" width="${W}" height="10" fill="${p.ink}"/>`;
        for (let x = 20; x < W; x += 60) body += `<rect x="${x}" y="${by + 10}" width="8" height="${H - by}" fill="${p.ink}" opacity=".85"/>`;
        body += `<ellipse cx="${W * 0.82}" cy="${horizon + 4}" rx="110" ry="14" fill="${p.ink}" opacity=".8"/>`;
        body += palm(W * 0.8, horizon + 2, 110, p.ink, 15) + palm(W * 0.86, horizon + 2, 80, p.ink, -10);
        for (let i = 0; i < 18; i++) body += `<path d="M${r() * W} ${by + 30 + r() * (H - by - 40)} q10 -6 20 0" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/>`;
        body += `<path d="M${W * 0.3} ${horizon + 80} l40 0 l-6 10 l-30 0 z M${W * 0.31 + 12} ${horizon + 80} l0 -40 l18 38 z" fill="${p.ink}"/>`;
        break;
      }
      case "swamp": {
        body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#${id}w)"/>`;
        for (let i = 0; i < 4; i++) body += `<rect y="${horizon - 30 + i * 20}" width="${W}" height="26" fill="#fff" opacity="${0.05 + i * 0.02}"/>`;
        for (let i = 0; i < 9; i++) {
          const tx = r() * W, th = 80 + r() * 140;
          body += `<path d="M${tx} ${horizon + 10} C${tx - 6} ${horizon - th * 0.4} ${tx + 8} ${horizon - th * 0.7} ${tx} ${horizon - th}" stroke="${p.ink}" stroke-width="${4 + r() * 5}" fill="none"/>`;
          body += `<ellipse cx="${tx}" cy="${horizon - th}" rx="${40 + r() * 40}" ry="${18 + r() * 14}" fill="${p.ink}"/>`;
          body += `<path d="M${tx - 30} ${horizon - th + 10} v40 M${tx + 20} ${horizon - th + 12} v55 M${tx} ${horizon - th + 14} v30" stroke="${p.ink}" stroke-width="2" opacity=".7"/>`;
        }
        for (let i = 0; i < 40; i++) { const gx = r() * W, gy = horizon + 20 + r() * (H - horizon - 20); body += `<path d="M${gx} ${gy} l-3 -${10 + r() * 20} M${gx} ${gy} l3 -${8 + r() * 18}" stroke="${p.ink}" stroke-width="2"/>`; }
        body += `<path d="M${W * 0.55} ${H * 0.86} q30 -10 60 0 q-30 4 -60 0z M${W * 0.55 + 6} ${H * 0.855} l4 -4 l4 4 M${W * 0.55 + 16} ${H * 0.855} l4 -4 l4 4" fill="${p.ink}" stroke="${p.ink}"/>`;
        break;
      }
      case "highway": {
        body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="${p.ink}"/>`;
        body += `<path d="M${W * 0.47} ${horizon} L${W * 0.53} ${horizon} L${W * 0.95} ${H} L${W * 0.05} ${H} Z" fill="#1a1024"/>`;
        for (let i = 0; i < 8; i++) {
          const t1 = i / 8, t2 = (i + 0.45) / 8;
          const y1 = horizon + (H - horizon) * t1 * t1, y2 = horizon + (H - horizon) * t2 * t2;
          body += `<path d="M${W / 2 - 1 - t1 * 4} ${y1} L${W / 2 + 1 + t1 * 4} ${y1} L${W / 2 + 1 + t2 * 6} ${y2} L${W / 2 - 1 - t2 * 6} ${y2}Z" fill="${p.sun}"/>`;
        }
        body += `<path d="M${W * 0.47} ${horizon} L${W * 0.05} ${H}" stroke="#ff2e88" stroke-width="3"/><path d="M${W * 0.53} ${horizon} L${W * 0.95} ${H}" stroke="#00e5d4" stroke-width="3"/>`;
        for (let i = 0; i < 6; i++) { const t = (i + 1) / 7, py = horizon + (H - horizon) * t * t, px = W * 0.47 - (W * 0.42) * t * t - 30 * t; body += palm(px, py, 40 + 220 * t * t, p.ink, 10); body += palm(W - px, py, 40 + 220 * t * t, p.ink, -10); }
        body += `<rect x="${W * 0.44}" y="${H * 0.8}" width="${W * 0.12}" height="${H * 0.08}" rx="10" fill="#0a0410"/><rect x="${W * 0.45}" y="${H * 0.83}" width="18" height="6" fill="#ff2e88"/><rect x="${W * 0.55 - 18}" y="${H * 0.83}" width="18" height="6" fill="#ff2e88"/>`;
        break;
      }
      case "mountain": {
        const layers = 4;
        for (let l = 0; l < layers; l++) {
          const base = horizon + l * 70, op = 0.5 + l * 0.17;
          let d = `M0 ${H} L0 ${base}`;
          for (let x = 0; x <= W; x += 40) d += ` L${x} ${base - 60 - r() * 120 + l * 20}`;
          d += ` L${W} ${H} Z`;
          body += `<path d="${d}" fill="${p.ink}" opacity="${op}"/>`;
        }
        for (let i = 0; i < 26; i++) { const tx = r() * W, ty = H * 0.8 + r() * H * 0.2, th = 60 + r() * 90; body += `<path d="M${tx} ${ty - th} L${tx - th * 0.28} ${ty} L${tx + th * 0.28} ${ty} Z" fill="${p.ink}"/>`; }
        break;
      }
      case "port": {
        body += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#${id}w)"/>`;
        body += `<rect x="${W * 0.55}" y="${horizon - 4}" width="${W * 0.45}" height="16" fill="${p.ink}"/>`;
        for (let x = W * 0.57; x < W; x += 50) body += `<rect x="${x}" y="${horizon + 10}" width="6" height="${H - horizon}" fill="${p.ink}"/>`;
        body += `<path d="M${W * 0.7} ${horizon - 4} v-150 h10 v150 M${W * 0.7} ${horizon - 150} h-120 v8 h120 M${W * 0.6} ${horizon - 142} v60" stroke="${p.ink}" stroke-width="8" fill="none"/>`;
        body += `<circle cx="${W * 0.2}" cy="${horizon - 70}" r="70" fill="none" stroke="${p.ink}" stroke-width="6"/>`;
        for (let a = 0; a < 12; a++) { const ang = (a / 12) * Math.PI * 2; body += `<line x1="${W * 0.2}" y1="${horizon - 70}" x2="${W * 0.2 + Math.cos(ang) * 70}" y2="${horizon - 70 + Math.sin(ang) * 70}" stroke="${p.ink}" stroke-width="2"/>`; }
        body += `<path d="M${W * 0.2} ${horizon - 70} l-40 74 M${W * 0.2} ${horizon - 70} l40 74" stroke="${p.ink}" stroke-width="6"/>`;
        body += `<path d="M${W * 0.15} ${H * 0.85} h120 l-14 22 h-92 z" fill="${p.ink}"/><rect x="${W * 0.15 + 40}" y="${H * 0.85 - 26}" width="40" height="26" fill="${p.ink}"/>`;
        break;
      }
    }
    // ziarno filmu + winieta
    defs += `<radialGradient id="${id}v" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>`;
    body += `<rect width="${W}" height="${H}" fill="url(#${id}v)"/>`;
    body += `<text x="${W - 16}" y="${H - 14}" text-anchor="end" font-family="Arial" font-size="14" fill="#fff" opacity=".55">GTA VI FunPage · fan art</text>`;
    return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>`, W, H };
  }

  const svgCache = new Map();
  function imageFor(item, i) {
    if (item.src) return { src: item.src, W: 0, H: 0 };
    if (!svgCache.has(i)) {
      const { svg, W, H } = sceneSVG(item, i);
      svgCache.set(i, { src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg), W, H });
    }
    return svgCache.get(i);
  }

  /* ---------- Render galerii ---------- */
  const galleryEl = $("#gallery");
  function galleryTile(item, i) {
    const img = imageFor(item, i);
    const b = document.createElement("button");
    b.className = "g-item reveal";
    b.dataset.index = i;
    b.dataset.cat = item.cat;
    b.setAttribute("aria-label", `Powiększ: ${item.title}`);
    b.innerHTML = `<img src="${img.src}" alt="${escapeHtml(item.title + " – " + item.caption)}" loading="lazy" ${img.W ? `width="${img.W}" height="${img.H}"` : ""}>
      <span class="g-zoom" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4M11 8v6M8 11h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>
      <figcaption><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.caption)}</span></figcaption>`;
    b.addEventListener("click", () => openLightbox(i));
    return b;
  }
  GALLERY.forEach((item, i) => galleryEl.appendChild(galleryTile(item, i)));

  const postcardsEl = $("#worldPostcards");
  [0, 1, 2].forEach((i) => {
    const t = galleryTile(GALLERY[i], i);
    postcardsEl.appendChild(t);
  });

  setupFilter("#galleryFilters", () => $$("#gallery .g-item"), (el, f) => f === "all" || el.dataset.cat === f);

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg");
  let lbIndex = 0, lbList = [], lastFocus = null;
  function visibleGalleryIndexes() {
    const vis = $$("#gallery .g-item:not(.hide)").map((el) => +el.dataset.index);
    return vis.length ? vis : GALLERY.map((_, i) => i);
  }
  function showLb() {
    const i = lbList[lbIndex];
    const item = GALLERY[i];
    lbImg.src = imageFor(item, i).src;
    lbImg.alt = item.title + " – " + item.caption;
    lbImg.style.animation = "none"; void lbImg.offsetWidth; lbImg.style.animation = "";
    $("#lbTitle").textContent = item.title;
    $("#lbCaption").textContent = item.caption;
    $("#lbCount").textContent = `${lbIndex + 1} / ${lbList.length}`;
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    lbList = visibleGalleryIndexes();
    if (!lbList.includes(i)) lbList = GALLERY.map((_, k) => k);
    lbIndex = lbList.indexOf(i);
    showLb();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $("#lbClose").focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  const lbStep = (d) => { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLb(); };
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => lbStep(-1));
  $("#lbNext").addEventListener("click", () => lbStep(1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-figure")) closeLightbox(); });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* =========================================================
     FILTRY (wspólne)
     ========================================================= */
  function setupFilter(groupSel, getItems, match) {
    const group = $(groupSel);
    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      $$(".chip", group).forEach((c) => c.classList.toggle("active", c === btn));
      const f = btn.dataset.filter;
      getItems().forEach((el) => {
        const show = match(el, f);
        el.classList.toggle("hide", !show);
        if (show) { el.classList.add("in"); el.style.animation = "none"; void el.offsetWidth; el.style.animation = ""; }
      });
    });
  }

  /* =========================================================
     MAPA / LOKACJE
     ========================================================= */
  const locPanel = $("#locPanel");
  function showLocation(key, scroll = false) {
    const L = LOCATIONS[key];
    if (!L) return;
    $("#locName").textContent = L.name;
    $("#locType").textContent = L.type;
    $("#locDesc").textContent = L.desc;
    $("#locTag").className = "tag " + (L.status === "confirmed" ? "tag-confirmed" : "tag-spec");
    $("#locTag").textContent = L.status === "confirmed" ? "Lokacja potwierdzona" : "Spekulacja";
    $("#locFacts").innerHTML = L.facts.map(([k, v]) => `<li><b>${escapeHtml(k)}:</b> <span>${escapeHtml(v)}</span></li>`).join("");
    locPanel.classList.remove("swap"); void locPanel.offsetWidth; locPanel.classList.add("swap");
    $$(".pin").forEach((p) => p.classList.toggle("active", p.dataset.loc === key));
    $$(".loc-card").forEach((c) => c.classList.toggle("active", c.dataset.locOpen === key));
    if (scroll && innerWidth <= 920) locPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  $$(".pin").forEach((p) => {
    p.addEventListener("click", () => showLocation(p.dataset.loc, true));
    p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showLocation(p.dataset.loc, true); } });
  });
  $$(".loc-card").forEach((c) => c.addEventListener("click", () => {
    showLocation(c.dataset.locOpen);
    const target = $(`.pin[data-loc="${c.dataset.locOpen}"]`) ? $(".map-wrap") : locPanel;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
  showLocation("vice");

  /* =========================================================
     FABUŁA: ROZDZIAŁY + SPOILERY
     ========================================================= */
  const chapterBtns = $$(".chapter-btn");
  function openChapter(n) {
    chapterBtns.forEach((b) => { const on = b.dataset.chapter === String(n); b.classList.toggle("active", on); b.setAttribute("aria-selected", String(on)); });
    $$(".chapter").forEach((c) => c.classList.toggle("active", c.dataset.chapterPanel === String(n)));
  }
  chapterBtns.forEach((b) => b.addEventListener("click", () => openChapter(b.dataset.chapter)));

  const spoilerToggle = $("#spoilerToggle");
  const spoilerLabel = $("#spoilerToggleLabel");
  function setSpoilersAll(show) {
    $$("[data-spoiler]").forEach((s) => {
      s.classList.toggle("revealed", show);
      s.setAttribute("aria-label", show ? "Spoiler odsłonięty" : "Spoiler – kliknij, aby odsłonić");
    });
    spoilerLabel.textContent = show ? "Spoilery widoczne" : "Spoilery ukryte";
    spoilerToggle.checked = show;
  }
  spoilerToggle.addEventListener("change", () => {
    if (spoilerToggle.checked && !confirm("Na pewno pokazać wszystkie spoilery na stronie?")) { spoilerToggle.checked = false; return; }
    store.set("gta6fp-spoilers", spoilerToggle.checked);
    setSpoilersAll(spoilerToggle.checked);
    toast(spoilerToggle.checked ? "Wszystkie spoilery odsłonięte" : "Spoilery znowu ukryte");
  });
  function revealSpoiler(s) {
    if (s.classList.contains("revealed")) return;
    s.classList.add("revealed", "flash");
    s.setAttribute("aria-label", "Spoiler odsłonięty");
    setTimeout(() => s.classList.remove("flash"), 1200);
  }
  $$("[data-spoiler]").forEach((s) => {
    s.addEventListener("click", () => revealSpoiler(s));
    s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); revealSpoiler(s); } });
  });
  setSpoilersAll(store.get("gta6fp-spoilers", false) === true);

  /* =========================================================
     CIEKAWOSTKI
     ========================================================= */
  const typeLabel = { fakt: ["Fakt", "tag-info"], egg: ["Easter egg", "tag-egg"], spolecznosc: ["Od graczy", "tag-info"] };
  const triviaGrid = $("#triviaGrid");
  triviaGrid.innerHTML = TRIVIA.map((t, i) => `
    <article class="trivia-card" data-type="${t.type}" style="animation-delay:${(i % 6) * 0.05}s" data-search-title="${escapeHtml(t.title)}" data-search-text="${escapeHtml(t.text)}">
      <div class="t-icon" aria-hidden="true">${escapeHtml(t.icon)}</div>
      <h4>${escapeHtml(t.title)}</h4>
      <p>${escapeHtml(t.text)}</p>
      <div class="t-tags">
        <span class="tag ${typeLabel[t.type][1]}">${typeLabel[t.type][0]}</span>
        <span class="tag ${t.status === "confirmed" ? "tag-confirmed" : "tag-spec"}">${t.status === "confirmed" ? "Potwierdzone" : "Spekulacja"}</span>
      </div>
    </article>`).join("");
  setupFilter("#triviaFilters", () => $$(".trivia-card"), (el, f) => f === "all" || el.dataset.type === f);

  /* ---------- Ciekawostka dnia ---------- */
  const factPool = TRIVIA.filter((t) => t.status === "confirmed");
  const today = new Date();
  const dayKey = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  let factIdx = dayKey % factPool.length;
  function showFact(label) {
    const p = $("#factText");
    p.style.opacity = 0;
    setTimeout(() => {
      p.textContent = factPool[factIdx].text;
      $("#factMeta").textContent = label + " · " + factPool[factIdx].title;
      p.style.opacity = 1;
    }, 200);
  }
  showFact("Dzisiejsza ciekawostka");
  $("#factShuffle").addEventListener("click", () => {
    let n;
    do { n = Math.floor(Math.random() * factPool.length); } while (n === factIdx && factPool.length > 1);
    factIdx = n;
    showFact("Losowa ciekawostka");
  });

  /* =========================================================
     DEVLOG
     ========================================================= */
  const fmtDate = (d) => {
    if (/^\d{4}$/.test(d)) return d + " (przewidywania)";
    const [y, m, dd] = d.split("-").map(Number);
    return new Date(y, m - 1, dd).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
  };
  const catLabel = { trailer: "Trailer", data: "Data premiery", news: "News" };
  $("#timeline").innerHTML = NEWS.map((n, i) => `
    <li class="tl-item${n.hl ? " hl" : ""}" data-cat="${n.cat}" style="animation-delay:${i * 0.04}s">
      <article class="tl-card" data-search-title="${escapeHtml(n.title)}" data-search-text="${escapeHtml(n.text + " " + fmtDate(n.date))}">
        <time class="tl-date" ${/^\d{4}-/.test(n.date) ? `datetime="${n.date}"` : ""}>${fmtDate(n.date)}</time>
        <h4>${escapeHtml(n.title)}</h4>
        <p>${escapeHtml(n.text)}</p>
        <span class="tag tag-info">${catLabel[n.cat]}</span>
        <span class="tag ${n.status === "confirmed" ? "tag-confirmed" : "tag-spec"}">${n.status === "confirmed" ? "Potwierdzone" : "Spekulacja"}</span>
      </article>
    </li>`).reverse().join("");
  setupFilter("#newsFilters", () => $$(".tl-item"), (el, f) => f === "all" || el.dataset.cat === f);

  /* =========================================================
     LICZNIK OD PREMIERY
     ========================================================= */
  // Premiera: 19 listopada 2026 (o północy czasu lokalnego użytkownika)
  const RELEASE = new Date(2026, 10, 19, 0, 0, 0).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  function tickCounter() {
    const now = Date.now();
    const diff = Math.abs(now - RELEASE);
    $("#counterLabel").textContent = now >= RELEASE ? "Od premiery minęło" : "Do premiery zostało";
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    $("#cDays").textContent = d;
    $("#cHours").textContent = pad(h);
    $("#cMins").textContent = pad(m);
    $("#cSecs").textContent = pad(s);
  }
  tickCounter();
  setInterval(tickCounter, 1000);

  /* =========================================================
     LICZNIK CZASU GRY (tracker)
     ========================================================= */
  const TKEY = "gta6fp-tracker";
  let tState = store.get(TKEY, { running: null, sessions: [] });
  if (!tState || !Array.isArray(tState.sessions)) tState = { running: null, sessions: [] };
  const trackerCard = $("#tracker");
  const fmtHMS = (ms) => { const t = Math.floor(ms / 1000); return `${pad(Math.floor(t / 3600))}:${pad(Math.floor((t % 3600) / 60))}:${pad(t % 60)}`; };
  const fmtHM = (ms) => { const m = Math.round(ms / 60000); return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`; };

  function renderTracker() {
    const running = tState.running;
    trackerCard.classList.toggle("running", !!running);
    $("#trackerToggle").textContent = running ? "Zakończ sesję" : "Start sesji";
    $("#trackerTime").textContent = fmtHMS(running ? Date.now() - running : 0);
    const total = tState.sessions.reduce((a, s) => a + s.ms, 0) + (running ? Date.now() - running : 0);
    const totalMin = Math.floor(total / 60000);
    $("#trackerTotal").textContent = `${Math.floor(totalMin / 60)} h ${totalMin % 60} min`;
    $("#trackerSessions").textContent = tState.sessions.length;
    $("#trackerLongest").textContent = fmtHM(tState.sessions.reduce((a, s) => Math.max(a, s.ms), 0));
  }
  function renderTrackerList() {
    const list = $("#trackerList");
    if (!tState.sessions.length) { list.innerHTML = `<li class="empty">Brak zapisanych sesji – kliknij „Start sesji”.</li>`; return; }
    list.innerHTML = tState.sessions.slice().reverse().slice(0, 20).map((s) => {
      const d = new Date(s.start);
      return `<li><span>${d.toLocaleDateString("pl-PL")} ${pad(d.getHours())}:${pad(d.getMinutes())}</span><b>${fmtHMS(s.ms)}</b></li>`;
    }).join("");
  }
  $("#trackerToggle").addEventListener("click", () => {
    if (tState.running) {
      const ms = Date.now() - tState.running;
      if (ms >= 1000) tState.sessions.push({ start: tState.running, ms });
      tState.running = null;
      toast(`Sesja zapisana: ${fmtHMS(ms)}`);
    } else {
      tState.running = Date.now();
      toast("Sesja rozpoczęta – miłej gry w Leonidzie!");
    }
    store.set(TKEY, tState);
    renderTracker(); renderTrackerList();
  });
  $("#trackerReset").addEventListener("click", () => {
    if (!tState.sessions.length && !tState.running) { toast("Historia jest już pusta"); return; }
    if (!confirm("Usunąć całą historię sesji z tego urządzenia?")) return;
    tState = { running: null, sessions: [] };
    store.set(TKEY, tState);
    renderTracker(); renderTrackerList();
    toast("Historia wyczyszczona");
  });
  renderTracker(); renderTrackerList();
  setInterval(() => { if (tState.running) renderTracker(); }, 1000);

  /* =========================================================
     QUIZ
     ========================================================= */
  const QN = 10;
  const qStart = $("#quizStart"), qRun = $("#quizRun"), qEnd = $("#quizEnd");
  let qSet = [], qI = 0, qScore = 0;
  const best = () => store.get("gta6fp-quiz-best", null);
  function showBest() { const b = best(); $("#quizBest").textContent = b !== null ? `Twój najlepszy wynik: ${b}/${QN}` : ""; }
  showBest();

  function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

  function startQuiz() {
    qSet = shuffle(QUIZ).slice(0, QN).map((q) => {
      const order = shuffle(q.a.map((_, i) => i));
      return { q: q.q, a: order.map((i) => q.a[i]), c: order.indexOf(q.c), e: q.e };
    });
    qI = 0; qScore = 0;
    qStart.hidden = true; qEnd.hidden = true; qRun.hidden = false;
    renderQ();
  }
  function renderQ() {
    const q = qSet[qI];
    $("#quizProgressText").textContent = `Pytanie ${qI + 1}/${QN}`;
    $("#quizScore").textContent = qScore;
    $("#quizProgressBar").style.width = (qI / QN) * 100 + "%";
    $("#quizQuestion").textContent = q.q;
    $("#quizExplain").textContent = "";
    $("#quizNext").hidden = true;
    const box = $("#quizAnswers");
    box.innerHTML = "";
    q.a.forEach((txt, i) => {
      const b = document.createElement("button");
      b.className = "q-answer";
      b.innerHTML = `<b>${"ABCD"[i]}</b><span>${escapeHtml(txt)}</span>`;
      b.addEventListener("click", () => answer(i));
      box.appendChild(b);
    });
    box.firstChild.focus({ preventScroll: true });
  }
  function answer(i) {
    const q = qSet[qI];
    const btns = $$(".q-answer");
    btns.forEach((b, k) => { b.disabled = true; if (k === q.c) b.classList.add("correct"); });
    if (i === q.c) { qScore++; $("#quizExplain").textContent = "✔ Dobrze! " + q.e; }
    else { btns[i].classList.add("wrong"); $("#quizExplain").textContent = "✘ Niestety. " + q.e; }
    $("#quizScore").textContent = qScore;
    $("#quizProgressBar").style.width = ((qI + 1) / QN) * 100 + "%";
    const next = $("#quizNext");
    next.textContent = qI + 1 < QN ? "Dalej" : "Zobacz wynik";
    next.hidden = false;
    next.focus({ preventScroll: true });
  }
  function endQuiz() {
    qRun.hidden = true; qEnd.hidden = false;
    const ranks = [
      [10, "LEGENDA LEONIDY", "Perfekcja. Lucia i Jason mogliby brać od Ciebie lekcje."],
      [8, "BOSS VICE CITY", "Świetny wynik – znasz Leonidę jak własną kieszeń."],
      [6, "GRACZ Z KEYS", "Nieźle! Jeszcze kilka trailerów i będziesz ekspertem."],
      [4, "TURYSTA", "Dopiero zwiedzasz Leonidę – zajrzyj do sekcji Ciekawostki."],
      [0, "ŚWIEŻAK", "Każdy kiedyś zaczynał. Przeczytaj stronę i spróbuj znowu!"],
    ];
    const [, rank, comment] = ranks.find(([min]) => qScore >= min);
    $("#quizRank").textContent = rank;
    $("#quizResult").textContent = `Twój wynik: ${qScore}/${QN}`;
    const b = best();
    let extra = "";
    if (b === null || qScore > b) { store.set("gta6fp-quiz-best", qScore); if (b !== null) extra = " Nowy rekord!"; }
    $("#quizComment").textContent = comment + extra;
    showBest();
    $("#quizRestart").focus({ preventScroll: true });
  }
  $("#quizStartBtn").addEventListener("click", startQuiz);
  $("#quizRestart").addEventListener("click", startQuiz);
  $("#quizNext").addEventListener("click", () => { qI++; qI < QN ? renderQ() : endQuiz(); });

  /* =========================================================
     WYSZUKIWARKA
     ========================================================= */
  const sOverlay = $("#searchOverlay"), sInput = $("#searchInput"), sResults = $("#searchResults");
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l");
  let index = [];
  // tekst elementu ze spacjami między węzłami (textContent skleja słowa z sąsiednich bloków)
  function textOf(el) {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const parts = [];
    while (w.nextNode()) { const t = w.currentNode.nodeValue.trim(); if (t) parts.push(t); }
    return parts.join(" ").replace(/\s+([.,;:!?)”])/g, "$1");
  }
  function buildIndex() {
    index = $$("[data-search-title]").map((el) => {
      const sec = el.closest("[data-section]");
      const secName = sec ? (sec.querySelector("h2")?.textContent || "Start") : "";
      const title = el.dataset.searchTitle;
      const plain = textOf(el);
      const text = (el.dataset.searchText || "") + " " + plain;
      return { el, title, text, plain, secName, nTitle: norm(title), nText: norm(text) };
    });
  }
  let sel = -1;
  function highlight(str, q) {
    const n = norm(str), i = n.indexOf(q);
    if (i < 0) return escapeHtml(str);
    return escapeHtml(str.slice(0, i)) + "<mark>" + escapeHtml(str.slice(i, i + q.length)) + "</mark>" + escapeHtml(str.slice(i + q.length));
  }
  function snippet(text, q) {
    const n = norm(text), i = n.indexOf(q);
    const start = Math.max(0, i - 50);
    let s = text.slice(start, start + 140).trim();
    if (start > 0) s = "…" + s;
    if (start + 140 < text.length) s += "…";
    return s;
  }
  function doSearch() {
    const raw = sInput.value.trim();
    const q = norm(raw);
    sel = -1;
    $("#searchHints").style.display = q ? "none" : "";
    if (!q) { sResults.innerHTML = ""; return; }
    const words = q.split(/\s+/);
    const hits = index
      .map((it) => {
        let score = 0;
        for (const w of words) {
          if (it.nTitle.includes(w)) score += 5;
          else if (it.nText.includes(w)) score += 1;
          else return null;
        }
        if (it.nTitle.startsWith(q)) score += 5;
        return { it, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    if (!hits.length) { sResults.innerHTML = `<li class="no-res">Brak wyników dla „${escapeHtml(raw)}”. Spróbuj innej frazy.</li>`; return; }
    const first = words[0];
    sResults.innerHTML = hits.map(({ it }, i) => {
      const src = norm(it.plain).includes(first) ? it.plain : it.text;
      return `<li><button data-i="${index.indexOf(it)}" id="sr${i}"><span class="r-sec">${escapeHtml(it.secName)}</span><span class="r-title">${highlight(it.title, first)}</span><span class="r-snip">${highlight(snippet(src, first), first)}</span></button></li>`;
    }).join("");
  }
  function goToResult(i) {
    const it = index[i];
    if (!it) return;
    closeSearch();
    const el = it.el;
    // pokaż ukryte elementy (zakładki, rozdziały, filtry)
    const chapter = el.closest(".chapter");
    if (chapter) openChapter(chapter.dataset.chapterPanel);
    if (el.classList.contains("chapter")) openChapter(el.dataset.chapterPanel);
    const hidden = el.closest(".hide") || (el.classList.contains("hide") ? el : null);
    if (hidden) {
      const grp = hidden.classList.contains("trivia-card") ? "#triviaFilters" : hidden.classList.contains("tl-item") ? "#newsFilters" : null;
      if (grp) $(`${grp} .chip[data-filter="all"]`).click();
    }
    const tl = el.closest(".tl-item");
    if (tl && tl.classList.contains("hide")) $('#newsFilters .chip[data-filter="all"]').click();
    if (el.dataset.locOpen) showLocation(el.dataset.locOpen);
    const hasSpoiler = el.querySelector("[data-spoiler]:not(.revealed)");
    el.classList.add("in");
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.remove("search-hit"); void el.offsetWidth; el.classList.add("search-hit");
      if (hasSpoiler) toast("Uwaga: ten fragment zawiera ukryte spoilery");
    }, 60);
  }
  function openSearch() {
    buildIndex();
    sOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    sInput.value = "";
    doSearch();
    setTimeout(() => sInput.focus(), 30);
  }
  function closeSearch() {
    sOverlay.hidden = true;
    document.body.style.overflow = "";
  }
  $("#searchOpen").addEventListener("click", openSearch);
  sInput.addEventListener("input", doSearch);
  sOverlay.addEventListener("click", (e) => {
    if (e.target === sOverlay) closeSearch();
    const chip = e.target.closest(".chip[data-q]");
    if (chip) { sInput.value = chip.dataset.q; doSearch(); sInput.focus(); }
    const res = e.target.closest("button[data-i]");
    if (res) goToResult(+res.dataset.i);
  });
  sInput.addEventListener("keydown", (e) => {
    const btns = $$("button[data-i]", sResults);
    if (!btns.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length;
      btns.forEach((b, i) => b.classList.toggle("sel", i === sel));
      btns[sel].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      goToResult(+(btns[Math.max(sel, 0)].dataset.i));
    }
  });

  /* =========================================================
     KLAWIATURA (globalnie)
     ========================================================= */
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); sOverlay.hidden ? openSearch() : closeSearch(); return; }
    if (e.key === "/" && sOverlay.hidden && lb.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); return; }
    if (e.key === "Escape") {
      if (!sOverlay.hidden) closeSearch();
      else if (!lb.hidden) closeLightbox();
      else if (navLinks.classList.contains("open")) closeMenu();
    }
    if (!lb.hidden) {
      if (e.key === "ArrowRight") lbStep(1);
      if (e.key === "ArrowLeft") lbStep(-1);
    }
  });

  /* ---------- Start ---------- */
  $("#year").textContent = new Date().getFullYear();
  observeReveal();
  onScroll();
  setTimeout(() => moveIndicator(links.find((l) => l.classList.contains("active"))), 300);
})();
