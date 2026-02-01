const modes = [
  { id: "random", label: "완전 랜덤" },
  { id: "linked", label: "연관 단어 포함" },
];

const themes = [
  { id: "fantasy", label: "판타지", keywords: ["룬", "드래곤", "페어", "루나", "오로라", "실프", "마나", "엘프", "세라프", "에테르"] },
  { id: "sci", label: "사이파이", keywords: ["네온", "코어", "퀀텀", "오메가", "노바", "프라임", "하이퍼", "시그마", "테라", "펄스"] },
  { id: "nature", label: "자연", keywords: ["바람", "숲", "파도", "노을", "별", "구름", "이끼", "솔", "이슬", "꽃"] },
  { id: "myth", label: "신화", keywords: ["티탄", "오딘", "아레스", "니케", "헬리오", "아틀라", "페가", "나투", "포스", "레테"] },
  { id: "sea", label: "바다", keywords: ["해류", "파도", "심해", "산호", "물결", "포말", "등대", "연무", "조류", "푸른"] },
  { id: "desert", label: "사막", keywords: ["모래", "신기루", "사구", "사하라", "황야", "오아시스", "바위", "열기"] },
  { id: "forest", label: "숲", keywords: ["녹", "새싹", "숲길", "이끼", "나뭇결", "바위", "초록", "숨"] },
  { id: "sky", label: "하늘", keywords: ["하늘", "비", "구름", "폭풍", "무지개", "번개", "날개", "바람"] },
  { id: "urban", label: "도시", keywords: ["네온", "거리", "지하", "스카이", "타워", "레일", "블록", "광장", "루프", "브릿지"] },
  { id: "mecha", label: "메카", keywords: ["기어", "메카", "코어", "모듈", "엔진", "프로토", "강철", "볼트", "회로", "합금"] },
  { id: "gothic", label: "고딕", keywords: ["흑", "장미", "장막", "달", "유령", "벽난", "귀족", "밤안개"] },
  { id: "hero", label: "영웅", keywords: ["용기", "검", "방패", "빛", "정의", "수호", "심장", "서약", "승리"] },
  { id: "cute", label: "귀여움", keywords: ["모찌", "콩", "토토", "뽀짝", "말랑", "꿀", "토리", "젤리", "빙글"] },
  { id: "dark", label: "다크", keywords: ["그림자", "밤", "흑", "재", "심연", "새벽", "망령", "흑막", "암흑"] },
  { id: "funny", label: "웃김", keywords: ["허당", "삐끗", "꿀꿀", "띠롱", "삐약", "뿜", "멍때", "뽀잉", "뒤뚱"] },
];

const moods = [
  { id: "soft", label: "부드러움", fragments: ["포근", "솜", "라떼", "봄", "은하", "하모니"] },
  { id: "strong", label: "강한", fragments: ["강철", "폭풍", "블레이드", "철", "파괴", "바위"] },
  { id: "mystic", label: "신비", fragments: ["안개", "달빛", "성운", "환상", "그림자", "새벽"] },
  { id: "cool", label: "시크", fragments: ["네온", "제로", "나이트", "코어", "에코", "블랙"] },
  { id: "bright", label: "밝은", fragments: ["샤인", "리프", "스파클", "해", "빛", "루미"] },
  { id: "fun", label: "웃긴", fragments: ["삐끗", "꿀꿀", "둥", "멍", "띠롱", "뿜"] },
];

const lengthOptions = [
  { id: "any", label: "상관없음", min: 3, max: 12 },
  { id: "short", label: "짧게", min: 3, max: 5 },
  { id: "mid", label: "보통", min: 5, max: 8 },
  { id: "long", label: "길게", min: 8, max: 12 },
];

const syllables = [
  "라",
  "리",
  "루",
  "르",
  "나",
  "노",
  "니",
  "누",
  "아",
  "에",
  "이",
  "오",
  "우",
  "카",
  "키",
  "코",
  "쿠",
  "하",
  "히",
  "호",
  "마",
  "미",
  "무",
  "바",
  "비",
  "보",
  "사",
  "시",
  "수",
  "자",
  "지",
  "주",
  "카",
  "키",
  "쿠",
  "타",
  "티",
  "토",
  "파",
  "피",
  "포",
];

const app = document.getElementById("app");
const usedNames = new Set();
const recentNames = [];
const recentPrefixes = [];
const recentLimit = 60;
const history = [];
let cursor = -1;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const makeChip = (text) => `<span class="chip">${text}</span>`;

const getLengthRange = (id) => lengthOptions.find((opt) => opt.id === id) || lengthOptions[0];

const parseCustomWords = (value) =>
  value
    .split(/[,/\s]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
    .slice(0, 8);

const expandCustomWords = (words) => {
  const expanded = new Set();
  words.forEach((word) => {
    expanded.add(word);
    if (word.length >= 2) {
      expanded.add(word.slice(0, 2));
      expanded.add(word.slice(-2));
    }
    if (word.length >= 3) {
      expanded.add(word.slice(0, 3));
      expanded.add(word.slice(-3));
    }
  });
  return [...expanded].filter((item) => item.length > 0);
};

const normalizeLength = (name, range) => {
  if (name.length > range.max) return name.slice(0, range.max);
  if (name.length < range.min) return name + pick(syllables).slice(0, range.min - name.length);
  return name;
};

const buildName = (prefs) => {
  const mood = pick(moods.filter((item) => prefs.mood === "any" || item.id === prefs.mood));
  const theme = pick(themes.filter((item) => prefs.theme === "any" || item.id === prefs.theme));
  const range = getLengthRange(prefs.length);
  const customPool = expandCustomWords(prefs.customWords);
  const themePool = customPool.length > 0 ? [...theme.keywords, ...customPool] : theme.keywords;

  const base = pick(syllables) + pick(syllables);
  const moodChunk = pick(mood.fragments);
  const themeChunk = pick(themePool);
  const linkChunk = customPool.length > 0 ? pick(customPool) : themeChunk;

  const patterns = [
    () => `${moodChunk}${base}`,
    () => `${base}${moodChunk}`,
    () => `${themeChunk}${base}`,
    () => `${base}${themeChunk}`,
    () => `${moodChunk}${pick(syllables)}${themeChunk}`,
    () => `${themeChunk}${pick(syllables)}${moodChunk}`,
    () => `${base}${pick(syllables)}${pick(syllables)}`,
    () => `${pick(syllables)}${base}${pick(syllables)}`,
    () => `${themeChunk}${pick(syllables)}${moodChunk}`,
  ];

  const linkedPatterns = [
    () => `${linkChunk}${base}${pick(syllables)}`,
    () => `${moodChunk}${linkChunk}`,
    () => `${linkChunk}${pick(syllables)}${moodChunk}`,
    () => `${linkChunk}${pick(syllables)}${moodChunk}`,
  ];

  const raw = prefs.mode === "linked" ? pick(linkedPatterns)() : pick(patterns)();
  return normalizeLength(raw, range);
};

const buildTagline = (prefs) => {
  const mood = prefs.mood === "any" ? "랜덤" : moods.find((item) => item.id === prefs.mood)?.label;
  const theme = prefs.theme === "any" ? "랜덤" : themes.find((item) => item.id === prefs.theme)?.label;
  const length = lengthOptions.find((item) => item.id === prefs.length)?.label || "상관없음";
  const custom = prefs.customWords.length > 0 ? "사용자 단어" : "기본 단어";
  return `게임 캐릭터 닉네임 · ${mood} 느낌 · ${prefs.mode === "linked" ? theme + " 연관" : "완전 랜덤"} · ${length} · ${custom}`;
};

const buildBatch = (prefs) => {
  const names = [];
  let guard = 0;
  const localPrefixes = new Set();
  while (names.length < 10 && guard < 600) {
    const name = buildName(prefs);
    const prefix = name.slice(0, 2);
    const tooRecent = recentNames.includes(name);
    const prefixRepeat = localPrefixes.has(prefix) || recentPrefixes.includes(prefix);
    if (!usedNames.has(name) && !tooRecent && !prefixRepeat) {
      usedNames.add(name);
      recentNames.push(name);
      if (recentNames.length > recentLimit) recentNames.shift();
      recentPrefixes.push(prefix);
      if (recentPrefixes.length > recentLimit) recentPrefixes.shift();
      localPrefixes.add(prefix);
      names.push(name);
    }
    guard += 1;
  }
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prefs,
    names,
    tagline: buildTagline(prefs),
    meta: [
      prefs.mode === "linked" ? "연관 단어" : "완전 랜덤",
      prefs.mood === "any" ? "느낌 랜덤" : moods.find((item) => item.id === prefs.mood)?.label,
      prefs.theme === "any" ? "테마 랜덤" : themes.find((item) => item.id === prefs.theme)?.label,
      prefs.customWords.length > 0 ? "사용자 단어 포함" : "기본 단어",
    ],
  };
};

const renderBatch = (batch) => {
  const container = document.querySelector("[data-results]");
  container.innerHTML = `
    <section class="result-card">
      <header>
        <h2>${batch.tagline}</h2>
        <div class="meta">
          ${batch.meta.map(makeChip).join("")}
          ${makeChip(batch.names.length + "개 추천")}
        </div>
      </header>
      <div class="name-line">
        ${batch.names.map((name) => `<button class="name-chip">${name}</button>`).join("")}
      </div>
    </section>
  `;
  updateHistoryButtons();
};

const updateHistoryButtons = () => {
  const prev = document.querySelector("[data-prev]");
  const next = document.querySelector("[data-next]");
  const counter = document.querySelector("[data-counter]");
  prev.disabled = cursor <= 0;
  next.disabled = cursor >= history.length - 1;
  counter.textContent = `${cursor + 1} / ${history.length}`;
};

const getPrefs = () => {
  const mode = document.querySelector("input[name='mode']:checked").value;
  const theme = document.querySelector("input[name='theme']:checked").value;
  const mood = document.querySelector("input[name='mood']:checked").value;
  const length = document.querySelector("input[name='length']:checked").value;
  const customWords = parseCustomWords(document.querySelector("[data-custom-words]").value);
  return { mode, theme, mood, length, customWords };
};

const applyThemeState = () => {
  const mode = document.querySelector("input[name='mode']:checked").value;
  const themeSection = document.querySelector("[data-theme-group]");
  const inputs = themeSection.querySelectorAll("input");
  const customInput = document.querySelector("[data-custom-words]");
  if (mode === "random") {
    themeSection.classList.add("is-disabled");
    inputs.forEach((input) => {
      input.disabled = true;
      if (input.value === "any") input.checked = true;
    });
    customInput.disabled = true;
    customInput.value = "";
  } else {
    themeSection.classList.remove("is-disabled");
    inputs.forEach((input) => {
      input.disabled = false;
    });
    customInput.disabled = false;
  }
};

const createBatch = () => {
  const prefs = getPrefs();
  if (cursor < history.length - 1) history.splice(cursor + 1);
  const batch = buildBatch(prefs);
  history.push(batch);
  cursor = history.length - 1;
  renderBatch(batch);
};

const reset = () => {
  document.querySelector("input[name='mode'][value='random']").checked = true;
  document.querySelector("input[name='theme'][value='any']").checked = true;
  document.querySelector("input[name='mood'][value='any']").checked = true;
  document.querySelector("input[name='length'][value='any']").checked = true;
  document.querySelector("[data-custom-words]").value = "";
  applyThemeState();
  createBatch();
};

app.innerHTML = `
  <div class="page">
    <header class="hero">
      <div class="badge">게임 닉네임 추천</div>
      <h1>나만의 캐릭터 닉네임 생성기</h1>
      <p class="sub">
        수백·수천 명이 써도 겹치지 않게, 계속 새 조합을 만들어냅니다.
        매번 10개씩 추천하고, 마음에 드는 이름은 눌러서 복사하세요.
      </p>
    </header>

    <section class="panel">
      <div class="panel-head">
        <h2>선택 없이도 바로 생성됩니다</h2>
        <p>느낌을 고르면 더 맞춤형으로 추천돼요.</p>
      </div>
      <form class="controls">
        <div class="control-group">
          <label>생성 방식</label>
          <div class="options">
            ${modes
              .map((item, index) => `<label><input type="radio" name="mode" value="${item.id}" ${index === 0 ? "checked" : ""} /> ${item.label}</label>`)
              .join("")}
          </div>
        </div>
        <div class="control-group" data-theme-group>
          <label>연관 단어</label>
          <div class="options">
            <label><input type="radio" name="theme" value="any" checked /> 상관없음</label>
            ${themes.map((item) => `<label><input type="radio" name="theme" value="${item.id}" /> ${item.label}</label>`).join("")}
          </div>
          <input class="text-input" type="text" data-custom-words placeholder="이름/의미 단어 입력 (예: 레비, 하늘, 루미)" />
          <p class="helper">쉼표나 공백으로 여러 단어를 입력할 수 있어요. (최대 8개)</p>
        </div>
        <div class="control-group">
          <label>전체 느낌</label>
          <div class="options">
            <label><input type="radio" name="mood" value="any" checked /> 상관없음</label>
            ${moods.map((item) => `<label><input type="radio" name="mood" value="${item.id}" /> ${item.label}</label>`).join("")}
          </div>
        </div>
        <div class="control-group">
          <label>글자 수</label>
          <div class="options">
            ${lengthOptions
              .map((item, index) => `<label><input type="radio" name="length" value="${item.id}" ${index === 0 ? "checked" : ""} /> ${item.label}</label>`)
              .join("")}
          </div>
        </div>
        <div class="actions">
          <button type="button" data-generate>새 추천 받기</button>
          <button type="button" class="ghost" data-reset>초기화</button>
        </div>
      </form>
    </section>

    <section class="results">
      <div class="results-head">
        <h2>추천 결과</h2>
        <div class="history">
          <button type="button" class="ghost" data-prev>이전</button>
          <span class="counter" data-counter>1 / 1</span>
          <button type="button" class="ghost" data-next>다음</button>
        </div>
      </div>
      <div class="results-grid" data-results></div>
    </section>
  </div>
`;

document.querySelector("[data-generate]").addEventListener("click", () => {
  createBatch();
});

document.querySelector("[data-reset]").addEventListener("click", () => {
  reset();
});

document.querySelector("[data-prev]").addEventListener("click", () => {
  if (cursor <= 0) return;
  cursor -= 1;
  renderBatch(history[cursor]);
});

document.querySelector("[data-next]").addEventListener("click", () => {
  if (cursor >= history.length - 1) return;
  cursor += 1;
  renderBatch(history[cursor]);
});

document.querySelectorAll("input[name='mode']").forEach((input) => {
  input.addEventListener("change", () => {
    applyThemeState();
  });
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".name-chip");
  if (!button) return;
  const text = button.textContent.trim();
  navigator.clipboard?.writeText(text);
  button.classList.add("copied");
  button.textContent = "복사됨!";
  setTimeout(() => {
    button.textContent = text;
    button.classList.remove("copied");
  }, 900);
});

applyThemeState();
createBatch();
