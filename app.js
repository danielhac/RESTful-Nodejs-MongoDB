var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

var bookRouter = express.Router();

bookRouter.route('/Books')
    .get(function(req, res) {
        var responseJson = {test: "Testing API"};

        res.json(responseJson);
    });

app.use('/api', bookRouter);

app.get('/', function(req, res) {
    res.send('Working!');
});

app.listen(port, function() {
    console.log('Running on port ' + port);
});