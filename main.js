const modes = [
  { id: "random", label: "완전 랜덤" },
  { id: "linked", label: "연관 단어 포함" },
];

const themes = [
  { id: "fantasy", label: "판타지", keywords: ["룬", "드래곤", "페어", "루나", "오로라", "실프"] },
  { id: "sci", label: "사이파이", keywords: ["네온", "코어", "퀀텀", "오메가", "노바", "프라임"] },
  { id: "nature", label: "자연", keywords: ["바람", "숲", "파도", "노을", "별", "구름"] },
  { id: "myth", label: "신화", keywords: ["티탄", "오딘", "아레스", "니케", "헬리오", "아틀라"] },
  { id: "cute", label: "귀여움", keywords: ["모찌", "콩", "토토", "뽀짝", "말랑", "꿀"] },
  { id: "dark", label: "다크", keywords: ["그림자", "밤", "흑", "재", "심연", "새벽"] },
  { id: "funny", label: "웃김", keywords: ["허당", "삐끗", "꿀꿀", "띠롱", "삐약", "뿜"] },
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
];

const englishBits = [
  "neo",
  "ark",
  "zen",
  "nova",
  "luna",
  "vex",
  "flux",
  "echo",
  "byte",
  "rift",
  "spark",
];

const app = document.getElementById("app");
const usedNames = new Set();
const history = [];
let cursor = -1;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const makeChip = (text) => `<span class="chip">${text}</span>`;

const getLengthRange = (id) => lengthOptions.find((opt) => opt.id === id) || lengthOptions[0];

const normalizeLength = (name, range) => {
  if (name.length > range.max) return name.slice(0, range.max);
  if (name.length < range.min) return name + pick(syllables).slice(0, range.min - name.length);
  return name;
};

const buildName = (prefs) => {
  const mood = pick(moods.filter((item) => prefs.mood === "any" || item.id === prefs.mood));
  const theme = pick(themes.filter((item) => prefs.theme === "any" || item.id === prefs.theme));
  const range = getLengthRange(prefs.length);

  const base = pick(syllables) + pick(syllables);
  const moodChunk = pick(mood.fragments);
  const themeChunk = pick(theme.keywords);
  const engChunk = pick(englishBits);

  const patterns = [
    () => `${moodChunk}${base}`,
    () => `${base}${moodChunk}`,
    () => `${themeChunk}${base}`,
    () => `${base}${themeChunk}`,
    () => `${moodChunk}${pick(syllables)}${themeChunk}`,
    () => `${themeChunk}${pick(syllables)}${moodChunk}`,
    () => `${base}${pick(syllables)}${pick(syllables)}`,
    () => `${pick(syllables)}${engChunk}${pick(syllables)}`,
    () => `${engChunk}${base}`,
  ];

  const linkedPatterns = [
    () => `${themeChunk}${base}${pick(syllables)}`,
    () => `${moodChunk}${themeChunk}`,
    () => `${themeChunk}${pick(syllables)}${engChunk}`,
    () => `${engChunk}${themeChunk}`,
  ];

  const raw = prefs.mode === "linked" ? pick(linkedPatterns)() : pick(patterns)();
  return normalizeLength(raw, range);
};

const buildTagline = (prefs) => {
  const mood = prefs.mood === "any" ? "랜덤" : moods.find((item) => item.id === prefs.mood)?.label;
  const theme = prefs.theme === "any" ? "랜덤" : themes.find((item) => item.id === prefs.theme)?.label;
  const length = lengthOptions.find((item) => item.id === prefs.length)?.label || "상관없음";
  return `게임 캐릭터 닉네임 · ${mood} 느낌 · ${prefs.mode === "linked" ? theme + " 연관" : "완전 랜덤"} · ${length}`;
};

const buildBatch = (prefs) => {
  const names = [];
  let guard = 0;
  while (names.length < 12 && guard < 400) {
    const name = buildName(prefs);
    if (!usedNames.has(name)) {
      usedNames.add(name);
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
      <div class="name-grid">
        ${batch.names.map((name) => `<button class="name-btn">${name}</button>`).join("")}
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
  return { mode, theme, mood, length };
};

const applyThemeState = () => {
  const mode = document.querySelector("input[name='mode']:checked").value;
  const themeSection = document.querySelector("[data-theme-group]");
  const inputs = themeSection.querySelectorAll("input");
  if (mode === "random") {
    themeSection.classList.add("is-disabled");
    inputs.forEach((input) => {
      input.disabled = true;
      if (input.value === "any") input.checked = true;
    });
  } else {
    themeSection.classList.remove("is-disabled");
    inputs.forEach((input) => {
      input.disabled = false;
    });
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
  applyThemeState();
  createBatch();
};

app.innerHTML = `
  <div class="page">
    <header class="hero">
      <div class="badge">게임 닉네임 추천</div>
      <h1>캐릭터 닉네임을<br />무작위로 만들어 드려요</h1>
      <p class="sub">
        수백·수천 명이 써도 겹치지 않게, 계속 새 조합을 만들어냅니다.
        마음에 드는 이름은 눌러서 복사하세요.
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
  const button = event.target.closest(".name-btn");
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
