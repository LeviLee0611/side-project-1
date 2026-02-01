const categories = [
  {
    id: "home",
    name: "집에서",
    sets: [
      ["창문 열기", "물 한 잔 마시기", "방 정리 5분"],
      ["책 한 쪽 읽기", "스트레칭 3분", "음악 한 곡 듣기"],
      ["간단히 샤워하기", "침대 시트 정리", "메모 3줄 쓰기"],
    ],
  },
  {
    id: "solo",
    name: "혼자",
    sets: [
      ["산책 10분", "하늘 사진 찍기", "좋아하는 가게 지나가기"],
      ["카페에서 물 마시기", "벤치 앉아 쉬기", "생각 정리 5분"],
      ["동네 한 바퀴 돌기", "계단 오르기 3층", "오늘 일정 확인"],
    ],
  },
  {
    id: "outside",
    name: "밖에서",
    sets: [
      ["가까운 공원 가기", "나무 한 그루 보기", "가볍게 걷기"],
      ["동네 골목 탐색", "작은 가게 구경", "햇볕 쐬기"],
      ["강변 걷기", "바람 느끼기", "사진 한 장 남기기"],
    ],
  },
  {
    id: "free",
    name: "돈 안 쓰고",
    sets: [
      ["물 마시기", "창문 환기", "무료 영상 보기"],
      ["집 주변 걷기", "공공 도서관 들르기", "무료 전시 찾아보기"],
      ["집에서 요가 5분", "오래된 노래 듣기", "냉장고 정리"],
    ],
  },
  {
    id: "friends",
    name: "친구랑",
    sets: [
      ["근처 산책", "사진 찍기", "근황 이야기"],
      ["공원에서 앉기", "간단한 게임 하기", "같이 걷기"],
      ["동네 카페 구경", "가벼운 대화", "다음 약속 정하기"],
    ],
  },
];

const app = document.getElementById("app");

const createSet = (items, index) => `
  <div class="set">
    <div class="set-title">세트 ${index + 1}</div>
    <ul class="set-list">
      ${items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </div>
`;

const createCard = (category, index) => `
  <section class="card" style="--delay:${index * 80}ms">
    <header class="card-header">
      <h2>${category.name}</h2>
      <span class="tag">오늘 할 수 있는 행동 3가지</span>
    </header>
    <div class="sets">
      ${category.sets.map(createSet).join("")}
    </div>
  </section>
`;

app.innerHTML = `
  <div class="page">
    <header class="hero">
      <p class="eyebrow">오늘 바로 써먹는 가벼운 컨텐츠</p>
      <h1>오늘 뭐 하지?</h1>
      <p class="sub">
        입력 없이 바로 확인하는 짧고 단순한 행동 제안.
        카테고리별로 3세트씩 준비했어요.
      </p>
    </header>
    <main class="grid">
      ${categories.map(createCard).join("")}
    </main>
    <footer class="foot">
      예시용 결과입니다. 필요하면 더 늘리거나 랜덤으로 돌릴 수 있어요.
    </footer>
  </div>
`;
