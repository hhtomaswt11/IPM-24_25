import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getConflitos } from './conflito.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const DB_PATH = join(__dirname, 'trabalhodb.json');

app.use(cors());
app.use(express.json());

// Função para carregar os dados da base de dados
export const loadDB = () => JSON.parse(readFileSync(DB_PATH, 'utf-8'));
const saveDB = (db) => writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

// -------------------- MENSAGENS --------------------
app.get('/mensagens', (req, res) => {
  const db = loadDB();
  res.json(db.mensagens || []);
});

app.patch('/mensagens/:id', (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const mensagem = db.mensagens.find(m => m.id === id);

  if (!mensagem) return res.status(404).json({ error: 'Mensagem não encontrada' });

  Object.assign(mensagem, req.body);
  saveDB(db);
  res.json(mensagem);
});

app.delete('/mensagens/:id', (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  db.mensagens = db.mensagens.filter(m => m.id !== id);
  saveDB(db);
  res.status(204).end();
});

// -------------------- DIRETOR --------------------

// GET diretor com id fixo = 1
app.get('/director', (req, res) => {
  const db = loadDB();
  const diretor = db.directors.find(d => d.id === 1);

  if (!diretor) return res.status(404).json({ error: 'Diretor não encontrado' });

  res.json(diretor);
});

// PATCH diretor com id fixo = 1
app.patch('/director', (req, res) => {
  const db = loadDB();
  const diretor = db.directors.find(d => d.id === 1);

  if (!diretor) return res.status(404).json({ error: 'Diretor não encontrado' });

  Object.assign(diretor, req.body);
  saveDB(db);
  res.json(diretor);
});

// -------------------- CONFLITOS ---------------------
app.get('/conflitos', (req, res) => {
  const conflitos = getConflitos(); // Chama a função para obter os conflitos tratados
  res.json(conflitos);
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});
