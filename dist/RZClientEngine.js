/**
 * Created by Anderson on 25/01/2016.
 */

//Array.find()
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

//Array.findIndex();
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
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
/**
 * Created by anderson.santos on 08/01/2016.
 */
var rz          = {};
rz.engine       = {};
rz.widgets      = {};
rz.plugins      = {};
rz.utils        = {};
rz.helpers      = {};
rz.behaviors    = {};
/**
 * Created by anderson.santos on 08/06/2016.
 */
rz.helpers.StringBuilder = StringBuilder;
rz.helpers.generateRandomID = generateRandomID;
rz.helpers.ensureFunction = function (f) {
    return (f === undefined) ? function () {
    } : f;
};
/**
 * Created by anderson.santos on 29/06/2016.
 */
rz.helpers.jsonUtils = {
    getDataAtPath: function(obj,path){
        if(obj===undefined||obj==null){
            return undefined;
        }
        else{
            var propArray = this.extractPropertyTree(path);
            var pos = 0;
            var lastRef = obj;
            var val = undefined;
            var getPropertyType = function(propString){
                if(propString.match(/^([a-zA-Z_$ºª]+([0-9]+)?)+$/)) return "sp";
                if(propString.match(/^([a-zA-Z_$ºª]+([0-9]+)?)+(\[[0-9]+])$/)) return "ua";
                if(propString.match(/^([a-zA-Z_$ºª]+([0-9]+)?)+(\[])$/)) return "dua";
                if(propString.match(/^([a-zA-Z_$ºª]+([0-9]+)?)+(\[[0-9]+])+$/)) return "ma";
            };
            var isLast = function(){
                return pos==propArray.length -1;
            };
            var transverse = function(item){
                var propType = getPropertyType(item);
                var last = isLast();
                    //ensureProperty(item,propType);
                    if(propType=="sp"){
                        if(last){
                            val = lastRef[item];
                        }
                        else{
                            lastRef = lastRef[item];
                            if(lastRef===undefined){
                                val = undefined;
                            }
                            else{
                                transverse(propArray[++pos]);
                            }
                        }

                    }
                    else if(propType=="ua"){
                        var parts = item.replace(/\[/,".").replace("]","").split(".");
                        var name = parts[0];
                        var position = parts[1];
                        if(last){
                            if(lastRef[name]!==undefined){
                                val = lastRef[name][position];
                            }
                            else{
                                val = undefined;
                            }

                        }
                        else{
                            if(lastRef===undefined||lastRef[name]===undefined||lastRef[name][position]===undefined){
                                val = undefined;
                            }
                            else{
                                lastRef = lastRef[name][position];
                                transverse(propArray[++pos]);
                            }

                        }
                    }
                    else if(propType=="dua"){
                        var name = item.replace("[]","");
                        var position = (lastRef===undefined || lastRef[name]===undefined)? 0: lastRef[name].length -1;
                        if(last){
                            if(lastRef[name] !==undefined){
                                val = lastRef[name][position];
                            }
                            else{
                                val = undefined;
                            }
                        }
                        else{

                            if(lastRef[name] !==undefined && lastRef[name][position] !=undefined){
                                lastRef = lastRef[name][position];
                                transverse(propArray[++pos]);
                            }
                            else{
                                val = undefined;
                            }

                        }

                    }
                    else if(propType=="ma"){
                        throw "not implemented yet";
                        // var parts = item.replace("["," [").split(' ');
                        // eval("lastRef['"+parts[0]+"']" + parts[1] + " = value");
                    }

            };
            transverse(propArray[pos]);
            return val;
        }

    },
    setDataAtPath : function(obj,value,path){
        if(obj===undefined||obj==null) obj = {};
        var propArray = this.extractPropertyTree(path);
        var pos = 0;
        var lastRef = obj;
        var getPropertyType = function(propString){
            if(propString.match(/^([a-zA-Z_$ºª]+([0-9]+)?)+$/)) return "sp";
            if(propString.match(/^([a-zA-Z_$ºª]+([0-9]+)?)+(\[[0-9]+])$/)) return "ua";
            if(propString.match(/^([a-zA-Z_$ºª]+([0-9]+)?)+(\[])$/)) return "dua";
            if(propString.match(/^([a-zA-Z_$ºª]+([0-9]+)?)+(\[[0-9]+])+$/)) return "ma";
        };
        var isLast = function(){
            return pos==propArray.length -1;
        };
        var ensureProperty = function(item,propType){
            if(propType=="sp"){
                if(lastRef[item]===undefined) lastRef[item] = {};
                return lastRef[item];
            }
            if(propType=="ua"){
                var parts = item.replace(/\[/,".").replace("]","").split(".");
                var name = parts[0];
                var position = parts[1];
                if(lastRef[name]==undefined) lastRef[name] = [];
                if(lastRef[name][position]==undefined) lastRef[name][position] = {};
                return lastRef[name][position];
            }
            if(propType=="dua"){
                var name = item.replace("[]","");
                var position=0;
                if(lastRef[name]==undefined){
                    lastRef[name] = [];
                }
                else{
                    position = lastRef[name].length;
                }
                if(lastRef[name][position]==undefined) lastRef[name][position] = {};
                return lastRef[name][position];
            }
            if(propType=="ma"){
                throw "not implemented yet. This component version not suports multi-dimensional arrays";
                var parts = item.replace(/\[/g,".").replace(/]/g,"").split(".");
                var name = parts[0];
                if(lastRef[name]===undefined || lastRef[name].length==undefined) lastRef[name]=[];
                var cont=1;
                var evalExpr = "lastRef['"+name+"'][" + parts[cont] +"]";
                while(cont<=parts.length-1){
                    if(eval(evalExpr + "===undefined")){
                        eval(evalExpr+"=[]");
                        cont+=1;
                        evalExpr += "[" + parts[cont] +"]";
                    }
                }
                return lastRef;
            }
        };

        var transverse = function(item){
            var propType = getPropertyType(item);
            if(isLast()){
                ensureProperty(item,propType);
                if(propType=="sp"){
                    lastRef[item] = value;
                }
                else if(propType=="ua"){
                    var parts = item.replace(/\[/,".").replace("]","").split(".");
                    var name = parts[0];
                    var position = parts[1];
                    lastRef[name][position] = value;
                }
                else if(propType=="dua"){
                    var name = item.replace("[]","");
                    var position = lastRef[name].length -1;
                    lastRef[name][position] = value;
                }
                else if(propType=="ma"){
                    var parts = item.replace("["," [").split(' ');
                    eval("lastRef['"+parts[0]+"']" + parts[1] + " = value");
                }
            }
            else{
                lastRef = ensureProperty(item,propType);
                transverse(propArray[++pos]);
            }
        };
        transverse(propArray[pos]);
    },
    extractPropertyTree : function (expression) {
        //variables
        var START_CHAR_PATTERN = /^[a-zA-Z_$ºª]$/;
        var OPEN_ARRAY_PATTERN = /^\[$/;
        var CLOSE_ARRAY_PATTERN = /^]$/;
        var CHAR_OR_DIGIT_PATTERN = /^[a-zA-Z_$ºª]|[0-9]$/;
        var DOT_PATTERN = /^\.$/;
        var ONLY_DIGIT_PATTERN = /^[0-9]$/;
        var DOUBLE_QUOTE_PATTERN = /^"$/;
        var SINGLE_QUOTE_PATTERN = /^'$/;
        var ANY_PATTERN = /^.$/;
        var properties = [];
        var currentProperty = "";

        //helpers
        var normalize = function () {
            for (var i = 0; i < properties.length; i++) {
                properties[i] = properties[i].replace(/(\["|\[')|("]|'])/g, "");
            }
        };
        //parser
        var dfa = new rz.plugins.DFAMachine(function (node, currentChar) {
            switch (node) {
                case "C":
                    properties.push(currentProperty);
                    currentProperty = "";
                    break;
                case "D":
                    currentProperty += currentChar;
                    break;
                case "G":
                case "K":
                    if (currentProperty !== "" && currentProperty.substr(0, currentProperty.length - 1) !== "") {
                        properties.push(currentProperty.substr(0, currentProperty.length - 1));
                        currentProperty = "[" + currentChar;
                    }
                    else {
                        currentProperty += currentChar;
                    }
                    break;
                case "END":
                    if (currentProperty !== "") properties.push(currentProperty);
                    break;
                default:
                    currentProperty+=currentChar;
                    break;

            }
        });
        dfa.addNode("START", [{pattern: START_CHAR_PATTERN, node: "A"}, {pattern: OPEN_ARRAY_PATTERN, node: "J"}]);
        dfa.addNode("A", [{pattern: CHAR_OR_DIGIT_PATTERN, node: "A"}, {pattern: OPEN_ARRAY_PATTERN,node: "D"}, {pattern: DOT_PATTERN, node: "C"},{node: "END"}]);
        dfa.addNode("C", [{pattern: START_CHAR_PATTERN, node: "A"}]);
        dfa.addNode("D", [{pattern: ONLY_DIGIT_PATTERN, node: "E"}, {pattern: CLOSE_ARRAY_PATTERN,node: "F"}, {pattern: DOUBLE_QUOTE_PATTERN, node: "G"},{pattern: SINGLE_QUOTE_PATTERN, node: "K"}]);
        dfa.addNode("E", [{pattern: ONLY_DIGIT_PATTERN, node: "E"}, {pattern: CLOSE_ARRAY_PATTERN, node: "F"}]);
        dfa.addNode("F", [{pattern: DOT_PATTERN, node: "C"}, {pattern: OPEN_ARRAY_PATTERN, node: "D"},{node:"END"}]);
        dfa.addNode("G", [{pattern: DOUBLE_QUOTE_PATTERN, node: "ERROR"}, {pattern: ANY_PATTERN, node: "H"}]);
        dfa.addNode("H", [{pattern: DOUBLE_QUOTE_PATTERN, node: "I"}, {pattern: ANY_PATTERN, node: "H"}]);
        dfa.addNode("I", [{pattern: CLOSE_ARRAY_PATTERN, node: "F"}]);
        dfa.addNode("J", [{pattern: DOUBLE_QUOTE_PATTERN, node: "G"}, {pattern: SINGLE_QUOTE_PATTERN, node: "K"}]);
        dfa.addNode("K", [{pattern: SINGLE_QUOTE_PATTERN, node: "ERROR"}, {pattern: ANY_PATTERN, node: "L"}]);
        dfa.addNode("L", [{pattern: SINGLE_QUOTE_PATTERN, node: "M"},{pattern: ANY_PATTERN, node: "L"}]);
        dfa.addNode("M", [{pattern: CLOSE_ARRAY_PATTERN, node: "F"}]);
        dfa.addNode("END");
        dfa.start(expression);
        normalize();
        return properties;
    }
};

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
/**
 * Created by anderson.santos on 08/01/2016.
 */
//consts
var $rzs = {
    s1: "invalid widget format",
    s2: "NOT_A_FUNCTION",
    s3: "NO_INITIALIZE_FUNCTION",
    s4: "NO_RENDER_FUNCTION",
    s5: "error registering widget",
    s6: "widget definition not found",
    s7: "UNKNOWN_WIDGET_DEFINITION",
    s8: "http://support.rz.com/rzframework/doc/common_errors"
};

rz.widgets.helpers = {
    widgets:{},
    widgetsMetaData:{},
    validateWidgetStructure : function (d) {
        if (typeof(d) !== 'function') throw this.error(1, $rzs.s1, $rzs.s2);
        //if(typeof(d.initialize) !== 'function') throw error(1,$rzs.s1,$rzs.s3);
        //if(typeof(d.render) !== 'function') throw error(1,$rzs.s1,$rzs.s4);
    },
    error : function (code, msg, d) {
        return {code: code, message: msg, details: d, helpLink: $rzs.s8 + "?code=" + code + "&d=" + d};
    },
    setupWidgetEventHandlers : function (eventData, h) {
        eventData.definition.eventHandlers = {};
        eventData.definition.eventHandlerDescriptions = {};
        if(h !==undefined && h.length > 0){
            h.forEach(function (it) {
                if(typeof(it)=="string"){
                    eventData.definition.eventHandlers[it] = [];
                    eventData.definition.eventHandlerDescriptions[it] = {};
                    rz.widgets.helpers.widgetsMetaData[eventData.name].eventInfo[it] = {};
                }
                else if(typeof(it)=="object"){
                    eventData.definition.eventHandlers[it.name] = [];
                    eventData.definition.eventHandlerDescriptions[it.name] = it;
                    rz.widgets.helpers.widgetsMetaData[eventData.name].eventInfo[it.name] = it;
                }
                else{
                    throw("invalid event handler definition");
                }
            });
        }
        eventData.definition.prototype.on = function (eventName, handler) {
            try {
                eventData.definition.eventHandlers[eventName].push(handler);
            }
            catch (e) {
                throw ("invalid event handler");
            }
        };

        eventData.definition.prototype.raiseEvent = function (name,args,sender) {
            var handlers = sender.getEventHandler(name);
            if (handlers !== undefined && handlers.length > 0) {
                handlers.forEach(function (it) {
                    it(sender,args);
                });
            }
        };

        eventData.definition.prototype.getEventHandlers = function () {
            return eventData.definition.eventHandlers;
        };

        eventData.definition.prototype.getEventHandler = function (name) {
            return eventData.definition.eventHandlers[name];
        };

        eventData.definition.prototype.getEventHandlersDescriptions = function () {
            return eventData.definition.eventHandlerDescriptions;
        };

        eventData.definition.prototype.getEventHandlersDescription = function (name) {
            return eventData.definition.eventHandlerDescriptions[name];
        };

    },
    setupMethodHandler : function (eventData,methodHandlers) {
        var defaultMHandler = function () {throw "not implemented";};
        eventData.definition.methodDescriptions = {};

        if(methodHandlers !==undefined && methodHandlers.length > 0){
            methodHandlers.forEach(function (it) {
                if(typeof(it)=="string"){
                    eventData.definition.methodDescriptions[it] = {};
                    eventData.definition.prototype[it] = defaultMHandler;
                    rz.widgets.helpers.widgetsMetaData[eventData.name].methodInfo[it] = {}
                }
                else if(typeof(it)=="object" && it.name !==undefined){
                    eventData.definition.methodDescriptions[it.name] = it;
                    eventData.definition.prototype[it.name] = defaultMHandler;
                    rz.widgets.helpers.widgetsMetaData[eventData.name].methodInfo[it.name] = it;
                }
                else{
                    throw "incorrect data format";
                }
            });
        }

        eventData.definition.prototype.getMethodDescriptors = function () {
            return eventData.definition.methodDescriptions;
        };

        eventData.definition.prototype.getMethodDescriptor = function (methodName) {
            return eventData.definition.methodDescriptions[methodName];
        }
    }

};

rz.engine.widgetDefinitionMethod = function (n,m,h, d) {
    try {
        var eventData = {
            name: n,
            definition: d,
            methodDeclarations:m,
            eventHandlers:h,
            cancel: false
        };
        if (!eventData.cancel) {
            rz.widgets.helpers.validateWidgetStructure(eventData.definition);
            rz.widgets.helpers.widgetsMetaData[eventData.name] = {};
            rz.widgets.helpers.widgetsMetaData[eventData.name].methodInfo = {};
            rz.widgets.helpers.widgetsMetaData[eventData.name].eventInfo = {};

            rz.widgets.helpers.setupWidgetEventHandlers(eventData,h);
            rz.widgets.helpers.setupMethodHandler(eventData,m);
            rz.widgets.helpers.widgets[eventData.name] = eventData.definition;
            return eventData.definition;
        }
    }
    catch (err) {
        console.error("%O", err);
        throw $rzs.s5;
        //todo melhorar essa parada
    }
};

rz.engine.renderWidgetDefinitionMethod = function (w, t, d) {
    var Widget = rz.widgets.helpers.widgets[w];
    if (Widget === undefined) {
        throw rz.widgets.helpers.error(2, $rzs.s7, $rzs.s6);
    }

    var widget = new Widget();
    widget.initialize(d, function (pd) {
        var ref = {renderData: widget.render(t, pd)};
        return ref;
    });
    return widget;
};

rz.engine.getWidgetEventHandlersDescriptionsMethod = function (widgetName) {
    return rz.widgets.helpers.widgetsMetaData[widgetName].eventInfo;
};

rz.engine.getWidgetEventHandlersDescriptionMethod = function (widgetName,eventName) {
    return rz.widgets.helpers.widgetsMetaData[widgetName].eventInfo[eventName];
};

rz.engine.getWidgetMethodsDescriptionsMethod = function (widgetName) {
    return rz.widgets.helpers.widgetsMetaData[widgetName].methodInfo;
};

rz.engine.getWidgetMethodsDescriptionMethod = function (widgetName,methodName) {
    return rz.widgets.helpers.widgetsMetaData[widgetName].methodInfo[methodName];
};


ruteZangada.extend("widget",rz.engine.widgetDefinitionMethod);
ruteZangada.extend("renderWidget",rz.engine.renderWidgetDefinitionMethod);
ruteZangada.extend("getWidgetEventHandlersDescriptions", rz.engine.getWidgetEventHandlersDescriptionsMethod);
ruteZangada.extend("getWidgetEventHandlersDescription", rz.engine.getWidgetEventHandlersDescriptionMethod);
ruteZangada.extend("getWidgetMethodsDescriptions", rz.engine.getWidgetMethodsDescriptionsMethod);
ruteZangada.extend("getWidgetMethodsDescription", rz.engine.getWidgetMethodsDescriptionMethod);


/**
 * Created by anderson.santos on 04/07/2016.
 */
rz.behaviors.helpers = {
    behaviors:{},
    behaviorsMetadata:{}
};

rz.engine.behaviorDefinitionMethod = function(n,m,d){
    var validateBehaviorStructure = function () {
        return true;
    };

    var applyDefaulStructure = function(){
        d.prototype.initialize = function(){
            throw "not implemented"
        };
        // d.prototype.setTrigger = function(trigger){
        //     //trigger: {name:"trigger-name",conditions:[{condition-list-or-method}]}
        //     if(this.source!==undefined){
        //         this.trigger = trigger;
        //         source.on(trigger.name);
        //     }
        //     else{
        //         throw "source is not defined";
        //     }
        // };
    };

    if(validateBehaviorStructure(d)){
        rz.behaviors.helpers.behaviorsMetadata[n] = m;
        applyDefaulStructure();
        rz.behaviors.helpers.behaviors[n] = d;
        return d;
    }
};

rz.engine.loadBehaviorMethod = function(name,params){
    var behavior = rz.behaviors.helpers.behaviors[name];
    if(behavior !==undefined){
        var bh = new behavior(params);
        bh.initialize();
        return new bh;
    }
    else{
        throw "behavior not registered"
    }
};

ruteZangada.extend("behavior",rz.engine.behaviorDefinitionMethod);
ruteZangada.extend("loadBehavior",rz.engine.loadBehaviorMethod);
// ruteZangada.extend("renderWidget",rz.engine.renderWidgetDefinitionMethod);
// ruteZangada.extend("getWidgetEventHandlersDescriptions", rz.engine.getWidgetEventHandlersDescriptionsMethod);
// ruteZangada.extend("getWidgetEventHandlersDescription", rz.engine.getWidgetEventHandlersDescriptionMethod);
// ruteZangada.extend("getWidgetMethodsDescriptions", rz.engine.getWidgetMethodsDescriptionsMethod);
// ruteZangada.extend("getWidgetMethodsDescription", rz.engine.getWidgetMethodsDescriptionMethod);
/**
 * Created by Anderson on 26/02/2016.
 */
rz.utils.uri = {
    getSearch : function(url){
        var fploc = url.indexOf("?");
        return (fploc==-1) ? "" : url.substring(fploc);
    },
    getParamCount : function(url){
        var query = this.getSearch(url);
        return (query.match(new RegExp(/[\?|&][a-zA-Z0-9+]+=([^&*]*)/g))||[]).length;
    },
    getParamList : function(url){
        var query = this.getSearch(url);
        var rawParams = query.match(new RegExp(/([\?|&][a-zA-Z0-9+]+=)/g))||[];
        var oparams = [];
        rawParams.forEach(function(it){
            oparams.push(it.replace(/[?|&|=]/g,""));
        });
        return oparams;
    },
    hasParam : function(url,p){
        var query = this.getSearch(url);
        return (query.match(new RegExp('[?&]' + p + '=([^&]+)')) || [])[0] !==undefined;
    },
    getParamValue : function(url,p){
        if(this.hasParam(url,p)){
            var query = this.getSearch(url);
            return ((query.match(new RegExp('[?&]' + p + '=([^&]+)')) || [])[0]||"").replace(/[?|&][a-zA-Z0-9*]+=/g,"");
        }
        else{
            return undefined;
        }
    },
    mergeParam: function (url, p, v) {
        var paramWithValue =p + '=' + v;
        if(this.getParamList(url).length>0){
            return url + '&' + paramWithValue;
        }
        else{
            return url + '?' + paramWithValue;
        }
    }
};
/**
 * Created by Anderson on 17/02/2016.
 */
rz.plugins.jsonFilterEngine = function (opt) {
    var getConnector = function (condition) {
        if(condition.connector===undefined){
            return "&&";
        }
        else{
            switch(condition.connector.toLocaleLowerCase()){
                case "and": return " && ";
                case "or": return " || ";
                case "and not": return " && !";
                case "or not": return " || !";
                default: return " && ";
            }
        }

    };

    var getOperator = function (condition) {
        if(condition.operator==undefined){
            return "===";
        }
        else{
            switch (condition.operator.toLowerCase()){
                case "equals":
                case "=":
                case "==":
                case "===": return "===@";
                case "notequas":
                case "<>":
                case "!=":
                case "!==":return "!==@";
                case "gt":
                case ">":
                case "greaterthan": return " > @";
                case "lt":
                case "<":
                case "lessthan": return " < @";
                case "gte":
                case ">=":
                case "greaterthanorequal": return " >= @";
                case "lte":
                case "<=":
                case "lessthanorequal": return " >= @";
                case "startswith":
                case "::=": return ".startsWith(@)";
                case "endswith":
                case "=::": return ".endsWith(@)";
                case "contains":
                case ":=:": return ".indexOf(@)!=-1";
                default: return condition.operator;
            }
        }
    };

    this.json2filterFunction = function (filterExpression) {
        var filterString = '';
        var processNodes = function (nodelist) {
            var blockStart = true;
            nodelist.forEach(function (item) {
                if(!blockStart){
                    filterString += getConnector(item);
                }
                else{
                    blockStart = false;
                }
                if(item.conditions === undefined){
                    filterString += "m."+item.field + getOperator(item).replace("@",item.value);
                }
                else{
                    filterString += '(';
                    processNodes(item.conditions);
                    filterString += ')';
                }
            });
        };
        processNodes(filterExpression);
        return filterString;
    };

    this.buildFilterFunction = function (filterExpression) {
        var expressionString = this.json2filterFunction(filterExpression);
        var r = function(m){return eval(expressionString);};
        return r;
    }
};
/**
 * Created by anderson.santos on 29/06/2016.
 */

rz.plugins.DFAMachine = function (onNodeEnter) {
    var $this = this;
    var expression = "";

    var nodes = {};
    var currentChar = 0;
    this.resultHandler = undefined;
    var char = "";
    this.onNodeEnter = onNodeEnter;

    var ERROR = function () {
        var msg = "parseError at position " + currentChar.toString() + "\n" + expression + "\n" + " ".repeat(currentChar - 1) + "^";
        if ($this.resultHandler === undefined) {
            throw msg;
        }
        else {
            $this.resultHandler({status: "fail", message: msg});
        }
    };

    var getNextChar = function () {
        var char = pickNextChar();
        currentChar += 1;
        return char;
    };

    var pickNextChar = function () {
        if (currentChar == expression.length) {
            return undefined;
        }
        else {
            var char = expression.substr(currentChar, 1);
            return (char !=="" && char!=undefined)? char:undefined;
        }
    };

    var raiseOnNodeEnther = function (node, currentChar, nextChar) {
        if ($this.onNodeEnter != undefined) {
            $this.onNodeEnter(node, currentChar, nextChar, expression);

        }
    };

    var processNode = function (node) {
        raiseOnNodeEnther(node, char, pickNextChar());
        if(node !=="END"){
            char = getNextChar();
            var rules = nodes[node];
            var ERR = true;
            if (rules != undefined && rules.length > 0) {
                rules.every(function (item) {
                    if(char===undefined){
                        if(item.pattern==undefined){
                            ERR = false;
                            if (item.node !== undefined) {
                                if (item.node == "ERROR") {
                                    ERR = true;
                                    ERROR();
                                }
                                else {
                                    processNode(item.node);
                                }
                            }
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                    else{
                        if(char.match(item.pattern)!=null) {
                            ERR = false;
                            if (item.node !== undefined) {
                                if (item.node == "ERROR") {
                                    ERR = true;
                                    ERROR();
                                }
                                else {
                                    processNode(item.node);
                                }

                            }
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                });
            }
            else {
                ERR = false;
            }

            if (ERR) ERROR();
        }
    };

    this.addNode = function (nodeName, rules) {
        nodes[nodeName] = rules;
    };

    this.start = function (inputValue, rhandler, startNode) {
        if (rhandler !== undefined) $this.resultHandler = rhandler;
        expression = inputValue;
        currentChar = 0;
        startNode = startNode || "START";
        processNode(startNode);
        if (getNextChar() !== undefined) {
            ERROR();
        }
        else {
            if ($this.resultHandler !== undefined) $this.resultHandler({
                status: "success",
                message: "success parsing expression \"" + expression + "\""
            });
        }

    };
};