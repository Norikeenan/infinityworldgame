//Guardando o nome do usuário.
let nicknameGuardado = "";

//Verificando se o nome existe ao clicar no botão. 
async function irParaSenha() {
    const inputNome = document.getElementById('nickname');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: valorNome })
    });

    // Se o servidor responder erro (400, 500, etc), vamos ler o que ele mandou
    if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ O servidor gritou isso:", errorText);
        alert("Erro no servidor: " + errorText);
        return;
    }

    const data = await response.json();

    if (data.disponivel) {
       // 1. Guarda o nome para usar depois no registro final
    nicknameGuardado = valorNome; 

    // 2. Esconde a parte do Nome
    document.getElementById('fase-nome').style.display = 'none';

    // 3. Mostra a parte da Senha
    // Dica: Use 'flex' se o seu CSS original for flexbox, ou 'block' se for simples
    document.getElementById('fase-senha').style.display = 'flex'; 
    
    console.log("Nome aceito! Indo para a fase de senha.");
    
    } else {
        alert("Este nome já tem dono!");
    }

} catch (error) {
    console.error("🚨 Erro de conexão ou no código JS:", error);
}
     finally {
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
            body: JSON.stringify ({
                nickname: nicknameGuardado,
                password: valorSenha
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
