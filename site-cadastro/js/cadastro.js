
let tentativas = 0;
const limiteTentativas = 3;

let currentStep = 1;
let totalSteps = 3;

let listaRegistro = {
    ultimoIdGravado: 0,
    pessoas: [{ id: 10, usuario: "DebAn", email: "debora@gmail.com", nome: "Debora Antunes", telefone: '(11) 2552-3443', sexo: 'feminino', linguagens: 'Java' }]
};

function nextStep() {
    if (currentStep < totalSteps) {
        if (validarFormulario()) {
            let currentSection = document.getElementById("step" + currentStep);
            currentSection.style.display = "none";

            currentStep++;

            let nextSection = document.getElementById("step" + currentStep);
            nextSection.style.display = "block";
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        let currentSection = document.getElementById("step" + currentStep);
        currentSection.style.display = "none";

        currentStep--;

        let previousSection = document.getElementById("step" + currentStep);
        previousSection.style.display = "block";
    }
}

function validarFormulario() {
    let currentSection = document.getElementById("step" + currentStep);

    if (currentStep === 1) {
        // Validação para a primeira etapa
        let usuario = document.getElementById('tusuario').value;
        let email = document.getElementById('temail').value;
        let senha = document.getElementById('tsenha1').value;
        let senha2 = document.getElementById('tsenha2').value;

        if (usuario === "" || email === "" || senha === "" || senha2 === "") {
            alert("Por favor, preencha todos os campos na primeira etapa.");
            return false;
        }

        //validação do email
        let emailPadrao = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(!email.match(emailPadrao)){
            alert("Por favor digite um e-mail válido");
            return false;
        }

        const emailExistente = listaRegistro.pessoas.some(pessoa => pessoa.email === email);
        if (emailExistente) {
            alert("Este email já está cadastrado. Por favor, use um email diferente.");
            return false;
    }

        //validação da senha (mínimo 8 caracteres)
        if(senha.length < 8 ){
            alert("A senha deve ter no minimo 8 caracteres");
            return false;
        }
        //verificando se as duas senhas são iguais
        if(senha !== senha2){
            alert("As senhas não coincidem. Por favor, tente novamente");
            return false;
        }


    } else if (currentStep === 2) {
        // Validação para a segunda etapa
        let nome = document.getElementById('tnome').value;
        let telefone = document.getElementById('tnumero').value;
        let sexo = document.querySelector('input[name="rdsexo"]:checked');

        if (nome === "" || telefone === "" || !sexo) {
            alert("Por favor, preencha todos os campos na segunda etapa.");
            return false;
        }

        //validação do telefone
        let numeroPadrao = /^[0-9]{9,15}$/;
        if(!telefone.match(numeroPadrao)){
            alert("Por favor digite um número de telefone válido");
            return false;
        }

        //validação do sexo
        if (!sexo){
            alert("por Favor, selecione o sexo")
            return false
        }

    } else if (currentStep === 3) {
        // Validação para a terceira etapa
        let linguagens = document.querySelectorAll('input[name="chk_language"]:checked');

        //validação de linguagens
        if (linguagens.length === 0) {
            alert("Selecione pelo menos uma linguagem na terceira etapa.");
            return false;
        }
    }

    return true;
}

function desenharTabela() {
    const tbody = document.getElementById("listaRegistroBody");
    if (tbody) {
        tbody.innerHTML = listaRegistro.pessoas.map(pessoa => {
            return `<tr>
                <td>${pessoa.id}</td>
                <td>${pessoa.usuario}</td>
                <td>${pessoa.email}</td>
                <td>${pessoa.senha}</td>
                <td>${pessoa.nome}</td>
                <td>${pessoa.telefone}</td>
                <td>${pessoa.sexo}</td>
                <td>${pessoa.linguagens}</td>
            </tr>`;
        }).join('');
    }
}

function inserirPessoa(usuario, email, senha, nome, telefone, sexo, linguagens) {
    let novoID = listaRegistro.pessoas.length + 1;
    let userData = {
        id: novoID,
        usuario: usuario,
        email: email,
        senha: senha,
        nome: nome,
        telefone: telefone,
        sexo: sexo,
        linguagens: linguagens.join(', ')
    };
    listaRegistro.pessoas.push(userData);
    localStorage.setItem('pessoa', JSON.stringify(listaRegistro));
    desenharTabela();
}

function limparDados() {
    document.getElementById('tusuario').value = '';
    document.getElementById('temail').value = '';
    document.getElementById('tsenha1').value = '';
    document.getElementById('tsenha2').value = '';
    document.getElementById('tnome').value = '';
    document.getElementById('tnumero').value = '';
    document.querySelector('input[name="rdsexo"]:checked').checked = false;
    document.querySelectorAll('input[name="chk_language"]:checked').forEach((checkbox) => {
        checkbox.checked = false;
    });
}

function visualizar(pagina, novo = false) {
    document.body.setAttribute("page", pagina);
    if (pagina === "cadastro") {
        if (novo) {
            limparDados();
            limparLocalStorage();
        }
        document.getElementById("tusuario").focus();
    }
}

function enviarDados() {
    if (validarFormulario()) {
        const usuario = document.getElementById('tusuario').value;
        const email = document.getElementById('temail').value;
        const senha = document.getElementById('tsenha1').value;
        const nome = document.getElementById('tnome').value;
        const telefone = document.getElementById('tnumero').value;
        const sexo = document.querySelector('input[name="rdsexo"]:checked').value;
        const linguagens = Array.from(document.querySelectorAll('input[name="chk_language"]:checked')).map(checkbox => checkbox.value);

        inserirPessoa(usuario, email, senha, nome, telefone, sexo, linguagens);

        limparDados();
        visualizar('lista');
    }
}

function limparLocalStorage() {
    localStorage.removeItem("pessoa");
}

function lerBD() {
    const lista = localStorage.getItem("pessoa");
    if (lista) {
        listaRegistro = JSON.parse(lista);
        desenharTabela();
    }
}

function fazerLogin() {
    const emailLogin = document.getElementById('emailLogin').value;
    const senhaLogin = document.getElementById('senhaLogin').value;

    const usuarioEncontrado = listaRegistro.pessoas.find(usuario => usuario.email === emailLogin);

    if (usuarioEncontrado) {
        if(usuarioEncontrado.senha === senhaLogin) {
            alert('Login bem-sucedido!');
            tentativas = 0;
            visualizar('lista');
        } else {
            tentativas++;

            if (tentativas === limiteTentativas) {
                alert('Você atingiu o limite de tentativas. Por favor, tente novamente mais tarde.');

            } else {
                alert(`Senha incorreta. Tentativa ${tentativas}/${limiteTentativas}.`);
            }
        }
    } else {
        alert('Email não encontrado. Por favor, verifique suas credenciais.');
    }
}


function redirecionar() {
    if (validarFormulario()) {
        visualizar('lista');
    }
}

function initializePage() {
    lerBD();
    desenharTabela();
    document.querySelector('button[name="btncadastra"]').addEventListener('click', enviarDados);
}

window.onload = initializePage;
