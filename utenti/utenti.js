document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('utenti-container');
    const filtroContainer = document.getElementById('filtro-container');
    const aggiungiUtenteContainer = document.getElementById('aggiungi-utente-container');
    const modal = document.getElementById('modalAggiungiUtente');
    const formAggiungiUtente = document.getElementById('formAggiungiUtente');

    const apiBaseUrl = 'http://localhost:8080/api/utente';

    const datiLoginString = sessionStorage.getItem("utente");
    const datiLogin = datiLoginString ? JSON.parse(datiLoginString) : null;
    const ruoloLoggato = datiLogin && datiLogin.utente ? datiLogin.utente.nomeRuolo : null;

    const ruoliFiltro = ['admin', 'operatore', 'alunno'];

    let utentiCaricati = [];
    
    function apriModal() {
        modal.style.display = 'flex';
    }

    function chiudiModal() {
        modal.style.display = 'none';
        formAggiungiUtente.reset();
    }

    modal.querySelector('.close-modal-btn').addEventListener('click', chiudiModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            chiudiModal();
        }
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

    function mostraUtenti(listaUtenti) {
        container.innerHTML = '';
        if (listaUtenti.length === 0) {
            container.innerHTML = `<p>Nessun utente trovato</p>`;
            return;
        }

        listaUtenti.forEach(utente => {
            const card = document.createElement('div');
            card.className = 'card-utente';

            let html = `
                <div class="card-content">
                    <h3>${utente.nome} ${utente.cognome}</h3>
                    <p><strong>Codice Fiscale:</strong> ${utente.codiceFiscale}</p>
                    <p><strong>Classe:</strong> ${utente.classe}</p>
                    <p><strong>Username:</strong> ${utente.username}</p>
                    <p><strong>Password:</strong> ${utente.password}</p>
                    <p><strong>Data Creazione:</strong> ${formatDate(utente.dataCreazione)}</p>
                    <p><strong>Data Modifica:</strong> ${formatDate(utente.dataModifica)}</p>
                    <p><strong>Attivo:</strong> ${utente.active ? 'Sì' : 'No'}</p>
                    <p><strong>ID Ruolo:</strong> ${utente.idRuolo}</p>
                    <p><strong>Nome Ruolo:</strong> ${utente.nomeRuolo}</p>
            `;

            if (ruoloLoggato === 'admin' && utente.nomeRuolo.toLowerCase() !== 'admin') {
                html += `
                    <button class="btn btn-danger btn-rimuovi-utente" data-id="${utente.idUtente}">
                        Rimuovi utente
                    </button>`;
            }
            html += `</div>`;

            card.innerHTML = html;
            container.appendChild(card);
        });

        // Gestione eliminazione utenti
        document.querySelectorAll('.btn-rimuovi-utente').forEach(button => {
            button.addEventListener('click', function () {
                const idUtente = this.getAttribute('data-id');
                if (confirm('Sei sicuro di voler eliminare questo utente?')) {
                    fetch(`${apiBaseUrl}/${idUtente}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        if (!response.ok) throw new Error('Errore durante l\'eliminazione dell\'utente');
                        alert('Utente eliminato con successo!');
                        caricaUtenti(); // Ricarica la lista dopo eliminazione
                    })
                    .catch(error => {
                        console.error('Errore nella cancellazione:', error);
                        alert('Errore durante l\'eliminazione. Riprova.');
                    });
                }
            });
        });
    }

    function caricaUtenti(ruolo = null) {
        let url = `${apiBaseUrl}/getAllUtenti`;
        if (ruolo && ruolo !== 'tutti') {
            url += `/${ruolo}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Errore nel recupero degli utenti');
                return response.json();
            })
            .then(utenti => {
                utentiCaricati = utenti;
                mostraUtenti(utentiCaricati);
            })
            .catch(error => {
                console.error('Errore nel caricamento:', error);
                container.innerHTML = `<p>Errore durante il caricamento dei dati.</p>`;
            });
    }

    function creaBottoniFiltro() {
        filtroContainer.innerHTML = '';

        const btnTutti = document.createElement('button');
        btnTutti.className = 'btn btn-secondary me-2 mb-2';
        btnTutti.textContent = 'Tutti';
        btnTutti.addEventListener('click', () => caricaUtenti(null));
        filtroContainer.appendChild(btnTutti);

        ruoliFiltro.forEach(r => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary me-2 mb-2';
            btn.textContent = r.charAt(0).toUpperCase() + r.slice(1);
            btn.addEventListener('click', () => caricaUtenti(r));
            filtroContainer.appendChild(btn);
        });
    }

    function creaBottoneAggiungi() {
        const btn = document.createElement('button');
        btn.className = 'btn btn-success';
        btn.textContent = 'Aggiungi Utente';
        btn.addEventListener('click', apriModal);
        aggiungiUtenteContainer.appendChild(btn);
    }

    formAggiungiUtente.addEventListener('submit', function(e) {
        e.preventDefault();

        const nuovoUtente = {
            nome: formAggiungiUtente.nome.value.trim(),
            cognome: formAggiungiUtente.cognome.value.trim(),
            codiceFiscale: formAggiungiUtente.codiceFiscale.value.trim(),
            classe: formAggiungiUtente.classe.value.trim(),
            username: formAggiungiUtente.username.value.trim(),
            password: formAggiungiUtente.password.value.trim(),
            idRuolo: parseInt(formAggiungiUtente.idRuolo.value, 10),
            nomeRuolo: formAggiungiUtente.nomeRuolo.value.trim()
        };

        fetch(`${apiBaseUrl}/aggiungiUtente`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuovoUtente)
        })
        .then(response => {
            if (!response.ok) throw new Error('Errore nell\'aggiunta utente');
            alert('Utente aggiunto con successo!');
            chiudiModal();
            caricaUtenti(); // Ricarica lista utenti
        })
        .catch(error => {
            console.error('Errore:', error);
            alert('Errore durante l\'aggiunta utente. Riprova.');
        });
    });

    // Avvio iniziale
    creaBottoniFiltro();
    creaBottoneAggiungi();
    caricaUtenti(null);

    // Funzioni per sessione e logout
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
        logoutBtn.addEventListener("click", function() {
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

});
