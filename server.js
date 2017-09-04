var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
var config = require('./config.js');

// Create link to the output directory
var distDir = __dirname + "/www/";
app.use(express.static(distDir));

console.log('Dist Dir: ' + distDir);
console.log('Environment: ' + config.env);
console.log('Port: ' + process.env.PORT);

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
  'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
app.set('port', process.env.PORT || 8080);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(app.get('port'));
console.log("App listening on port " + app.get('port'));

/* Adding this: "ionic_source_map_type": "eval", to package.json in the config section speeds up builds but disables VS Code debugging */