// ─── Clock ────────────────────────────────────────────

let currentDay = null;

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("clock-main").textContent = `${h}:${m}`;
  document.getElementById("clock-seconds").textContent = `:${s}`;

  if (now.getDate() !== currentDay) {
    currentDay = now.getDate();
    updateDate(now);
  }
}

const DAY_KANJI = ["日", "月", "火", "水", "木", "金", "土"];

function updateDate(now) {
  const locale = navigator.languages?.[0] || navigator.language || "en-US";
  const formatted = now.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const kanji = document.createElement("span");
  kanji.className = "date-kanji";
  kanji.setAttribute("aria-hidden", "true");
  kanji.textContent = DAY_KANJI[now.getDay()];

  document
    .getElementById("date")
    .replaceChildren(document.createTextNode(`${formatted} · `), kanji);
}

// ─── Render Bookmarks ─────────────────────────────────

function renderBookmarks() {
  const grid = document.getElementById("bookmarks-grid");

  for (const [category, links] of Object.entries(bookmarks)) {
    const col = document.createElement("section");
    col.className = "category";
    col.dataset.category = category;

    const title = document.createElement("h2");
    title.className = "category-title";

    const dot = document.createElement("span");
    dot.className = "pane-dot";
    dot.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");
    const path = document.createElement("span");
    path.className = "pane-path";
    path.setAttribute("aria-hidden", "true");
    path.textContent = "~/";
    label.append(path, document.createTextNode(category));

    title.append(dot, label);
    col.appendChild(title);

    const ul = document.createElement("ul");
    ul.className = "link-list";

    for (const [slug, { url, logo, displayUrl }] of Object.entries(links)) {
      const li = document.createElement("li");
      li.className = "link-item";
      li.dataset.slug = slug;
      li.dataset.display = displayUrl;

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";

      const icon = document.createElement("i");
      icon.className = logo;
      icon.setAttribute("aria-hidden", "true");

      const nameSpan = document.createElement("span");
      nameSpan.className = "link-name";
      nameSpan.textContent = slug;

      const urlSpan = document.createElement("span");
      urlSpan.className = "link-url";
      urlSpan.textContent = displayUrl;

      a.append(icon, nameSpan, urlSpan);
      li.appendChild(a);
      ul.appendChild(li);
    }

    col.appendChild(ul);
    grid.appendChild(col);
  }
}

// ─── Search ───────────────────────────────────────────

function performSearch(query) {
  const categories = document.querySelectorAll(".category");
  const lowerQuery = query.toLowerCase();

  categories.forEach((cat) => {
    const items = cat.querySelectorAll(".link-item");
    let visibleCount = 0;

    items.forEach((item) => {
      const slug = item.dataset.slug.toLowerCase();
      const display = item.dataset.display.toLowerCase();
      const matches =
        !lowerQuery ||
        slug.includes(lowerQuery) ||
        display.includes(lowerQuery);

      item.classList.toggle("hidden", !matches);
      if (matches) visibleCount++;
    });

    cat.classList.toggle("hidden", visibleCount === 0);
  });

  updateTarget(lowerQuery);
}

function updateTarget(query) {
  document
    .querySelectorAll(".link-item.is-target")
    .forEach((el) => el.classList.remove("is-target"));

  if (!query) return;

  const first = document.querySelector(
    ".category:not(.hidden) .link-item:not(.hidden)",
  );
  if (first) first.classList.add("is-target");
}

function updateURL(query) {
  const url = new URL(window.location);
  if (query) {
    url.searchParams.set("q", query);
  } else {
    url.searchParams.delete("q");
  }
  window.history.replaceState({}, "", url);
}

function clearSearch(input) {
  input.value = "";
  performSearch("");
  updateURL("");
}

function initSearch() {
  const input = document.getElementById("search-input");

  // Restore search from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q");
  if (initialQuery) {
    input.value = initialQuery;
    performSearch(initialQuery);
  }

  input.addEventListener("input", () => {
    const query = input.value.trim();
    performSearch(query);
    updateURL(query);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      clearSearch(input);
      input.blur();
      return;
    }

    if (e.key !== "Enter") return;

    const query = input.value.trim();
    if (!query) return;

    const target = document.querySelector(
      ".category:not(.hidden) .link-item:not(.hidden) a",
    );

    if (target) {
      target.click();
    } else {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank",
        "noopener,noreferrer",
      );
    }

    clearSearch(input);
  });

  // Typing anywhere routes to the prompt
  document.addEventListener("keydown", (e) => {
    if (e.defaultPrevented || document.activeElement === input) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "/") {
      e.preventDefault();
      input.focus();
      return;
    }

    if (e.key.length === 1 && e.key !== " ") {
      input.focus();
    }
  });

  input.focus({ preventScroll: true });
}

// ─── Init ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 1000);
  renderBookmarks();
  initSearch();
});
