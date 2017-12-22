function Enum(types, translations) {
    this.enum = [];
    this.types = [];

    for (var element in types) {
        this.enum.push({
            element: element,
            value: types[element],
            translation: translations[element]
        });
        this.types.push(types[element]);
    }
}

Enum.prototype.getTypes = function() {
    return this.types;
};

Enum.prototype.containsValue = function(value) {
    for (var key in this.enum) {
        var element = this.enum[key];
        if (element.value == value)
            return true;
    }
    return false;
};

Enum.prototype.containsTranslation = function(translation) {
    for (var key in this.enum) {
        var element = this.enum[key];
        if (element.translation == translation)
            return true;
    }
    return false;
};

Enum.prototype.getValue = function(translation) {
    for (var key in this.enum) {
        var element = this.enum[key];
        if (element.translation == translation) {
            return element.value;
        }
    }
    return undefined;
};

Enum.prototype.getTranslation = function(value) {
    for (var key in this.enum) {
        var element = this.enum[key];
        if (element.value == value) {
            return element.translation;
        }
    }
    return undefined;
};

module.exports = Enum;
