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
        messaggioErrore.style.display = 'none';

        // Validazione campi obbligatori
        if (!nome || !cognome || !codiceFiscale || !classe || !email || !username || !password || !confirmPassword) {
            mostraErrore('Compila tutti i campi obbligatori!');
            return;
        }

        // Validazione email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostraErrore('Inserisci un indirizzo email valido!');
            return;
        }

        // Validazione password
        if (password !== confirmPassword) {
            mostraErrore('Le password non corrispondono!');
            return;
        }

        if (password.length < 8) {
            mostraErrore('La password deve essere lunga almeno 8 caratteri!');
            return;
        }

        // Creazione oggetto utente
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

        // Disabilita il bottone durante la richiesta
        const registerBtn = document.getElementById('registerBtn');
        registerBtn.disabled = true;
        registerBtn.textContent = 'Registrazione in corso...';

        // Invia i dati al backend
        fetch('http://localhost:8080/api/utente/aggiungiUtente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuovoUtente)
        })
        .then(response => {
            if (!response.ok) throw new Error('Errore durante l\'eliminazione dell\'utente');
            messaggioErrore.style.color = 'green';
            messaggioErrore.textContent = 'Registrazione completata! Controlla la tua email per verificare l\'account.';
            messaggioErrore.style.display = 'block';
            
            // Resetta il form
            formAggiungiUtente.reset();                      
        })
        .catch(error => {
            console.error('Errore:', error); 
            
            let errorMessage = 'Errore durante la registrazione';
            try {
                const errorObj = JSON.parse(error.message);
                if (errorObj.message && errorObj.message.includes("username")) {
                    errorMessage = 'Username già esistente';
                } else if (errorObj.message && errorObj.message.includes("email")) {
                    errorMessage = 'Email già registrata';
                }
            } catch (e) {
                // Non è un JSON, usa il messaggio originale
                if (error.message.includes("username")) {
                    errorMessage = 'Username già esistente';
                } else if (error.message.includes("email")) {
                    errorMessage = 'Email già registrata';
                }
            }
            
            mostraErrore(errorMessage);
        })
        .finally(() => {
            // Riabilita il bottone
            registerBtn.disabled = false;
            registerBtn.textContent = 'Registrati';
        });
    });

    function mostraErrore(messaggio) {
        messaggioErrore.style.color = 'red';
        messaggioErrore.textContent = messaggio;
        messaggioErrore.style.display = 'block';
        
        // Scrolla fino al messaggio di errore
        messaggioErrore.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});