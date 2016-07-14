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
            if(eventData.definition.eventHandlers[eventName] === undefined){
                eventData.definition.eventHandlers[eventName] = [];
                rz.instrumentation.log.warn("unknown eventhandler registered" ,{eventName:eventName, handler:handler});
            }
            try {
                eventData.definition.eventHandlers[eventName].push(handler);
            }
            catch (e) {
                rz.instrumentation.log.error("invalid event handler ",{eventName:eventName, handler:handler});
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

rz.engine.renderWidgetDefinitionMethod = function (w, t, d,p) {
    var Widget = rz.widgets.helpers.widgets[w];
    if (Widget === undefined) {
        throw rz.widgets.helpers.error(2, $rzs.s7, $rzs.s6);
    }

    var widget = new Widget();
    widget.initialize(d, function (pd) {
        var ref = {renderData: widget.render(t, pd,
            function(renderData){
                if(p!==undefined){
                    var eventArgs = {cancel:false,params:pd,rd:renderData};
                    p(renderData,eventArgs,function(p){
                        if(!p.cancel){
                            ruteZangada.plot(p.rd);
                        }
                    });
                }
                else{
                    ruteZangada.plot(renderData);
                }
            }
        )};
        return ref;
    });
    return widget;
};

rz.engine.plotContentMethod = function(data){
    if(data.method=="append"){
        $(data.target).append(data.data.toString());
    }
    else{
        $(data.target).html(data.data.toString());
    }
    if(data.doAfterRenderAction!==undefined) data.doAfterRenderAction();
    if(data.sender !==undefined){
        data.sender.raiseEvent("widget-rendered",undefined,data.sender);
    }
    //todo raise "afterPlot" event
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
ruteZangada.extend("plot", rz.engine.plotContentMethod);

