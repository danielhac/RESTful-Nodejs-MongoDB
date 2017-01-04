var express = require('express');

var routes = function(Book) {
    var bookRouter = express.Router();

    bookRouter.route('/')
        .post(function(req, res) {
            var book = new Book(req.body);

            book.save();
            res.status(201).send(book);
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

    // Middleware for 'id' route - Goes thru here 1st before next section
    bookRouter.use('/:id', function(req, res, next) {
        Book.findById(req.params.id, function(err, book) {
            if (err)
                res.status(500).send(err);
            else if (book) {
                req.book = book;
                next();
            }
            else {
                res.status(404).send('Book not found!')
            }
        });
    });

    bookRouter.route('/:id')
        .get(function(req, res) {
            res.json(req.book);
        })
        .put(function(req, res) {
            Book.findById(req.params.id, function(err, book) {
                req.book.title = req.body.title;
                req.book.author = req.body.author;
                req.book.genre = req.body.genre;
                req.book.read = req.body.read;

                req.book.save(function(err) {
                    if (err)
                        res.status(500).send(err);
                    else {
                        res.json(req.book);
                    }
                });
            });
        })
        .patch(function(req, res) {
            // Delete '_id' to eliminate issues for the Forloop next
            if (req.body._id) {
                delete req.body._id;
            }
            // Forloop to get any data passed in
            for (var p in req.body) {
                req.book[p] = req.body[p];
            }

            // Save the change
            req.book.save(function(err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.book);
                }
            });
        })
        .delete(function(req, res) {
            req.book.remove(function(err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });

    return bookRouter;
};

module.exports = routes;