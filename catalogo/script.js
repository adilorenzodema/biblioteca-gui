document.addEventListener('DOMContentLoaded', function () {
    const libriContainer = document.getElementById('libri-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const datiLoginString = sessionStorage.getItem("utente");
    const datiLogin = datiLoginString ? JSON.parse(datiLoginString) : null;
    const ruolo = "admin";   //datiLogin.utente.ruolo
    const apiUrl = 'http://localhost:8080/api/libri/getAllLibri';
    const apiUrlPrestito='http://localhost:8080/api/libri/concedi';
    const containerAggiungiLibro = document.getElementById('aggiungi-libro-container');
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
                        <div class="alert alert-info">Nessun libro disponibile nel catalogo.</div>
                    </div>`;
                return;
            }

            libri.forEach((libro, index) => {
                const col = document.createElement('div');
                col.className = 'col';

                const copertinaUrl = libro.link;


                col.innerHTML = `
    <div class="card libro-card h-100">
        <img src="${copertinaUrl}" class="card-img-top" alt="Copertina di ${libro.titolo}">
        <div class="card-body">
            <h5 class="card-title">${libro.titolo}</h5>
            <p class="card-text"><strong>Autore:</strong> ${libro.autore}</p>
            <p class="card-text"><strong>Genere:</strong> ${libro.genere}</p>

            <ul class="list-group list-group-flush mt-3" style="display: none;">
                <li class="list-group-item"><strong>Editore:</strong> ${libro.casaEditrice}</li>
                <li class="list-group-item"><strong>ISBN:</strong> ${libro.iban}</li>
                <li class="list-group-item ${libro.disponibilita !== 0 ? 'disponibile' : 'non-disponibile'}">
                    <strong>Disponibilità:</strong> ${libro.disponibilita !== 0 ? 'Disponibile' : 'Non disponibile'}
                </li>
            </ul>

            <a href="#" class="toggle-details mt-2 d-block">
                <i class="fas fa-chevron-down"></i> Mostra dettagli
            </a>

           ${ruolo === "admin" || ruolo === "operatore" ? `
    <button class="open-modal-btn btn btn-primary mt-3" data-index="${index}">Prenota</button>
` : ''}

            ${ruolo === "admin" || ruolo === "operatore" ? `
                <button class="btn btn-danger mt-3 btnEliminaLibro">Rimuovi libro</button>
            ` : ''}
            
        </div>
    </div>
    <div class="modal modal-libro" data-index="${index}" style="display: none;" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="modal-content">
            <button class="close-modal-btn close" aria-label="Chiudi Modale">&times;</button>
            <h2 class="mb-3">Prenota il libro: <em>${libro.titolo}</em></h2>
            <form class="form-prenotazione" data-idlibro="${libro.idLibro}">
                <div class="mb-2">
                    <label for="nome-${index}" class="form-label">Nome</label>
                    <input type="text" class="form-control" id="nome-${index}" required>
                </div>
                <div class="mb-2">
                    <label for="cognome-${index}" class="form-label">Cognome</label>
                    <input type="text" class="form-control" id="cognome-${index}" required>
                </div>
                <div class="mb-2">
                    <label for="classe-${index}" class="form-label">Classe</label>
                    <input type="text" class="form-control" id="classe-${index}" required>
                </div>
                <div class="mb-3">
                    <label for="cf-${index}" class="form-label">Codice Fiscale</label>
                    <input type="text" class="form-control" id="cf-${index}" maxlength="16" required>
                </div>
                <button type="submit" class="btn btn-success">Conferma Prenotazione</button>
            </form>
        </div>
    </div>
`;


                libriContainer.appendChild(col);
            });

            libriContainer.querySelectorAll('.toggle-details').forEach(toggle => {
                toggle.addEventListener('click', function (e) {
                    e.preventDefault();
                    toggleDetails(this);
                });
            });

          
            libriContainer.addEventListener('click', function (e) {
                if (e.target.classList.contains('open-modal-btn')) {
                    const index = e.target.getAttribute('data-index');
                    const modal = document.querySelector(`.modal-libro[data-index="${index}"]`);
                    if (modal) {
                        modal.style.display = 'flex';
                        modal.classList.add('show');
                        modal.setAttribute('aria-hidden', 'false');
                    }
                }

                if (e.target.classList.contains('close-modal-btn')) {
                    const modal = e.target.closest('.modal-libro');
                    if (modal) {
                        modal.style.display = 'none';
                        modal.classList.remove('show');
                        modal.setAttribute('aria-hidden', 'true');
                    }
                }

                if (e.target.classList.contains('modal-libro')) {
                    e.target.style.display = 'none';
                    e.target.classList.remove('show');
                    e.target.setAttribute('aria-hidden', 'true');
                }
            });

            libriContainer.addEventListener('submit', function (e) {
    if (e.target.classList.contains('form-prenotazione')) {
        e.preventDefault();

        const form = e.target;
        const idLibro = form.getAttribute('data-idlibro');
        const index = form.closest('.modal-libro').getAttribute('data-index');
        const idUtente = sessionStorage.getItem('idUtente');
        if (!idUtente) {
            alert('Utente non autenticato! Effettua il login.');
            return;
        }
        const nome = form.querySelector(`#nome-${index}`).value.trim();
        const cognome = form.querySelector(`#cognome-${index}`).value.trim();
        const classe = form.querySelector(`#classe-${index}`).value.trim();
        const codiceFiscale = form.querySelector(`#cf-${index}`).value.trim();

        const prenotazione = {
            idLibro: parseInt(idLibro),
            idUtente: parseInt(idUtente),
            nome,
            cognome,
            classe,
            codiceFiscale
        };

        fetch(apiUrlPrestito, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prenotazione)
        })
            .then(response => {
                if (!response.ok) throw new Error('Non è stato possibile effettuare la prenotazione');
                return response.text();
            })
            .then(data => {
                alert('Prenotazione effettuata con successo!');
                form.reset();
                form.closest('.modal-libro').style.display = 'none';
            })
            .catch(error => {
                console.error('Errore nella prenotazione:', error);
                alert('Errore durante la prenotazione. Riprova più tardi.');
            });
    }
});

        })
        .catch(error => {
            loadingElement.style.display = 'none';
            errorElement.textContent = `Si è verificato un errore: ${error.message}`;
            errorElement.style.display = 'block';
            console.error('Errore:', error);
        });

    function toggleDetails(element) {
        const detailsList = element.previousElementSibling;
        if (!detailsList) return;

        const isVisible = detailsList.style.display === 'block';
        detailsList.style.display = isVisible ? 'none' : 'block';
        element.innerHTML = isVisible
            ? '<i class="fas fa-chevron-down"></i> Mostra dettagli'
            : '<i class="fas fa-chevron-up"></i> Nascondi dettagli';
    }
    if (ruolo === 'admin' || ruolo === 'operatore') {
    const bottone = document.createElement('button');
    bottone.className = 'btn btn-success';
    bottone.textContent = 'Aggiungi libro';
    bottone.addEventListener('click', function () {
        const modal = document.getElementById('modalAggiungiLibro');
        modal.style.display = 'flex';
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    });

    containerAggiungiLibro.appendChild(bottone);
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('close-modal-btn') || e.target.id === 'modalAggiungiLibro') {
        const modal = document.getElementById('modalAggiungiLibro');
        modal.style.display = 'none';
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }
});
});
function checkSession() {
    const datiLoginString = sessionStorage.getItem("utente");

    if (!datiLoginString) {
        alert("Sessione non trovata. Effettua il login.");
        window.location.href = "/login/login.html";
        return false;
    }

    const datiLogin = JSON.parse(datiLoginString);
    const now = Date.now();

    if (now > datiLogin.expiryTime) {
        alert("Sessione scaduta. Effettua di nuovo il login.");
        sessionStorage.clear(); 
        window.location.href = "/login/login.html";
        return false;
    }

    return true;
}
checkSession();
