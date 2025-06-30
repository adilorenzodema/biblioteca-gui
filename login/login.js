const messaggioErrore = document.getElementById("messaggioErrore");
const loginBtn = document.getElementById("loginBtn");
const registerBtn=document.getElementById("registerBtn")

function doLogin() {
    const username = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;

    fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 500) {
            messaggioErrore.innerHTML = "Credenziali sbagliate";
            throw new Error("Credenziali sbagliate"); // Stop chaining
        } else {
            messaggioErrore.innerHTML = "Errore sconosciuto";
            throw new Error("Errore sconosciuto");
        }
    })
    .then(utenteLoggato => {
        if (!utenteLoggato.active) {
            messaggioErrore.innerHTML = "Il tuo account non è attivo.";
            return; // blocca il login
        }

        const loginTime = Date.now();
        const expiryTime = loginTime + (1 * 60 * 60 * 1000); // 1 ora

        const datiLogin = {
            utente: utenteLoggato,
            loginTime: loginTime,
            expiryTime: expiryTime
        };

        sessionStorage.setItem("utente", JSON.stringify(datiLogin));

        console.log("Sessione salvata:", datiLogin);
        window.location.href = "../homePage/homepage.html";
    })
    .catch(error => {
        console.error("Errore nella fetch:", error);
        // alert già gestito sopra se è stato uno degli errori previsti
        // ma possiamo aggiungere fallback:
        if (!messaggioErrore.innerHTML) {
            alert("Errore nella comunicazione con il server");
        }
    });
}

function relocation(){
    window.location.href = '../registrazione/registrazione.html';
}
registerBtn.addEventListener("click", relocation);