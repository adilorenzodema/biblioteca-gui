document.addEventListener("DOMContentLoaded", function () {
  const tableHead = document.getElementById("prestiti-table-head");
  const tableBody = document.getElementById("prestiti-table-body");
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");

  const btnAttivi = document.getElementById("btnAttivi");
  const btnConclusi = document.getElementById("btnConclusi");

  const apiBase = "http://localhost:8080/api/prestiti";

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const libroId = getQueryParam("libroId");

  function getApiUrl(tipo) {
    const endpoint = tipo === "attivi" ? "getAllPrestito" : "getAllPrestitiConclusi";
    return libroId
      ? `${apiBase}/${endpoint}/${libroId}`
      : `${apiBase}/${endpoint}`;
  }

  function aggiornaIntestazioneTabella(tipo) {
    tableHead.innerHTML = `
      <tr>
        <th>Utente</th>
        <th>Titolo Libro</th>
        <th>${tipo === "attivi" ? "Data Fine" : "Data Fine"}</th>
        <th>${tipo === "attivi" ? "Termina Prestito" : "Data Restituzione"}</th>
      </tr>
    `;
  }

  function caricaPrestiti(tipo) {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";
    tableBody.innerHTML = "";
    aggiornaIntestazioneTabella(tipo);

    const url = getApiUrl(tipo);

    fetch(url)
      .then((response) => {
        if (!response.ok)
          throw new Error("Errore nel caricamento dei prestiti");
        return response.json();
      })
      .then((prestiti) => {
        loadingEl.style.display = "none";

        if (prestiti.length === 0) {
          tableBody.innerHTML = `<tr><td colspan="4" class="text-center">Nessun prestito ${tipo} trovato.</td></tr>`;
          return;
        }

        prestiti.forEach((p) => {
          const dataFineStr = p.dataFine
            ? new Date(p.dataFine).toLocaleDateString()
            : "-";
          const dataRestituzioneStr = p.dataRestituzione
            ? new Date(p.dataRestituzione).toLocaleDateString()
            : "-";

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${p.nomeCognome}</td>
            <td>${p.titoloLibro || "-"}</td>
            <td>${dataFineStr}</td>
            <td>
              ${
                tipo === "attivi"
                  ? `<button class="btn-rimuovi" data-id="${p.idPrestito}">Termina Prestito</button>`
                  : `${dataRestituzioneStr}`
              }
            </td>
          `;
          tableBody.appendChild(row);
        });

        // Aggiungo listener ai bottoni di terminazione prestito solo se tipo = attivi
        if (tipo === "attivi") {
          document.querySelectorAll(".btn-rimuovi").forEach((button) => {
            button.addEventListener("click", function () {
              const idPrestito = this.getAttribute("data-id");

              let url = `http://localhost:8080/api/prestiti/terminaPrestito/${idPrestito}`;

              // Se vuoi puoi passare libroId come query param, se serve
              // if (libroId) url += `?libroId=${libroId}`;

              fetch(url, { method: "PUT" })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Errore nella terminazione del prestito");
                  }
                  // Ricarico la lista attivi
                  caricaPrestiti("attivi");
                })
                .catch((err) => alert("Errore: " + err.message));
            });
          });
        }
      })
      .catch((err) => {
        loadingEl.style.display = "none";
        errorEl.style.display = "block";
        errorEl.textContent = err.message;
      });
  }

  function evidenziaBottoneSelezionato(tipo) {
    if (tipo === "attivi") {
      btnAttivi.classList.add("btn-selected");
      btnConclusi.classList.remove("btn-selected");
    } else {
      btnAttivi.classList.remove("btn-selected");
      btnConclusi.classList.add("btn-selected");
    }
  }

  btnAttivi.addEventListener("click", () => {
    caricaPrestiti("attivi");
    evidenziaBottoneSelezionato("attivi");
  });

  btnConclusi.addEventListener("click", () => {
    caricaPrestiti("conclusi");
    evidenziaBottoneSelezionato("conclusi");
  });

  // Caricamento iniziale (attivi)
  caricaPrestiti("attivi");
  evidenziaBottoneSelezionato("attivi");

  checkSession();
  mostraRuoloUtente();

  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.clear();
      window.location.href = "../login/login.html";
    });
  }

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
});
