document.addEventListener("DOMContentLoaded", function () {
  const libriContainer = document.getElementById("libri-container");
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const datiLoginString = sessionStorage.getItem("utente");
  const datiLogin = datiLoginString ? JSON.parse(datiLoginString) : null;
  const ruolo = datiLogin?.utente?.nomeRuolo || null;

  // Gestione link navbar
  const areaPersonaleLink = document.getElementById("areaPersonaleLink");
  if (areaPersonaleLink && (ruolo === "admin" || ruolo === "operatore")) {
    areaPersonaleLink.style.display = "none";
  }
  const gestioneUtentiLink = document.getElementById("gestioneUtentiLink");
  if (gestioneUtentiLink && (ruolo === "admin" || ruolo === "operatore")) {
    gestioneUtentiLink.style.display = "list-item";
  }

  const apiUrl = "http://localhost:8080/api/libri/getAllLibri";
  const apiUrlPrestito = "http://localhost:8080/api/libri/concedi";
  const apiUrlAggiungi = "http://localhost:8080/api/libri/aggiungi";
  const formAggiungiLibro = document.getElementById("formAggiungiLibro");
  const containerAggiungiLibro = document.getElementById("aggiungi-libro-container");

  // Caricamento lista libri
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error("Errore nel recupero dei dati");
      return response.json();
    })
    .then(libri => {
      loadingElement.style.display = "none";
      if (libri.length === 0) {
        libriContainer.innerHTML = `
          <div class="col-12">
            <div class="alert alert-info">Nessun libro disponibile nel catalogo.</div>
          </div>`;
        return;
      }

      libri.forEach((libro, index) => {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
          <div class="card libro-card h-100">
            <img src="${libro.link}" class="card-img-top" alt="Copertina di ${libro.titolo}">
            <div class="card-body">
              <h5 class="card-title">${libro.titolo}</h5>
              <p class="card-text"><strong>Autore:</strong> ${libro.autore}</p>
              <p class="card-text"><strong>Genere:</strong> ${libro.genere}</p>
              <p class="card-text"><strong>Disponibilità:</strong> ${
                libro.disponibilita !== 0 ? "Disponibile" : "Non disponibile"
              }</p>
              <ul class="list-group list-group-flush mt-3" style="display: none;">
                <li class="list-group-item"><strong>Editore:</strong> ${libro.casaEditrice}</li>
                <li class="list-group-item"><strong>ISBN:</strong> ${libro.iban}</li>
              </ul>
              <a href="#" class="toggle-details mt-2 d-block">
                <i class="fas fa-chevron-down"></i> Mostra dettagli
              </a>
              ${
                (ruolo === "admin" || ruolo === "operatore")
                  ? `
                    <button class="open-modal-btn btn btn-primary mt-3" data-index="${index}" ${
                      libro.disponibilita === 0 ? "disabled" : ""
                    }>Prestito</button>
                    <button class="btn btn-danger mt-3 btnEliminaLibro" data-idlibro="${libro.idLibro}">Rimuovi libro</button>
                    <button class="btn btn-info mt-3 btnVisualizzaPrestiti" data-idlibro="${libro.idLibro}">Visualizza prestiti</button>
                  `
                  : ""
              }
            </div>
          </div>

          <div class="modal modal-libro" data-index="${index}" style="display: none;">
            <div class="modal-content">
              <button class="close-modal-btn close">&times;</button>
              <h2 class="mb-3">Prenota il libro: <em>${libro.titolo}</em></h2>
              <form class="form-prenotazione" data-idlibro="${libro.idLibro}">
                <div class="mb-3">
                  <label for="alunno-${index}" class="form-label">Seleziona Alunno</label>
                  <select class="form-select" id="idAlunno-${index}" name="idAlunno" required>
                    <option value="" disabled selected>Seleziona un alunno</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-success">Conferma Prenotazione</button>
              </form>
            </div>
          </div>
        `;
        libriContainer.appendChild(col);
      });

      // Toggle dettagli
      libriContainer.querySelectorAll(".toggle-details").forEach(toggle => {
        toggle.addEventListener("click", e => {
          e.preventDefault();
          const details = toggle.previousElementSibling;
          const visible = details.style.display === "block";
          details.style.display = visible ? "none" : "block";
          toggle.innerHTML = visible
            ? '<i class="fas fa-chevron-down"></i> Mostra dettagli'
            : '<i class="fas fa-chevron-up"></i> Nascondi dettagli';
        });
      });

      // Gestione eventi click su bottoni
      libriContainer.addEventListener("click", e => {
        if (e.target.classList.contains("open-modal-btn")) {
          const idx = e.target.dataset.index;
          const modal = document.querySelector(`.modal-libro[data-index="${idx}"]`);
          modal?.style.setProperty("display", "flex");
        }
        if (e.target.classList.contains("close-modal-btn") || e.target.classList.contains("modal-libro")) {
          e.target.closest(".modal-libro")?.style.setProperty("display", "none");
        }
        if (e.target.classList.contains("btnEliminaLibro")) {
          const id = e.target.dataset.idlibro;
          if (confirm("Sei sicuro di voler eliminare questo libro?")) {
            fetch(`http://localhost:8080/api/libri/${id}`, { method: "DELETE" })
              .then(r => r.ok ? location.reload() : Promise.reject())
              .catch(() => alert("Errore durante l'eliminazione. Riprova."));
          }
        }
        if (e.target.classList.contains("btnVisualizzaPrestiti")) {
          const id = e.target.dataset.idlibro;
          window.location.href = `../visualizzaPrestiti/visualizzaPrestiti.html?libroId=${id}`;
        }
        if (e.target.classList.contains("modal-libro")) {
          e.target.style.display = "none";
        }
      });

      // Caricamento alunni dentro modale
      document.addEventListener("click", async e => {
        if (e.target.classList.contains("open-modal-btn")) {
          const idx = e.target.dataset.index;
          const select = document.getElementById(`idAlunno-${idx}`);
          select.innerHTML = `<option disabled selected>Caricamento alunni...</option>`;
          try {
            const res = await fetch("http://localhost:8080/api/utente/getAllUtenti/alunno");
            const alunni = await res.json();
            select.innerHTML = `<option disabled selected>Seleziona un alunno</option>`;
            alunni.forEach(a => {
              const opt = document.createElement("option");
              opt.value = a.idUtente;
              opt.textContent = `${a.nome} ${a.cognome}`;
              select.appendChild(opt);
            });
          } catch {
            select.innerHTML = `<option disabled selected>Errore nel caricamento</option>`;
          }
        }
      });
    })
    .catch(() => {
      loadingElement.style.display = "none";
      errorElement.textContent = "Errore nel caricamento dei libri.";
      errorElement.style.display = "block";
    });

  // Pulsanti Aggiungi / (opzionale) Visualizza Prestiti globali
  if (ruolo === "admin" || ruolo === "operatore") {
    const btnAggiungi = document.createElement("button");
    btnAggiungi.className = "btn btn-success me-2";
    btnAggiungi.textContent = "Aggiungi libro";
    btnAggiungi.onclick = () => {
      document.getElementById("modalAggiungiLibro")?.style.setProperty("display","flex");
    };

    const btnGlobalPrestiti = document.createElement("button");
    btnGlobalPrestiti.className = "btn btn-info";
    btnGlobalPrestiti.textContent = "Visualizza prestiti";
    btnGlobalPrestiti.onclick = () => window.location.href = "../visualizzaPrestiti/visualizzaPrestiti.html";

    containerAggiungiLibro?.append(btnAggiungi, btnGlobalPrestiti);
  }

  // Submit form aggiunta libro
  formAggiungiLibro?.addEventListener("submit", e => {
    e.preventDefault();
    const nuovoLibro = {
      titolo: formAggiungiLibro.titolo.value.trim(),
      autore: formAggiungiLibro.autore.value.trim(),
      casaEditrice: formAggiungiLibro.casaEditrice.value.trim(),
      genere: formAggiungiLibro.genere.value.trim(),
      iban: formAggiungiLibro.iban.value.trim(),
      link: formAggiungiLibro.immagineLibro.value.trim(),
      disponibilita: parseInt(formAggiungiLibro.disponibilita.value, 10),
    };
    fetch(apiUrlAggiungi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuovoLibro),
    })
    .then(r => {
      if (!r.ok) throw new Error();
      alert("Libro aggiunto con successo!");
      formAggiungiLibro.reset();
      document.getElementById("modalAggiungiLibro")?.style.setProperty("display","none");
      location.reload();
    })
    .catch(() => alert("Errore durante l'aggiunta del libro."));
  });

  // Controllo sessione e logout
  function checkSession() {
    const s = sessionStorage.getItem("utente");
    if (!s) return alert("Sessione non trovata."), window.location.href = "../login/login.html", false;
    const exp = JSON.parse(s).expiryTime;
    if (Date.now() > exp) return sessionStorage.clear(), alert("Sessione scaduta."), window.location.href = "../login/login.html", false;
    return true;
  }
  checkSession();
  document.getElementById("logoutButton")?.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "../login/login.html";
  });
  const ruoloEl = document.getElementById("userRole");
  if (ruoloEl) ruoloEl.textContent = `Ruolo: ${ruolo}`;
});
