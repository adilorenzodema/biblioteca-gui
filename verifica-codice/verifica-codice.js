 document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const username = urlParams.get('username');
            document.getElementById('username').value = username;

            const form = document.getElementById('verificaForm');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const codice = document.getElementById('codice').value;
                
                try {
                    const response = await fetch('https://biblioteca-scolastica.onrender.com/api/utente/verificaCodice', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `username=${username}&codice=${codice}`
                    });

                    const result = await response.text();
                    document.getElementById('messaggio').textContent = result;
                    
                    if(response.ok) {
                        setTimeout(() => {
                            window.location.href = '../login/login.html';
                        }, 2000);
                    }
                } catch (error) {
                    document.getElementById('messaggio').textContent = 'Errore di connessione';
                }
            });
        });