var express = require('express');
var app = express();

app.get("/", function(req, res)
{
    res.send("oi");
});

app.listen(8080);