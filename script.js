const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ethosLogo = new Image();
ethosLogo.src = "assets/logo.png";

const bgm = new Audio("assets/ethos-bgm.mp3");
bgm.loop = true;
bgm.volume = 0.5;

let items = [];
let score = 0;
let gameOver = false;

function spawnItem() {
  const isBomb = Math.random() < 0.3;
  items.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 32,
    height: 32,
    isBomb: isBomb,
    speed: 2 + Math.random() * 2
  });
}

function drawItem(item) {
  if (item.isBomb) {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(item.x + 16, item.y + 16, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "20px monospace";
    ctx.fillText("X", item.x + 9, item.y + 23);
  } else {
    if (ethosLogo.complete) {
      ctx.drawImage(ethosLogo, item.x, item.y, item.width, item.height);
    } else {
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(item.x, item.y, item.width, item.height);
    }
  }
}

canvas.addEventListener("click", (e) => {
  if (bgm.paused) bgm.play();
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (
      clickX >= item.x &&
      clickX <= item.x + item.width &&
      clickY >= item.y &&
      clickY <= item.y + item.height
    ) {
      if (item.isBomb) {
        document.getElementById("message").innerText = "💥 You tapped a bomb! Game Over.";
        gameOver = true;
        return;
      } else {
        score++;
        document.getElementById("score").innerText = "Score: " + score;
        items.splice(i, 1);
        return;
      }
    }
  }
});

canvas.addEventListener("touchstart", (e) => {
  if (bgm.paused) bgm.play();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const event = new MouseEvent("click", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(event);
}, { passive: false });

document.getElementById("muteBtn").addEventListener("click", () => {
  bgm.muted = !bgm.muted;
  document.getElementById("muteBtn").innerText = bgm.muted ? "🔇" : "🔊";
});

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  items.forEach(item => {
    item.y += item.speed;
    drawItem(item);
  });

  items = items.filter(item => item.y < canvas.height + 40);

  if (Math.random() < 0.02) {
    spawnItem();
  }

  requestAnimationFrame(update);
}

ethosLogo.onload = () => update();
