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
    },
    isValidPropertyExpression: function(expression,callback){
        try{
            var propertytree = this.extractPropertyTree(expression);
            if(callback) callback(true,propertytree);
            return true;
        }
        catch (ex){
            if(callback) callback(false);
            return false;
        }


    }
};
