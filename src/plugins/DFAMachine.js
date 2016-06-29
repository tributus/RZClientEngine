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