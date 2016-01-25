/**
 * Created by anderson.santos on 08/01/2016.
 */
var ruteZangada = (function ($) {
    var $this = this;

    this.extend = function (n, f) {
        $this[n] = f;
    };

    this.get = function (url, callback) {
        callback = callback || function(){};
        $.get(url, function (data, status, jqxhr) {
            callback(data, status, jqxhr);
        }).fail(function (data,status) {
            callback(data,status);
        });
    };

    this.post = function (url, data, callback) {
        alert("NOT IMPLEMENTED");
        throw "NOT_IMPLEMENTED";
    };

    this.put = function (url, data, callback) {
        alert("NOT IMPLEMENTED");
        throw "NOT_IMPLEMENTED";
    };

    this.delete = function (url, data, callback) {
        alert("NOT IMPLEMENTED");
        throw "NOT_IMPLEMENTED";
    };

    return this;
})(jQuery);