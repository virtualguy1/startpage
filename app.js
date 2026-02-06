// Simple clock display
function updateClock() {
  const clockElement = document.getElementById("clock");
  if (!clockElement) return;

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function renderBookmarks() {
  // Check if bookmarks data exists
  if (typeof bookmarks === "undefined") {
    console.error(
      "Bookmarks data not found. Make sure data.js is loaded first.",
    );
    return;
  }

  const container = document.querySelector(".categories");
  if (!container) return;

  Object.entries(bookmarks).forEach(([category, links]) => {
    const section = document.createElement("section");
    section.className = "category";

    section.innerHTML = `
      <h2 class="category__label">${category}</h2>
      <div class="cards">
        ${Object.entries(links)
          .map(
            ([name, data]) => `
          <a href="${data.url}" class="card" target="_blank" rel="noopener noreferrer">
            <div class="card__icon">
              <i class="${data.logo}"></i>
            </div>
            <div class="card__name">${name}</div>
            <div class="card__url">${data.displayUrl}</div>
          </a>
        `,
          )
          .join("")}
      </div>
    `;

    container.appendChild(section);
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderBookmarks();
  updateClock();
  setInterval(updateClock, 1000);
});
