document.addEventListener('DOMContentLoaded', () => {
    const formAggiungiUtente = document.getElementById('formAggiungiUtente');
    const messaggioErrore = document.getElementById('messaggioErrore');

    formAggiungiUtente.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = formAggiungiUtente.nome.value.trim();
        const cognome = formAggiungiUtente.cognome.value.trim();
        const codiceFiscale = formAggiungiUtente.codiceFiscale.value.trim();
        const classe = formAggiungiUtente.classe.value.trim();
        const email = formAggiungiUtente.email.value.trim();
        const username = formAggiungiUtente.username.value.trim();
        const password = formAggiungiUtente.password.value.trim();
        const confirmPassword = formAggiungiUtente.confirmPassword.value.trim();
        const idRuolo = 2; // alunno
        const nomeRuolo = "alunno";

        messaggioErrore.textContent = '';

        if (!nome || !cognome || !codiceFiscale || !classe || !email || !username || !password || !confirmPassword) {
            messaggioErrore.textContent = 'Compila tutti i campi!';
            return;
        }

        // Verifica che password e conferma password coincidano
        if (password !== confirmPassword) {
            messaggioErrore.textContent = 'Le password non corrispondono!';
            return;
        }

        const nuovoUtente = {
            nome,
            cognome,
            codiceFiscale,
            classe,
            email,
            username,
            password,
            idRuolo,
            nomeRuolo
        };

        fetch('http://localhost:8080/api/utente/aggiungiUtente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuovoUtente)
        })
        .then(response => {
            if (!response.ok) throw new Error('Errore nell\'aggiunta utente');
            alert('Registrazione effettuata! Controlla la tua email per confermare l\'account.');
            window.location.href = '../homePage/homepage.html';
        })
        .catch(error => {
            console.error('Errore:', error);
            messaggioErrore.textContent = 'Errore durante la registrazione. Riprova.';
        });
    });
});
