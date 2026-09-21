class PortfolioCarousel {
  constructor(root) {
    this.root = root;
    this.image = root.querySelector(".stage-image");
    this.count = root.querySelector(".stage-count");
    this.thumbnails = [...root.querySelectorAll(".thumbnail")];
    this.intervalMs = Number(root.dataset.interval) || 3000;
    this.index = Math.max(0, this.thumbnails.findIndex((item) => item.classList.contains("is-active")));
    this.timerId = null;
    this.isPaused = false;
    this.isVisible = false;

    this.root.style.setProperty("--thumb-count", this.thumbnails.length);
    this.bindEvents();
    this.observeVisibility();
    this.applyImageMode();
  }

  bindEvents() {
    this.thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        this.show(index);
        this.restart();
      });
    });

    this.image.addEventListener("load", () => this.applyImageMode());

    this.root.addEventListener("mouseenter", () => this.pause());
    this.root.addEventListener("mouseleave", () => this.resume());
    this.root.addEventListener("focusin", () => this.pause());
    this.root.addEventListener("focusout", (event) => {
      if (!this.root.contains(event.relatedTarget)) this.resume();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stop();
      else this.resume();
    });
  }

  observeVisibility() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.isVisible = entry.isIntersecting && entry.intersectionRatio > 0.25;
        if (this.isVisible) this.start();
        else this.stop();
      });
    }, { threshold: [0, 0.25, 0.6] });

    observer.observe(this.root);
  }

  applyImageMode() {
    const isPortrait = this.image.naturalHeight > this.image.naturalWidth;
    this.image.classList.toggle("is-portrait", isPortrait);
  }

  show(index) {
    const nextIndex = (index + this.thumbnails.length) % this.thumbnails.length;
    const thumbnail = this.thumbnails[nextIndex];

    if (nextIndex === this.index && this.image.src.endsWith(thumbnail.dataset.src)) return;

    this.image.classList.add("is-changing");
    window.setTimeout(() => {
      this.index = nextIndex;
      this.image.src = thumbnail.dataset.src;
      this.image.alt = thumbnail.dataset.alt || "作品畫面";
      this.thumbnails.forEach((item, itemIndex) => {
        const active = itemIndex === this.index;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-current", active ? "true" : "false");
      });
      this.count.textContent = `${String(this.index + 1).padStart(2, "0")} / ${String(this.thumbnails.length).padStart(2, "0")}`;
      requestAnimationFrame(() => this.image.classList.remove("is-changing"));
    }, 190);
  }

  next() {
    this.show(this.index + 1);
  }

  start() {
    if (this.timerId || this.isPaused || !this.isVisible || document.hidden) return;
    this.root.classList.add("is-playing");
    this.timerId = window.setInterval(() => this.next(), this.intervalMs);
  }

  stop() {
    if (this.timerId) window.clearInterval(this.timerId);
    this.timerId = null;
    this.root.classList.remove("is-playing");
  }

  pause() {
    this.isPaused = true;
    this.stop();
  }

  resume() {
    this.isPaused = false;
    this.start();
  }

  restart() {
    this.stop();
    this.isPaused = false;
    this.start();
  }
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => new PortfolioCarousel(carousel));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const projects = [...document.querySelectorAll(".project")];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-42% 0px -48% 0px", threshold: 0 });

projects.forEach((project) => sectionObserver.observe(project));

const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector(".mobile-nav");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  mobileNav.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
