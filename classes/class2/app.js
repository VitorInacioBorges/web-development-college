// Importa a lista de contatos (banco de dados simulado) a partir de um arquivo local chamado "db.js"
import books from "./db.js";
import rents from "./db.js";
import users from "./db.js";

// Importa o framework Express para a criação do servidor e manipulação de rotas HTTP
import express from "express";

// Inicializa a aplicação Express e atribui à constante "app" para configurar rotas e middlewares
const app = express();

// Configura o Express para interpretar requisições que chegam com o corpo (body) no formato JSON
app.use(express.json());

// POST '/bib/user' : register an user (id_user, nome, cpf, email, senha).
app.post("/bib/user", (req, res) => {});

// POST '/bib/livro' : register a book (id_livro, título, isbn, edição, ano).
app.post("/bib/livro", (req, res) => {});

// POST '/bib/locar' : register a book rent (id_user, id_livro, status).
app.post("/bib/locar", (req, res) => {});

// GET '/bib/user' : list users (JSON format).
app.get("/bib/user", (req, res) => {});

// GET '/bib/livro' : list books (JSON format).
app.get("/bib/user", (req, res) => {});

// GET '/bib/livro/:id' : list a book by id (JSON format).
app.get("/bib/user", (req, res) => {});

// GET '/bib/locar' : list book rents - List the rental user's name, book's name e status da locação (formato JSON).
app.get("/bib/user", (req, res) => {});

// PUT '/bib/user/:id' : alterar um usuário dado um id.
app.put("/bib/user", (req, res) => {});

// PUT '/bib/livro/:id' : alterar um livro dado um id.
app.put("/bib/user", (req, res) => {});

// DELETE '/bib/user/:id' : remover um usuário dado um id (e todas as locações associadas).
app.delete("/bib/user", (req, res) => {});

// DELETE '/bib/livro/:id' : remover um livro dado um id (e todas as locações associadas).
app.delete("/bib/user", (req, res) => {});
