document.addEventListener('DOMContentLoaded', function() {
    const libriContainer = document.getElementById('libri-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    const apiUrl = 'http://localhost:8080/api/libri/getAllLibri';
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel recupero dei dati');
            }
            return response.json();
        })
        .then(libri => {
            loadingElement.style.display = 'none';
            
            if (libri.length === 0) {
                libriContainer.innerHTML = '<div class="col-12"><div class="alert alert-info">Nessun libro disponibile nel catalogo.</div></div>';
                return;
            }
            
            libri.forEach(libro => {
                const col = document.createElement('div');
                col.className = 'col';
                
                const copertinaUrl = libro.link;
                
                col.innerHTML = `
                    <div class="card libro-card h-100">
                        <img src="${copertinaUrl}" class="card-img-top">
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
                            
                            <a class="toggle-details mt-2 d-block" onclick="toggleDetails(this)">
                                <i class="fas fa-chevron-down"></i> Mostra dettagli
                            </a>
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

function toggleDetails(element) {
    const detailsList = element.previousElementSibling;
    const icon = element.querySelector('i');
    
    if (detailsList.style.display === 'none' || !detailsList.style.display) {
        detailsList.style.display = 'block';
        element.innerHTML = '<i class="fas fa-chevron-up"></i> Nascondi dettagli';
    } else {
        detailsList.style.display = 'none';
        element.innerHTML = '<i class="fas fa-chevron-down"></i> Mostra dettagli';
    }
}