const galleries = {
  street: {
    index: "01",
    title: "日常街拍",
    folder: "street",
    prefix: "street",
    count: 12,
  },
  film: {
    index: "02",
    title: "底片",
    folder: "film",
    prefix: "film",
    count: 5,
  },
  chenglong: {
    index: "03",
    title: "成龍溼地藝術季",
    folder: "chenglong",
    prefix: "chenglong",
    count: 12,
  },
  tuku: {
    index: "04",
    title: "土庫在地店家宣傳",
    folder: "tuku",
    prefix: "tuku",
    count: 11,
  },
};

const tabs = [...document.querySelectorAll(".photo-tab")];
const galleryElement = document.querySelector("#photo-gallery");
const titleElement = document.querySelector("#gallery-title");
const indexElement = document.querySelector("#gallery-index");
const countElement = document.querySelector("#gallery-count");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderGallery(key, shouldScroll = false) {
  const gallery = galleries[key];
  if (!gallery) return;

  const fragment = document.createDocumentFragment();
  for (let number = 1; number <= gallery.count; number += 1) {
    const paddedNumber = String(number).padStart(2, "0");
    const figure = document.createElement("figure");
    const frame = document.createElement("div");
    const image = document.createElement("img");
    const label = document.createElement("span");

    figure.className = "photo-item";
    figure.style.animationDelay = `${Math.min((number - 1) * 55, 330)}ms`;
    frame.className = "photo-frame";
    image.src = `assets/photography/${gallery.folder}/${gallery.prefix}-${paddedNumber}.jpg`;
    image.alt = `${gallery.title}攝影作品 ${number}`;
    image.decoding = "async";
    image.loading = number === 1 ? "eager" : "lazy";
    label.className = "photo-number";
    label.textContent = `${paddedNumber} / ${String(gallery.count).padStart(2, "0")}`;

    frame.append(image, label);
    figure.append(frame);
    fragment.append(figure);
  }

  galleryElement.replaceChildren(fragment);
  titleElement.textContent = gallery.title;
  indexElement.textContent = `PROJECT ${gallery.index}`;
  countElement.textContent = `${String(gallery.count).padStart(2, "0")} PHOTOS`;

  tabs.forEach((tab) => {
    const isActive = tab.dataset.gallery === key;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  if (shouldScroll) {
    document.querySelector(".photo-gallery-section").scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => renderGallery(tab.dataset.gallery, true));
});

renderGallery("street");
