const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const revealItems = document.querySelectorAll('.reveal');
const toTopButton = document.querySelector('.to-top');
const themeToggle = document.getElementById('theme-toggle');
const accordionItems = document.querySelectorAll('[data-accordion-item]');

const words = [
  'qualité',
  'logistique',
  'performance industrielle',
  'organisation',
  'pilotage des flux',
  'amélioration continue'
];

const animatedWord = document.getElementById('animated-word');
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const applyTheme = (theme) => {
  document.body.setAttribute('data-theme', theme);
  if (!themeToggle) return;

  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'
  );
};

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light');


const closeAccordionItem = (item) => {
  const trigger = item.querySelector('.sae-trigger');
  const panel = item.querySelector('.sae-panel');
  if (!trigger || !panel) return;

  trigger.setAttribute('aria-expanded', 'false');
  panel.style.maxHeight = `${panel.scrollHeight}px`;

  requestAnimationFrame(() => {
    panel.style.maxHeight = '0px';
    panel.classList.remove('is-open');
  });

  window.setTimeout(() => {
    if (trigger.getAttribute('aria-expanded') === 'false') {
      panel.hidden = true;
      panel.style.maxHeight = '';
    }
  }, 360);
};

const openAccordionItem = (item) => {
  const trigger = item.querySelector('.sae-trigger');
  const panel = item.querySelector('.sae-panel');
  if (!trigger || !panel) return;

  panel.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  panel.classList.add('is-open');
  panel.style.maxHeight = `${panel.scrollHeight}px`;
};

accordionItems.forEach((item) => {
  const trigger = item.querySelector('.sae-trigger');
  const panel = item.querySelector('.sae-panel');
  if (!trigger || !panel) return;

  panel.hidden = true;

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    accordionItems.forEach((otherItem) => {
      if (otherItem !== item) closeAccordionItem(otherItem);
    });

    if (isOpen) {
      closeAccordionItem(item);
    } else {
      openAccordionItem(item);
    }
  });
});

const runWordSlider = () => {
  if (!animatedWord) return;

  const currentWord = words[wordIndex];

  if (!deleting) {
    charIndex += 1;
    animatedWord.textContent = currentWord.slice(0, charIndex);

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(runWordSlider, 1300);
      return;
    }
  } else {
    charIndex -= 1;
    animatedWord.textContent = currentWord.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(runWordSlider, deleting ? 45 : 85);
};

navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

themeToggle?.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', () => navLinks.classList.remove('open'));
});

const setActiveLink = () => {
  const y = window.scrollY + 140;

  navAnchors.forEach((anchor) => {
    const section = document.querySelector(anchor.getAttribute('href'));
    if (!section) return;

    const top = section.offsetTop;
    const height = section.offsetHeight;
    anchor.classList.toggle('active', y >= top && y < top + height);
  });
};

const revealOnScroll = () => {
  revealItems.forEach((item) => {
    if (item.getBoundingClientRect().top < window.innerHeight - 80) {
      item.classList.add('visible');
    }
  });
};

window.addEventListener('resize', () => {
  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.sae-trigger');
    const panel = item.querySelector('.sae-panel');
    if (!trigger || !panel) return;

    if (trigger.getAttribute('aria-expanded') === 'true') {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });
});

window.addEventListener('scroll', () => {
  setActiveLink();
  revealOnScroll();
  toTopButton?.classList.toggle('show', window.scrollY > 320);
});

toTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = 'Message envoyé ✓';
  button.disabled = true;
});

runWordSlider();
setActiveLink();
revealOnScroll();
