const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do MySQL - Pool de conexões
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Aa@8578150493',
  database: 'cadastros_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Rota GET - Listar todos os contatos
app.get('/api/cadastro', async (req, res) => {
  console.log('GET /api/cadastro - Listando cadastros...');
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM cadastros ORDER BY id ASC');
    connection.release();
    
    console.log(`Retornando ${rows.length} contatos`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({ erro: 'Erro ao buscar contatos', detalhes: error.message });
  }
});

// Rota POST - Criar OU Atualizar contato
app.post('/api/cadastro', async (req, res) => {
  console.log('===== POST /api/cadastro =====');
  console.log('Payload recebido:', JSON.stringify(req.body, null, 2));
  
  const { id, nome, email, celular, telefone, cpf, dataNascimento } = req.body;

  // Validações básicas
  if (!nome || !email) {
    console.log('Validação falhou: Nome ou Email ausente');
    return res.status(400).json({ erro: 'Nome e Email são obrigatórios' });
  }

  try {
    const connection = await pool.getConnection();
    
    // Se tem ID, atualiza. Senão, insere
    if (id) {
      console.log('Atualizando contato ID:', id);
      await connection.execute(
        'UPDATE cadastros SET nome = ?, email = ?, celular = ?, telefone = ?, cpf = ?, data_nascimento = ? WHERE id = ?',
        [
          nome,
          email,
          (celular && celular.trim()) ? celular.trim() : null,
          (telefone && telefone.trim()) ? telefone.trim() : null,
          (cpf && cpf.trim()) ? cpf.trim() : null,
          (dataNascimento && dataNascimento.trim()) ? dataNascimento.trim() : null,
          id
        ]
      );
      connection.release();
      console.log('Contato atualizado com sucesso');
      res.status(200).json({ mensagem: 'Contato atualizado com sucesso', id });
    } else {
      console.log('Inserindo novo contato...');
      const [result] = await connection.execute(
        'INSERT INTO cadastros (nome, email, celular, telefone, cpf, data_nascimento) VALUES (?, ?, ?, ?, ?, ?)',
        [
          nome,
          email,
          (celular && celular.trim()) ? celular.trim() : null,
          (telefone && telefone.trim()) ? telefone.trim() : null,
          (cpf && cpf.trim()) ? cpf.trim() : null,
          (dataNascimento && dataNascimento.trim()) ? dataNascimento.trim() : null
        ]
      );
      connection.release();
      console.log('Contato inserido com sucesso. ID:', result.insertId);
      res.status(201).json({
        mensagem: 'Contato salvo com sucesso',
        id: result.insertId,
        nome, email, celular, telefone, cpf, dataNascimento
      });
    }
  } catch (error) {
    console.error('ERRO ao salvar contato:', error);
    res.status(500).json({ erro: 'Erro ao salvar contato', detalhes: error.message });
  }
});

// Rota DELETE - Excluir contato
app.delete('/api/cadastro/:id', async (req, res) => {
  console.log('DELETE /api/cadastro/:id');
  const { id } = req.params;
  console.log('ID para exclusão:', id);

  if (!id) {
    return res.status(400).json({ erro: 'ID não fornecido' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('DELETE FROM cadastros WHERE id = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      console.log('Nenhum contato encontrado com ID:', id);
      return res.status(404).json({ erro: 'Contato não encontrado' });
    }

    console.log('Contato excluído com sucesso. ID:', id);
    res.status(200).json({ mensagem: 'Contato excluído com sucesso', id });
  } catch (error) {
    console.error('ERRO ao excluir contato:', error);
    res.status(500).json({ erro: 'Erro ao excluir contato', detalhes: error.message });
  }
});

// Rota de teste
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Backend está funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Conectado ao MySQL - cadastros_db');
});