const archetypes = [
  {
    id: "mage",
    label: "마도사",
    vibes: ["신비", "차분", "지성"],
    stems: ["아르", "에일", "리안", "세르", "루네", "엘라", "모르", "시아"],
    suffixes: ["린", "테", "온", "엘", "리", "라", "노", "스"],
  },
  {
    id: "warrior",
    label: "전사",
    vibes: ["강인", "담대", "거칠"],
    stems: ["라그", "카르", "볼트", "드락", "브론", "타르", "그림", "하른"],
    suffixes: ["가드", "록", "탄", "르", "스", "렌", "발", "크"],
  },
  {
    id: "rogue",
    label: "도적",
    vibes: ["은밀", "민첩", "가벼"],
    stems: ["니르", "벨", "라즈", "시브", "카인", "루카", "제로", "그림"],
    suffixes: ["로", "스", "린", "크", "엘", "네", "자", "움"],
  },
  {
    id: "guardian",
    label: "수호자",
    vibes: ["든든", "따뜻", "안정"],
    stems: ["가온", "라움", "미르", "이든", "하늘", "브람", "소라", "루미"],
    suffixes: ["담", "결", "온", "빛", "수", "림", "해", "누"],
  },
  {
    id: "traveler",
    label: "방랑자",
    vibes: ["자유", "모험", "낭만"],
    stems: ["바람", "노을", "별", "해", "길", "파도", "하늘", "구름"],
    suffixes: ["길", "노마", "빛", "새", "결", "음", "온", "루"],
  },
];

const tones = [
  { id: "cute", label: "귀여움", fragments: ["콩", "포포", "모찌", "단", "토토", "부비"] },
  { id: "cool", label: "시크", fragments: ["블랙", "네온", "제로", "나이트", "코어", "에코"] },
  { id: "fantasy", label: "판타지", fragments: ["룬", "드래곤", "페어", "루나", "오로라", "실프"] },
  { id: "soft", label: "부드러움", fragments: ["포근", "은하", "라떼", "솜", "봄", "하모니"] },
];

const app = document.getElementById("app");

const makeChip = (text) => `<span class="chip">${text}</span>`;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildName = (archetype, tone, length) => {
  const base = `${pick(archetype.stems)}${pick(archetype.suffixes)}`;
  const toneChunk = pick(tone.fragments);
  if (length === "short") return base.slice(0, 4);
  if (length === "long") return `${toneChunk}${base}`;
  return `${base}${toneChunk}`;
};

const buildTagline = (archetype, tone) =>
  `${pick(archetype.vibes)}한 ${archetype.label} + ${tone.label}`;

const buildSet = (prefs) => {
  const archetype = pick(archetypes.filter((a) => prefs.archetype === "any" || a.id === prefs.archetype));
  const tone = pick(tones.filter((t) => prefs.tone === "any" || t.id === prefs.tone));
  const names = new Set();
  while (names.size < 6) {
    names.add(buildName(archetype, tone, prefs.length));
  }
  return {
    archetype,
    tone,
    tagline: buildTagline(archetype, tone),
    names: [...names],
  };
};

const render = (result) => {
  const card = `
    <section class="result-card">
      <header>
        <h2>${result.tagline}</h2>
        <div class="meta">
          ${makeChip(result.archetype.label)}
          ${makeChip(result.tone.label)}
          ${makeChip(result.names.length + "개 추천")}
        </div>
      </header>
      <div class="name-grid">
        ${result.names.map((name) => `<button class="name-btn">${name}</button>`).join("")}
      </div>
    </section>
  `;
  const container = document.querySelector("[data-results]");
  container.insertAdjacentHTML("afterbegin", card);
};

const clearResults = () => {
  const container = document.querySelector("[data-results]");
  container.innerHTML = "";
};

const getPrefs = () => {
  const archetype = document.querySelector("input[name='archetype']:checked").value;
  const tone = document.querySelector("input[name='tone']:checked").value;
  const length = document.querySelector("input[name='length']:checked").value;
  return { archetype, tone, length };
};

app.innerHTML = `
  <div class="page">
    <header class="hero">
      <div class="badge">캐릭터 닉네임 생성기</div>
      <h1>한 번의 클릭으로<br />닉네임 아이디어를 뽑아요</h1>
      <p class="sub">
        세계관, 분위기, 길이를 선택하면 어울리는 닉네임을 추천합니다.
        마음에 드는 이름은 눌러서 복사할 수 있어요.
      </p>
    </header>

    <section class="panel">
      <div class="panel-head">
        <h2>원하는 느낌을 골라주세요</h2>
        <p>선택 없이도 바로 추천됩니다.</p>
      </div>
      <form class="controls">
        <div class="control-group">
          <label>캐릭터 유형</label>
          <div class="options">
            <label><input type="radio" name="archetype" value="any" checked /> 상관없음</label>
            ${archetypes.map((item) => `<label><input type="radio" name="archetype" value="${item.id}" /> ${item.label}</label>`).join("")}
          </div>
        </div>
        <div class="control-group">
          <label>분위기</label>
          <div class="options">
            <label><input type="radio" name="tone" value="any" checked /> 상관없음</label>
            ${tones.map((item) => `<label><input type="radio" name="tone" value="${item.id}" /> ${item.label}</label>`).join("")}
          </div>
        </div>
        <div class="control-group">
          <label>길이</label>
          <div class="options">
            <label><input type="radio" name="length" value="short" /> 짧게</label>
            <label><input type="radio" name="length" value="mid" checked /> 보통</label>
            <label><input type="radio" name="length" value="long" /> 길게</label>
          </div>
        </div>
        <div class="actions">
          <button type="button" data-generate>닉네임 추천 받기</button>
          <button type="button" class="ghost" data-reset>초기화</button>
        </div>
      </form>
    </section>

    <section class="results">
      <div class="results-head">
        <h2>추천 결과</h2>
        <p>새로 만들수록 다른 조합이 나와요.</p>
      </div>
      <div class="results-grid" data-results></div>
    </section>
  </div>
`;

const generate = () => {
  const prefs = getPrefs();
  render(buildSet(prefs));
};

const reset = () => {
  document.querySelector("input[name='archetype'][value='any']").checked = true;
  document.querySelector("input[name='tone'][value='any']").checked = true;
  document.querySelector("input[name='length'][value='mid']").checked = true;
  clearResults();
  render(buildSet(getPrefs()));
  render(buildSet(getPrefs()));
};

document.querySelector("[data-generate]").addEventListener("click", () => {
  generate();
});

document.querySelector("[data-reset]").addEventListener("click", () => {
  reset();
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

reset();
