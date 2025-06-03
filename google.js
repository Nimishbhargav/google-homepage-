// ========== Typewriter Effect ==========
const typewriterEl = document.getElementById('typewriter');
const words = [
  "Welcome to your Custom Galaxy Homepage",
  "Search anything with Google",
  "Enjoy the galaxy vibes ✨"
];
let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingSpeed = 120;   // slower typing speed
const deletingSpeed = 80;  // slower deleting speed
const pauseTime = 1500;    // pause before deleting or next word

function typeLoop() {
  const currentWord = words[currentWordIndex];
  if (!isDeleting) {
    typewriterEl.textContent = currentWord.slice(0, currentCharIndex + 1);
    currentCharIndex++;
    if (currentCharIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeLoop, pauseTime);
      return;
    }
  } else {
    typewriterEl.textContent = currentWord.slice(0, currentCharIndex - 1);
    currentCharIndex--;
    if (currentCharIndex === 0) {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % words.length;
      setTimeout(typeLoop, 500);
      return;
    }
  }
  setTimeout(typeLoop, isDeleting ? deletingSpeed : typingSpeed);
}

typeLoop();

// ========== Dark Mode Toggle ==========
const darkToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

function applyDarkMode(isDark) {
  if (isDark) {
    body.classList.add('dark');
    localStorage.setItem('darkMode', 'enabled');
  } else {
    body.classList.remove('dark');
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Load dark mode preference
applyDarkMode(localStorage.getItem('darkMode') === 'enabled');

darkToggle.addEventListener('click', () => {
  applyDarkMode(!body.classList.contains('dark'));
});

// ========== Microphone Voice Search ==========
const micBtn = document.getElementById('mic-btn');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('search-form');

micBtn.addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Sorry, your browser doesn't support voice recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onstart = () => {
    micBtn.textContent = "🎙️";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    form.submit();
  };

  recognition.onerror = (event) => {
    alert("Error during speech recognition: " + event.error);
  };

  recognition.onend = () => {
    micBtn.textContent = "🎤";
  };
});

// ========== Save/Restore Search Input ==========
searchInput.addEventListener('input', () => {
  sessionStorage.setItem('lastSearch', searchInput.value);
});

window.addEventListener('load', () => {
  const lastSearch = sessionStorage.getItem('lastSearch');
  if (lastSearch) {
    searchInput.value = lastSearch;
  }
});
// ======= Galaxy revolving stars =======

const starOrbits = document.getElementById('star-orbits');
const numStars = 60; // number of stars

function createStar(index) {
  const star = document.createElement('div');
  star.classList.add('star');

  // Random orbit radius (distance from center)
  const radius = 50 + Math.random() * 250; // 50px to 300px

  // Random speed (in degrees per second)
  const speed = 5 + Math.random() * 15; // 5 to 20 degrees/sec

  // Random initial angle
  let angle = Math.random() * 360;

  // Attach custom properties to the star element
  star.dataset.radius = radius;
  star.dataset.speed = speed;
  star.dataset.angle = angle;

  // Initial position
  updateStarPosition(star);

  starOrbits.appendChild(star);
  return star;
}

function updateStarPosition(star) {
  const radius = +star.dataset.radius;
  const angle = +star.dataset.angle;

  // Convert angle to radians
  const rad = (angle * Math.PI) / 180;

  // Calculate x,y relative to center (50% 50%)
  const x = radius * Math.cos(rad);
  const y = radius * Math.sin(rad);

  star.style.transform = `translate(${x}px, ${y}px)`;
}

// Create stars once
const stars = [];
for (let i = 0; i < numStars; i++) {
  stars.push(createStar(i));
}

// Animate stars
function animateStars(timestamp) {
  stars.forEach(star => {
    let angle = +star.dataset.angle;
    const speed = +star.dataset.speed;
    angle += speed * 0.016; // approx 60fps (16ms/frame)
    if (angle >= 360) angle -= 360;
    star.dataset.angle = angle;
    updateStarPosition(star);
  });

  requestAnimationFrame(animateStars);
}

requestAnimationFrame(animateStars);
