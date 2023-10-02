// Funcao para registrar um usuario
function registerUser(email, password) {
    // Checar se o email ja esta cadastrado
    if (localStorage.getItem(email)) {
        document.getElementById("registerMessage").style.color = "red";
        return 'E-mail ja cadastrado';
    }

    // Armazenar o email e senha no localStorage
    localStorage.setItem(email, password);
        document.getElementById("registerMessage").style.color = "green";
        return 'Usuario cadastrado com sucesso';
}

// Capturando os formulários
var registerForm = document.getElementById("registrationForm");

// Evento de submit do formulário de registro
registerForm.addEventListener("submit", function(event) {
  event.preventDefault();
  
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  
  var message = registerUser(email, password);
  
  document.getElementById("registerMessage").innerText = message;
});