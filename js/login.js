// Funcao para validar o usuario
function validateUser(email, password) {
    // Checar se o email e senha estão corretos
    const storedPassword = localStorage.getItem(email);

    // Checar se o email existe no localStorage
    if (!storedPassword || storedPassword !== password) {
        document.getElementById("loginMessage").style.color = "red";
        return 'E-mail ou senha inválidos';
    }

    // Aguardar 3 segundos e redirecionar para a página home.html
    setTimeout(function() {
        window.location.href = "home.html";
    }, 3000);
    
    document.getElementById("loginMessage").style.color = "green";
    return 'Usuario validado com sucesso. Redirecionando...';
  }


// Capturar o formulário de login
var loginForm = document.getElementById("loginForm");

// Adicionando evento de submit ao formulário de login
loginForm.addEventListener("submit", function(event) {
  event.preventDefault();
  
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  
  var message = validateUser(email, password);
  
  if (message !== 'E-mail ou senha inválidos') {
      message = 'Usuário validado com sucesso. Redirecionando...';
  }
  
  document.getElementById("loginMessage").innerText = message;
});