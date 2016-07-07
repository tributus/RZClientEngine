#RZClientEngine
Core ui library for RuteZangada Platform. 

##Overview
This component contains core functionality and provides the "ruteZangada" object who centralizes all *client side* features for rzPlatform. 

##Install
Use bower to install this component:

```
bower install rutezangada-clientengine
```


##Using
###Widgets Render Engine
This engine creates (definition) and instantiates (usage) widgets and render that (plot) into html elements. To create a widget, use the following sintax: 

```html
     var wiget = ruteZangada.widget("WidgetName",['operations','list'], ['events','list'],widgetBodyFunction);
   );
```

####operations list
This list defines the widget interface operations (public methods). A public method is created for each operation defined in this list. These methods would be overrided in *widgetBodyFunction*. If you not overrides a method, an "not implemented" exception will be thrown every time it is invoked;   

####Example:

```html
var op = ["setWidgetData","getWidgetData","clearData"]
// when createing the widget, setWidgetData(), getWidgetData() and clearData() methods will be automatically injected;
```

Optionally, you can use the *MethodInfo* object model to define detailed information about each operation 

```html
var op = [
    {name:"OperationName", description:"detailed operation description", friendlyName:"operation friendly name",
        params:[
            {name:"paramName", friendlyName:"param friendly name",description:"param desription",type:"param's type name"}
        ]
    },
]
```

When using this object specification, you can add any other informations who judge relevant. The only mandatory property is *"name"* .


To get widget operations information, you can use the *getMethodDescriptors()* or *\[instance\].getMethodDescriptor(n)* where \[instance\] is the widget instance pointer.  
 

####events list
An array of events who can handled by widget;

####Example

```html
var ev = ["after-save","before-load"];
```



###http get helper
ruteZangada offers a method to do GET http requests. We encourage that it be used for all http requests.

####Exemple

```
ruteZangada.get("http://url.com?param=1",function(data,status){
    ...
});
```

##Versions and features
###0.0.1
- Widgets Render Engine
- http get helper
