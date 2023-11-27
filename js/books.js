/**
 * salvar
 * Salva os dados do formulário na collection do Firebase
 * @param {object} event - Evento do objeto que foi clicado
 * @param {string} collection - Nome da collection que será salva no Firebase
 * @return {null} - Snapshot atualizado dos dados
 */

function salvar(event, collection) {
  event.preventDefault() // evita que o formulário seja recarregado

  // Pegue os valores dos elementos do formulário
  let ano = document.getElementById('ano').value;
  let data = document.getElementById('data').value;

  // Verifique se o ano e a data são válidos
  let dataAtual = new Date();
  let anoAtual = dataAtual.getFullYear();
  if (ano > anoAtual) {
    alert('⚠️ O ano de publicação não pode ser maior que o ano atual!');
    return;
  }

  let dataFormatada = new Date(data);
  if (dataFormatada > dataAtual) {
    alert('⚠️ A data não pode ser maior que a data atual!');
    return;
  }

  //Verificando os campos obrigatórios
  if (document.getElementById('titulo').value === '') { alert('⚠️ É obrigatório infromar o título!') }
  else if (document.getElementById('autor').value === '') { alert('⚠️ É obrigatório infromar o autor!') }
  else if (document.getElementById('ano').value === '') { alert('⚠️ É obrigatório infromar o ano de publicação!') }
  else if (document.getElementById('data').value === '') { alert('⚠️ É obrigatório infromar a data!') }
  else { incluir(event, collection) }
}


function incluir(event, collection) {
  event.preventDefault() // evita que o formulário seja recarregado
  //Obtendo os campos do formulário
  let titulo = document.getElementById('titulo').value
  let autor = document.getElementById('autor').value
  let ano = document.getElementById('ano').value
  let dataL = document.getElementById('data').value
  let disponivel = document.getElementById('disponivel').checked
  let estado = document.querySelector('input[name="estado"]:checked').value
  let descricao = document.getElementById('descricao').value

  //criando um objeto com os dados do cliente
  let booksList = {
    titulo: titulo,
    autor: autor,
    ano: ano,
    data: dataL,
    disponivel: disponivel,
    estado: estado,
    descricao: descricao
  }
  console.log(booksList)
  //Enviando os dados dos campos para o Firebase

  firebase.firestore().collection(collection).add(booksList)
    .then(() => {
      alert('✅ Registro cadastrado com sucesso!')
      document.getElementById('formCadastro').reset() //Limpar o formulário
      listarLivros(); // Atualize a lista de livros
    })
    .catch(error => {
      console.error(`Ocorreu um erro: ${error.code}-${error.message}`)
      alert(`❌ Falha ao incluir: ${error.message}`)
    })
}
//função para listar os livros
function listarLivros() {

  //obtendo onde iremos inserir a tabela
  let tabela = document.getElementById('listagem')
  tabela.innerHTML = '' //limpamos a tabela
  //criamos uma tabela com HTML
  let table = document.createElement('table')
  table.className = 'table table-striped table-hover'
  table.innerHTML = `<thead>
                         <tr class='table-secondary'>
                           <th>Título</th>
                           <th>Autor</th>
                           <th>Ano</th>
                           <th>Data</th>
                           <th>Disponível</th>
                           <th>Estado</th>
                           <th>Descrição</th>
                           <th>Opções</th>
                         </tr>
                      </thead>
                      <tbody>
                      </tbody>   
                      `
  tabela.appendChild(table)

  //preenchendo a tabela com os dados do clientes                      
  let tbody = table.querySelector('tbody')
  firebase.firestore().collection('books').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let livro = doc.data()
      let dataObj = new Date(livro.data);
      let dia = dataObj.getDate() + 1; // O dia é indexado a partir de 0, então adicionamos 1 para obter o dia correto.
      let mes = dataObj.getMonth() + 1; // Os meses são indexados a partir de 0, então adicionamos 1 para obter o mês correto.
      let ano = dataObj.getFullYear();
      let dataFormatada = `${dia}/${mes}/${ano}`;
      let row = tbody.insertRow()
      row.innerHTML = `
                      <td>${livro.titulo}</td>
                      <td>${livro.autor}</td>
                      <td>${livro.ano}</td>
                      <td>${dataFormatada}</td>
                      <td>${livro.disponivel ? 'Disponível' : 'Indisponível'}</td>
                      <td>${livro.estado}</td>
                      <td>${livro.descricao}</td>
                      <td>
                        <button class='btn btn-clean btn-sm' onclick="apagarCliente('${doc.id}')"><i class="bi bi-trash"></i></button>
                        <button class='btn btn-clean btn-sm' onclick="editarCliente('${doc.id}')"><i class="bi bi-pencil"></i></button>
                      </td>
                      `
    });
  });
}

//chamar a função logo que carregar a página
listarLivros()

function editarCliente(id) {
  // Verifique se o ID é válido
  if (!id) {
    console.log("ID inválido!");
    return;
  }

  // Busque o livro com o ID especificado
  const livroRef = firebase.firestore().collection('books').doc(id);
  livroRef.get().then((doc) => {
    if (doc.exists) {
      // Preencha o formulário de edição com os dados do livro
      let livro = doc.data();

      // Imprima o valor do campo "data" para o modal de edição no input id="data"
      let dataObj = new Date(livro.data);
      let dia = dataObj.getDate() + 1; // O dia é indexado a partir de 0, então adicionamos 1 para obter o dia correto.
      let mes = dataObj.getMonth() + 1; // Os meses são indexados a partir de 0, então adicionamos 1 para obter o mês correto.
      let ano = dataObj.getFullYear();
      let dataFormatada = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      document.getElementById('data_edit').value = dataFormatada;
      console.log(dataFormatada);
      // Imprima o valor do campo "disponivel" para o modal de edição no input id="disponivel"
      document.getElementById('disponivel_edit').checked = livro.disponivel;
      // Imprima os demais campos
      document.getElementById('titulo_edit').value = livro.titulo;
      document.getElementById('autor_edit').value = livro.autor;
      document.getElementById('ano_edit').value = livro.ano;
      document.getElementById('descricao_edit').value = livro.descricao;
      // Imprima o valor do campo "estado" para o modal de edição no input id="estado"
      document.querySelector(`input[name="estado_edit"][value="${livro.estado}"]`).checked = true;
      // Transporta o id para o input id="id_edit"
      document.getElementById('id_edit').value = id;

      // Mostre o modal
      var editModal = new bootstrap.Modal(document.getElementById('editModal'));
      editModal.show();
    } else {
      console.log("Nenhum documento encontrado com o ID: ", id);
    }
  }).catch((error) => {
    console.log("Erro ao obter o documento:", error);
  });
}


//função para salvar a edição
function salvarEdicao(id_edit) {
  console.log(id_edit);
  // Atualize o livro no Firestore
  let titulo = document.getElementById('titulo_edit').value;  
  let autor = document.getElementById('autor_edit').value;
  let ano = document.getElementById('ano_edit').value;
  let dataL = document.getElementById('data_edit').value;
  let disponivel = document.getElementById('disponivel_edit').checked;
  let estado = document.querySelector('input[name="estado_edit"]:checked').value;
  let descricao = document.getElementById('descricao_edit').value;

  let livro = {
    titulo: titulo,
    autor: autor,
    ano: ano,
    data: dataL,
    disponivel: disponivel,
    estado: estado,
    descricao: descricao
  }
  console.log(livro);

  // Atualize o livro no Firestore
  const livroRef = firebase.firestore().collection('books').doc(id_edit);
  livroRef.update(livro)
    .then(() => {
      alert('✅ Registro atualizado com sucesso!')
      listarLivros(); // Atualize a lista de livros
    })
    .catch(error => {
      console.error(`Ocorreu um erro: ${error.code}-${error.message}`)
      alert(`❌ Falha ao atualizar: ${error.message}`)
    })
}

//função para apagar um cliente
function apagarCliente(id) {
  // Verifique se o ID é válido
  if (!id) {
    console.log("ID inválido!");
    return;
  }
  
  // Exclua o livro com o ID especificado
  firebase.firestore().collection('books').doc(id).delete().then(() => {
    alert('Livro excluído com sucesso!');
    listarLivros(); // Atualize a lista de livros
  }).catch((error) => {
    console.error("Error removing document: ", error);
  });
}
