// Movie Tracker — web port of the Python terminal app.
// Persists to localStorage; supports JSON import/export.

const STORAGE_KEY = "movieTracker.movies";

const DUMMY_DATA = [
  { title: "Inception", genre: "Sci-Fi", rating: 9 },
  { title: "Interstellar", genre: "Sci-Fi", rating: 8.7 },
  { title: "The Dark Knight", genre: "Action", rating: 9.5 },
  { title: "Titanic", genre: "Drama", rating: 8 },
];

let movies = loadFromStorage();

// --- DOM references ---
const els = {
  rows: document.getElementById("movie-rows"),
  empty: document.getElementById("empty-state"),
  statTotal: document.getElementById("stat-total"),
  statAverage: document.getElementById("stat-average"),
  statTop: document.getElementById("stat-top"),
  search: document.getElementById("search"),
  filterGenre: document.getElementById("filter-genre"),
  sort: document.getElementById("sort"),
  form: document.getElementById("movie-form"),
  formTitle: document.getElementById("form-title"),
  formSubmit: document.getElementById("form-submit"),
  formCancel: document.getElementById("form-cancel"),
  editIndex: document.getElementById("edit-index"),
  title: document.getElementById("title"),
  genre: document.getElementById("genre"),
  rating: document.getElementById("rating"),
  fileImport: document.getElementById("file-import"),
};

// --- Storage helpers ---
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

// --- Rendering ---
function ratingTier(rating) {
  if (rating >= 8.5) return "high";
  if (rating >= 6) return "mid";
  return "low";
}

function getVisibleMovies() {
  const keyword = els.search.value.trim().toLowerCase();
  const genreFilter = els.filterGenre.value;
  const sort = els.sort.value;

  // Keep original indices so edit/remove map back to the source array.
  let list = movies.map((movie, index) => ({ movie, index }));

  if (keyword) {
    list = list.filter((m) => m.movie.title.toLowerCase().includes(keyword));
  }
  if (genreFilter) {
    list = list.filter(
      (m) => m.movie.genre.toLowerCase() === genreFilter.toLowerCase()
    );
  }

  switch (sort) {
    case "rating-desc":
      list.sort((a, b) => b.movie.rating - a.movie.rating);
      break;
    case "rating-asc":
      list.sort((a, b) => a.movie.rating - b.movie.rating);
      break;
    case "title-asc":
      list.sort((a, b) => a.movie.title.localeCompare(b.movie.title));
      break;
  }
  return list;
}

function renderGenreOptions() {
  const genres = [...new Set(movies.map((m) => m.genre))].sort((a, b) =>
    a.localeCompare(b)
  );
  const current = els.filterGenre.value;
  els.filterGenre.innerHTML = '<option value="">All genres</option>';
  for (const genre of genres) {
    const opt = document.createElement("option");
    opt.value = genre;
    opt.textContent = genre;
    els.filterGenre.appendChild(opt);
  }
  // Restore selection if it still exists.
  if (genres.some((g) => g === current)) els.filterGenre.value = current;
}

function renderSummary() {
  const total = movies.length;
  els.statTotal.textContent = total;

  if (total === 0) {
    els.statAverage.textContent = "—";
    els.statTop.textContent = "—";
    return;
  }

  const sum = movies.reduce((acc, m) => acc + m.rating, 0);
  els.statAverage.textContent = (sum / total).toFixed(2);

  const best = movies.reduce((a, b) => (b.rating > a.rating ? b : a));
  els.statTop.textContent = `${best.title} (${best.rating})`;
}

function renderTable() {
  const list = getVisibleMovies();
  els.rows.innerHTML = "";

  if (list.length === 0) {
    els.empty.hidden = false;
    els.empty.textContent =
      movies.length === 0
        ? "No movies to show. Add one above or load the sample data."
        : "No movies match the current search/filter.";
    return;
  }
  els.empty.hidden = true;

  list.forEach(({ movie, index }, displayPos) => {
    const tr = document.createElement("tr");
    const tier = ratingTier(movie.rating);
    tr.innerHTML = `
      <td class="col-id">${displayPos + 1}</td>
      <td class="cell-title"></td>
      <td><span class="genre-tag"></span></td>
      <td class="col-rating"><span class="rating-badge" data-tier="${tier}">${movie.rating}</span></td>
      <td class="col-actions">
        <button class="btn-icon" data-action="edit" data-index="${index}">Edit</button>
        <button class="btn-icon btn-icon--danger" data-action="remove" data-index="${index}">Remove</button>
      </td>`;
    // Use textContent for user-supplied strings to avoid HTML injection.
    tr.querySelector(".cell-title").textContent = movie.title;
    tr.querySelector(".genre-tag").textContent = movie.genre;
    els.rows.appendChild(tr);
  });
}

function render() {
  renderGenreOptions();
  renderSummary();
  renderTable();
}

// --- Actions ---
function resetForm() {
  els.form.reset();
  els.editIndex.value = "-1";
  els.formTitle.textContent = "Add a movie";
  els.formSubmit.textContent = "Add movie";
  els.formCancel.hidden = true;
}

function startEdit(index) {
  const movie = movies[index];
  if (!movie) return;
  els.editIndex.value = String(index);
  els.title.value = movie.title;
  els.genre.value = movie.genre;
  els.rating.value = movie.rating;
  els.formTitle.textContent = "Edit movie";
  els.formSubmit.textContent = "Save changes";
  els.formCancel.hidden = false;
  els.title.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function removeMovie(index) {
  const movie = movies[index];
  if (!movie) return;
  movies.splice(index, 1);
  saveToStorage();
  render();
  toast(`Removed “${movie.title}”`);
}

function handleSubmit(event) {
  event.preventDefault();
  const title = els.title.value.trim();
  const genre = els.genre.value.trim();
  const rating = parseFloat(els.rating.value);

  if (!title || !genre || Number.isNaN(rating)) {
    toast("Please fill in all fields with a valid rating", true);
    return;
  }
  if (rating < 0 || rating > 10) {
    toast("Rating must be between 0 and 10", true);
    return;
  }

  const index = parseInt(els.editIndex.value, 10);
  if (index >= 0 && movies[index]) {
    movies[index] = { title, genre, rating };
    toast("Movie updated");
  } else {
    movies.push({ title, genre, rating });
    toast("Movie added");
  }
  saveToStorage();
  resetForm();
  render();
}

function loadDummyData() {
  if (movies.length > 0) {
    const append = confirm(
      "Sample data\n\nOK = append to your list\nCancel = replace your list"
    );
    if (append) {
      movies.push(...DUMMY_DATA.map((m) => ({ ...m })));
      toast("Sample data appended");
    } else {
      movies = DUMMY_DATA.map((m) => ({ ...m }));
      toast("Sample data loaded (replaced)");
    }
  } else {
    movies = DUMMY_DATA.map((m) => ({ ...m }));
    toast("Sample data loaded");
  }
  saveToStorage();
  render();
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(movies, null, 4)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "movies.json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Exported movies.json");
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error("not an array");
      const cleaned = data
        .filter((m) => m && typeof m === "object")
        .map((m) => ({
          title: String(m.title ?? "Untitled"),
          genre: String(m.genre ?? "Unknown"),
          rating: Number(m.rating) || 0,
        }));
      movies = cleaned;
      saveToStorage();
      render();
      toast(`Loaded ${cleaned.length} movie(s)`);
    } catch {
      toast("Error loading file — invalid JSON", true);
    }
  };
  reader.onerror = () => toast("Error reading file", true);
  reader.readAsText(file);
}

// --- Toast ---
let toastTimer;
function toast(message, isError = false) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.toggle("toast--error", isError);
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

// --- Events ---
els.form.addEventListener("submit", handleSubmit);
els.formCancel.addEventListener("click", resetForm);
els.search.addEventListener("input", renderTable);
els.filterGenre.addEventListener("change", renderTable);
els.sort.addEventListener("change", renderTable);

els.rows.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const index = parseInt(button.dataset.index, 10);
  if (button.dataset.action === "edit") startEdit(index);
  else if (button.dataset.action === "remove") removeMovie(index);
});

document.getElementById("btn-dummy").addEventListener("click", loadDummyData);
document.getElementById("btn-export").addEventListener("click", exportJSON);
els.fileImport.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) importJSON(file);
  event.target.value = ""; // allow re-importing the same file
});

// --- Bootstrap ---
// On first load (empty storage) seed from the data file served out of the
// container's mounted volume at /data/movies.json (Docker mission req. 4c).
async function init() {
  if (movies.length === 0) {
    try {
      const res = await fetch("/data/movies.json", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          movies = data
            .filter((m) => m && typeof m === "object")
            .map((m) => ({
              title: String(m.title ?? "Untitled"),
              genre: String(m.genre ?? "Unknown"),
              rating: Number(m.rating) || 0,
            }));
          saveToStorage();
        }
      }
    } catch {
      // No mounted data (e.g. opened as a plain file) — start empty.
    }
  }
  render();
}

init();
