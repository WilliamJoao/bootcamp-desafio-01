const express = require('express');

// instancia o servidor
const server = express()

// passando pro servidor o tipo de dados que vai receber
server.use(express.json());

/**
 * Utilizamos a variável `numberOfRequests` como
 * `let` porque vai sofrer mutação. A variável
 * `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo
 * uma constante.
 */
let numberOfRequests = 0;
const projects = []

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExistes(req, res, next) {

    const { id } = req.params;

    const projetc = projects.find(p => p.id == id);

    if (!projetc) {
        return res.status(400).json({ error: 'Project not found' })
    }

    return next()
}

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {

    numberOfRequests++
    console.log(`Número de requisições: ${numberOfRequests}`);

    return next();
}

server.use(logRequests);

// lista todos os projetos
server.get('/projects', (req, res) => {

    return res.json(projects)
});

// cadastra um novo projeto
server.post('/projects', (req, res) => {

    const { id, title, task } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(projects)
});

// cadastra um novo projeto
server.post('/projects/:id/tasks', checkProjectExistes, (req, res) => {

    const { id } = req.params;
    const { task } = req.body;

    const projetc = projects.find(p => p.id == id);

    projetc.tasks.push(task)

    return res.json(projects)
});

// altera apenas o nome do projeto
server.put('/projects/:id', checkProjectExistes, (req, res) => {

    const { id } = req.params;
    const { title } = req.body;

    const projetc = projects.find(p => p.id == id);

    projetc.title = title;

    return res.json(projetc)
});

//deletando o projeto
server.delete('/projects/:id', checkProjectExistes, (req, res) => {

    const { id } = req.params;

    const projetc = projects.findIndex(p => p.id == id);
    projects.splice(projetc.id, 1);

    return res.send()
});

server.listen(3000);