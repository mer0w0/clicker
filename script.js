let score = 0;
let clickPower = 1;
let autoPower = 0;

let clickCost = 10;
let autoCost = 15;

// --- 保存・読み込み ---
function loadData() {
  const saved = JSON.parse(localStorage.getItem("saveData"));
  if (saved) {
    score = saved.score || 0;
    clickPower = saved.clickPower || 1;
    autoPower = saved.autoPower || 0;
    clickCost = saved.clickCost || 10;
    autoCost = saved.autoCost || 15;
  }
}
function saveData() {
  localStorage.setItem("saveData", JSON.stringify({
    score, clickPower, autoPower, clickCost, autoCost
  }));
}

// --- UI更新 ---
function updateScore() {
  scoreElement.textContent = score;
  popupScore.textContent = score;
  document.getElementById("clickCost").textContent = clickCost;
  document.getElementById("autoCost").textContent = autoCost;
  saveData();
}

// --- ポップアップ操作 ---
function closeStore() {
  storePopup.classList.add("hidden");
}
function closeYoutubePopup() {
  youtubePopup.classList.add("hidden");
  youtubeFrame.src = "";
}

// --- アップグレード購入 ---
function buyClickUpgrade() {
  if (score >= clickCost) {
    score -= clickCost;
    clickPower += 1;
    clickCost = Math.ceil(clickCost * 1.2);
    updateScore();
    alert("クリック強化したよ！");
  } else {
    alert("足りないよ！");
  }
}
function buyAutoClick() {
  if (score >= autoCost) {
    score -= autoCost;
    autoPower += 1;
    autoCost = Math.ceil(autoCost * 1.2);
    updateScore();
    alert("自動クリック強化したよ！");
  } else {
    alert("足りないよ！");
  }
}

// --- 一気に買う ---
function buyMaxClickUpgrade() {
  let bought = 0;
  while (score >= clickCost) {
    score -= clickCost;
    clickPower += 1;
    clickCost = Math.ceil(clickCost * 1.2);
    bought++;
  }
  if (bought > 0) {
    alert(`クリック強化を${bought}回買った！`);
    updateScore();
  } else {
    alert("足りないよ！");
  }
}
function buyMaxAutoClick() {
  let bought = 0;
  while (score >= autoCost) {
    score -= autoCost;
    autoPower += 1;
    autoCost = Math.ceil(autoCost * 1.2);
    bought++;
  }
  if (bought > 0) {
    alert(`自動クリックを${bought}回買った！`);
    updateScore();
  } else {
    alert("足りないよ！");
  }
}

// --- クリック処理 ---
const scoreElement = document.getElementById("score");
const popupScore = document.getElementById("popupScore");
const clickImage = document.getElementById("clickImage");
const storePopup = document.getElementById("storePopup");
const youtubePopup = document.getElementById("youtubePopup");
const youtubeInput = document.getElementById("youtubeInput");
const youtubeFrame = document.getElementById("youtubeFrame");

clickImage.addEventListener("click", (e) => {
  score += clickPower;
  updateScore();
  createEffect(e.clientX, e.clientY);
});

// --- ストアボタン ---
document.getElementById("storeBtn").addEventListener("click", () => {
  popupScore.textContent = score;
  storePopup.classList.remove("hidden");
});

// --- 自動加算 ---
setInterval(() => {
  if (autoPower > 0) {
    score += autoPower;
    updateScore();
  }
}, 1000);

// --- 効果表示 ---
function createEffect(x, y) {
  const effect = document.createElement("div");
  effect.className = "effect";
  effect.textContent = `+${clickPower}`;
  effect.style.left = `${x - 10}px`;
  effect.style.top = `${y - 20}px`;
  document.body.appendChild(effect);
  setTimeout(() => effect.remove(), 800);
}

// --- YouTubeポップアップ表示 ---
document.getElementById("youtubeBtn").addEventListener("click", () => {
  youtubePopup.classList.remove("hidden");
});

// めろチョイスの動画IDリスト（例）
const randomVideos = [
  "bncdfyVBmI8",
  "RyRfLSOewbU",
  "emrt46SRyYs",
  "5EpCqR49sEg",
  "nQo7HuO355w"
];

// --- YouTube動画読み込み ---
function loadYoutubeVideo() {
  let url = youtubeInput.value.trim();
  let videoId = "";

  if (url === "") {
    // 空ならランダムに選ぶ
    const randomIndex = Math.floor(Math.random() * randomVideos.length);
    videoId = randomVideos[randomIndex];
  } else {
    // URLから動画ID抽出（v= や youtu.be に対応）
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (match) {
      videoId = match[1];
    } else {
      alert("URLが正しくないよ！");
      return;
    }
  }
  youtubeFrame.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
}

let googlePopupVisible = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if (!googlePopupVisible) {
      const popup = document.createElement("div");
      popup.id = "googlePopup";
      popup.style.position = "fixed";
      popup.style.top = "0";
      popup.style.left = "0";
      popup.style.width = "100vw";
      popup.style.height = "100vh";
      popup.style.backgroundColor = "white";
      popup.style.zIndex = "10000";
      popup.style.display = "flex";
      popup.style.justifyContent = "center";
      popup.style.alignItems = "center";
      popup.style.overflow = "hidden";

      const img = document.createElement("img");
      img.src = "./images/yahoo_home.png"; // ←必要ならここを変えてね
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover"; // 画面にピッタリ収まるように拡大縮小
      popup.appendChild(img);

      document.body.appendChild(popup);
      googlePopupVisible = true;
    } else {
      const popup = document.getElementById("googlePopup");
      if (popup) popup.remove();
      googlePopupVisible = false;
    }
  }
});

// --- ページ読み込み時に保存データを読み込む ---
window.addEventListener("load", () => {
  loadData();
  updateScore();
});

