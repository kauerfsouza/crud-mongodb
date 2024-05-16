// imports
const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')

//configurações
const PORT = 3000
const app = express()

// middlewares
app.use(express.json())


// conexão com o banco
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS


mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.e5ojqov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("Conectado ao banco Mongo!"))
    .catch(err => console.log("Erro ao conectar ao banco Mongo: ", err))

// models
const pessoa = mongoose.model('pessoa', { nome: String })

// rotas
app.post('/pessoas', async (req, res) => {
    try {
        const pessoa = new Pessoa({ nome: req.body.nome });
        const pessoaCriada = await pessoa.save();
        res.status(201).json(pessoaCriada);
    } catch (error) {
        console.error('Erro ao criar pessoa:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao criar pessoa' });
    }
});




// Rota para obter todas as pessoas
app.get('/pessoas', async (req, res) => {
    try {
        const pessoas = await Pessoa.find();
        res.json(pessoas);
    } catch (error) {
        console.error('Erro ao obter pessoas:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao obter pessoas' });
    }
});

// Rota para obter uma pessoa por ID
app.get('/pessoas/:id', async (req, res) => {
    try {
        const pessoa = await Pessoa.findById(req.params.id);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }
        res.json(pessoa);
    } catch (error) {
        console.error('Erro ao obter pessoa:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao obter pessoa' });
    }
});

// Rota para atualizar uma pessoa por ID
app.put('/pessoas/:id', async (req, res) => {
    try {
        const pessoa = await Pessoa.findByIdAndUpdate(req.params.id, { nome: req.body.nome }, { new: true });
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }
        res.json(pessoa);
    } catch (error) {
        console.error('Erro ao atualizar pessoa:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao atualizar pessoa' });
    }
});

// Rota para excluir uma pessoa por ID
app.delete('/pessoas/:id', async (req, res) => {
    try {
        const pessoa = await Pessoa.findByIdAndDelete(req.params.id);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }
        res.json({ message: 'Pessoa excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir pessoa:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao excluir pessoa' });
    }
});


// start
app.listen(PORT, () => {
    console.log(`Aplicação rodando na porta ${PORT}`)
})