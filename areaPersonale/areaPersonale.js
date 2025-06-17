document.addEventListener('DOMContentLoaded', function () {
    const libriContainer = document.getElementById('libri-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

<<<<<<< HEAD
        const idUtente = parseInt(sessionStorage.getItem('idUtente'));   
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

                col.innerHTML = `
                    <div class="card libro-card h-100">
                        <img src="${copertinaUrl}" class="card-img-top" alt="Copertina di ${libro.titolo}" 
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/150x200?text=Copertina+non+disponibile'">
                        <div class="card-body">
                            <h5 class="card-title">${libro.titolo}</h5>
                            <p class="card-text"><strong>Autore:</strong> ${libro.autore || 'N/A'}</p>
                            <p class="card-text"><strong>Genere:</strong> ${libro.genere || 'N/A'}</p>

                            <ul class="list-group list-group-flush mt-3">
                                <li class="list-group-item"><strong>Editore:</strong> ${libro.casaEditrice || 'N/A'}</li>
                                <li class="list-group-item"><strong>ISBN:</strong> ${libro.iban || 'N/A'}</li>
                                <li class="list-group-item"><strong>Data Inizio:</strong> ${new Date().toLocaleDateString()}</li>
                                <li class="list-group-item"><strong>Data Fine:</strong> ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</li>
                            </ul>
                        </div>
                    </div>
=======
    const apiUrl = 'http://localhost:8080/api/libri/getMyLibri';

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
                <li class="list-group-item ${libro.disponibilita ? 'disponibile' : 'non-disponibile'}">
                    <strong>Disponibilità:</strong> ${libro.disponibilita ? 'Disponibile' : 'Non disponibile'}
                </li>
            </ul>

            <a href="#" class="toggle-details mt-2 d-block">
                <i class="fas fa-chevron-down"></i> Mostra dettagli
            </a>

            <button class="open-modal-btn btn btn-primary mt-3" data-index="${index}">Prenota</button>
        </div>
    </div>

    <div class="modal modal-libro" data-index="${index}" style="display: none;" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="modal-content">
            <button class="close-modal-btn close" aria-label="Chiudi Modale">&times;</button>
            <h2 class="mb-3">Prenota il libro: <em>${libro.titolo}</em></h2>
            <form class="form-prenotazione">
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
>>>>>>> 33b1cb2f812e8df8a2d31390a62b5698fd50d669
                `;

                libriContainer.appendChild(col);
            });
<<<<<<< HEAD
=======

         
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
>>>>>>> 33b1cb2f812e8df8a2d31390a62b5698fd50d669
        })
        .catch(error => {
            loadingElement.style.display = 'none';
            errorElement.textContent = `Si è verificato un errore: ${error.message}`;
            errorElement.style.display = 'block';
            console.error('Errore:', error);
        });
<<<<<<< HEAD
});
=======

    function toggleDetails(element) {
        const detailsList = element.previousElementSibling;
        if (!detailsList) return;

        const isVisible = detailsList.style.display === 'block';
        detailsList.style.display = isVisible ? 'none' : 'block';
        element.innerHTML = isVisible
            ? '<i class="fas fa-chevron-down"></i> Mostra dettagli'
            : '<i class="fas fa-chevron-up"></i> Nascondi dettagli';
    }
});
function checkSession() {
    const now = Date.now();
    if (now > datiLogin.expiryTime) {
        alert("Sessione scaduta, effettua di nuovo il login");
        sessionStorage.removeItem("utente");
        window.location.href = "/login/login.html";
        return false;
    }
    return true;
}
checkSession();
>>>>>>> 33b1cb2f812e8df8a2d31390a62b5698fd50d669
