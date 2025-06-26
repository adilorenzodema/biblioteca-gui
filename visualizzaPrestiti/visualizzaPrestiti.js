document.addEventListener("DOMContentLoaded", function () {
  // Funzione per leggere parametro query string
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const libroId = getQueryParam("libroId");
  const apiUrlBase = "http://localhost:8080/api/prestiti/getAllPrestito";
  const apiUrl = libroId ? `${apiUrlBase}/${libroId}` : apiUrlBase;

  const tableBody = document.getElementById("prestiti-table-body");
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");

  loadingEl.style.display = "block";
  errorEl.style.display = "none";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Errore nel caricamento dei prestiti");
      return response.json();
    })
    .then((prestiti) => {
      loadingEl.style.display = "none";

      if (prestiti.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center">Nessun prestito attivo trovato.</td></tr>`;
        return;
      }

      // Popola la tabella
      tableBody.innerHTML = "";
      prestiti.forEach((p) => {
        const dataFineStr = p.dataFine
          ? new Date(p.dataFine).toLocaleDateString()
          : "-";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${p.nomeCognome}</td>
          <td>${dataFineStr}</td>
          <td><button class="btn-rimuovi" data-id="${p.idPrestito}">Termina prestito</button></td>
        `;
        tableBody.appendChild(row);
      });

      document.querySelectorAll(".btn-rimuovi").forEach((button) => {
        button.addEventListener("click", function () {
            const idPrestito = this.getAttribute("data-id");  // prendi id prestito dal bottone

            const libroId = getQueryParam("libroId"); // se scegli idlibro usa "idlibro"

            let url = `http://localhost:8080/api/prestiti/terminaPrestito/${idPrestito}`;

            if (libroId) {
                url += `?libroId=${libroId}`;
            }

            fetch(url, { method: "PUT" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nella rimozione del prestito");
                }
                window.location.reload();
            })
            .catch(err => alert("Errore: " + err.message));
        });


      });
    })
    .catch((err) => {
      loadingEl.style.display = "none";
      errorEl.style.display = "block";
      errorEl.textContent = err.message;
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
