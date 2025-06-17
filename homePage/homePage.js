const logoutBtn=document.getElementById("logoutButton");
function logout() {
    sessionStorage.clear();
    window.location.href = "/login.html";
}
logoutBtn.addEventListener("click", logout);