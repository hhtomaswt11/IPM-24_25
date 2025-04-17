import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const DB_PATH = join(__dirname, 'trabalhodb.json');

app.use(cors());
app.use(express.json());

const loadDB = () => JSON.parse(readFileSync(DB_PATH, 'utf-8'));
const saveDB = (db) => writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');

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

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
