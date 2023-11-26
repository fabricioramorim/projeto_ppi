(function($) {
    "use strict";
	
	// Options for Message
	//----------------------------------------------
  var options = {
	  'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
	  'btn-success': '<i class="fa fa-check"></i>',
	  'btn-error': '<i class="fa fa-remove"></i>',
	  'msg-success': 'All Good! Redirecting...',
	  'msg-error': 'Wrong login credentials!'
  };
});

/**
 * salvar
 * Salva os dados do formulário na collection do Firebase
 * @param {object} event - Evento do objeto que foi clicado
 * @param {string} collection - Nome da collection que será salva no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection) {
    event.preventDefault() // evita que o formulário seja recarregado
    //Verificando os campos obrigatórios
    if (document.getElementById('nome').value === '') { alert('⚠️ É obrigatório infromar o nome!') }
    else if (document.getElementById('email').value === '') { alert('⚠️ É obrigatório infromar o email!') }
    else if (document.getElementById('nascimento').value === '') { alert('⚠️ É obrigatório infromar a data de Nascimento!') }
    else if (document.getElementById('id').value !== '') {
        alterar(event, collection)
    }
    else { incluir(event, collection) }
}

function incluir(event, collection) {
    event.preventDefault() // evita que o formulário seja recarregado
    //Obtendo os campos do formulário
    const form = document.forms[0]
    const data = new FormData(form)
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries())
    //console.log(`os dados são:`)
    //console.log(values)
    //O retorno é uma Promise (promessa)
    /*let nome = document.getElementById('nome').value
    let nascimento = document.getElementById('nascimento').value
    let email = document.getElementById('email').value
    const pessoa = {
        nome: nome,
        nascimento: nascimento,
        email: email
    }*/

    return firebase.database().ref(collection).push(values)
        .then(() => {
            alert('✅ Registro cadastrado com sucesso!')
            document.getElementById('formCadastro').reset() //Limpar o formulário
        })
        .catch(error => {
            console.error(`Ocorreu um erro: ${error.code}-${error.message}`)
            alert(`❌ Falha ao incluir: ${error.message}`)
        })
}

/**
 * obtemDados.
 * Obtém os dados da collectiona partir do Firebase
 * @param {string} collection - Nome da Collection no Firebase
 * @return {object} - Uma tabela com os dados obtidos
 */

function obtemDados(collection) {
    var tabela = document.getElementById('tabelaDados')
    firebase.database().ref(collection).on('value', (snapshot) => {
        tabela.innerHTML = ''
        let cabecalho = tabela.insertRow()
        cabecalho.className = 'table-info'
        cabecalho.insertCell().textContent = 'Nome'
        cabecalho.insertCell().textContent = 'Nascimento'
        cabecalho.insertCell().textContent = 'Email'
        cabecalho.insertCell().textContent = 'Sexo'
        cabecalho.insertCell().textContent = 'Salário'
        cabecalho.insertCell().textContent = 'Opções'

        snapshot.forEach(item => {
            //Dados do Firebase
            let db = item.ref.path.pieces_[0] // collection
            let id = item.ref.path.pieces_[1] // id
            let registro = JSON.parse(JSON.stringify(item.val()))
            //Criando as novas linhas na tabela
            let novaLInha = tabela.insertRow()
            novaLInha.insertCell().textContent = item.val().nome
            novaLInha.insertCell().textContent = new Date(item.val().nascimento).toLocaleDateString()
            novaLInha.insertCell().textContent = item.val().email
            novaLInha.insertCell().textContent = item.val().sexo
            novaLInha.insertCell().textContent = item.val().salario
            novaLInha.insertCell().innerHTML =
                `
            <button class='btn btn-danger' title='Remove o registro corrente' onclick=remover('${db}','${id}')>🗑️</button>
            <button class='btn btn-warning' title='Edita o registro corrente' onclick=carregaDadosAlteracao('${db}','${id}')>✏️</button>
            `
        })
        let rodape = tabela.insertRow()
        rodape.className = 'table-primary'
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().textContent = ''
        rodape.insertCell().innerHTML = totalRegistros(collection)
    })
}

/**
 * totalRegistros.
 * Retorna a contagem total do número de registro da collection informada
 * @param {string} collection - Nome da collection no Firebase
 * @return {string} - Texto com o total de registros
 */

function totalRegistros(collection) {
    var retorno = '...'
    firebase.database().ref(collection).on('value', (snapshot) => {
        if (snapshot.numChildren() == 0) {
            retorno = 'Ainda não há nenhum registro cadastrado!'
        } else {
            retorno = `Total de Registros: ${snapshot.numChildren()}`
        }
    })
    return retorno
}

/**
 * remover
 * Remove os dados da collection a partir do id informado
 * @param {string} db - Nome da collection do Firebase
 * @param {integer} id - Id do registro no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function remover(db, id) {
    //Iremos confirmar com o usuário
    if (window.confirm('🔴 Confirma a exclusão do registro?')) {
        let dadoExclusao = firebase.database().ref().child(db + '/' + id)
        dadoExclusao.remove()
            .then(() => {
                alert('✅ Registro removido com sucesso!')
            })
            .catch(error => {
                alert('❌ Fala ao excluir: ' + error.message)
            })
    }
}

function carregaDadosAlteracao(db, id) {
    firebase.database().ref(db).on('value', (snapshot) => {
        snapshot.forEach(item => {
            if (item.ref.path.pieces_[1] === id) {
                //Se for igual ao id, iremos igualar os campos
                document.getElementById('id').value = item.ref.path.pieces_[1]
                document.getElementById('nome').value = item.val().nome
                document.getElementById('email').value = item.val().email
                document.getElementById('nascimento').value = item.val().nascimento
                document.getElementById('salario').value = item.val().salario
                //Campo Sexo    
                if (item.val().sexo === 'Masculino') {
                    document.getElementById('sexoM').checked = true
                } else {
                    document.getElementById('sexoF').checked = true
                }
            }
        })
    })
}

function alterar(event, collection) {
    event.preventDefault()
    //Obtendo os campos do formulário
    const form = document.forms[0];
    const data = new FormData(form);
    //Obtendo os valores dos campos
    const values = Object.fromEntries(data.entries());
    console.log(values)
    //Enviando os dados dos campos para o Firebase
    return firebase.database().ref().child(collection + '/' + values.id).update({
        nome: values.nome,
        email: values.email,
        sexo: values.sexo,
        nascimento: values.nascimento,
        salario: values.salario
    })
        .then(() => {
            alert('✅ Registro alterado com sucesso!')
            document.getElementById('formCadastro').reset()
        })
        .catch(error => {
            console.log(error.code)
            console.log(error.message)
            alert('❌ Falha ao alterar: ' + error.message)
        })
}