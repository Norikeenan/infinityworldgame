require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // Importante para o caminho dos arquivos

const app = express(); 
app.use(express.json());
app.use(cors());

// Configura a pasta "public" para entregar o HTML/CSS/JS
app.use(express.static('public'));

// 👇 1. CONFIGURAÇÃO DO BANCO
const connection = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

// Testando a conexão do Pool
connection.getConnection((err, conn) => {
    if (err) {
        console.error("Erro ao conectar no MySQL:", err);
    } else {
        console.log("✅ Conectado ao MySQL com sucesso (Modo Pool)!");
        conn.release(); // Libera a conexão de volta para o gerente
    }
});

// --- ROTAS (O Cérebro) ---

// Rota principal (opcional, já que o static faz isso, mas bom garantir)
app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'novo-user', 'index.html'));
});

// Rota 1: Verificar Nome
app.post('/verificar-nome', (req, res) => {
    const nickname = req.body.nickname;
    const sql = "SELECT * FROM usuarios WHERE nickname = ?";
    
    // 👇 CORREÇÃO: Usando 'connection' em vez de 'db'
    connection.query(sql, [nickname], (err, result) => {
        if (err) {
            console.error("Erro no banco:", err);
            return res.status(500).json({ erro: "Culpa do banco: " + err.message });
        }

        if (result.length > 0) {
            res.json({ disponivel: false });
        } else {
            res.json({ disponivel: true });
        }
    });
});

// Rota 2: Registro Final
app.post('/registro', (req, res) => {
    const { nickname, password } = req.body;

    if (!nickname || !password) {
        return res.status(400).json({ mensagem: "Faltou nome ou senha!" });
    }

    const sql = "INSERT INTO usuarios (nickname, password) VALUES (?, ?)";

    // 👇 CORREÇÃO: Usando 'connection' em vez de 'db'
    connection.query(sql, [nickname, password], (err, result) => {
        if (err) {
            console.error("Erro ao salvar:", err);
            return res.status(500).json({ mensagem: "Erro ao criar conta." });
        }
        
        console.log(`Novo jogador registrado: ${nickname}`);
        res.json({ sucesso: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando! Acesse: http://localhost:${PORT}`);
});