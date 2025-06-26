document.addEventListener("DOMContentLoaded", function () {
    const datiLoginString = sessionStorage.getItem("utente");

    if (!datiLoginString) {
        alert("Sessione non trovata. Effettua il login.");
        window.location.href = "../login/login.html";
        return;
    }

    const datiLogin = JSON.parse(datiLoginString);
    const ruolo = datiLogin.utente.nomeRuolo;

    // Mostra "Gestione Utenti" solo per admin o operatori
    if (ruolo === "admin" || ruolo === "operatore") {
        const navList = document.getElementById("navList");

        const nuovoElementoNav = document.createElement("li");
        const linkUtenti = document.createElement("a");
        linkUtenti.href = "../utenti/utenti.html";
        linkUtenti.textContent = "Gestione Utenti";

        nuovoElementoNav.appendChild(linkUtenti);
        navList.appendChild(nuovoElementoNav);

        const nuovoElementoNavPrestiti = document.createElement("li");
        const linkPrestiti = document.createElement("a");
        linkPrestiti.href = "../gestisciPrestiti/gestisciPrestiti.html";
        linkPrestiti.textContent = "Gestione Prestiti";

        nuovoElementoNav.appendChild(linkPrestiti);
        navList.appendChild(nuovoElementoNav);
    }

    // Nascondi "Area Personale" se NON è un alunno
    if (ruolo !== "alunno") {
        const areaPersonaleLink = document.getElementById("areaPersonaleLink");
        if (areaPersonaleLink) {
            areaPersonaleLink.parentElement.remove(); // rimuove il <li> intero
        }
    }
});

// Gestione logout e sessione
const logoutBtn = document.getElementById("logoutButton");
function logout() {
    sessionStorage.clear();
    window.location.href = "../login/login.html";
}
logoutBtn.addEventListener("click", logout);

function checkSession() {
    const datiLoginString = sessionStorage.getItem("utente");
    if (!datiLoginString) return;

    const datiLogin = JSON.parse(datiLoginString);
    const now = Date.now();

    if (now > datiLogin.expiryTime) {
        alert("Sessione scaduta, effettua di nuovo il login");
        sessionStorage.removeItem("utente");
        window.location.href = "../login/login.html";
        return false;
    }
    return true;
}
checkSession();

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