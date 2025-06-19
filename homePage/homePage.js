document.addEventListener("DOMContentLoaded", function () {
    const datiLoginString = sessionStorage.getItem("utente");

    if (!datiLoginString) {
        alert("Sessione non trovata. Effettua il login.");
        window.location.href = "../login/login.html";
        return;
    }

    const datiLogin = JSON.parse(datiLoginString);
    const ruolo = datiLogin.utente.nomeRuolo;

    if (ruolo === "admin" || ruolo === "operatore") {
        const navList = document.getElementById("navList");

        const nuovoElementoNav = document.createElement("li");
        const link = document.createElement("a");
        link.href = "../utenti/utenti.html";
        link.textContent = "Gestione Utenti";

        nuovoElementoNav.appendChild(link);
        navList.appendChild(nuovoElementoNav);
    }
});
const logoutBtn=document.getElementById("logoutButton");
function logout() {
    sessionStorage.clear();
    window.location.href = "../login/login.html";
}
function checkSession() {
    const now = Date.now();
    if (now > datiLogin.expiryTime) {
        alert("Sessione scaduta, effettua di nuovo il login");
        sessionStorage.removeItem("utente");
        window.location.href = "../login/login.html";
        return false;
    }
    return true;
}
logoutBtn.addEventListener("click", logout)
checkSession();
