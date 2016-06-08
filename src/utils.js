/**
 * Created by Anderson on 12/01/2016.
 * Esta biblioteca contém código utilizado pelo core engine (diferente dos helpers que contém código do core, utilizado pelos widgets)
 */
function StringBuilder() {
    var strings = [];

    this.append = function (string) {
        string = verify(string);
        if (string.length > 0) strings[strings.length] = string;
    };

    this.appendLine = function (string) {
        string = verify(string);
        if (this.isEmpty()) {
            if (string.length > 0) strings[strings.length] = string;
            else return;
        }
        else strings[strings.length] = string.length > 0 ? "\r\n" + string : "\r\n";
    };

    this.appendFormat = function (string) {
        string = verify(string);

        var fstring = string;
        for (var i = 1; i < arguments.length; i++) {
            pattern = new RegExp("\\{" + (i - 1).toString() + "}", 'g');

            fstring = fstring.replace(pattern, arguments[i]);
        }

        if (string.length > 0) strings[strings.length] = fstring;
    };

    this.appendLineFormat = function (string) {
        string = verify(string);
        var fstring = string;
        for (var i = 1; i < arguments.length; i++) {
            pattern = new RegExp("\\{" + (i - 1).toString() + "}", 'g');

            fstring = fstring.replace(pattern, arguments[i]);
        }

        if (this.isEmpty()) {
            if (fstring.length > 0) strings[fstring.length] = fstring;
            else return;
        }
        else strings[strings.length] = string.length > 0 ? "\r\n" + fstring : "\r\n";
    };

    this.clear = function () { strings = []; };

    this.isEmpty = function () { return strings.length == 0; };

    this.toString = function () { return strings.join(""); };

    var verify = function (string) {
        if (!defined(string)) return "";
        if (getType(string) != getType(new String())) return String(string);
        return string;
    };

    var defined = function (el) {
        return el != null && typeof (el) != "undefined";
    };

    var getType = function (instance) {
        if (!defined(instance.constructor)) throw Error("Unexpected object type");
        var type = String(instance.constructor).match(/function\s+(\w+)/);
        return (defined(type))?type[1]:"undefined";
    };
}

String.prototype.startsWith = function (str) {
    return this.indexOf(str) == 0;
};

function generateRandomID(size) {
    var s = (size === undefined) ? 8 : size;
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789_";
    var id = "wdgv_";
    for (var i = 0; i < s; i++)
        id += possible.charAt(Math.floor(Math.random() * possible.length));

    return id;
}