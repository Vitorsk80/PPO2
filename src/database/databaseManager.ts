import { Database } from 'bun:sqlite';

export const db = new Database('database.sqlite', { strict: true });

// 1. Ativa o suporte a chaves estrangeiras no SQLite
db.run("PRAGMA foreign_keys = ON;");

// 2. Criação individual e segura de cada tabela
db.run(`
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL DEFAULT 'usuario',
    xp INTEGER NOT NULL DEFAULT 0,
    nivel INTEGER NOT NULL DEFAULT 1,
    streak INTEGER NOT NULL DEFAULT 0
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS materia (
    id_materia INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    area_conhecimento TEXT
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS questionario (
    id_questionario INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    dificuldade TEXT NOT NULL,
    id_materia INTEGER NOT NULL,
    FOREIGN KEY (id_materia)
        REFERENCES materia(id_materia)
        ON DELETE CASCADE
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS questao (
    id_questao INTEGER PRIMARY KEY AUTOINCREMENT,
    enunciado TEXT NOT NULL,
    id_questionario INTEGER NOT NULL,
    FOREIGN KEY (id_questionario)
        REFERENCES questionario(id_questionario)
        ON DELETE CASCADE
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS alternativa (
    id_alternativa INTEGER PRIMARY KEY AUTOINCREMENT,
    letra TEXT,
    descricao TEXT NOT NULL,
    correta INTEGER NOT NULL CHECK(correta IN (0,1)),
    id_questao INTEGER NOT NULL,
    FOREIGN KEY (id_questao)
        REFERENCES questao(id_questao)
        ON DELETE CASCADE
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS tentativa (
    id_tentativa INTEGER PRIMARY KEY AUTOINCREMENT,
    data_realizacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tempo_gasto INTEGER NOT NULL,
    pontuacao INTEGER NOT NULL,
    xp_ganho INTEGER NOT NULL DEFAULT 0,
    id_usuario INTEGER NOT NULL,
    id_questionario INTEGER NOT NULL,
    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,
    FOREIGN KEY (id_questionario)
        REFERENCES questionario(id_questionario)
        ON DELETE CASCADE
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS resposta (
    id_resposta INTEGER PRIMARY KEY AUTOINCREMENT,
    acertou INTEGER NOT NULL CHECK(acertou IN (0,1)),
    id_tentativa INTEGER NOT NULL,
    id_questao INTEGER NOT NULL,
    id_alternativa INTEGER NOT NULL,
    FOREIGN KEY (id_tentativa)
        REFERENCES tentativa(id_tentativa)
        ON DELETE CASCADE,
    FOREIGN KEY (id_questao)
        REFERENCES questao(id_questao)
        ON DELETE CASCADE,
    FOREIGN KEY (id_alternativa)
        REFERENCES alternativa(id_alternativa)
        ON DELETE CASCADE
);
`);
