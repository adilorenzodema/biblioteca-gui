const messaggioErrore=document.getElementById("messaggioErrore")
const loginBtn = document.getElementById("loginBtn");

function doLogin() {
    const username = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;

    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(dataJson => {
      if(dataJson.status===200){
      console.log("Risposta server:", dataJson);
      window.location.href = "/homePage/homepage.html";
      }
      else if(dataJson.status===500){
        messaggioErrore.innerHTML="credenziali sbagliate";
      }
      else{
        messaggioErrore.innerHTML="errore sconosciuto";
      }
    })
    .catch(error => {
      console.error("Errore nella fetch:", error);
      alert("Errore nella comunicazione con il server");
    });
};
