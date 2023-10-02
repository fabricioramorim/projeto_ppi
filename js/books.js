/**
 * Função para salvar os dados do cliente utilizando o LocalStorage
 */
function salvarCliente(){
    //obtendo os dados do formulário
    let titulo = document.getElementById('titulo').value
    let autor = document.getElementById('autor').value
    let ano = document.getElementById('ano').value
    let data = document.getElementById('data').value
    let disponivel = document.getElementById('disponivel').checked
    let estado = document.querySelector('input[name="estado"]:checked').value
    let descricao = document.getElementById('descricao').value
    //criando um objeto com os dados do cliente
    let livro = {id: Date.now(), titulo:titulo, autor:autor, ano:ano, data:data, disponivel:disponivel, estado:estado, descricao:descricao}
    //criando o array de clientes
    let livros = JSON.parse(localStorage.getItem('livros')) || []     
    //adicionando o cliente ao array de clientes. 
    //Método push adiciona no fim do array
    livros.push(livro)      
    //salva a lista atualizada no localstorage
    localStorage.setItem('livros', JSON.stringify(livros))  
    //atualizamos a tabela
    alert('Livro cadastrado com sucesso!');
    listarClientes()                 
}
//função para listar os clientes
function listarClientes(){
    //obtendo os dados
    let livros = JSON.parse(localStorage.getItem('livros')) || []
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
//preenchendo a tabela com os dados do clientes                      
let tbody = table.querySelector('tbody')
for(let i=0; i<livros.length; i++){
    let livro = livros[i]
    let dataObj = new Date(livro.data);
    let dia = dataObj.getDate();
    let mes = dataObj.getMonth() + 1; // Os meses são indexados a partir de 0, então adicionamos 1 para obter o mês correto.
    let ano = dataObj.getFullYear();
    let dataFormatada = `${dia}/${mes}/${ano}`;
    let row = tbody.insertRow(i)
    row.innerHTML = `
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.ano}</td>
                    <td>${dataFormatada}</td>
                    <td>${livro.disponivel ? 'Disponível' : 'Indisponível'}</td>
                    <td>${livro.estado}</td>
                    <td>${livro.descricao}</td>
                    <td><button class='btn btn-clean btn-sm' 
                    onclick="apagarCliente('${livro.id}')">Apagar</button></td>
                    `
}


  tabela.appendChild(table)                     
}

//chamar a função logo que carregar a página
listarClientes()

function apagarCliente(id){
    //obtendo os dados
    let livros = JSON.parse(localStorage.getItem('livros')) || []
    
    //filtramos a lista de clientes para remover com o ID
    livros = livros.filter(function(livro) {
        return Number(livro.id) !== Number(id)
    })
    //atualizamos o localStorage com a nova lista de clientes
    localStorage.setItem('livros', JSON.stringify(livros))
    //atualizamos a UI
    listarClientes()
}
