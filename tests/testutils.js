
exports.check = function(done, f) {
    try {
        f();
    } catch (e) {
        done(e);
    }
}
