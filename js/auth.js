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
            window.location.href = `${baseURL}/HTML/Fatec/Projeto/home.html`
        })
        .catch(error => {
            var mensagemErro = ''
            switch (error.code) {
                case 'auth/invalid-email':
                    mensagemErro = 'O e-mail informado é inválido!'
                    break;
                case 'aluth/email-already-exists':
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
            window.location.href = `${baseURL}/HTML/Fatec/Projeto/index.html`
        })
        .catch(error => {
            alert(`Nâo foi possível cadastrar o usuário. erro: ${error.message}`)
        })
}
/**
 * verificaLogado
 * Verifica se o usuário está logado no sistema
 * @param {Null}
 */
function verificaLogado() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            console.log('Acesso inválido. Redirecionando...')
            window.location.href = baseURL
        }
    })
}
function logout() {
    alert('Saindo!')
    window.location.href = `${baseURL}/HTML/Fatec/Projeto/index.html`
}