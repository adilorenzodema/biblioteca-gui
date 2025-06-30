document.addEventListener('DOMContentLoaded', function () {
    const libriContainer = document.getElementById('libri-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    const datiLogin = JSON.parse(sessionStorage.getItem("utente"));
    const idUtente = datiLogin?.utente?.idUtente;

    if (!idUtente || isNaN(idUtente)) {
        errorElement.textContent = 'Utente non autenticato. Effettua il login.';
        errorElement.style.display = 'block';
        loadingElement.style.display = 'none';
        return;
    }

    const apiUrl = `http://localhost:8080/api/libri/getMyLibri?idUtente=${idUtente}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Errore nel recupero dei dati');
            return response.json();
        })
        .then(libri => {
            loadingElement.style.display = 'none';

            if (libri.length === 0) {
                libriContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info">Non hai alcun libro in prestito.</div>
                    </div>`;
                return;
            }

            libri.forEach((libro, index) => {
                const col = document.createElement('div');
                col.className = 'col';

                const copertinaUrl = libro.link || 'https://via.placeholder.com/150x200?text=Copertina+non+disponibile';

                // Calcola date prestito (qui puoi usare libro.dataInizio se lo ricevi dal backend)
                const inizioPrestito = libro.dataInizio ? new Date(libro.dataInizio) : null;
                const finePrestito = libro.dataFine ? new Date(libro.dataFine) : null;
                const oggi = new Date();

                const isScaduto = oggi > finePrestito;

                // Mostra alert se il prestito è scaduto
                if (isScaduto) {
                    alert(`⚠️ Il prestito del libro "${libro.titoloLibro}" è scaduto.\nTi invitiamo a riportarlo in biblioteca.`);
                }

                col.innerHTML = `
                    <div class="card libro-card h-100 ${isScaduto ? 'border-danger' : ''}">
                        <img src="${copertinaUrl}" class="card-img-top" alt="Copertina di ${libro.titoloLibo}" 
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/150x200?text=Copertina+non+disponibile'">
                        <div class="card-body">
                            <h5 class="card-title">${libro.titolo}</h5>
                            <p class="card-text"><strong>Autore:</strong> ${libro.autore || 'N/A'}</p>
                            <p class="card-text"><strong>Genere:</strong> ${libro.genere || 'N/A'}</p>

                            <ul class="list-group list-group-flush mt-3">
                                <li class="list-group-item"><strong>Editore:</strong> ${libro.casaEditrice || 'N/A'}</li>
                                <li class="list-group-item"><strong>ISBN:</strong> ${libro.iban || 'N/A'}</li>
                                <li class="list-group-item"><strong>Data Inizio:</strong> ${inizioPrestito ? inizioPrestito.toLocaleDateString() : 'N/A'}</li>
                                <li class="list-group-item"><strong>Data Fine:</strong> ${finePrestito ? finePrestito.toLocaleDateString() : 'N/A'}</li>
                            </ul>

                            ${isScaduto ? `
                                <div class="alert alert-danger mt-3" role="alert">
                                    Prestito del libro scaduto, riportare in biblioteca.
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;

                libriContainer.appendChild(col);
            });
        })
        .catch(error => {
            loadingElement.style.display = 'none';
            errorElement.textContent = `Si è verificato un errore: ${error.message}`;
            errorElement.style.display = 'block';
            console.error('Errore:', error);
        });
});

// LOGOUT
const logoutBtn = document.getElementById("logoutButton");

function logout() {
    sessionStorage.clear();
    window.location.href = "../login/login.html";
}

logoutBtn.addEventListener("click", logout);

// SESSION CHECK
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

