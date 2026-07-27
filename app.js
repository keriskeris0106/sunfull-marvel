/* ==========================================================================
   선플마블 (Sunfull Marble) - 게임 구동 엔진 (app.js - 2차 피드백 반영본)
   ========================================================================== */

// 런타임 상세 오류 캐처 (CORS 보안 우회용)
window.addEventListener('error', function(e) {
  if (e.error) {
    alert("🚨 선플마블 엔진 내부 오류 감지!\n\n오류명: " + e.error.name + "\n메시지: " + e.error.message + "\n\n디버그 스펙(Stack):\n" + e.error.stack);
  } else {
    alert("🚨 선플마블 엔진 일반 오류 감지!\n\n메시지: " + e.message + "\n파일: " + e.filename + "\n라인: " + e.lineno);
  }
});


// 1. 상황 미션 카드 데이터셋 (이지/하드 공통 사용)
const MISSION_CARDS = {
  baemin: {
    name: "배달의 만족 🛵",
    color: "var(--color-baemin)",
    list: [
      { type: "칭찬", text: "사장님이 정성껏 만들어주신 돈가스가 따뜻하게 도착했다." },
      { type: "칭찬", text: "리뷰 이벤트로 약속한 치즈볼보다 훨씬 더 많은 양을 서비스로 주셨다." },
      { type: "칭찬", text: "포장지에 사장님이 직접 쓴 '맛있게 드세요'라는 손편지가 붙어 있었다." },
      { type: "칭찬", text: "비가 엄청 쏟아지는 날인데, 배달 기사님이 음식을 젖지 않게 조심히 가져다주셨다." },
      { type: "칭찬", text: "처음 시켜본 식당인데, 양이 정말 많아서 온 가족이 배부르게 나누어 먹었다." },
      { type: "칭찬", text: "음식을 담은 용기가 플라스틱이 아니라 친환경 종이 용기여서 분리수거하기 좋았다." },
      { type: "칭찬", text: "너무 맛있어서 내 마음속 우리 동네 최고의 맛집 1위로 저장하고 싶다." },
      { type: "조언", text: "피자가 배달 오다가 심하게 흔들려서 한쪽으로 모양이 찌그러졌다." },
      { type: "조언", text: "햄버거 세트를 시켰는데, 실수로 감자튀김이 빠져서 도착했다." },
      { type: "조언", text: "따뜻해야 할 국물 요리가 조금 식어서 미지근하게 도착했다." },
      { type: "조언", text: "튀김이 평소보다 조금 눅눅해서 바삭한 맛이 덜했다." },
      { type: "조언", text: "메뉴판 사진에 있던 화려한 토핑과 실제 음식의 모양이 조금 달랐다." }
    ]
  },
  youtube: {
    name: "너튜브 📺",
    color: "var(--color-youtube)",
    list: [
      { type: "칭찬", text: "피아노 학원에서 열심히 연습한 곡을 연주하여 올린 영상." },
      { type: "칭찬", text: "우리 반 학생들이 다 함께 힘을 모아 만든 학교폭력 예방 캠페인 영상." },
      { type: "칭찬", text: "내가 평소에 잘 몰랐던 어려운 과학 원리를 아주 쉽게 설명해 주는 영상." },
      { type: "칭찬", text: "춤 연습을 얼마나 열심히 했는지, 땀을 뻘뻘 흘리는 댄스 커버 영상." },
      { type: "의견", text: "유튜버가 재미있는 영화를 소개하며 '여러분의 인생 영화는 무엇인가요?'라고 묻는 영상." },
      { type: "의견", text: "크리에이터가 '다음 영상에서는 어떤 슬라임 재료를 섞어볼까요?'라며 아이디어를 묻는다." },
      { type: "조언", text: "친구가 올린 브이로그인데, 배경음악 소리가 너무 커서 친구의 목소리가 잘 안 들린다." },
      { type: "조언", text: "재밌는 게임 플레이 영상인데, 중간에 화면이 너무 심하게 흔들려서 어지럽다." },
      { type: "조언", text: "요리 튜토리얼 영상인데, 중요한 레시피 자막이 너무 빨리 지나가서 읽기 어렵다." }
    ]
  },
  nurizip: {
    name: "누리집 🌐",
    color: "var(--color-nurizip)",
    list: [
      { type: "질문", text: "멕시코 음식 타코를 집에서 쉽게 만드는 방법을 설명한 글을 읽고 할 수 있는 질문." },
      { type: "질문", text: "제주도의 숨겨진 아름다운 바닷가를 직접 찍은 사진과 함께 소개하는 글을 보고 할 수 있는 질문." },
      { type: "질문", text: "내가 좋아하는 웹툰 작가의 인터뷰와 함께, 캐릭터를 그리는 과정이 올라온 글을 보고 할 수 있는 질문." },
      { type: "칭찬", text: "글쓴이가 집에서 키우는 고양이의 귀여운 사진을 잔뜩 올리며 매력을 소개하는 글." },
      { type: "칭찬", text: "우리나라의 역사를 초등학생 눈높이에 맞춰 재미있는 짧은 만화로 그려준 글." },
      { type: "칭찬", text: "친구가 밤을 새워가며 노트에 꾹꾹 눌러 쓴 판타지 소설의 첫 번째 에피소드." },
      { type: "칭찬", text: "지구 환경 보호를 위해 집에서 당장 실천할 수 있는 꿀팁 3가지를 정리해 놓은 글." },
      { type: "의견", text: "영양사 선생님이 '다음 달 급식 메뉴로 새로 넣었으면 하는 음식을 추천해 주세요'라고 올린 글." },
      { type: "의견", text: "'이번 주말에 가족들과 보면 좋을 영화를 추천해 주세요!'라는 글." },
      { type: "의견", text: "학급 게시판에 반장이 '올해 우리 반 체육대회 단체 티셔츠 색깔 뭘로 할까요?'라고 묻는 글." },
      { type: "의견", text: "미술 시간에 자신이 그린 그림 2장을 올리며 '어느 그림이 더 잘 그린 그림인가요?'라고 묻는 글." },
      { type: "조언", text: "숙제 자료를 찾았는데, 글씨 폰트가 너무 작고 배경색과 겹쳐서 읽기 불편한 글." },
      { type: "조언", text: "정보는 정말 좋은데, 글 중간중간 맞춤법이 꽤 많이 틀려서 뜻을 이해하기 헷갈리는 글." }
    ]
  },
  kkaetalk: {
    name: "깨똑 💬",
    color: "var(--color-kkaetalk)",
    list: [
      { type: "칭찬", text: "친구가 단톡방에 자기가 그린 그림을 '좀 이상한가?'라며 쑥스럽게 자랑했다." },
      { type: "칭찬", text: "내가 아파서 결석했는데, 친구가 오늘 알림장 내용과 숙제를 사진 찍어 SNS로 보내주었다." },
      { type: "칭찬", text: "방학이 시작되는 첫날 아침, 한 친구가 '우리 반 모두 건강하고 즐거운 방학 보내!'라고 연락했다." },
      { type: "칭찬", text: "모둠 과제 발표가 무사히 다 끝났는데, 조원이 단체 채팅방에 '다들 정말 고생 많았어!'라고 연락을 남겼다." },
      { type: "조언", text: "밤 11시가 넘은 늦은 시간, 자야 하는데 친구가 단톡방에서 계속 심심하다며 연락을 한다." },
      { type: "조언", text: "단체 채팅방에서 친구가 내가 별로 좋아하지 않는 별명을 부르며 자꾸 장난을 친다." },
      { type: "조언", text: "단체 채팅방에서 문자로만 대화하다 보니, 친구가 내 농담을 오해해서 갑자기 기분이 상한 것 같다." },
      { type: "조언", text: "한 친구가 길게 고민을 털어놓았는데, 다른 친구들이 귀찮은 듯 'ㅇㅇ', 'ㅋㅋ' 단답만 하고 있다." }
    ]
  }
};

// 2. 황금열쇠 카드 데이터셋 (이지 / 하드 분리)
const GOLDKEY_CARDS = {
  easy: [
    { title: "[5칸 앞으로]", text: "자료가 믿을만한지 파악하기 위해 출처를 확인했습니다.", resultText: "5칸 앞으로 이동합니다.", action: (p) => movePlayerEffect(p, 5) },
    { title: "[3칸 뒤로]", text: "스마트폰을 보며 길을 걷다가 친구와 부딪힐 뻔했습니다.", resultText: "3칸 뒤로 이동합니다.", action: (p) => movePlayerEffect(p, -3) },
    { title: "[사이버 수사대 이동]", text: "누리집에서 상대의 기분을 고려하지 않고 댓글을 썼습니다.", resultText: "즉시 [사이버 수사대] 칸으로 이동합니다.", action: (p) => sendToJailEffect(p) },
    { title: "[선플 캠페인 본부 이동]", text: "길 잃은 강아지를 찾아주는 게시물을 공유해 좋은 일에 앞장섰습니다.", resultText: "[선플 캠페인 본부] 칸으로 즉시 이동합니다.", action: (p) => forceMoveToCellEffect(p, "hq") },
    { title: "[우주여행 이동]", text: "내가 남긴 칭찬 댓글에 유튜버가 직접 '하트'를 눌러주었습니다.", resultText: "즉시 [우주여행] 칸으로 이동합니다.", action: (p) => forceMoveToCellEffect(p, "travel") },
    
    { title: "[사이버 수사대 탈출 쿠폰 획득]", text: "부모님과 정한 스마트폰 사용 시간을 어기지 않고 잘 지켰습니다.", resultText: "탈출 쿠폰 1장을 획득합니다.", action: (p) => modifyCouponEffect(p, 1) },
    { title: "[사이버 수사대 탈출 쿠폰 획득]", text: "다른 사람이 만든 자료를 사용할 때, 출처를 밝혔습니다.", resultText: "탈출 쿠폰 1장을 획득합니다.", action: (p) => modifyCouponEffect(p, 1) },
    { title: "[사이버 수사대 탈출 쿠폰 획득]", text: "반말이 아닌 존댓말로 댓글을 달았습니다.", resultText: "탈출 쿠폰 1장을 획득합니다.", action: (p) => modifyCouponEffect(p, 1) },
    { title: "[사이버 수사대 탈출 쿠폰 회수]", text: "스스로 정한 스마트폰 사용 시간을 어기고 1시간을 더 게임했습니다.", resultText: "탈출 쿠폰 1장을 빼앗깁니다.", action: (p) => modifyCouponEffect(p, -1) },
    { title: "[사이버 수사대 탈출 쿠폰 회수]", text: "출처를 밝히지 않고, 다른 사람이 만든 자료를 마음대로 사용하였습니다.", resultText: "탈출 쿠폰 1장을 빼앗깁니다.", action: (p) => modifyCouponEffect(p, -1) },

    { title: "[스마일 토큰 1개 획득]", text: "가족과 저녁을 먹을 때 스마트폰을 보지 않고 대화에 집중했습니다.", resultText: "빈 플랫폼 중 무작위 1곳에 내 스마일 토큰이 세워집니다.", action: (p) => buildRandomTokenEffect(p) },
    { title: "[스마일 토큰 1개 획득]", text: "아주 구체적이고 칭찬이 가득한 리뷰를 남겨 사장님을 감동시켰습니다.", resultText: "빈 플랫폼 중 무작위 1곳에 내 스마일 토큰이 세워집니다.", action: (p) => buildRandomTokenEffect(p) },
    { title: "[스마일 토큰 1개 회수]", text: "유튜브에서 본 가짜 뉴스를 진짜인 줄 알고 친구들에게 퍼뜨렸습니다.", resultText: "내 스마일 토큰 1개가 무작위로 사라집니다.", action: (p) => removeRandomTokenEffect(p) },
    { title: "[스마일 토큰 1개 회수]", text: "누리집에 상대를 비난하는 댓글을 달았습니다.", resultText: "내 스마일 토큰 1개가 무작위로 사라집니다.", action: (p) => removeRandomTokenEffect(p) },

    { title: "[하트칩 1개 획득]", text: "읽는 사람을 배려하여 댓글을 적었습니다.", resultText: "하트 칩 1개를 획득합니다.", action: (p) => modifyHeartsEffect(p, 1) },
    { title: "[하트칩 2개 획득]", text: "내가 올린 질문 글에 친절하게 답변해 준 사람에게 '감사합니다!'라고 답글을 달았습니다.", resultText: "하트 칩 2개를 획득합니다.", action: (p) => modifyHeartsEffect(p, 2) },
    { title: "[하트칩 1개 회수]", text: "인터넷에 있는 글을 그대로 복사하여 숙제로 제출했습니다.", resultText: "벌금으로 하트 칩 1개를 캠페인 본부에 냅니다.", action: (p) => payFineEffect(p, 1) },
    { title: "[하트칩 2개 회수]", text: "화가 난다고 댓글에 욕설을 썼다가 다른 사람들에게 신고를 당했습니다.", resultText: "벌금으로 하트 칩 2개를 캠페인 본부에 냅니다.", action: (p) => payFineEffect(p, 2) }
  ],
  hard: [
    { title: "[5칸 앞으로]", text: "자료가 믿을만한지 파악하기 위해 출처를 확인했습니다.", resultText: "5칸 앞으로 이동합니다.", action: (p) => movePlayerEffect(p, 5) },
    { title: "[3칸 뒤로]", text: "스마트폰을 보며 길을 걷다가 친구와 부딪힐 뻔했습니다.", resultText: "3칸 뒤로 이동합니다.", action: (p) => movePlayerEffect(p, -3) },
    { title: "[사이버 수사대 이동]", text: "누리집에서 상대의 기분을 고려하지 않고 댓글을 썼습니다.", resultText: "즉시 [사이버 수사대] 칸으로 이동합니다.", action: (p) => sendToJailEffect(p) },
    { title: "[선플 캠페인 본부 이동]", text: "길 잃은 강아지를 찾아주는 게시물을 공유해 좋은 일에 앞장섰습니다.", resultText: "[선플 캠페인 본부] 칸으로 즉시 이동합니다.", action: (p) => forceMoveToCellEffect(p, "hq") },
    { title: "[우주여행 이동]", text: "내가 남긴 칭찬 댓글에 유튜버가 직접 '하트'를 눌러주었습니다.", resultText: "즉시 [우주여행] 칸으로 이동합니다.", action: (p) => forceMoveToCellEffect(p, "travel") },
    
    { title: "[사이버 수사대 탈출 쿠폰 획득]", text: "부모님과 정한 스마트폰 사용 시간을 어기지 않고 잘 지켰습니다.", resultText: "탈출 쿠폰 1장을 획득합니다.", action: (p) => modifyCouponEffect(p, 1) },
    { title: "[사이버 수사대 탈출 쿠폰 획득]", text: "다른 사람이 만든 자료를 사용할 때, 출처를 밝혔습니다.", resultText: "탈출 쿠폰 1장을 획득합니다.", action: (p) => modifyCouponEffect(p, 1) },
    { title: "[사이버 수사대 탈출 쿠폰 획득]", text: "반말이 아닌 존댓말로 댓글을 달았습니다.", resultText: "탈출 쿠폰 1장을 획득합니다.", action: (p) => modifyCouponEffect(p, 1) },
    { title: "[사이버 수사대 탈출 쿠폰 회수]", text: "스스로 정한 스마트폰 사용 시간을 어기고 1시간을 더 게임했습니다.", resultText: "탈출 쿠폰 1장을 빼앗깁니다.", action: (p) => modifyCouponEffect(p, -1) },
    { title: "[사이버 수사대 탈출 쿠폰 회수]", text: "출처를 밝히지 않고, 다른 사람이 만든 자료를 마음대로 사용하였습니다.", resultText: "탈출 쿠폰 1장을 빼앗깁니다.", action: (p) => modifyCouponEffect(p, -1) },

    { title: "[스마일 토큰 1개 획득]", text: "검색한 정보의 출처가 분명한지 따져 신뢰할 수 있는 정보임을 확인했습니다.", resultText: "빈 플랫폼 중 무작위 1곳에 내 스마일 토큰이 세워집니다.", action: (p) => buildRandomTokenEffect(p) },
    { title: "[스마일 토큰 1개 획득]", text: "정보를 선택할 때는 찾고 싶은 목적과 관련이 있는 내용인지 확인했습니다.", resultText: "빈 플랫폼 중 무작위 1곳에 내 스마일 토큰이 세워집니다.", action: (p) => buildRandomTokenEffect(p) },
    { title: "[스마일 토큰 1개 회수]", text: "친구의 웃긴 표정을 찍은 사진을 허락없이 나의 SNS에 올렸습니다.", resultText: "내 스마일 토큰 1개가 무작위로 사라집니다.", action: (p) => removeRandomTokenEffect(p) },
    { title: "[스마일 토큰 1개 회수]", text: "단체 채팅방에서 다른 친구를 몰래 험담하는 내용에 'ㅋㅋ 맞음' 이라고 동조했습니다.", resultText: "내 스마일 토큰 1개가 무작위로 사라집니다.", action: (p) => removeRandomTokenEffect(p) },

    { title: "[하트칩 1개 획득]", text: "생성형 AI가 쓴 글을 그대로 베끼지 않고, 나의 비판적 의견을 덧붙여 과제를 완성했습니다.", resultText: "하트 칩 1개를 획득합니다.", action: (p) => modifyHeartsEffect(p, 1) },
    { title: "[하트칩 2개 획득]", text: "저작권, 초상권과 같은 매체 활용 윤리를 지키며 발표자료를 제작했습니다.", resultText: "하트 칩 2개를 획득합니다.", action: (p) => modifyHeartsEffect(p, 2) },
    { title: "[하트칩 1개 회수]", text: "늦은 밤까지 숏폼 영상을 보느라 다음 날 학교에 지각했습니다.", resultText: "벌금으로 하트 칩 1개를 캠페인 본부에 냅니다.", action: (p) => payFineEffect(p, 1) },
    { title: "[하트칩 2개 회수]", text: "숏폼에서 본 자극적이고 위험한 챌린지를 따라했습니다.", resultText: "벌금으로 하트 칩 2개를 캠페인 본부에 냅니다.", action: (p) => payFineEffect(p, 2) }
  ]
};

// 3. 플레이어 설정값 정의
const PLAYER_COLORS = {
  2: ["#FF4500", "#0000FF"], 
  3: ["#FF4500", "#0000FF", "#00A86B"], 
  4: ["#FF4500", "#0000FF", "#00A86B", "#4A2711"] 
};

// 투명도가 들어간 플레이어 연한 배경색 맵 (스마일 토큰 획득에 따른 배경색 채우기용)
const PLAYER_LIGHT_BACKGROUNDS = {
  "#FF4500": "var(--color-p1-light)",
  "#0000FF": "var(--color-p2-light)",
  "#00A86B": "var(--color-p3-light)",
  "#4A2711": "var(--color-p4-light)"
};

// Web Audio API 기반 짧은 효과음 엔진 (BGM 없음, 외부 파일 의존 없음)
const AudioFX = (function() {
  let ctx = null;

  function initCtx() {
    if (!ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        ctx = new AudioContext();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function play(type) {
    if (gameState.settings && gameState.settings.isMuted) return;
    try {
      initCtx();
      if (!ctx) return;
      
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'dice') {
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(160 + Math.random() * 180, now + i * 0.07);
          gain.gain.setValueAtTime(0.08, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.04);
        }
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.15, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.15);
        });
      } else if (type === 'fail') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'goldkey') {
        [880, 1174.66, 1396.91].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.15, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.18);
        });
      } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.2, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.22);
        });
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  return { play };
})();

// LocalStorage 기반 영구 설정 로드/저장 모듈
const SAVED_SETTINGS = (function() {
  try {
    const raw = localStorage.getItem('sunfull_marvel_settings');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
})();

function saveSettingsToStorage() {
  try {
    localStorage.setItem('sunfull_marvel_settings', JSON.stringify(gameState.settings));
  } catch (e) {}
}

// 4. 게임 상태 객체
let gameState = {
  difficulty: 'easy',       
  playerCount: 2,           
  players: [],              
  currentPlayerIdx: 0,      
  boardCells: [],           
  campaignFunds: 0,         
  isRolling: false,         
  isMovementActive: false,  
  teleportMode: false,      
  timerInterval: null,
  settings: SAVED_SETTINGS || {
    diceSpeed: 800,        // 주사위 롤링 속도 (800ms 기본)
    timerDuration: 10,     // 미션 수행 제한시간 (10초 기본)
    isMuted: false         // 효과음 음소거 여부
  }
};

// 5. DOM 요소 참조
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const boardEl = document.getElementById('board');
const playersListEl = document.getElementById('players-list');
const btnRollDice = document.getElementById('btn-roll-dice');
const turnMessageEl = document.getElementById('turn-message');
const currentPlayerNameEl = document.getElementById('current-player-name');
const diceResultText = document.getElementById('dice-result-text');

// 모달창들
const rulesModal = document.getElementById('rules-modal');
const missionModal = document.getElementById('mission-modal');
const buildModal = document.getElementById('build-modal');
const goldkeyModal = document.getElementById('goldkey-modal');
const jailModal = document.getElementById('jail-modal');
const gameoverModal = document.getElementById('gameover-modal');

// 모달 내용 바인딩 엘리먼트
const missionPlatformType = document.getElementById('mission-platform-type');
const missionTagType = document.getElementById('mission-tag-type');
const missionSituationText = document.getElementById('mission-situation-text');
const timerNum = document.getElementById('timer-num');
const timerFill = document.getElementById('timer-fill');
const btnStartTimer = document.getElementById('btn-start-timer');
const missionJudgementButtons = document.getElementById('mission-judgement-buttons');
const timerBox = document.getElementById('timer-box');

const goldkeyTitle = document.getElementById('goldkey-title');
const goldkeyDescText = document.getElementById('goldkey-desc-text');
const goldkeyResultText = document.getElementById('goldkey-result-text');

const jailPlayerTicketCount = document.getElementById('jail-player-ticket-count');

const gameoverReasonText = document.getElementById('gameover-reason-text');
const rankingListContainer = document.getElementById('ranking-list-container');

// ==========================================================================
// 6. 초기 구동 및 설정 이벤트 바인딩
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 난이도 선택 이벤트
  document.querySelectorAll('.difficulty-options .btn-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.difficulty-options .btn-select').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      gameState.difficulty = target.dataset.difficulty;
    });
  });

  // 인원 선택 이벤트
  document.querySelectorAll('.player-count-options .btn-select-small').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.player-count-options .btn-select-small').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      gameState.playerCount = parseInt(target.dataset.players);
      
      document.querySelectorAll('.colors-preview .color-chip').forEach((chip, idx) => {
        if (idx < gameState.playerCount) {
          chip.classList.remove('hidden');
        } else {
          chip.classList.add('hidden');
        }
      });
    });
  });

  // 버튼 바인딩들
  document.getElementById('btn-start-game').addEventListener('click', startGame);
  
  document.getElementById('btn-show-rules-setup').addEventListener('click', () => {
    setupRulesModalButton(false); 
    showModal(rulesModal);
  });
  document.getElementById('btn-game-rules').addEventListener('click', () => {
    setupRulesModalButton(true); 
    showModal(rulesModal);
  });
  document.getElementById('btn-close-rules').addEventListener('click', () => hideModal(rulesModal));

  document.getElementById('btn-force-quit').addEventListener('click', triggerManualQuit);
  btnRollDice.addEventListener('click', rollDice);

  // 미션 모달 내 이벤트
  btnStartTimer.addEventListener('click', startMissionTimer);
  document.getElementById('btn-mission-fail').addEventListener('click', handleMissionFail);
  document.getElementById('btn-mission-success').addEventListener('click', handleMissionSuccess);

  // 황금열쇠 닫기
  document.getElementById('btn-close-goldkey').addEventListener('click', () => {
    hideModal(goldkeyModal);
  });

  // 감옥 선택
  document.getElementById('btn-jail-use-ticket').addEventListener('click', handleJailUseTicket);
  document.getElementById('btn-jail-no-ticket').addEventListener('click', handleJailNoTicket);

  // 게임오버 리셋
  document.getElementById('btn-gameover-yes').addEventListener('click', resetToSetup);
  document.getElementById('btn-gameover-no').addEventListener('click', () => {
    hideModal(gameoverModal);
  });

  // [NEW] 게임 설정 모달 관련 이벤트 & UI 동기화 모듈
  const settingsModal = document.getElementById('settings-modal');
  const btnGameSettings = document.getElementById('btn-game-settings');
  if (btnGameSettings) {
    btnGameSettings.addEventListener('click', () => {
      AudioFX.play('click');
      syncSettingsUI();
      showModal(settingsModal);
    });
  }
  document.getElementById('btn-close-settings').addEventListener('click', () => {
    AudioFX.play('click');
    saveSettingsToStorage();
    hideModal(settingsModal);
  });

  // 주사위 속도 프로그레스 슬라이더 이벤트 (1: 느리게 1600ms, 2: 보통 800ms, 3: 빠르게 400ms)
  const speedRange = document.getElementById('setting-dice-speed-range');
  const speedLabels = document.querySelectorAll('.speed-label');
  const speedMap = { 1: 1600, 2: 800, 3: 400 };

  if (speedRange) {
    speedRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      gameState.settings.diceSpeed = speedMap[val] || 800;
      saveSettingsToStorage();
      speedLabels.forEach(lbl => {
        if (parseInt(lbl.dataset.step) === val) {
          lbl.classList.add('active');
        } else {
          lbl.classList.remove('active');
        }
      });
      AudioFX.play('click');
    });

    speedLabels.forEach(lbl => {
      lbl.addEventListener('click', (e) => {
        const step = parseInt(e.currentTarget.dataset.step);
        speedRange.value = step;
        gameState.settings.diceSpeed = speedMap[step] || 800;
        saveSettingsToStorage();
        speedLabels.forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
        AudioFX.play('click');
      });
    });
  }

  // 미션 타이머 시간 설정 버튼 그룹 (칩 형태)
  document.querySelectorAll('#setting-timer-duration-group .btn-setting-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      AudioFX.play('click');
      document.querySelectorAll('#setting-timer-duration-group .btn-setting-chip').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      gameState.settings.timerDuration = parseInt(e.currentTarget.dataset.timer);
      saveSettingsToStorage();
    });
  });

  // 효과음 스위치 토글 이벤트
  const soundToggle = document.getElementById('setting-sound-toggle');
  const soundStatusLabel = document.getElementById('sound-status-label');

  if (soundToggle) {
    soundToggle.addEventListener('change', (e) => {
      gameState.settings.isMuted = !e.target.checked;
      saveSettingsToStorage();
      if (gameState.settings.isMuted) {
        soundStatusLabel.innerText = '🔇 효과음 꺼짐';
      } else {
        soundStatusLabel.innerText = '🔊 효과음 켜짐';
        AudioFX.play('click');
      }
    });
  }

  // 초기 설정 UI 동기화 실행
  syncSettingsUI();
});

function syncSettingsUI() {
  const speedRange = document.getElementById('setting-dice-speed-range');
  const speedLabels = document.querySelectorAll('.speed-label');
  const timerChips = document.querySelectorAll('#setting-timer-duration-group .btn-setting-chip');
  const soundToggle = document.getElementById('setting-sound-toggle');
  const soundStatusLabel = document.getElementById('sound-status-label');

  let stepVal = 2;
  if (gameState.settings.diceSpeed >= 1400) stepVal = 1;
  else if (gameState.settings.diceSpeed <= 500) stepVal = 3;

  if (speedRange) speedRange.value = stepVal;
  speedLabels.forEach(lbl => {
    if (parseInt(lbl.dataset.step) === stepVal) lbl.classList.add('active');
    else lbl.classList.remove('active');
  });

  timerChips.forEach(chip => {
    if (parseInt(chip.dataset.timer) === gameState.settings.timerDuration) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  if (soundToggle) {
    soundToggle.checked = !gameState.settings.isMuted;
  }
  if (soundStatusLabel) {
    soundStatusLabel.innerText = gameState.settings.isMuted ? '🔇 효과음 꺼짐' : '🔊 효과음 켜짐';
  }
}

function setupRulesModalButton(isIngame) {
  const container = document.getElementById('rules-button-container');
  container.innerHTML = '';
  if (isIngame) {
    const btn = document.createElement('button');
    btn.className = 'btn-primary';
    btn.style.margin = '0 auto';
    btn.innerText = '🎮 게임으로 돌아가기';
    btn.onclick = () => hideModal(rulesModal);
    container.appendChild(btn);
  }
}

// ==========================================================================
// 7. 게임 시작 및 보드 렌더링
// ==========================================================================
function startGame() {
  setupScreen.classList.remove('active');
  gameScreen.classList.add('active');

  gameState.players = [];
  const colors = PLAYER_COLORS[gameState.playerCount];
  for (let i = 0; i < gameState.playerCount; i++) {
    gameState.players.push({
      id: i + 1,
      name: `플레이어 ${i + 1}`,
      color: colors[i],
      class: `p${i + 1}`,
      position: 0,
      hearts: 20,           
      tokens: 0,            
      tickets: 0,           
      jailTurns: 0,         
      isJailed: false,
      isBankrupt: false,
      lastRollWasDouble: false,
      isWaitingTeleport: false // 알고리즘 떡상 대기 여부 플래그
    });
  }
  gameState.currentPlayerIdx = 0;
  gameState.campaignFunds = 0;
  gameState.teleportMode = false;
  gameState.isRolling = false;
  gameState.isMovementActive = false;

  createBoardLayout();

  renderScoreboard();
  renderBoard();
  updatePawnPositions();

  updateTurnUI();
}

function createBoardLayout() {
  const cells = [];
  
  if (gameState.difficulty === 'easy') {
    const rawPool = [
      ...Array(5).fill({ type: 'baemin', name: '배달의 만족', icon: '🛵' }),
      ...Array(5).fill({ type: 'youtube', name: '너튜브', icon: '📺' }),
      ...Array(5).fill({ type: 'nurizip', name: '누리집', icon: '🌐' }),
      ...Array(5).fill({ type: 'goldkey', name: '황금열쇠', icon: '🗝️' })
    ];
    
    shuffle(rawPool);

    let poolIdx = 0;
    for (let i = 0; i < 24; i++) {
      if (i === 0) {
        cells.push({ id: 0, type: 'login', name: '로그인 (시작)', icon: '💻', isCorner: true });
      } else if (i === 6) {
        cells.push({ id: 6, type: 'police', name: '사이버 수사대', icon: '🚨', isCorner: true });
      } else if (i === 12) {
        cells.push({ id: 12, type: 'hq', name: '선플 캠페인 본부', icon: '💖', isCorner: true });
      } else if (i === 18) {
        cells.push({ id: 18, type: 'travel', name: '알고리즘 떡상', icon: '🚀', isCorner: true });
      } else {
        cells.push({ id: i, ...rawPool[poolIdx++], owner: null, smileTokens: 0, isCorner: false });
      }
    }
  } else {
    const rawPool = [
      ...Array(6).fill({ type: 'baemin', name: '배달의 만족', icon: '🛵' }),
      ...Array(6).fill({ type: 'youtube', name: '너튜브', icon: '📺' }),
      ...Array(6).fill({ type: 'nurizip', name: '누리집', icon: '🌐' }),
      ...Array(6).fill({ type: 'kkaetalk', name: '깨똑', icon: '💬' }),
      ...Array(4).fill({ type: 'goldkey', name: '황금열쇠', icon: '🗝️' })
    ];
    
    shuffle(rawPool);

    let poolIdx = 0;
    for (let i = 0; i < 32; i++) {
      if (i === 0) {
        cells.push({ id: 0, type: 'login', name: '로그인 (시작)', icon: '💻', isCorner: true });
      } else if (i === 8) {
        cells.push({ id: 8, type: 'police', name: '사이버 수사대', icon: '🚨', isCorner: true });
      } else if (i === 16) {
        cells.push({ id: 16, type: 'hq', name: '선플 캠페인 본부', icon: '💖', isCorner: true });
      } else if (i === 24) {
        cells.push({ id: 24, type: 'travel', name: '알고리즘 떡상', icon: '🚀', isCorner: true });
      } else {
        cells.push({ id: i, ...rawPool[poolIdx++], owner: null, smileTokens: 0, isCorner: false });
      }
    }
  }

  gameState.boardCells = cells;
}

// 피셔-예이츠 셔플 알고리즘 구현체 (누락 복구)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// ==========================================================================
// 8. 렌더링 함수들
// ==========================================================================
function renderScoreboard() {
  playersListEl.innerHTML = '';
  gameState.players.forEach(p => {
    const card = document.createElement('div');
    card.id = `player-card-${p.id}`;
    card.className = `player-card ${p.isBankrupt ? 'bankrupt' : ''}`;
    
    let ticketHTML = '';
    if (p.tickets > 0) {
      ticketHTML = `<div class="stat-item" style="color: #2980B9;">🎟️ 탈출 쿠폰: <span id="p-tickets-${p.id}">${p.tickets}</span>장</div>`;
    }

    card.innerHTML = `
      <div class="player-card-header">
        <div class="player-name-wrap">
          <span class="pawn-indicator" style="background-color: ${p.color};">💬</span>
          <span>${p.name}</span>
        </div>
        ${p.isJailed ? '<span class="jail-badge">조사 중</span>' : ''}
      </div>
      <div class="player-card-stats">
        <div class="stat-item">❤️ 하트칩: <span id="p-hearts-${p.id}">${p.hearts}</span>개</div>
        <div class="stat-item">😊 스마일 토큰: <span id="p-tokens-${p.id}">${p.tokens}</span>개</div>
        ${ticketHTML}
      </div>
    `;
    playersListEl.appendChild(card);
  });
  
  updateHQFundsUI();
}

function renderBoard() {
  boardEl.innerHTML = '';
  
  const total = gameState.boardCells.length;
  const sideCells = total / 4; 
  const gridSize = sideCells + 1; 

  if (gameState.difficulty === 'easy') {
    boardEl.className = 'board-grid easy-mode';
  } else {
    boardEl.className = 'board-grid hard-mode';
  }

  gameState.boardCells.forEach((cell, idx) => {
    const cellDiv = document.createElement('div');
    cellDiv.id = `cell-${cell.id}`;
    cellDiv.className = `board-cell ${cell.isCorner ? 'corner-cell' : ''}`;
    
    if (!cell.isCorner) {
      cellDiv.classList.add(`${cell.type}-cell`);
    }

    let row, col;
    if (idx <= sideCells) {
      row = 1;
      col = idx + 1;
    } else if (idx < sideCells * 2) {
      row = idx - sideCells + 1;
      col = gridSize;
    } else if (idx <= sideCells * 3) {
      row = gridSize;
      col = gridSize - (idx - sideCells * 2);
    } else {
      row = gridSize - (idx - sideCells * 3);
      col = 1;
    }

    cellDiv.style.gridRow = row;
    cellDiv.style.gridColumn = col;

    cellDiv.innerHTML = `
      <div class="cell-info">
        <span class="cell-icon">${cell.icon}</span>
        <span class="cell-name">${cell.name}</span>
      </div>
      <div class="cell-tokens" id="cell-tokens-${cell.id}"></div>
      <div class="cell-pawns" id="cell-pawns-${cell.id}"></div>
    `;

    if (cell.type === 'hq') {
      const hqInfo = cellDiv.querySelector('.cell-info');
      const hqBadge = document.createElement('div');
      hqBadge.id = 'hq-funds-badge-inside';
      hqBadge.className = 'hq-funds-badge';
      hqBadge.innerText = `❤️ 0`;
      hqInfo.appendChild(hqBadge);
    }

    cellDiv.addEventListener('click', () => {
      if (gameState.teleportMode && !cell.isCorner) {
        // 순간이동 타겟 클릭
        handleTeleportToCell(cell.id);
      } else if (gameState.teleportMode && cell.isCorner && cell.type !== 'travel') {
        // [우주여행 피드백]: 떡상 칸 제외 나머지 3개 특수칸 클릭 순간이동 가능
        handleTeleportToCell(cell.id);
      }
    });

    boardEl.appendChild(cellDiv);
  });

  const centerDiv = document.createElement('div');
  centerDiv.className = 'board-center-area';
  // 피드백: 가운데 상시 현재차례 안내 + 선플 3대수칙 가이드 렌더링 카드 구조 마련
  centerDiv.innerHTML = `
    <!-- 현재 차례 뱃지 -->
    <div id="center-turn-box" class="center-turn-indicator">
      <span class="pawn-dot" style="background-color: var(--color-p1);"></span>
      <span>플레이어 1의 차례입니다!</span>
    </div>

    <!-- 선플 3대 수칙 가이드라인 -->
    <div id="center-rules-card-box" class="center-rules-card">
      <div class="center-rules-title">💡 선플 통과 조건 3가지</div>
      <ul class="center-rules-list">
        <li>1. 존댓말 사용하기</li>
        <li>2. 비속어 및 줄임말 금지</li>
        <li>3. 존중과 배려의 마음 담기</li>
      </ul>
    </div>

    <!-- 뽑기/행동 버튼 렌더링 영역 -->
    <div id="center-action-area"></div>

    <div id="teleport-banner" class="teleport-guide-banner">
      🚀 알고리즘 떡상 상태입니다!<br>이동하고 싶은 플랫폼 또는 다른 특수 칸을 클릭하세요!
    </div>
  `;
  boardEl.appendChild(centerDiv);
}

function updatePawnPositions() {
  gameState.boardCells.forEach(cell => {
    const pawnsContainer = document.getElementById(`cell-pawns-${cell.id}`);
    if (pawnsContainer) pawnsContainer.innerHTML = '';
  });

  gameState.players.forEach(p => {
    if (p.isBankrupt) return;
    const pawnsContainer = document.getElementById(`cell-pawns-${p.position}`);
    if (pawnsContainer) {
      const pawnSpan = document.createElement('span');
      pawnSpan.className = 'pawn';
      pawnSpan.style.backgroundColor = p.color;
      pawnSpan.style.color = '#FFFFFF';
      pawnSpan.innerText = '💬';
      pawnSpan.title = p.name;
      pawnsContainer.appendChild(pawnSpan);
    }
  });
}

// 스마일 토큰 소유권 칠하기 & 회수 피드백 반영
function updateSmileTokensUI(cellId) {
  const cell = gameState.boardCells.find(c => c.id === cellId);
  const container = document.getElementById(`cell-tokens-${cellId}`);
  const cellDiv = document.getElementById(`cell-${cellId}`);
  if (!container || !cell || !cellDiv) return;

  container.innerHTML = '';
  
  if (cell.smileTokens > 0) {
    const owner = gameState.players.find(p => p.id === cell.owner);
    if (owner) {
      // 1) 스마일 토큰 😊 이미지 나열
      for (let i = 0; i < cell.smileTokens; i++) {
        const tokenBadge = document.createElement('span');
        tokenBadge.className = 'smile-token-badge';
        tokenBadge.innerText = '😊';
        container.appendChild(tokenBadge);
      }
      // 2) 플랫폼 칸 배경색 자체를 플레이어 연한 색으로 칠하기 (피드백 반영)
      const lightBgColor = PLAYER_LIGHT_BACKGROUNDS[owner.color] || '#FFFFFF';
      cellDiv.style.backgroundColor = lightBgColor;
    }
  } else {
    // 스마일 토큰이 0이 되면 다시 완벽한 흰색 배경으로 초기화
    cellDiv.style.backgroundColor = '#FFFFFF';
  }
}

function updateHQFundsUI() {
  const badgeInside = document.getElementById('hq-funds-badge-inside');
  if (badgeInside) {
    badgeInside.innerText = `❤️ ${gameState.campaignFunds}`;
  }
}

// ==========================================================================
// 9. 차례 턴 흐름 제어 (중앙 영역 갱신 및 떡상 순간이동 대기 처리)
// ==========================================================================
function updateTurnUI() {
  const currentPlayer = gameState.players[gameState.currentPlayerIdx];
  
  // 1. 중앙의 플레이어 인디케이터 고정 업데이트
  const turnBox = document.getElementById('center-turn-box');
  if (turnBox) {
    turnBox.innerHTML = `
      <span class="pawn-dot" style="background-color: ${currentPlayer.color};"></span>
      <span>${currentPlayer.name}의 차례입니다!</span>
    `;
  }

  // 2. 우측 스코어보드 하이라이팅 변경
  document.querySelectorAll('.player-card').forEach(card => card.classList.remove('active-turn'));
  const currentCard = document.getElementById(`player-card-${currentPlayer.id}`);
  if (currentCard) currentCard.classList.add('active-turn');

  // [떡상 핫픽스 피드백]: 내 턴이 시작되었을 때 떡상 대기 상태인지 탐지
  if (currentPlayer.isWaitingTeleport) {
    gameState.teleportMode = true; 
    
    // 주사위 롤러 비활성화
    turnMessageEl.innerText = "🚀 알고리즘 떡상! 순간이동 할 칸을 클릭하세요.";
    btnRollDice.innerText = "이동 대기 중...";
    btnRollDice.disabled = true;

    // 중앙 수칙 카드를 숨기고 텔레포트 안내 배너 노출
    const rulesCardBox = document.getElementById('center-rules-card-box');
    if (rulesCardBox) rulesCardBox.style.display = 'none';
    
    const teleportBanner = document.getElementById('teleport-banner');
    if (teleportBanner) teleportBanner.style.display = 'block';

    // 순간이동 대상 칸 하이라이팅 개시 (자기가 멈춰있는 떡상 칸은 제외)
    highlightTeleportTargets(currentPlayer.position);
  } else {
    // 일반 상태
    gameState.teleportMode = false;
    turnMessageEl.innerText = `${currentPlayer.name}님, 주사위를 굴려주세요.`;
    btnRollDice.innerText = "🎲 주사위 굴리기";
    btnRollDice.disabled = false;

    // 텔레포트 배너 숨기고 수칙 카드 복원
    const teleportBanner = document.getElementById('teleport-banner');
    if (teleportBanner) teleportBanner.style.display = 'none';

    const rulesCardBox = document.getElementById('center-rules-card-box');
    if (rulesCardBox) rulesCardBox.style.display = 'block';

    clearTeleportHighlights();

    // 사이버 수사대에 갇혀 있고, 쿠폰이 있을 때 바로 팝업 노출
    if (currentPlayer.isJailed && currentPlayer.tickets > 0) {
      showJailDecisionModal(currentPlayer);
    }
  }
}

// 턴 복귀 및 기본 중앙 카드 원복
function endTurn() {
  if (checkGameOverCondition()) return;

  gameState.isRolling = false;
  gameState.isMovementActive = false;

  // 1. 진행용으로 그려진 중앙의 뽑기/확인 버튼 카드들 삭제
  clearCenterActionCard();

  // 2. 3번 스킵 버그 방지용 안전 모듈러 루프 수행
  let safety = 0;
  do {
    gameState.currentPlayerIdx = (gameState.currentPlayerIdx + 1) % gameState.playerCount;
    safety++;
    if (safety > 10) break;
  } while (gameState.players[gameState.currentPlayerIdx].isBankrupt);

  // 3. 차례 UI 갱신
  updateTurnUI();
}

// ==========================================================================
// 10. 주사위 작동 & 플레이어 말 이동
// ==========================================================================
// 누적 주사위 회전 각도 (단 1회의 연속 회전 구현용)
let diceTotalRot1 = { x: 0, y: 0 };
let diceTotalRot2 = { x: 0, y: 0 };

function rollDice() {
  if (gameState.isRolling || gameState.isMovementActive || gameState.teleportMode) return;
  
  AudioFX.play('dice');

  const currentPlayer = gameState.players[gameState.currentPlayerIdx];
  gameState.isRolling = true;
  btnRollDice.disabled = true;
  clearCenterActionCard();

  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  const total = die1 + die2;
  const isDouble = (die1 === die2);

  const d1El = document.getElementById('dice1');
  const d2El = document.getElementById('dice2');

  const rollSpeed = gameState.settings ? gameState.settings.diceSpeed : 800;
  const transitionSec = (rollSpeed / 1000).toFixed(2);

  // 선택한 속도(400ms/800ms/1600ms)에 맞게 CSS 트랜지션 속도를 동적으로 설정
  d1El.style.transition = `transform ${transitionSec}s cubic-bezier(0.25, 0.8, 0.25, 1)`;
  d2El.style.transition = `transform ${transitionSec}s cubic-bezier(0.25, 0.8, 0.25, 1)`;

  // 각 눈금별 3D 회전 각도 맵
  const faceOffsets = {
    1: { x: 0, y: 0 },
    6: { x: 0, y: 180 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    2: { x: -90, y: 0 },
    5: { x: 90, y: 0 }
  };

  // 단 1회의 매끄러운 3D 회전 애니메이션 계산 (2바퀴 = 720도 회전 후 해당 눈금에 안착)
  diceTotalRot1.x += 720;
  diceTotalRot1.y += 720;
  diceTotalRot2.x += 720;
  diceTotalRot2.y += 720;

  const targetX1 = diceTotalRot1.x + faceOffsets[die1].x;
  const targetY1 = diceTotalRot1.y + faceOffsets[die1].y;
  const targetX2 = diceTotalRot2.x + faceOffsets[die2].x;
  const targetY2 = diceTotalRot2.y + faceOffsets[die2].y;

  // 단 한 번의 트랜스폼으로 주사위 굴림 실행
  d1El.style.transform = `rotateX(${targetX1}deg) rotateY(${targetY1}deg)`;
  d2El.style.transform = `rotateX(${targetX2}deg) rotateY(${targetY2}deg)`;

  setTimeout(() => {
    // 회전이 정지되면 멈춘 주사위 눈금이 이동할 숫자가 됨
    if (isDouble && !currentPlayer.isJailed) {
      diceResultText.innerText = `결과: ${die1} + ${die2} = ${total} ★더블!★`;
      triggerDoubleConfetti();
    } else {
      diceResultText.innerText = `결과: ${die1} + ${die2} = ${total}`;
    }
    
    handleDiceResult(currentPlayer, total, isDouble);
  }, rollSpeed);
}

// 색종이 & 풍선 축하 효과 내장 (피드백 반영)
function triggerDoubleConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  // 1) 컨페티 50개 생성
  const colors = ['#F1C40F', '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6', '#E67E22', '#F39C12', '#FF69B4'];
  for (let i = 0; i < 55; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(piece);
  }

  // 2) 풍선 8개 생성
  for (let i = 0; i < 8; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${10 + Math.random() * 80}vw`;
    balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    balloon.style.color = balloon.style.backgroundColor;
    balloon.style.animationDelay = `${Math.random() * 1.2}s`;
    container.appendChild(balloon);
  }

  // 2.6초 후 전체 삭제
  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }, 2600);
}

function handleDiceResult(player, total, isDouble) {
  if (player.isJailed) {
    if (isDouble) {
      player.isJailed = false;
      player.jailTurns = 0;
      renderScoreboard();
      turnMessageEl.innerText = "🚨 탈출 성공! 더블이 나와서 즉시 이동합니다.";
      
      animatePlayerMovement(player, total, false);
    } else {
      player.jailTurns++;
      turnMessageEl.innerText = "더블이 나오지 않았습니다. 탈출 실패!";
      
      if (player.jailTurns >= 3) {
        player.isJailed = false;
        player.jailTurns = 0;
        turnMessageEl.innerText = "3턴 동안 반성 완료! 다음 턴에 자동 탈출합니다.";
      }
      renderScoreboard();
      
      setTimeout(() => {
        endTurn();
      }, 1500);
    }
    return;
  }

  animatePlayerMovement(player, total, isDouble);
}

// 500ms 지연으로 플레이어 말이 이동하는 속도를 둔화시킴
function animatePlayerMovement(player, steps, isDouble) {
  gameState.isMovementActive = true;
  let currentStep = 0;
  const totalCells = gameState.boardCells.length;

  // 이동 시작 시 중앙 가이드 일시 비가시 처리
  const rulesCardBox = document.getElementById('center-rules-card-box');
  if (rulesCardBox) rulesCardBox.style.display = 'none';

  function step() {
    if (currentStep < steps) {
      player.position = (player.position + 1) % totalCells;
      
      // 로그인 지점 통과 보너스
      if (player.position === 0) {
        player.hearts += 15;
        document.getElementById(`p-hearts-${player.id}`).innerText = player.hearts;
        turnMessageEl.innerText = `💻 로그인 통과 보상! ❤️ 하트칩 15개 지급!`;
      }
      
      updatePawnPositions();
      currentStep++;
      const stepDelay = Math.max(160, Math.round(gameState.settings.diceSpeed * 0.45));
      setTimeout(step, stepDelay);
    } else {
      gameState.isMovementActive = false;
      handleCellLandAction(player, player.position, isDouble);
    }
  }

  step();
}

// ==========================================================================================================
// 11. 칸 도착 - 중앙 카드 렌더링 및 모달 호출 제어
// ==========================================================================================================
function handleCellLandAction(player, cellId, isDouble) {
  const cell = gameState.boardCells[cellId];
  player.lastRollWasDouble = isDouble;

  // 미션 수행 전 중앙 가이드라인 숨김
  const rulesCardBox = document.getElementById('center-rules-card-box');
  if (rulesCardBox) rulesCardBox.style.display = 'none';

  // 1. 모서리 특수 칸 처리
  if (cell.isCorner) {
    if (cell.type === 'login') {
      renderCenterActionCard(player, cell, '특수행동', '로그인 칸에 도착했습니다. 접속 보상을 수령합니다.', () => {
        player.hearts += 15;
        showAlertPopup("로그인 성공!", `시작점에 안착했습니다. 접속 보너스 ❤️ 하트칩 15개를 추가로 받습니다!`, () => {
          renderScoreboard();
          checkDoubleBonusAndEnd(player);
        });
      });
    }
    else if (cell.type === 'police') {
      renderCenterActionCard(player, cell, '특수행동', '사이버 수사대 조사실 칸에 도착했습니다. 조사를 받습니다.', () => {
        player.isJailed = true;
        player.jailTurns = 0;
        showAlertPopup("사이버 수사대", `악플 신고가 접수되어 조사를 받습니다. 3턴 동안 갇히거나 주사위 더블, 황금열쇠로 뽑은 [사이버 수사대 탈출 쿠폰]이 있다면 바로 탈출할 수 있습니다.`, () => {
          renderScoreboard();
          endTurn(); 
        });
      });
    }
    else if (cell.type === 'hq') {
      renderCenterActionCard(player, cell, '특수행동', '선플 캠페인 본부에 도착했습니다. 쌓인 벌금을 수령합니다.', () => {
        const funds = gameState.campaignFunds;
        player.hearts += funds;
        gameState.campaignFunds = 0;
        
        showAlertPopup("선플 캠페인 본부", `우수 캠페인 활동자로 선정되었습니다! 그동안 모인 벌금 하트칩을 모두 가져갑니다! (❤️ 하트칩 ${funds}개 획득)`, () => {
          renderScoreboard();
          updateHQFundsUI();
          checkDoubleBonusAndEnd(player);
        });
      });
    }
    else if (cell.type === 'travel') {
      // [우주여행 피드백 교정]: 떡상 도착 시 바로 날아가지 않고 상태 예약만 한 뒤 턴 종료!
      renderCenterActionCard(player, cell, '우주여행 확인', '알고리즘 떡상 칸에 도착했습니다. 다음 턴 순간이동을 확보합니다.', () => {
        player.isWaitingTeleport = true; // 예약
        showAlertPopup("알고리즘 떡상 🚀", `내가 쓴 선플이 베스트 댓글이 되었습니다!<br>다음 차례가 돌아오면 주사위를 굴리지 않고 **나머지 3개 특수칸 또는 플랫폼 칸 어디로든 곧바로 이동**할 수 있습니다!`, () => {
          checkDoubleBonusAndEnd(player); // 턴 안전 마감
        });
      });
    }
    return;
  }

  // 2. 황금열쇠 칸 처리
  if (cell.type === 'goldkey') {
    renderCenterActionCard(player, cell, '황금열쇠카드', '황금열쇠 칸에 도착했습니다. 황금열쇠 카드를 확인합니다.', () => {
      triggerGoldKey(player);
    });
    return;
  }

  // 3. 일반 플랫폼 칸 처리
  // [A] 남의 땅인 경우 ➡️ 힐링 통행료 지불
  if (cell.owner !== null && cell.owner !== player.id) {
    const owner = gameState.players.find(p => p.id === cell.owner);
    if (!owner.isBankrupt) {
      renderCenterActionCard(player, cell, '통행료 지불', `${owner.name}님의 선플 구역입니다. 힐링 통행료를 냅니다.`, () => {
        const fee = cell.smileTokens;
        player.hearts -= fee;
        owner.hearts += fee;
        
        showAlertPopup("힐링 통행료 지불", `${owner.name}님의 멋진 선플 구역입니다!<br>기분 좋은 선플을 읽고 힐링한 값으로 **❤️ 하트칩 ${fee}개**를 플랫폼의 주인에게 줍니다.`, () => {
          renderScoreboard();
          if (player.hearts <= 0) {
            player.isBankrupt = true;
            handleGameOver(`플레이어의 파산으로 게임이 종료되었습니다.`, true); // 자동종료: true
          } else {
            checkDoubleBonusAndEnd(player);
          }
        });
      });
      return;
    }
  }

  // [B] 빈 땅이거나 내 땅인 경우 ➡️ 선플 미션 도전!
  renderCenterActionCard(player, cell, `${cell.name} 상황`, `${cell.name} 플랫폼에 도착했습니다. 미션 상황을 확인합니다.`, () => {
    triggerPlatformMission(player, cell);
  });
}

function renderCenterActionCard(player, cell, buttonText, message, onConfirmClick) {
  const container = document.getElementById('center-action-area');
  if (!container) return;

  let themeClass = 'special-card';
  if (cell.type === 'baemin') themeClass = 'baemin-card';
  if (cell.type === 'youtube') themeClass = 'youtube-card';
  if (cell.type === 'nurizip') themeClass = 'nurizip-card';
  if (cell.type === 'kkaetalk') themeClass = 'kkaetalk-card';
  if (cell.type === 'goldkey') themeClass = 'goldkey-card';

  container.innerHTML = `
    <div class="center-action-card ${themeClass}">
      <p class="center-action-msg"><strong>[${player.name}]</strong> ${message}</p>
      <button class="btn-center-action" id="btn-trigger-popup">${buttonText}</button>
    </div>
  `;

  document.getElementById('btn-trigger-popup').onclick = () => {
    onConfirmClick();
  };
}

function clearCenterActionCard() {
  const container = document.getElementById('center-action-area');
  if (container) container.innerHTML = '';
}

function checkDoubleBonusAndEnd(player) {
  if (player.isBankrupt) return;

  if (player.lastRollWasDouble && !player.isJailed) {
    player.lastRollWasDouble = false; 
    turnMessageEl.innerText = "★더블!★ 한 번 더 굴릴 기회를 얻었습니다!";
    gameState.isRolling = false;
    btnRollDice.disabled = false;
    clearCenterActionCard();
  } else {
    endTurn();
  }
}

// ==========================================================================
// 12. 플랫폼 미션 & 토큰 건설 프로세스
// ==========================================================================
let activePlayer = null;
let activeCell = null;
let secondsLeft = 10;

function triggerPlatformMission(player, cell) {
  activePlayer = player;
  activeCell = cell;

  const config = MISSION_CARDS[cell.type];
  missionPlatformType.innerText = config.name;
  document.getElementById('mission-header-bar').style.backgroundColor = config.color;

  const list = config.list;
  const randomCard = list[Math.floor(Math.random() * list.length)];
  missionTagType.innerText = `[${randomCard.type} 미션]`;
  missionSituationText.innerText = `"${randomCard.text}"`;

  const duration = gameState.settings ? gameState.settings.timerDuration : 10;
  
  if (duration === 0) {
    // 제한시간 없음
    timerBox.classList.add('hidden');
    btnStartTimer.classList.add('hidden');
    missionJudgementButtons.classList.remove('hidden');
  } else {
    timerBox.classList.add('hidden');
    missionJudgementButtons.classList.add('hidden');
    btnStartTimer.classList.remove('hidden');
    timerNum.innerText = duration;
    timerFill.style.width = "100%";
  }

  showModal(missionModal);
}

function startMissionTimer() {
  AudioFX.play('click');
  btnStartTimer.classList.add('hidden');
  timerBox.classList.remove('hidden');
  
  const initialDuration = gameState.settings ? gameState.settings.timerDuration : 10;
  secondsLeft = initialDuration;
  timerNum.innerText = secondsLeft;
  timerFill.style.width = "100%";
  document.querySelector('.timer-circle').classList.remove('active-tick');

  gameState.timerInterval = setInterval(() => {
    secondsLeft--;
    timerNum.innerText = secondsLeft;
    const percentage = Math.max(0, (secondsLeft / initialDuration) * 100);
    timerFill.style.width = `${percentage}%`;

    if (secondsLeft <= 3 && secondsLeft > 0) {
      AudioFX.play('click');
      document.querySelector('.timer-circle').classList.add('active-tick');
    }

    if (secondsLeft <= 0) {
      clearInterval(gameState.timerInterval);
      document.querySelector('.timer-circle').classList.remove('active-tick');
      missionJudgementButtons.classList.remove('hidden');
    }
  }, 1000);
}

function handleMissionFail() {
  AudioFX.play('fail');
  clearInterval(gameState.timerInterval);
  hideModal(missionModal);

  activePlayer.hearts -= 1;
  gameState.campaignFunds += 1;

  showAlertPopup("미션 실패 😢", "선플 수칙을 어겨 벌금으로 **하트칩 1개**를 [선플 캠페인 본부]에 냅니다.", () => {
    renderScoreboard();
    if (activePlayer.hearts <= 0) {
      activePlayer.isBankrupt = true;
      handleGameOver(`플레이어의 파산으로 게임이 종료되었습니다.`, true);
    } else {
      checkDoubleBonusAndEnd(activePlayer);
    }
  });
}

function handleMissionSuccess() {
  AudioFX.play('success');
  clearInterval(gameState.timerInterval);
  hideModal(missionModal);

  document.getElementById('build-player-heart').innerText = activePlayer.hearts;

  const cards = document.querySelectorAll('.build-card');
  cards.forEach(card => {
    card.classList.remove('selected');
    const cost = parseInt(card.dataset.build) * 2;
    if (cost > activePlayer.hearts) {
      card.style.opacity = '0.4';
      card.style.pointerEvents = 'none';
    } else {
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
    }

    card.onclick = () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const tokenCount = parseInt(card.dataset.build);
      executeBuild(tokenCount);
    };
  });

  showModal(buildModal);
}

function executeBuild(count) {
  hideModal(buildModal);
  
  if (count > 0) {
    const cost = count * 2;
    activePlayer.hearts -= cost;
    activePlayer.tokens += count;
    
    activeCell.owner = activePlayer.id;
    activeCell.smileTokens += count;
    
    updateSmileTokensUI(activeCell.id);
    renderScoreboard();
    
    showAlertPopup("건설 완료!", `이 칸에 스마일 토큰 **😊 ${count}개**를 세웠습니다! 이제 이 곳은 당신의 클린 존입니다.`, () => {
      checkDoubleBonusAndEnd(activePlayer);
    });
  } else {
    checkDoubleBonusAndEnd(activePlayer);
  }
}

// ==========================================================================
// 13. 황금열쇠 시스템 (턴교대 도돌이표 차단 검증 완료)
// ==========================================================================
function triggerGoldKey(player) {
  AudioFX.play('goldkey');
  const deck = gameState.difficulty === 'easy' ? GOLDKEY_CARDS.easy : GOLDKEY_CARDS.hard;
  const card = deck[Math.floor(Math.random() * deck.length)];

  goldkeyTitle.innerText = card.title;
  goldkeyDescText.innerText = card.text;
  goldkeyResultText.innerText = `결과: ${card.resultText}`;

  showModal(goldkeyModal);

  document.getElementById('btn-close-goldkey').onclick = () => {
    AudioFX.play('click');
    hideModal(goldkeyModal);
    card.action(player); 
  };
}

function movePlayerEffect(player, steps) {
  if (steps > 0) {
    animatePlayerMovement(player, steps, false);
  } else {
    const totalCells = gameState.boardCells.length;
    let stepCount = 0;
    
    function backStep() {
      if (stepCount < Math.abs(steps)) {
        player.position = (player.position - 1 + totalCells) % totalCells;
        updatePawnPositions();
        stepCount++;
        setTimeout(backStep, 500); 
      } else {
        handleCellLandAction(player, player.position, false);
      }
    }
    backStep();
  }
}

function sendToJailEffect(player) {
  const jailIndex = gameState.difficulty === 'easy' ? 6 : 8;
  player.position = jailIndex;
  player.isJailed = true;
  player.jailTurns = 0;
  updatePawnPositions();
  renderScoreboard();
  endTurn();
}

function forceMoveToCellEffect(player, type) {
  const targetCell = gameState.boardCells.find(c => c.type === type);
  if (targetCell) {
    player.position = targetCell.id;
    updatePawnPositions();
    
    setTimeout(() => {
      handleCellLandAction(player, targetCell.id, false);
    }, 500);
  }
}

function modifyCouponEffect(player, amount) {
  player.tickets = Math.max(0, player.tickets + amount);
  renderScoreboard();
  endTurn();
}

function modifyHeartsEffect(player, amount) {
  player.hearts += amount;
  renderScoreboard();
  if (player.hearts <= 0) {
    player.isBankrupt = true;
    handleGameOver(`플레이어의 파산으로 게임이 종료되었습니다.`, true);
  } else {
    endTurn();
  }
}

function payFineEffect(player, amount) {
  const actualFine = Math.min(player.hearts, amount);
  player.hearts -= actualFine;
  gameState.campaignFunds += actualFine;
  
  renderScoreboard();
  updateHQFundsUI();

  if (player.hearts <= 0) {
    player.isBankrupt = true;
    handleGameOver(`플레이어의 파산으로 게임이 종료되었습니다.`, true);
  } else {
    endTurn();
  }
}

function buildRandomTokenEffect(player) {
  const emptyCells = gameState.boardCells.filter(c => !c.isCorner && c.type !== 'goldkey' && c.owner === null);
  
  if (emptyCells.length > 0) {
    const targetCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    targetCell.owner = player.id;
    targetCell.smileTokens = 1;
    player.tokens += 1;
    
    updateSmileTokensUI(targetCell.id);
    renderScoreboard();
    
    showAlertPopup("토큰 선물!", `행운이 따르네요! 주인 없는 **[${targetCell.name}]**에 스마일 토큰이 세워졌습니다!`, () => {
      endTurn();
    });
  } else {
    showAlertPopup("효과 무효", "현재 판 위에 빈 플랫폼이 없어 스마일 토큰을 새로 세울 수 없습니다.", () => {
      endTurn();
    });
  }
}

function removeRandomTokenEffect(player) {
  const ownedCells = gameState.boardCells.filter(c => c.owner === player.id && c.smileTokens > 0);
  
  if (ownedCells.length > 0) {
    const targetCell = ownedCells[Math.floor(Math.random() * ownedCells.length)];
    targetCell.smileTokens -= 1;
    player.tokens -= 1;
    
    if (targetCell.smileTokens === 0) {
      targetCell.owner = null; 
    }
    
    updateSmileTokensUI(targetCell.id);
    renderScoreboard();
    
    showAlertPopup("토큰 압수 😢", `안타깝습니다! **[${targetCell.name}]**의 스마일 토큰 1개가 사라졌습니다.`, () => {
      endTurn();
    });
  } else {
    showAlertPopup("효과 무효", "회수할 수 있는 본인 소유의 스마일 토큰이 없습니다.", () => {
      endTurn();
    });
  }
}

// ==========================================================================
// 14. 감옥 (사이버 수사대) 의사결정 프로세스
// ==========================================================================
let jailActivePlayer = null;

function showJailDecisionModal(player) {
  jailActivePlayer = player;
  jailPlayerTicketCount.innerText = player.tickets;
  showModal(jailModal);
}

function handleJailUseTicket() {
  hideModal(jailModal);
  
  jailActivePlayer.tickets -= 1;
  jailActivePlayer.isJailed = false;
  jailActivePlayer.jailTurns = 0;
  
  renderScoreboard();
  showAlertPopup("탈출 성공!", "탈출 쿠폰을 사용하여 무사히 조사실을 나왔습니다. 주사위를 던져 전진해 주세요!", () => {
    gameState.isRolling = false;
    btnRollDice.disabled = false;
    turnMessageEl.innerText = `${jailActivePlayer.name}님, 주사위를 굴려주세요.`;
  });
}

function handleJailNoTicket() {
  hideModal(jailModal);
  
  gameState.isRolling = false;
  btnRollDice.disabled = false;
  turnMessageEl.innerText = "더블이 나오길 기대하며 주사위를 굴려주세요!";
}

// ==========================================================================
// 15. 우주여행 (알고리즘 떡상) 순간이동 처리 (떡상 턴 꼬임 완벽 방어)
// ==========================================================================
function highlightTeleportTargets(currentPos) {
  gameState.boardCells.forEach(cell => {
    // 1) 본인 떡상 칸 제외
    if (cell.id === currentPos) return;

    // 2) 일반 플랫폼 칸 하이라이트
    if (!cell.isCorner) {
      const cellDiv = document.getElementById(`cell-${cell.id}`);
      if (cellDiv) cellDiv.classList.add('teleport-target');
    }
    
    // 3) [피드백]: 로그인, 수사대, 본부 3개 특수 칸도 이동 대상에 포함
    if (cell.isCorner && cell.type !== 'travel') {
      const cellDiv = document.getElementById(`cell-${cell.id}`);
      if (cellDiv) cellDiv.classList.add('teleport-target');
    }
  });
}

function clearTeleportHighlights() {
  document.querySelectorAll('.board-cell').forEach(cellDiv => {
    cellDiv.classList.remove('teleport-target');
  });
}

function handleTeleportToCell(cellId) {
  const currentPlayer = gameState.players[gameState.currentPlayerIdx];
  
  // 떡상 상태 플래그 해제
  currentPlayer.isWaitingTeleport = false;
  gameState.teleportMode = false;
  clearTeleportHighlights();
  document.getElementById('teleport-banner').style.display = 'none';

  // 실제 선택한 칸으로 이동
  currentPlayer.position = cellId;
  updatePawnPositions();

  // 도착한 칸 액션 즉각 실행
  setTimeout(() => {
    handleCellLandAction(currentPlayer, cellId, false);
  }, 300);
}

// ==========================================================================
// 16. 게임 종료 & 랭킹 시스템 (파산 시 계속진행 아니오 버튼 차단)
// ==========================================================================
function checkGameOverCondition() {
  const bankruptPlayer = gameState.players.find(p => p.hearts <= 0);
  if (bankruptPlayer) {
    bankruptPlayer.isBankrupt = true;
    handleGameOver(`플레이어의 파산(하트칩 0개)으로 게임이 종료되었습니다.`, true); // 자동 종료
    return true;
  }
  return false;
}

function triggerManualQuit() {
  calculateRankings();
  gameoverReasonText.innerText = "중도 종료 버튼이 클릭되어 게임이 중단되었습니다.";
  handleGameOver("중도 종료 버튼이 클릭되어 게임이 중단되었습니다.", false); // 수동 종료
}

// 파산 종료와 수동 종료 분기 (피드백 반영)
function handleGameOver(reason, isAutomatic) {
  AudioFX.play('win');
  calculateRankings();
  gameoverReasonText.innerText = reason;
  
  const btnNo = document.getElementById('btn-gameover-no');
  if (btnNo) {
    if (isAutomatic) {
      // 파산 자동 종료 시에는 '아니오' 버튼을 완전히 숨겨 홈 복귀만 가능하게 강제
      btnNo.style.display = 'none';
    } else {
      // 수동 종료일 때는 계속 플레이 가능하도록 살려둠
      btnNo.style.display = 'block';
    }
  }
  
  showModal(gameoverModal);
}

function calculateRankings() {
  rankingListContainer.innerHTML = '';

  const sorted = [...gameState.players].sort((a, b) => {
    if (b.tokens !== a.tokens) {
      return b.tokens - a.tokens;
    }
    return b.hearts - a.hearts;
  });

  let rank = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (curr.tokens !== prev.tokens || curr.hearts !== prev.hearts) {
        rank = i + 1;
      }
    }
    
    const item = document.createElement('div');
    item.className = `ranking-item ${rank === 1 ? 'rank-1' : ''}`;
    item.innerHTML = `
      <div class="rank-badge">
        <span>🏆 ${rank}등</span>
        <span class="pawn-indicator" style="background-color: ${sorted[i].color};">💬</span>
        <span>${sorted[i].name}</span>
      </div>
      <div class="rank-stats">
        😊 토큰 ${sorted[i].tokens}개 / ❤️ 하트칩 ${sorted[i].hearts}개
      </div>
    `;
    rankingListContainer.appendChild(item);
  }
}

function resetToSetup() {
  hideModal(gameoverModal);
  gameScreen.classList.remove('active');
  setupScreen.classList.add('active');
}

// ==========================================================================
// 17. 팝업 / 알림창 유틸리티
// ==========================================================================
function showModal(modalEl) {
  modalEl.classList.add('active');
}

function hideModal(modalEl) {
  modalEl.classList.remove('active');
}

function showAlertPopup(title, message, onConfirm) {
  const alertOverlay = document.createElement('div');
  alertOverlay.className = 'modal-overlay active';
  alertOverlay.style.zIndex = '200'; 

  alertOverlay.innerHTML = `
    <div class="modal-content" style="text-align: center; max-width: 420px; border-top: 5px solid var(--color-baemin);">
      <h2 style="font-family: var(--font-family-title); margin-bottom: 15px;">${title}</h2>
      <p style="font-size: 1rem; line-height: 1.5; color: var(--text-dark); margin-bottom: 25px;">${message}</p>
      <button class="btn-primary-large" style="padding: 12px 0;">확인</button>
    </div>
  `;

  document.body.appendChild(alertOverlay);

  const confirmBtn = alertOverlay.querySelector('button');
  confirmBtn.focus();
  confirmBtn.onclick = () => {
    document.body.removeChild(alertOverlay);
    if (onConfirm) onConfirm();
  };
}
