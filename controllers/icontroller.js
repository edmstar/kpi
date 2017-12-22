function IController(app) {
    this.app = app;
}

IController.prototype.applyMiddlewares = function() {};
IController.prototype.applyRoutes = function() {};

IController.prototype.error = function(res, error) {
    if (error) {
        res.status(401);
        res.send(error);
    }
};

IController.compose = function(child) {
    // Setup inheritance
    child.prototype = Object.create(IController.prototype);
    child.prototype.constructor = child;
};

module.exports = IController;
