const introOverlay = document.querySelector("#intro-overlay");
const introVideo = document.querySelector("#intro-video");
const introStart = document.querySelector("#intro-start");
const introHint = document.querySelector("#intro-hint");
const introSkip = document.querySelector("#intro-skip");
const appShell = document.querySelector("#app-shell");
const backgroundMusic = document.querySelector("#background-music");
const musicToggle = document.querySelector("#music-toggle");

const MUSIC_VOLUME = 0.12;
const MUSIC_FADE_MS = 2600;

let gameStarted = false;
let musicEnabled = true;
let fadeFrame = 0;

function setMusicButtonState() {
  musicToggle.textContent = musicEnabled ? "♫ Música: ON" : "♫ Música: OFF";
  musicToggle.setAttribute("aria-pressed", String(musicEnabled));
  musicToggle.setAttribute(
    "aria-label",
    musicEnabled ? "Desactivar música" : "Activar música"
  );
}

function fadeMusicIn() {
  cancelAnimationFrame(fadeFrame);

  if (!musicEnabled) {
    backgroundMusic.volume = 0;
    return;
  }

  const startedAt = performance.now();
  backgroundMusic.volume = 0;

  const step = (now) => {
    const progress = Math.min(1, (now - startedAt) / MUSIC_FADE_MS);
    backgroundMusic.volume = MUSIC_VOLUME * progress;

    if (progress < 1 && musicEnabled) {
      fadeFrame = requestAnimationFrame(step);
    }
  };

  fadeFrame = requestAnimationFrame(step);
}

async function primeBackgroundMusic() {
  try {
    backgroundMusic.muted = true;
    backgroundMusic.volume = 0;
    await backgroundMusic.play();
  } catch {
    // El juego puede continuar aunque el navegador no prepare el audio.
  }
}

async function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  introVideo.pause();
  introOverlay.classList.add("intro-overlay--leaving");

  appShell.classList.remove("app-shell--waiting");
  appShell.setAttribute("aria-hidden", "false");
  musicToggle.hidden = false;

  try {
    backgroundMusic.currentTime = 0;
    backgroundMusic.muted = false;

    if (musicEnabled) {
      await backgroundMusic.play();
      fadeMusicIn();
    }
  } catch {
    musicEnabled = false;
    setMusicButtonState();
  }

  await import("./main.js");

  window.setTimeout(() => {
    introOverlay.remove();
  }, 520);
}

introStart.addEventListener("click", async () => {
  introStart.disabled = true;
  introHint.textContent = "Preparando tu jardín…";

  await primeBackgroundMusic();

  introVideo.currentTime = 0;
  introVideo.muted = false;
  introVideo.volume = 1;

  try {
    await introVideo.play();
    introStart.hidden = true;
    introHint.hidden = true;
    introSkip.hidden = false;
  } catch {
    await startGame();
  }
});

introVideo.addEventListener("ended", startGame);
introVideo.addEventListener("error", startGame);
introSkip.addEventListener("click", startGame);

musicToggle.addEventListener("click", async () => {
  musicEnabled = !musicEnabled;
  cancelAnimationFrame(fadeFrame);

  if (musicEnabled) {
    backgroundMusic.muted = false;
    backgroundMusic.volume = MUSIC_VOLUME;

    try {
      await backgroundMusic.play();
    } catch {
      musicEnabled = false;
    }
  } else {
    backgroundMusic.pause();
  }

  setMusicButtonState();
});

setMusicButtonState();
