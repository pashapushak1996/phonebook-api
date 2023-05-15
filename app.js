const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const persons = require('./db');

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.listen(3001, () => {
    console.log('Server is running on 3001 port');
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    const person = persons.find((person) => person.id === id);

    if (!person) {
        return res.status(404)
    }

    res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    const personIndex = persons.findIndex((person) => person.id === id);

    if (personIndex === -1) {
        return res.status(404);
    }

    persons.splice(personIndex, 1);

    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400);
    }

    const isPersonExist = persons.find((person) => person.name === name);

    if (isPersonExist) {
        return res.status(400).send('name must be unique');
    }

    const person = {
        name,
        number,
        id: Math.floor
        (Math.random() * 1000000)
    };

    persons.push(person);

    res.status(201).json(person);
});


app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${ persons.length }</p>
    <p>${ new Date().toString() }</p>
     `)
});