document.addEventListener('DOMContentLoaded', function () {
    const libriContainer = document.getElementById('libri-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

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
