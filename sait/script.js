/* ------- SPISAK S 15 IGRI ------- */
const games = [
    { id: 1, title: "Catan", description: "Стратегия за търговия и развитие.", players: "3–4", timeMinutes: 75 },
    { id: 2, title: "Carcassonne", description: "Плочки, градове и точки.", players: "2–5", timeMinutes: 40 },
    { id: 3, title: "Ticket to Ride", description: "Изграждане на маршрути.", players: "2–5", timeMinutes: 45 },
    { id: 4, title: "Gloomhaven", description: "Тежка кооперативна кампания.", players: "1–4", timeMinutes: 120 },
    { id: 5, title: "Dobble", description: "Бърза парти игра за реакция.", players: "2–8", timeMinutes: 15 },
    { id: 6, title: "Azul", description: "Изграждай мозайки от плочки.", players: "2–4", timeMinutes: 40 },
    { id: 7, title: "Splendor", description: "Стратегия със скъпоценни камъни.", players: "2–4", timeMinutes: 30 },
    { id: 8, title: "7 Wonders", description: "Развий цивилизация през три епохи.", players: "2–7", timeMinutes: 35 },
    { id: 9, title: "Pandemic", description: "Кооперативна игра срещу зарази.", players: "2–4", timeMinutes: 45 },
    { id: 10, title: "Dixit", description: "Асоциации и въображение.", players: "3–6", timeMinutes: 30 },
    { id: 11, title: "Codenames", description: "Отборна игра с думи.", players: "4–10", timeMinutes: 20 },
    { id: 12, title: "Kingdomino", description: "Кралство с домино плочки.", players: "2–4", timeMinutes: 20 },
    { id: 13, title: "Terraforming Mars", description: "Стратегия за развитие на Марс.", players: "1–5", timeMinutes: 120 },
    { id: 14, title: "Scythe", description: "Алтернативна история + икономика.", players: "1–5", timeMinutes: 115 },
    { id: 15, title: "Root", description: "Асиметрична гора с фракции.", players: "2–4", timeMinutes: 90 }
];

/* ------- REVIEWS STORAGE ------- */
let reviews = JSON.parse(localStorage.getItem("reviewsByGame") || "{}");
function saveReviews() {
    localStorage.setItem("reviewsByGame", JSON.stringify(reviews));
}

/* ------- AVERAGE RATING ------- */
function getAverageRating(gameId) {
    const list = reviews[gameId] || [];
    if (list.length === 0) return 0;

    const sum = list.reduce((a, b) => a + b.rating, 0);
    return sum / list.length;
}

/* ------- SORTING BY RATING ------- */
function sortGamesByRating() {
    games.sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id));
}

/* ------- RENDER CATALOG ------- */
const gameList = document.getElementById("game-list");

function renderGames() {
    sortGamesByRating();
    gameList.innerHTML = "";

    games.forEach(g => {
        const avg = getAverageRating(g.id).toFixed(1);
        const stars = avg > 0 ? "⭐ " + avg : "няма рейтинг";

        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
            <h3>${g.title}</h3>
            <p>${g.description}</p>
            <small style="color:var(--muted)">Средна оценка: ${stars}</small>
            <button class="details-btn">Детайли</button>
        `;

        card.querySelector(".details-btn").onclick = () => openGameModal(g);
        gameList.appendChild(card);
    });
}

renderGames();

/* ------- MODAL ------- */
const modal = document.getElementById("game-modal");
const modalClose = document.getElementById("modal-close");

const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-description");
const modalAverage = document.getElementById("modal-average");

const modalReviewList = document.getElementById("modal-review-list");
const modalReviewName = document.getElementById("modal-review-name");
const modalReviewText = document.getElementById("modal-review-text");
const modalReviewSubmit = document.getElementById("modal-review-submit");
const ratingStars = document.querySelectorAll("#rating-stars span");

let currentGameId = null;
let currentRating = 0;

/* ------- STAR RATING LOGIC ------- */
ratingStars.forEach(star => {
    star.addEventListener("click", () => {
        currentRating = Number(star.dataset.value);
        updateStars();
    });
});

function updateStars() {
    ratingStars.forEach(star => {
        star.classList.toggle("selected", Number(star.dataset.value) <= currentRating);
    });
}

/* ------- OPEN MODAL ------- */
function openGameModal(game) {
    currentGameId = game.id;
    currentRating = 0;
    updateStars();

    modalTitle.textContent = game.title;
    modalDesc.textContent =
        `${game.description} (👥 ${game.players}, ⏱ ${game.timeMinutes} мин)`;

    const avg = getAverageRating(game.id);
    modalAverage.textContent =
        avg === 0 ? "Няма оценки" : `Средна оценка: ⭐ ${avg.toFixed(1)} / 5`;

    renderReviews();
    modal.classList.remove("hidden");
}

modalClose.onclick = () => modal.classList.add("hidden");

/* ------- RENDER REVIEWS ------- */
function renderReviews() {
    modalReviewList.innerHTML = "";

    const list = reviews[currentGameId] || [];

    list.forEach(r => {
        const item = document.createElement("div");
        item.className = "modal-review-item";

        const stars =
            "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

        item.innerHTML = `<b>${r.name}</b> – 
            <span style="color:#ffcc00">${stars}</span><br>${r.text}`;

        modalReviewList.appendChild(item);
    });
}

/* ------- ADD REVIEW ------- */
modalReviewSubmit.onclick = () => {
    const name = modalReviewName.value.trim();
    const text = modalReviewText.value.trim();

    if (!name || !text || currentRating === 0) {
        alert("Попълнете име, текст и оценка.");
        return;
    }

    if (!reviews[currentGameId]) reviews[currentGameId] = [];

    reviews[currentGameId].push({
        name,
        text,
        rating: currentRating
    });

    saveReviews();
    renderReviews();
    renderGames(); // ⬅ обновява каталога по рейтинг

    modalReviewName.value = "";
    modalReviewText.value = "";
    currentRating = 0;
    updateStars();
};
