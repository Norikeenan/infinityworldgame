 async function enviarRegistro() {
    const nickname = document.getElementById('nicknameInput').ariaValueMax;

    if(!nickname) {
        alert("Por favor, digite um nome!");
        return;
    }
    //Conexão com o front-end
    const resposta = await fetch('/registrar', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ nickname: nickname })
    });

    const dados = await resposta.json();

    if (dados.sucesso) {
        alert("Parabéns! " + nickname + " registrado com sucesso");
    } else {
        alert("Erro: " + dados.mensagem);
    }
 }