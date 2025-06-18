const messaggioErrore = document.getElementById("messaggioErrore");
const loginBtn = document.getElementById("loginBtn");

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
            return response.json()
        } else if (response.status === 500) {
            messaggioErrore.innerHTML = "Credenziali sbagliate";
        } else {
            messaggioErrore.innerHTML = "Errore sconosciuto";
        }
        return response.json();
    })
    .then(utenteLoggato => {
        const loginTime = Date.now();
        const expiryTime = loginTime + (1*60*60*1000);

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
            alert("Errore nella comunicazione con il server");
    })

}