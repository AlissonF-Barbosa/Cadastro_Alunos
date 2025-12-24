const mysql = require ('mysql2/promise')

async function criarBancoDados() {
    try{
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'alunos_cadastrados',
        password: 'Aa@8578150492'
    })


console.log('Conectado ao MySQL');

await connection.query('CREATE DATABASE IF NOT EXISTS cadastros_db');
console.log('Banco de dados criado/já existe');

await connection.query('USE cadastros_db');
await connection.query(`
    CREATE TABLE IF NOT EXISTS cadastros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_criação TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
    )
    `);
    console.log('Tabela de contatos já criada/já existe');

    await connection.end();
    console.log('Banco de dados configurado com sucesso!');
  }catch (error){
    console.error('Erro ao configurar banco de dados:', error.message);
    process.exit(1);
}
}

criarBancoDados();

