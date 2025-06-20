document.addEventListener('DOMContentLoaded', () => {
    const formAggiungiUtente = document.getElementById('formAggiungiUtente');
    const messaggioErrore = document.getElementById('messaggioErrore');

    formAggiungiUtente.addEventListener('submit', function(e) {
        e.preventDefault();

        const nuovoUtente = {
            nome: formAggiungiUtente.nome.value.trim(),
            cognome: formAggiungiUtente.cognome.value.trim(),
            codiceFiscale: formAggiungiUtente.codiceFiscale.value.trim(),
            classe: formAggiungiUtente.classe.value.trim(),
            username: formAggiungiUtente.username.value.trim(),
            password: formAggiungiUtente.password.value.trim(),
            idRuolo: 2,
            nomeRuolo: "alunno"
        };

        messaggioErrore.textContent = '';

        if (!nuovoUtente.nome || !nuovoUtente.cognome || !nuovoUtente.codiceFiscale || !nuovoUtente.classe || !nuovoUtente.username || !nuovoUtente.password) {
            messaggioErrore.textContent = 'Compila tutti i campi!';
            return;
        }

        fetch('http://localhost:8080/api/utente/aggiungiUtente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuovoUtente)
        })
        .then(response => {
            if (!response.ok) throw new Error('Errore nell\'aggiunta utente');
            alert('Utente aggiunto con successo!');
            window.location.href = '../homePage/homepage.html';
        })
        .catch(error => {
            console.error('Errore:', error);
            messaggioErrore.textContent = 'Errore durante l\'aggiunta utente. Riprova.';
        });
    });
});
