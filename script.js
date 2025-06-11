const loginBtn=document.getElementById("loginBtn");
const inputPassword=document.getElementById("inputPassword").value;
const inputEmail=document.getElementById("inputEmail").value;
function stampaDati(){
    console.log(document.getElementById("inputEmail").value);
}
loginBtn.addEventListener("click", stampaDati());
