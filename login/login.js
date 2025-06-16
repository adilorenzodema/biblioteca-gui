const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", function(event) {
    const email = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;
    console.log("Email:", email);
    console.log("Password:", password);

    fetch("http://localhost:8080/api/login/checkUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    .then(data => {
      console.log("Risposta server:", data);
      if (data.loginSuccess) {
        window.location.href = "/homePage/homepage.html";
      } else {
        alert("Email o password errati");
      }
    })
    .catch(error => {
      console.error("Errore nella fetch:", error);
      alert("Errore nella comunicazione con il server");
    });
  });
