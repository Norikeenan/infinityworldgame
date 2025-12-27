//Guardando o nome do usuário.
let nicknameGuardado = "";

//Verificando se o nome existe ao clicar no botão. 
async function irParaSenha() {
    const inputName = document.getElementById('nickname');
    const valorNome = inputNome.value.trim();
    const botao = document.querySelector('#fase-nome button');

    if (!valorNome) {
        alert("Digite um nome, jogador!");
        return;
    }

    //Efeito visual enquanto carrega
    botao.innerText = "Verificando...";
    botao.disabled = true;

    //Pergunta ao servidor se o nome está livre
    try {
        const response = await fetch('/verificar-nome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ nickname: valorNome})
        });

        const data = await response.json();

        if (data.disponivel) {
            //sucesso: Guarda o nome e muda de tela
            nicknameGuardado = valorNome;
            document.getElementById('fase-nome').style.display = 'none';
            document.getElementById('fase-senha').style.display = 'flex';
            document.getElementById('senha').focus();
        } else {
            alert("Esse nome já tem dono! Tente outro.");
            inputNome.focus();
        }

    } catch (error) {
        console.error(error);
        alert("error ao conectar com a guilda.");
    } finally {
        botao.innerText = "Próximo";
        botao.disabled = false;
    }

}

//Botão voltar
function voltarParaNome() {
    document.getElementById('fase-senha').style.display = 'none';
    document.getElementById('fase-nome').style.display = 'flex';
}

//Cria a conta com senha
async function finalizarRegistro() {
    const inputSenha = document.getElementById('senha');
    const valorSenha = inputSenha.value.trim();

    if (!valorSenha) {
        alert("Sua conta precisa de uma senha!");
        return;
    }

    try {
        const response = await fetch('/registro', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.string ({
                nickname: nicknameGuardado,
                password: vlaorSenha
            })
        });
        if (response.ok) {
            window.location.href = "/jogo.html";
        } else {
            alert("Erro ao criar conta.");
        }
    } catch (error) {
        console.error(error);
    }
}
