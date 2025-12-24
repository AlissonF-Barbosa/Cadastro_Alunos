const mysql = require('mysql2/promise');

async function adicionarColunas() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'alunos_cadastrados',  // ou 'root'
      password: 'Aa@8578150492',  // sua senha
      database: 'cadastros_db'
    });

    console.log('Conectado ao MySQL');

    // Adicionar coluna celular
    try {
      await connection.query('ALTER TABLE cadastros ADD COLUMN celular VARCHAR(255)');
      console.log('Coluna celular adicionada');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('Coluna celular já existe');
      } else {
        throw e;
      }
    }

    // Adicionar coluna telefone
    try {
      await connection.query('ALTER TABLE cadastros ADD COLUMN telefone VARCHAR(255)');
      console.log('Coluna telefone adicionada');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('Coluna telefone já existe');
      } else {
        throw e;
      }
    }

    // Adicionar coluna cpf
    try {
      await connection.query('ALTER TABLE cadastros ADD COLUMN cpf VARCHAR(255)');
      console.log('Coluna cpf adicionada');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('Coluna cpf já existe');
      } else {
        throw e;
      }
    }

    // Adicionar coluna data_nascimento
    try {
      await connection.query('ALTER TABLE cadastros ADD COLUMN data_nascimento VARCHAR(255)');
      console.log('Coluna data_nascimento adicionada');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('Coluna data_nascimento já existe');
      } else {
        throw e;
      }
    }

    await connection.end();
    console.log('Colunas configuradas com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar colunas:', error.message);
    process.exit(1);
  }
}

adicionarColunas();