let listraRegistro ={
    ultimoIdGravado : 0,
    pessoas:[{id: 10, nome: "Debora Antunes", telefone: '(11) 2552-3443' }]
}


function visualizar(pagina) {
    documento.body.setAtribute('page', pagina);
    if (pagina === 'cadastro') {
        document.getElementById('nome').focus()

    }
}

function inserirPessoa(nome,telefone){
    const id = listaRegistro.ultimoIdGravado + 1;
    listraRegistro.pessoas.push({id,nome,telefone})
    desenharTabela()
    visualizar('lista')
}

function desenharTabela(){
    const tbody = document.getElementById("listaRegistroBody");
    if(tbody){
        tbody.innerHTML = listraRegistro.pessoas.map(pessoa => {
            return `<tr>
            <td>${pessoa.id}</td>
            <td>${pessoa.nome}</td>
            <td>${pessoa.telefone}</td>
            </tr>`
        }).join('');
    }
}

function enviarDados(e){
    e.preventDefault()
    const dados = {
        id: document.getElementById('codigo').value, 
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value
    }
    console.log(dados)
}

window.addEventListener('load', () =>{
    desenharTabela()
    document.getElementById("cadastro-registros").addEventListener
    ('submit', enviarDados)
})

