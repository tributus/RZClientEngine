rz.httpclient.ajax = function (method, url, data, success, fail, sudouser, sudokey) {
    $.ajax({
        type: method,
        url: url,
        data: JSON.stringify(data),
        crossDomain: true,
        headers: {
            "sudo-user": sudouser || "",
            "sudo-key": sudokey || ""
        },
        success: function (d) {
            if (d !== undefined && d.status !== "authentication") {
                if (success) success(d);
            }
            else {
                setTimeout(function () {
                    $RZ_APP.ui.sudo(d, method, url, data, success, fail);
                }, 1000);
            }
        },
        error: function (e) {
            if (fail) {
                fail(e);
            }
            else {
                var message = "Erro consultando o serviço";
                $RZ_APP.ui.alert(message);
                console.warn(message, e);
            }
        },
        dataType: 'json',
        contentType: 'application/json'
    });
};

rz.httpclient.get = function (url, data, success, fail) {
    rz.httpclient.ajax("GET", url, data, success, fail);
};

rz.httpclient.post = function (url, data, success, fail) {
    rz.httpclient.ajax("post", url, data, success, fail);
};

rz.httpclient.postX = function (url, data, success, fail) {
    $.ajax({
        url: url,
        type: "post",
        data: data,
        crossDomain: true,
        success: function (d) {
            if (success) success(d);
        },
        error: function (e) {
            if (e.status == 200) {
                var resp = JSON.parse(e.responseText);
                success({status: "success", data: resp});
            }
            else if (e.status == 401) {
                success({status: "fail"});
            }
            else {
                var mensagem = "Erro efetuando o login";
                console.warn(mensagem, e);
                if (fail) {
                    fail(e);
                }
                else {
                    $RZ_APP.ui.alert(mensagem);
                }
            }


        },
        dataType: 'text/html'
    });
};

rz.httpclient.put = function (url, data, success, fail) {
    rz.httpclient.ajax("put", url, data, success, fail);
};

rz.httpclient.delete = function (url, data, success, fail) {
    rz.httpclient.ajax("delete", url, data, success, fail);
};

rz.httpclient.buildApiUrl = function(url,params,apiVersion){
    apiVersion = apiVersion || "1";
    var baseUrl = $RZ_APP.Settings.apiBaseUrl.replace("{version}",apiVersion);
    if(params){
        var keys = url.match(/\{[a-zA-Z]+}/g);
        if(keys){
            keys.forEach(function(key){
                var paramVal = params[key.replace(/\{|}/g,"")]||"";
                url = url.replace(key,paramVal);
            });
        }
    }
    return baseUrl + url;
};

rz.httpclient.buildExternalApiUrl = function(url,params){
    if(params){
        var keys = url.match(/\{[a-zA-Z]+}/g);
        if(keys){
            keys.forEach(function(key){
                var paramVal = params[key.replace(/\{|}/g,"")]||"";
                url = url.replace(key,paramVal);
            });
        }
    }
    return url;
};

rz.httpclient.buildUrl = function (url, params) {
    if(params){
        var keys = url.match(/\{[a-zA-Z]+}/g);
        if(keys){
            keys.forEach(function(key){
                url = url.replace(key,params[key.replace(/\{|}/g,"")]);
            });
        }
    }
    return url;
};

rz.httpclient.setBaseApiUrl = function(value){
    $RZ_APP.Settings.apiBaseUrl = value;
}