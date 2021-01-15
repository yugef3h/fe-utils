let counter = require('./Hello');
exports.create = function (name) {
    return {
        name: name,
        counter: counter
    }
}