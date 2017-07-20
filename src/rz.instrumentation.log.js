/**
 * Created by anderson.santos on 14/07/2016.
 */
rz.instrumentation.log = {
    logListeners:[],
    registerListener:function(l){
        this.logListeners.push(l);
    },
    broadCast:function(message,data,type){
        var $this = this;
        setTimeout(function(){
            $this.logListeners.forEach(function(l){
                l({
                    message:message,
                    type:type,
                    data:data
                });
            });
        },10);
    },
    debug:function(message,data){
        this.broadCast(message,data,"debug");
    },
    info:function(message,data){
        this.broadCast(message,data,"info");
    },
    warn:function(message,data){
        this.broadCast(message,data,"warning");
    },
    error:function(message,data){
        this.broadCast(message,data,"error");
    }
};