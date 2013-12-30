var express  = require('express'),
    mongoose = require('mongoose'),
    routes   = require('./routes'),
    http     = require('http'),
    path     = require('path');

mongoose.connect('mongodb://localhost/crime_crunch');

var app = express(),
    db  = mongoose.connection;

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);

// development only
if ('development' === app.get('env')) {
  mongoose.set('debug', true);
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/incidents', routes.incidents);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Listening on port ' + app.get('port') + '.\n++ The Emperor protects. ++');
});
