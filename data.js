const bookmarks = {
  General: {
    gmail: {
      url: "https://mail.google.com/",
      logo: "https://www.google.com/s2/favicons?domain=gmail.com&sz=32",
      displayUrl: "mail.google.com",
    },
    ymail: {
      url: "https://mail.yahoo.com/",
      logo: "https://www.google.com/s2/favicons?domain=yahoo.com&sz=32",
      displayUrl: "mail.yahoo.com",
    },
    whatsapp: {
      url: "https://web.whatsapp.com/",
      logo: "https://www.google.com/s2/favicons?domain=whatsapp.com&sz=32",
      displayUrl: "web.whatsapp.com",
    },
  },
  Anime: {
    anichart: {
      url: "https://anichart.net/",
      logo: "https://www.google.com/s2/favicons?domain=anichart.net&sz=32",
      displayUrl: "anichart.net",
    },
    anilist: {
      url: "https://anilist.co/home",
      logo: "https://www.google.com/s2/favicons?domain=anilist.co&sz=32",
      displayUrl: "anilist.co",
    },
    zoro: {
      url: "https://aniwatch.to/",
      logo: "https://www.google.com/s2/favicons?domain=aniwatch.to&sz=32",
      displayUrl: "aniwatch.to",
    },
    subsplease: {
      url: "https://subsplease.org/",
      logo: "https://www.google.com/s2/favicons?domain=subsplease.org&sz=32",
      displayUrl: "subsplease.org",
    },
  },
  Work: {
    github: {
      url: "https://github.com/virtualguy1",
      logo: "https://www.google.com/s2/favicons?domain=github.com&sz=32",
      displayUrl: "github.com",
    },
    linkedin: {
      url: "https://www.linkedin.com/",
      logo: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=32",
      displayUrl: "linkedin.com",
    },
    twitter: {
      url: "https://twitter.com/",
      logo: "https://www.google.com/s2/favicons?domain=twitter.com&sz=32",
      displayUrl: "twitter.com",
    },
    "r/unixporn": {
      url: "https://www.reddit.com/r/unixporn/",
      logo: "https://www.google.com/s2/favicons?domain=reddit.com&sz=32",
      displayUrl: "reddit.com",
    },
  },
  Social: {
    facebook: {
      url: "https://www.facebook.com/",
      logo: "https://www.google.com/s2/favicons?domain=facebook.com&sz=32",
      displayUrl: "facebook.com",
    },
    youtube: {
      url: "https://www.youtube.com/",
      logo: "https://www.google.com/s2/favicons?domain=youtube.com&sz=32",
      displayUrl: "youtube.com",
    },
  },
};

function renderBookmarks() {
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
          <a href="${data.url}" class="card">
            <div class="card__icon">
              <img src="${data.logo}" alt="">
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

document.addEventListener("DOMContentLoaded", renderBookmarks);
