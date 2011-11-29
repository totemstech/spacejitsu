
/**
 * method(that, name, method, _super)
 * Adds a method to the current object denoted by that and preserves
 * _super implementation (see Crockford)
 */
var method = function(that, name, method, _super) {
    if(_super) {
        var m = that[name];
        _super[name] = function() {
            return m.apply(that, arguments);
        };
    }
    that[name] = method;
};

/**
 * getter(that, name, obj, prop)
 * Generates a getter on the current object denoted by that
 */
var getter = function(that, name, obj, prop) {
    var getter = function() {
        return obj[prop];
    };
    that[name] = getter;
};

/**
 * setter(that, name, obj, prop)
 * Generates a setter on the current object denoted by that
 */
var setter = function(that, name, obj, prop) {
    var setter = function (arg) {
        obj[prop] = arg;
        return that;
    };
    that['set' + name.substring(0, 1).toUpperCase() + name.substring(1)] = setter;
};

/**
 * responds(that, name)
 * Tests whether the object responds to a given function name
 */
var responds = function(that, name) {
    return (that[name] && typeof that[name] === 'function');
};
