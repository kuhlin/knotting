const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi'); //used for validation

const app = express();
app.use(express.json());
// defining an array to work as the database (temporary solution)
const books = [
    { title: 'Harry Potter', id: 1 },
    { title: 'Twilight', id: 2 },
    { title: 'Lorien Legacies', id: 3 }
]

const ads = [
    {title: 'Hello, world (again)!'}
  ];

 // adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined')); 

//READ Request Handlers
app.get('/', (req, res) => {
    //res.send('Welcome to Knotting REST API with Node.js Tutorial!!');
    res.send(ads);
});

app.get('/api/books', (req, res) => {
    res.send(books);
});

app.get('/api/books/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));

    if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>');
    res.send(book);
});

//CREATE Request Handler
app.post('/api/books', (req, res) => {

    const { error } = validateBook(req.body);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }
    const book = {
        id: books.length + 1,
        title: req.body.title
    };
    books.push(book);
    res.send(book);
});

//UPDATE Request Handler
app.put('/api/books/:id', (req, res) => {
    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>');

    const { error } = validateBook(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    book.title = req.body.title;
    res.send(book);
});

//DELETE Request Handler
app.delete('/api/books/:id', (req, res) => {

    const book = books.find(c => c.id === parseInt(req.params.id));
    if (!book) res.status(404).send('<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>');

    const index = books.indexOf(book);
    books.splice(index, 1);

    res.send(book);
});

function validateBook(book) {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });
    return schema.validate(book);

}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ${port}..'));