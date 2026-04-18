// ─── Clock ────────────────────────────────────────────

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("clock-main").textContent = `${h}:${m}`;
  document.getElementById("clock-seconds").textContent = `:${s}`;
}

function updateDate() {
  const now = new Date();
  const locale = navigator.languages?.[0] || navigator.language || "en-US";
  const formatted = now.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("date").textContent = formatted;
}

// ─── Render Bookmarks ─────────────────────────────────

function renderBookmarks() {
  const grid = document.getElementById("bookmarks-grid");
  let globalIndex = 0;

  for (const [category, links] of Object.entries(bookmarks)) {
    const col = document.createElement("div");
    col.className = "category";
    col.dataset.category = category;

    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = category;
    col.appendChild(title);

    const ul = document.createElement("ul");
    ul.className = "link-list";

    for (const [slug, { url, logo, displayUrl }] of Object.entries(links)) {
      const li = document.createElement("li");
      li.className = "link-item";
      li.dataset.slug = slug;
      li.dataset.display = displayUrl;
      li.style.animationDelay = `${globalIndex * 55}ms`;

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

      globalIndex++;
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
    if (e.key !== "Enter") return;

    const query = input.value.trim();
    if (!query) return;

    const hasVisible = document.querySelector(".link-item:not(.hidden)");
    if (!hasVisible) {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank",
        "noopener,noreferrer",
      );
      input.value = "";
      updateURL("");
      // Reset filter state
      document
        .querySelectorAll(".link-item.hidden")
        .forEach((el) => el.classList.remove("hidden"));
      document
        .querySelectorAll(".category.hidden")
        .forEach((el) => el.classList.remove("hidden"));
    }
  });
}

// ─── Init ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  updateDate();
  setInterval(updateClock, 1000);
  renderBookmarks();
  initSearch();
});
