const baseURL = "http://127.0.0.1:5500"

/**
 * loginFirebase
 * Realiza a autenticação do usuário no firabase
 * @param {String} email - email do usuário
 * @param {String} senha - senha do usuário
 * @return {object} - Objeto com o usupario logado
 */
function loginFirebase(email, senha) {
    firebase
        .auth()
        .signInWithEmailAndPassword(email, senha)
        .then(result => {
            alert(`Bem vindo, ${JSON.stringify(result.user.email)}`)
            window.location = "books.html"
        })
        .catch(error => {
            var mensagemErro = ''
            switch (error.code) {
                case 'auth/invalid-email':
                    mensagemErro = 'O e-mail informado é inválido!'
                    break;
                case 'auth/email-already-exists':
                    mensagemErro = 'O e-mail informado já está sendo utilizado!'
                    break;
                default:
                    mensagemErro = error.message
            }
            alert(`Erro ao efetuar o login: ${mensagemErro}`)
        })
}
/**
 * novoUsuario.
 * Cria um novo usuário no Firebase
 * @param {string} email - email do usuário
 * @param {string} senha - senha do usuário
 * @return {object} - O usuário criado
 */
function novoUsuario(email, senha) {
    firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then((result) => {
            alert(`Bem vindo, ${JSON.stringify(result.user.email)}`)
            // Direcionameos o usuário para a tela inicial
            window.location = "books.html"
        })
        .catch(error => {
            alert(`Nâo foi possível cadastrar o usuário. erro: ${error.message}`)
        })
}

/**
 * loginGoogle
 * Realiza a autenticação do usuário no firabase
 * @param {Null}
 *  
    */

function loginGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            alert(`Bem vindo, ${JSON.stringify(result.user.email)}`)
            window.location = "books.html"
        })
        .catch(error => {
            alert(`Erro ao efetuar o login: ${error.message}`)
        })
}


/**
 * verificaLogado
 * Verifica se o usuário está logado no sistema
 * @param {Null}
 */
function verificaLogado() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
        } else {
            // Caso não esteja logado, direcionamos ele para a tela de login
            window.location = "index.html"
        }
    })
}

function logout() {
    // Realiza o logout do usuário firebase
    firebase.auth().signOut()
        .then(() => {
            // Direciona o usuário para a tela de login
            window.location = "index.html"
        })
        .catch(error => {
            alert(`Erro ao efetuar o logout: ${error.message}`)
        })
}