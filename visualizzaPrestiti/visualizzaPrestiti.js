document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idlibro = params.get("libroId");
  const tbody = document.getElementById("prestiti-body");
  const loading = document.getElementById("loading");
  const errore = document.getElementById("errore");

  if (!idlibro) {
    errore.textContent = "ID del libro mancante.";
    return;
  }

  fetch(`http://localhost:8080/api/prestiti/libro/${idlibro}`)
    .then(response => {
      if (!response.ok) throw new Error("Errore nel recupero dei prestiti");
      return response.json();
    })
    .then(prestiti => {
      if (loading) loading.style.display = "none";
      if (prestiti.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Nessun prestito per questo libro.</td></tr>`;
        return;
      }

      prestiti.forEach(prestito => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${prestito.utente.nome} ${prestito.utente.cognome}</td>
          <td>${prestito.dataScadenza}</td>
          <td>
            <button class="btn-rimuovi" data-id="${prestito.id}">
            Rimuovi
            </button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error(err);
      if (loading) loading.style.display = "none";
      if (errore) errore.textContent = "Errore durante il caricamento dei prestiti.";
    });

  // Eventuale gestione rimozione
  tbody.addEventListener("click", function (e) {
    if (e.target.closest(".btn-rimuovi")) {
      const idPrestito = e.target.closest(".btn-rimuovi").dataset.id;
      if (confirm("Vuoi davvero rimuovere questo prestito?")) {
        fetch(`http://localhost:8080/api/prestiti/${idPrestito}`, {
          method: "DELETE"
        })
        .then(res => {
          if (!res.ok) throw new Error();
          alert("Prestito rimosso con successo.");
          location.reload();
        })
        .catch(() => alert("Errore durante la rimozione del prestito."));
      }
    }
  });
});
