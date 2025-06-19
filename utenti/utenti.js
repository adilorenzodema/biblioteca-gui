document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('utenti-container');
    const apiUrl = 'http://localhost:8080/api/utente/getAllUtenti';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel recupero degli utenti');
            }
            return response.json();
        })
        .then(utenti => {
            if (utenti.length === 0) {
                container.innerHTML = `<p>Nessun utente trovato.</p>`;
                return;
            }

            utenti.forEach(utente => {
                const card = document.createElement('div');
                card.className = 'card-utente';

                card.innerHTML = `
                    <div class="card-content">
                        <h3>${utente.nome} ${utente.cognome}</h3>
                        <p><strong>Codice Fiscale:</strong> ${utente.codiceFiscale}</p>
                        <p><strong>Username:</strong> ${utente.username}</p>
                        <p><strong>Password:</strong> ${utente.password}</p>
                        <p><strong>Data Creazione:</strong> ${formatDate(utente.dataCreazione)}</p>
                        <p><strong>Data Modifica:</strong> ${formatDate(utente.dataModifica)}</p>
                        <p><strong>Attivo:</strong> ${utente.active ? 'Sì' : 'No'}</p>
                        <p><strong>ID Ruolo:</strong> ${utente.idRuolo}</p>
                        <p><strong>Nome Ruolo:</strong> ${utente.nomeRuolo}</p>
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Errore nel caricamento:', error);
            container.innerHTML = `<p>Errore durante il caricamento dei dati.</p>`;
        });
    function formatDate(data) {
        if (!data) return '-';
        const date = new Date(data);
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
});
