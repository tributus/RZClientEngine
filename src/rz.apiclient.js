rz.apiEndpoints = {}
rz.httpclient.registerApiEndpoint = function(name,handler){
  rz.apiEndpoints[name] = handler;
}

rz.httpclient.callApi = function(name,params,requestBody,success,fail){
  var apiData = rz.apiEndpoints[name];
  if(!apiData){
    fail({error:"api endpoint not registered"});
  }
  else{
    var url = (apiData.external)? rz.httpclient.buildExternalApiUrl(apiData.url,params) : rz.httpclient.buildApiUrl(apiData.url,params);
    var __call = function(f_url,f_requestBody,f_apiData){
      rz.httpclient[(f_apiData.method || "get").toLowerCase()](f_url, f_requestBody, success, fail);
    }
    if(apiData.beforeCall){
      apiData.beforeCall(apiData,url,params,requestBody,function(i_apiData,i_url,i_requestBody,cancel){
        if(!cancel){
          __call(i_url,i_requestBody,i_apiData);
        }
        else{
          success({"status":"canceled"});
        }
      });
    }
    else{
      __call(url,requestBody,apiData);
    }
  }
}

rz.httpclient.registerApiEndpoint("get context info",{
  url:"auth/session",
  method:"GET",
  external:false,
  beforeCall:function(apiData,url,params,requestBody,callback){
    var cancel = false; //didatic purposes only
    return callback(apiData,url,requestBody,cancel);
  }
});

rz.httpclient.registerApiEndpoint("api test",{
  url:"testes/t1/{data}",
  method:"GET",
  external:false
});