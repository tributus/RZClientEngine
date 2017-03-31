/**
 * Created by Anderson on 26/02/2016.
 */
rz.utils.uri = {
    getSearch : function(url){

        var fploc_i = url.indexOf("?");
        var fploc_h = url.indexOf("#");
        var fploc_d = url.indexOf("&");
        var foundValues = [];
        if(fploc_i >= 0) foundValues.push(fploc_i);
        if(fploc_h >= 0) foundValues.push(fploc_h);
        if(fploc_d >= 0) foundValues.push(fploc_d);
        if(foundValues.length==0){
            return "";
        }
        else{
            var min = foundValues.reduce(function(a, b) {
                return Math.min(a, b);
            });
            return url.substring(min);
        }
        //return (fploc==-1) ? "" : url.substring(fploc);
    },
    getParamCount : function(url){
        var query = this.getSearch(url);
        return (query.match(new RegExp(/[\?|&|#][a-zA-Z0-9+]+(=([^&|#|?*]*))?/g))||[]).length;
    },
    getParamList : function(url){
        var query = this.getSearch(url);
        var rawParams = query.match(new RegExp(/([\?|&|#][a-zA-Z0-9+]+=?)/g))||[];
        var oparams = [];
        rawParams.forEach(function(it){
            oparams.push(it.replace(/[?|&|=|#]/g,""));
        });
        return oparams;
    },
    hasParam : function(url,p){
        var query = this.getSearch(url);
        return (query.match(new RegExp('[?&#]' + p + '=([^&]+)')) || [])[0] !==undefined;
    },
    getParamValue : function(url,p){
        if(this.hasParam(url,p)){
            var query = this.getSearch(url);
            return ((query.match(new RegExp('[?&#]' + p + '=([^&|^?|^#]+)')) || [])[0]||"").replace(/[?|&|#][a-zA-Z0-9*]+=/g,"");
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