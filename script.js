document.addEventListener("DOMContentLoaded", () => {

  const loadingScreen = document.getElementById("loadingScreen");
  const app = document.querySelector(".overlay");

  const slides = document.querySelectorAll(".slide");
  const openBtn = document.getElementById("openBtn");
  const backBtn = document.getElementById("backBtn");
  const nextBtn = document.getElementById("nextBtn");
  const introClick = document.getElementById("introClick");

  let currentSlide = 0;

  const audio = new Audio();
  const clickSound = new Audio("music/click.mp3");
  clickSound.volume = 0.5;

  const songs = [
    { title: "♫ Overjoyed", file: "music/song1.mp3" },
    { title: "♫ Name", file: "music/song2.mp3" },
    { title: "♫ Faithfully", file: "music/song3.mp3" },
    { title: "♫ I'll Be", file: "music/song4.mp3" },
    { title: "♫ 3 AM", file: "music/song5.mp3" }
  ];

  slides.forEach(slide => {
    if (slide.classList.contains("player")) {
      slide.innerHTML = `
        <div class="player-content">
          <img class="disc" src="images/cd.png">
          <p class="song-title"></p>
          <div class="song-controls">
            <img src="images/song-back.png" class="song-btn song-prev">
            <img src="images/play.png" class="song-btn play-btn">
            <img src="images/song-next.png" class="song-btn song-next">
          </div>
        </div>
      `;
    }
  });

  function showSlide(index) {
    audio.pause();
    audio.currentTime = 0;

    document.querySelectorAll(".disc").forEach(d =>
      d.classList.remove("spinning")
    );

    document.querySelectorAll(".play-btn").forEach(btn =>
      btn.src = "images/play.png"
    );

    slides.forEach(s => s.classList.remove("active"));
    slides[index].classList.add("active");

    currentSlide = index;
    loadSong(index);
    updateButtons();
  }

  function loadSong(index) {
    const slide = slides[index];
    if (!slide.classList.contains("player")) return;

    const songIndex = parseInt(slide.dataset.song);
    audio.src = songs[songIndex].file;

    slide.querySelector(".song-title").textContent =
      songs[songIndex].title;
  }

  document.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  });

  document.addEventListener("click", e => {

    const activeSlide = slides[currentSlide];

    if (activeSlide.classList.contains("player")) {

      const songIndex = parseInt(activeSlide.dataset.song);

      if (e.target.classList.contains("play-btn")) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      }

      if (e.target.classList.contains("song-prev")) {
        if (currentSlide > 0) showSlide(currentSlide - 1);
      }

      if (e.target.classList.contains("song-next")) {
        if (currentSlide < slides.length - 1)
          showSlide(currentSlide + 1);
      }

      if (songIndex === 1) {
        const disc = activeSlide.querySelector(".disc");
        if (disc) {
          const rect = disc.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) +
            Math.pow(e.clientY - centerY, 2)
          );

          if (distance < rect.width * 0.15) {
            showHiddenMessage();
          }
        }
      }
    }
  });

  function showHiddenMessage() {
    const message = document.createElement("div");
    message.className = "secret-message";
    message.textContent = "You’re like a poem I wish I wrote.";

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.opacity = "1";
    }, 10);

    message.addEventListener("click", () => {
      message.style.opacity = "0";
      setTimeout(() => {
        message.remove();
      }, 500);
    });
  }

  audio.addEventListener("play", () => {
    const activeSlide = slides[currentSlide];
    if (!activeSlide.classList.contains("player")) return;

    const disc = activeSlide.querySelector(".disc");
    const btn = activeSlide.querySelector(".play-btn");

    disc.classList.add("spinning");
    btn.src = "images/pause.png";
  });

  audio.addEventListener("pause", () => {
    const activeSlide = slides[currentSlide];
    if (!activeSlide.classList.contains("player")) return;

    const disc = activeSlide.querySelector(".disc");
    const btn = activeSlide.querySelector(".play-btn");

    disc.classList.remove("spinning");
    btn.src = "images/play.png";
  });

  audio.addEventListener("ended", () => {
    audio.pause();
  });

  introClick?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  backBtn.addEventListener("click", () => {
    if (currentSlide > 0)
      showSlide(currentSlide - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1)
      showSlide(currentSlide + 1);
  });

  openBtn.addEventListener("click", () => {
    showSlide(2);
  });

  function updateButtons() {
    openBtn.style.display = "none";
    backBtn.style.display = "none";
    nextBtn.style.display = "none";

    if (currentSlide === 1) {
      openBtn.style.display = "block";
      return;
    }

    if (currentSlide > 1) {
      backBtn.style.display = "block";
    }

    if (currentSlide > 1 && currentSlide < slides.length - 1) {
      nextBtn.style.display = "block";
    }
  }

  showSlide(0);

  setTimeout(() => {
    loadingScreen.style.transition = "opacity 0.6s ease";
    loadingScreen.style.opacity = "0";

    setTimeout(() => {
      loadingScreen.style.display = "none";
      app.style.display = "flex";
    }, 600);

  }, 1200);

});
