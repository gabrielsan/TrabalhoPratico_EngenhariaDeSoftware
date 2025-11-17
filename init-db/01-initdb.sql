CREATE DATABASE IF NOT EXISTS bd_projeto_integrador DEFAULT CHARACTER SET utf8mb4 DEFAULT ENCRYPTION='N';
USE bd_projeto_integrador;

CREATE TABLE IF NOT EXISTS usuario (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(100) NOT NULL,
  email varchar(60) NOT NULL,
  senha varchar(60) NOT NULL,
  limite float NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY email (email),
  KEY createdAt (createdAt),
  KEY id (id)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categoria (
  id int NOT NULL AUTO_INCREMENT,
  idUsuario int NOT NULL,
  nome varchar(45) NOT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY id (id),
  KEY createdAt (createdAt),
  KEY idUsuario (idUsuario),
  CONSTRAINT fk_categoria_usuario1 FOREIGN KEY (idUsuario) REFERENCES usuario (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS transacao (
  id int NOT NULL AUTO_INCREMENT,
  idUsuario int NOT NULL,
  descricao varchar(250) NOT NULL,
  data datetime NOT NULL,
  valor float NOT NULL,
  tipo char(1) NOT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id,idUsuario),
  KEY fk_transacao_usuario1_idx (idUsuario),
  KEY data (data),
  KEY tipo (tipo),
  KEY id (id),
  KEY createdAt (createdAt),
  CONSTRAINT fk_transacao_usuario1 FOREIGN KEY (idUsuario) REFERENCES usuario (id)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categoriatransacao (
  idCategoria int NOT NULL,
  idTransacao int NOT NULL,
  valor float NOT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idCategoria,idTransacao),
  KEY fk_categoriaTransacao_has_transacao_transacao1_idx (idTransacao),
  KEY fk_categoriaTransacao_has_transacao_categoriaTransacao_idx (idCategoria),
  KEY createdAt (createdAt),
  CONSTRAINT fk_categoriaTransacao_has_transacao_categoriaTransacao FOREIGN KEY (idCategoria) REFERENCES categoria (id),
  CONSTRAINT fk_categoriaTransacao_has_transacao_transacao1 FOREIGN KEY (idTransacao) REFERENCES transacao (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;