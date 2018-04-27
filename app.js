var express    = require ("express");
var bodyParser = require ("body-parser");
var routes     = require ("./routes/routes.js");
var app        = express ();

app.use (bodyParser.json());
app.use (bodyParser.urlencoded ( { extended: true } ) );
app.use (express.json());
app.use(express.urlencoded());

routes (app);

var server = app.listen (3000, function () {
    console.log ("app running on port.", server.address().port);
});
