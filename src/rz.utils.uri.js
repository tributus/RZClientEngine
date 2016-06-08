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