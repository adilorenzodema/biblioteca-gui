const logoutBtn=document.getElementById("logoutButton");
function logout() {
    sessionStorage.clear();
    window.location.href = "/login/login.html";
}
function checkSession() {
    const now = Date.now();
    if (now > datiLogin.expiryTime) {
        alert("Sessione scaduta, effettua di nuovo il login");
        sessionStorage.removeItem("utente");
        window.location.href = "/login/login.html";
        return false;
    }
    return true;
}
checkSession();
logoutBtn.addEventListener("click", logout);