require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express(); 
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const db = mysql.createConnection({
    // O comando "process.env.VARIAVEL" tenta pegar o valor da nuvem.
    // O "||" significa "OU". Se não achar na nuvem, usa o valor fixo (seu PC).
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'sua_senha_local',
    database: process.env.MYSQLDATABASE || 'financas_pessoais',
    port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
    } else {
        console.log('✅ Conectado ao MySQL com sucesso!');
    }
});

// --- ROTAS (O Cérebro) ---

// Rota de Cadastro de Jogador
//Entrega do HTML
 app.get('/registro', (req, res) => {
    res.sendFile(pach.join(__dirname, 'public', 'novo-user', 'index.html'));
 });
  //Salvar no Banco
 app.post('/registrar', (req, res) => {
    const { nickname } = req.body;

    //não aceita nome vazio
    if (!nickname) {
        return res.status(400).json({ sucesso: false, mensagem: "Nome inválido" });
    }
    const sql = 'INSERT INTO usuarios (nickname) VALUES (?)';

    connection.query(sql, [nickname], (err, result) => {
        if (err) {
            //nome duplicado
            console.error(err);
            res.status(500).json({ sucesso: false, mensagem: "Erro so salvar ou nome já existe! "});
        } else {
            //Personagem Criado!
            res.json({ sucesso: true, mensagem: "Registrado!"});
        }
    });
 });
// Define a porta (3000 é o padrãozão do Node)
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando! Acesse: http://localhost:${PORT}`);
});