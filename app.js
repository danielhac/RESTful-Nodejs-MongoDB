var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db = mongoose.connect('mongodb://localhost/bookAPI');

var Book = require('./models/bookModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var bookRouter = express.Router();

bookRouter.route('/Books')
    .post(function(req, res) {
        var book = new Book(req.body);

        console.log(book);
        res.send(book);
    })
    .get(function(req, res) {

        // Can replace empty object with req.query to allow search for all
        var query = {};

        // Only allow filtering of 'genre'
        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        Book.find(query, function(err, books) {
            if (err)
                res.status(500).send(err);
            else
                res.json(books);
        });
    });

bookRouter.route('/Books/:id')
    .get(function(req, res) {

        Book.findById(req.params.id, function(err, book) {
            if (err)
                res.status(500).send(err);
            else
                res.json(book);
        });
    });

app.use('/api', bookRouter);

app.get('/', function(req, res) {
    res.send('Working!');
});

app.listen(port, function() {
    console.log('Running on port ' + port);
});