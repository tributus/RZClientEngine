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
            throw "initialize method is not implemented";
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
        return bh;
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