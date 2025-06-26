document.addEventListener("DOMContentLoaded", function () {
  const libriContainer = document.getElementById("libri-container");
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const datiLoginString = sessionStorage.getItem("utente");
  const datiLogin = datiLoginString ? JSON.parse(datiLoginString) : null;
  const ruolo =
    datiLogin && datiLogin.utente ? datiLogin.utente.nomeRuolo : null;
  const areaPersonaleLink = document.getElementById("areaPersonaleLink");
  if (areaPersonaleLink && (ruolo === "admin" || ruolo === "operatore")) {
    areaPersonaleLink.style.display = "none";
  }

  const gestioneUtentiLink = document.getElementById("gestioneUtentiLink");
  if (gestioneUtentiLink && (ruolo === "admin" || ruolo === "operatore")) {
    gestioneUtentiLink.style.display = "list-item";
  }

  const gestionePrestitiLink = document.getElementById("gestionePrestitiLink");
  if (gestionePrestitiLink && (ruolo === "admin" || ruolo === "operatore")) {
    gestionePrestitiLink.style.display = "list-item";
  }

 
  
  const apiUrl = "http://localhost:8080/api/libri/getAllLibri";
  const apiUrlPrestito = "http://localhost:8080/api/libri/concedi";
  const formAggiungiLibro = document.getElementById("formAggiungiLibro");
  const apiUrlAggiungi = "http://localhost:8080/api/libri/aggiungi";
  const containerAggiungiLibro = document.getElementById(
    "aggiungi-libro-container"
  );

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Errore nel recupero dei dati");
      return response.json();
    })
    .then((libri) => {
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

        const copertinaUrl = libro.link;

        col.innerHTML = `
    <div class="card libro-card h-100">
        <img src="${copertinaUrl}" class="card-img-top" alt="Copertina di ${
          libro.titolo
        }">
        <div class="card-body">
            <h5 class="card-title">${libro.titolo}</h5>
            <p class="card-text"><strong>Autore:</strong> ${libro.autore}</p>
            <p class="card-text"><strong>Genere:</strong> ${libro.genere}</p>
            <p class="card-text"${
                  libro.disponibilita !== 0 ? "disponibile" : "non-disponibile"
                }">
                    <strong>Disponibilità:</strong> ${
                      libro.disponibilita !== 0
                        ? "Disponibile"
                        : "Non disponibile"
                    }
                  </p>
            <ul class="list-group list-group-flush mt-3" style="display: none;">
                <li class="list-group-item"><strong>Editore:</strong> ${
                  libro.casaEditrice
                }</li>
                <li class="list-group-item"><strong>ISBN:</strong> ${
                  libro.iban
                }</li>
                
            </ul>

            <a href="#" class="toggle-details mt-2 d-block">
                <i class="fas fa-chevron-down"></i> Mostra dettagli
            </a>

            ${
              ruolo === "admin" || ruolo === "operatore"
                ? `
                  <button class="open-modal-btn btn btn-primary mt-3" data-index="${index}" ${
                    libro.disponibilita === 0 ? "disabled" : ""
                  }>Prestito</button>
                  <button class="btn btn-danger mt-3 btnEliminaLibro" data-idlibro="${libro.idLibro}">Rimuovi libro</button>
                  <a href="../visualizzaPrestiti/visualizzaPrestiti.html?libroId=${libro.idLibro}" class="btn btn-info mt-3">Visualizza Prestiti</a>
                `
                : ""
            }
        </div>
    </div>

    <div class="modal modal-libro" data-index="${index}" style="display: none;" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="modal-content">
            <button class="close-modal-btn close" aria-label="Chiudi Modale">&times;</button>
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

      libriContainer.querySelectorAll(".toggle-details").forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
          e.preventDefault();
          toggleDetails(this);
        });
      });

      libriContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("open-modal-btn")) {
          const index = e.target.getAttribute("data-index");
          const modal = document.querySelector(
            `.modal-libro[data-index="${index}"]`
          );
          if (modal) {
            modal.style.display = "flex";
            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
          }
        }

        if (e.target.classList.contains("close-modal-btn")) {
          const modal = e.target.closest(".modal-libro");
          if (modal) {
            modal.style.display = "none";
            modal.classList.remove("show");
            modal.setAttribute("aria-hidden", "true");
          }
        }

        if (e.target.classList.contains("modal-libro")) {
          e.target.style.display = "none";
          e.target.classList.remove("show");
          e.target.setAttribute("aria-hidden", "true");
        }
      });

      document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("open-modal-btn")) {
          e.preventDefault();

          const index = e.target.getAttribute("data-index");
          const modal = document.querySelector(
            `.modal-libro[data-index="${index}"]`
          );
          const select = document.getElementById(`idAlunno-${index}`);

          modal.style.display = "block";
          modal.setAttribute("aria-hidden", "false");

          // Pulisce e mostra "Caricamento..."
          select.innerHTML =
            '<option value="" disabled selected>Caricamento alunni...</option>';

          try {
            const res = await fetch(
              "http://localhost:8080/api/utente/getAllUtenti/alunno"
            ); // Cambia con la tua API
            const alunni = await res.json();

            select.innerHTML =
              '<option value="" disabled selected>Seleziona un alunno</option>';

            alunni.forEach((alunno) => {
              const option = document.createElement("option");
              option.value = alunno.idUtente;
              option.textContent = `${alunno.nome} ${alunno.cognome}`;
              select.appendChild(option);
            });
          } catch (err) {
            console.error("Errore nel caricamento alunni:", err);
            select.innerHTML =
              '<option value="" disabled selected>Errore nel caricamento</option>';
          }
        }

        // Chiusura modale
        if (e.target.classList.contains("close-modal-btn")) {
          const modal = e.target.closest(".modal-libro");
          modal.style.display = "none";
          modal.setAttribute("aria-hidden", "true");
        }
      });
    });

  function toggleDetails(element) {
    const detailsList = element.previousElementSibling;
    if (!detailsList) return;

    const isVisible = detailsList.style.display === "block";
    detailsList.style.display = isVisible ? "none" : "block";
    element.innerHTML = isVisible
      ? '<i class="fas fa-chevron-down"></i> Mostra dettagli'
      : '<i class="fas fa-chevron-up"></i> Nascondi dettagli';
  }

  if (ruolo === "admin" || ruolo === "operatore") {
  const bottoneAggiungi = document.createElement("button");
  bottoneAggiungi.className = "btn btn-success me-2";
  bottoneAggiungi.textContent = "Aggiungi libro";
  bottoneAggiungi.addEventListener("click", function () {
    const modal = document.getElementById("modalAggiungiLibro");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    }
  });
  const bottonePrestiti = document.createElement("button");
  bottonePrestiti.className = "btn btn-info";
  

  if (containerAggiungiLibro) {
    containerAggiungiLibro.appendChild(bottoneAggiungi);
  }
}


  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("close-modal-btn") ||
      e.target.id === "modalAggiungiLibro"
    ) {
      const modal = document.getElementById("modalAggiungiLibro");
      if (modal) {
        modal.style.display = "none";
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
      }
    }
  });

  if (formAggiungiLibro) {
    formAggiungiLibro.addEventListener("submit", function (e) {
      e.preventDefault();

      const titolo = formAggiungiLibro
        .querySelector('[name="titolo"]')
        .value.trim();
      const autore = formAggiungiLibro
        .querySelector('[name="autore"]')
        .value.trim();
      const casaEditrice = formAggiungiLibro
        .querySelector('[name="casaEditrice"]')
        .value.trim();
      const genere = formAggiungiLibro
        .querySelector('[name="genere"]')
        .value.trim();
      const iban = formAggiungiLibro
        .querySelector('[name="iban"]')
        .value.trim();
      const link = formAggiungiLibro
        .querySelector('[name="immagineLibro"]')
        .value.trim();
      const disponibilita = parseInt(
        formAggiungiLibro.querySelector('[name="disponibilita"]').value,
        10
      );

      const nuovoLibro = {
        titolo,
        autore,
        casaEditrice,
        genere,
        iban,
        disponibilita,
        link,
      };

      fetch(apiUrlAggiungi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuovoLibro),
      })
        .then((response) => {
          if (!response.ok)
            throw new Error("Errore durante l'aggiunta del libro");
        })
        .then((data) => {
          alert("Libro aggiunto con successo!");
          formAggiungiLibro.reset();
          const modal = document.getElementById("modalAggiungiLibro");
          if (modal) {
            modal.style.display = "none";
            modal.classList.remove("show");
          }
          location.reload();
        })
        .catch((error) => {
          console.error("Errore:", error);
          alert("Errore durante l'aggiunta del libro.");
        });
    });
  }

  libriContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("btnEliminaLibro")) {
      const idLibro = e.target.getAttribute("data-idlibro");

      if (confirm("Sei sicuro di voler eliminare questo libro?")) {
        fetch(`http://localhost:8080/api/libri/${idLibro}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok)
              throw new Error("Errore durante l'eliminazione del libro");
            alert("Libro eliminato con successo!");
            location.reload();
          })
          .catch((error) => {
            console.error("Errore:", error);
            alert("Errore durante l'eliminazione. Riprova.");
          });
      }
    }
  });

  document.addEventListener("submit", function (e) {
    if (e.target.classList.contains("form-prenotazione")) {
      e.preventDefault();

      const form = e.target;
      const idLibro = form.getAttribute("data-idlibro");

      // Trova la modale genitore
      const modal = form.closest(".modal-libro");
      if (!modal) {
        alert("Errore interno: modale non trovata.");
        return;
      }
      const index = modal.getAttribute("data-index");

      // Seleziona la select con id corretto usando l'index
      const selectAlunno = form.querySelector('select[name="idAlunno"]');
      const idAlunno = selectAlunno?.value;

      if (!selectAlunno) {
        alert("Errore: campo selezione alunno non trovato.");
        return;
      }

      if (!idAlunno || idAlunno === "") {
        alert("Seleziona un alunno prima di confermare la prenotazione.");
        return;
      }

      console.log("ID alunno selezionato:", idAlunno);

      const payload = {
        idLibro: idLibro,
        idUtente: idAlunno,
      };

      fetch(apiUrlPrestito, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Errore durante la prenotazione");
          alert("Prenotazione effettuata con successo!");
          // Chiudi modale
          if (modal) {
            modal.style.display = "none";
            modal.classList.remove("show");
            modal.setAttribute("aria-hidden", "true");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Errore durante la prenotazione. Riprova.");
        });
    }
  });
});

function checkSession() {
  const datiLoginString = sessionStorage.getItem("utente");

  if (!datiLoginString) {
    alert("Sessione non trovata. Effettua il login.");
    window.location.href = "../login/login.html";
    return false;
  }

  const datiLogin = JSON.parse(datiLoginString);
  const now = Date.now();

  if (now > datiLogin.expiryTime) {
    alert("Sessione scaduta. Effettua di nuovo il login.");
    sessionStorage.clear();
    window.location.href = "../login/login.html";
    return false;
  }

  return true;
}

checkSession();

const logoutBtn = document.getElementById("logoutButton");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "../login/login.html";
  });
}

function mostraRuoloUtente() {
  const datiLoginString = sessionStorage.getItem("utente");
  if (!datiLoginString) return;

  const datiLogin = JSON.parse(datiLoginString);
  const ruolo = datiLogin?.utente?.nomeRuolo || "Ruolo non disponibile";

  const ruoloElement = document.getElementById("userRole");
  if (ruoloElement) {
    ruoloElement.textContent = `Ruolo: ${ruolo}`;
  }
}

mostraRuoloUtente();
