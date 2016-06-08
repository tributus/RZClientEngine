/**
 * Created by anderson.santos on 08/06/2016.
 */
rz.helpers.StringBuilder = StringBuilder;
rz.helpers.generateRandomID = generateRandomID;
rz.helpers.ensureFunction = function(f){
    return (f===undefined) ? function(){}:f;
};