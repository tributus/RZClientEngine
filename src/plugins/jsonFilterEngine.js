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