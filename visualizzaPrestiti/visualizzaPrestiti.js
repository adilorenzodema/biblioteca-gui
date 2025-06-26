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
        // p ha: idUtente, idLibro, nomeCognome, dataFine (Timestamp)
        const dataFineStr = p.dataFine
          ? new Date(p.dataFine).toLocaleDateString()
          : "-";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${p.nomeCognome}</td>
          <td>${dataFineStr}</td>
          <td><button class="btn-rimuovi" data-id="${p.idPrestito}">Rimuovi</button></td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      loadingEl.style.display = "none";
      errorEl.style.display = "block";
      errorEl.textContent = err.message;
    });

});
