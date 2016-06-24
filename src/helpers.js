/**
 * Created by anderson.santos on 08/06/2016.
 */
rz.helpers.StringBuilder = StringBuilder;
rz.helpers.generateRandomID = generateRandomID;
rz.helpers.ensureFunction = function (f) {
    return (f === undefined) ? function () {
    } : f;
};
rz.helpers.jsonUtils = {
    getDataAtPath: function (obj, path) {
        var parts = path.split('.');
        var val = obj;
        parts.every(function (part) {
            val = val[part];
            return val !== undefined;
        });
        return val;
    },
    setDataAtPath: function(obj,path,value){
        var parts = path.split(".");
        var last = obj;
        parts.forEach(function (it, ix) {
            if ((ix == parts.length - 1)) {
                last[it] = value;
            }
            else {
                if (last[it] === undefined) {
                    last[it] = {};
                }
            }
            last = last[it];
        });
    }
};
