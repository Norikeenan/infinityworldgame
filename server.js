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
app.post('/api/jogador', (req, res) => {
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).send({ mensagem: 'O nickname é obrigatório, jogador!' });
    }

    const sql = "INSERT INTO usuarios (nome) VALUES (?)";

    db.query(sql, [nickname], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({ mensagem: 'Erro ao criar personagem.' });
        } else {
            res.status(201).send({ 
                mensagem: 'Personagem criado!', 
                id: result.insertId,
                nome: nickname
            });
        }
    });
});
// Define a porta (3000 é o padrãozão do Node)
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando! Acesse: http://localhost:${PORT}`);
});