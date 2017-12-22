const bodyParser = require('body-parser');
const jwt = require('jwt-simple');

const IController = require('./icontroller.js');

function AuthenticationController(app) {
    IController.call(this, app);
    this.login = this.login.bind(this);
    this.authenticate = this.authenticate.bind(this);
}

IController.compose(AuthenticationController);

AuthenticationController.prototype.secret = function() {
    return 'fc8b6d0a83a4ab1b5c9a0e7f9d79a032';
};

AuthenticationController.prototype.deny = function(res) {
    res.status(401);
    res.json({
        "status": 401,
        "message": "Invalid token or key."
    });
};

AuthenticationController.prototype.expire = function(res) {
    res.status(401);
    res.json({
        "status": 401,
        "message": "Token expired. Please log in again."
    });
};

AuthenticationController.prototype.authenticate = function(req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (!token) {
        this.deny(res);
        return;
    }

    try {
        var data = jwt.decode(token, this.secret());
    } catch (err) {
        this.deny(res);
        return;
    }

    var lastLogin = new Date(data.expire);
    if (lastLogin.getTime() < Date.now()) {
        this.expire(res);
        return;
    }

    next();
};

AuthenticationController.prototype.login = function(req, res, next) {
    var expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.send({
        token: jwt.encode({
            expire: expires.getTime(),
            login: req.body.login || ''
        }, this.secret())
    });

};

AuthenticationController.prototype.applyMiddlewares = function() {
    this.app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    this.app.post("/login", bodyParser.json(), this.login);

    this.app.use("*", bodyParser.json(), this.authenticate);
};

AuthenticationController.prototype.applyRoutes = function() {

};

exports.AuthenticationController = AuthenticationController;
