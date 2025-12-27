require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express(); 
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const connection = mysql.createConnection({
    // O comando "process.env.VARIAVEL" tenta pegar o valor da nuvem.
    // O "||" significa "OU". Se não achar na nuvem, usa o valor fixo (seu PC).
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'sua_senha_local',
    database: process.env.MYSQLDATABASE || 'financas_pessoais',
    port: process.env.MYSQLPORT || 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
    } else {
        console.log('✅ Conectado ao MySQL com sucesso!');
    }
});

// --- ROTAS (O Cérebro) ---

//rota principal do site
// Adicione isso se não tiver:
const path = require('path');


app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de Cadastro de Jogador
//Entrega do HTML
 app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'novo-user', 'index.html'));
 });
  //Salvar no Banco
 app.post('/registrar', (req, res) => {
    const nickname  = req.body.nickname;

    const sql = "SELECT * FROM usuarios WHERE nickname = ?";

    db.query(sql, [nickname], (err, result) => {
        if (err) {
            console.error("Erro no banco:", err);
            return res.status(500).json({ erro: "Erro interno" });
        }

        if (result.length > 0) {
            res.json({ disponivel: false });
        } else {
            res.json({ disponivel: true });
        }
    })
 });
 app.post('/registro', (req, res) => {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
        return res.status(400).json({ mensagem: "Faltou nome ou senha!" });
    }

    const sql = "INSERT INTO usuarios (nickname, password) VALUES (?, ?)";

    db.query(sql, [nickname, password], (err, result) => {
        if (err) {
            console.error("Erro ao salvar:" ,  err);
            return res.status(500).json({ mensagem: "Erro ao criar conta. "});
        }

        console.log ('Novo jogador registrado: ${nickname}');
        res.json({ sucesso: true });
     });

 });
// Define a porta (3000 é o padrãozão do Node)
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando! Acesse: http://localhost:${PORT}`);
});