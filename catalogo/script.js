document.addEventListener('DOMContentLoaded', function() {
    const libriContainer = document.getElementById('libri-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    const apiUrl = 'http://localhost:8080/api/libri/getAllLibri';
    
    fetch(apiUrl)
        .then(response => { //gestisce la risposta HTTP 
            //verifica che la risposta sia avvenuta correttante
            if (!response.ok) {
                console.log("AIUTO c'e un errore!!!!")
                throw new Error('Errore nel recupero dei dati'); //solleva en'eccezione, mandando un messaggio di errore
                
            }
            console.log("AIUTO!!!!")
            return response.json(); //restituisce la risposta in formato json
        })
        //gestisce i libri ricevuti 
        .then(libri => {
            console.log("AIUTO 2!!!!")
            loadingElement.style.display = 'none';
            //controlla che ci siano libri nel catagolo
            if (libri.length === 0) {
                libriContainer.innerHTML = '<p>Nessun libro disponibile nel catalogo.</p>';
                return;
                console.log("AIUTO non ci sono libri!!!!")
            }
            //per ogni libro inserisce le informazioni
            libri.forEach(libro => {
                console.log("AIUTO sto guardando i libri!!!!")
                const libroCard = document.createElement('div');
                libroCard.className = 'libro-card';
                
                libroCard.innerHTML = `
                    <h3>${libro.titolo}</h3>
                    <p><strong>Autore:</strong> ${libro.autore}</p>
                    <p><strong>Casa editrice:</strong> ${libro.casaEditrice}</p>
                    <p><strong>Genere:</strong> ${libro.genere}</p>
                    <p><strong>ISBN:</strong> ${libro.iban}</p>
                    <p><strong>Disponibilita:</strong> ${libro.disponibilita}</p>
                    ${libro.descrizione ? `<p>${libro.descrizione}</p>` : ''}
                `;
                
                libriContainer.appendChild(libroCard);
            });
        })
        //gestisce gli errori
        .catch(error => {
            loadingElement.style.display = 'none';
            errorElement.textContent = `Si è verificato un errore: ${error.message}`;
            errorElement.style.display = 'block';
            console.error('Errore:', error);
        });
});