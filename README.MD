#RZClientEngine 0.0.1
Mecanismo de interface do usuário da plataforma RuteZangada.

##Visão geral
Este componente disponibiliza o objeto "ruteZangada" que centraliza todas as funcionalidades *client side* da plataforma.

##Versões e funcionalidades
###0.0.1
- mecanismo de renderização de widgets
- http get helper

##Uso
###mecanismo de renderização de widgets
Este mecanismo cria e instancia (plota) widgets em elementos html
Para criar um widget, use a seguinte sintaxe:

```html
var wiget = ruteZangada.widget("Nome",['lista','de','operacoes'], ['lista','de','eventos'],widgetBodyFunction);
    );
```

####lista de operações
Esta lista define as operações que fazem parte da interface do widget. Para cada operação informada aqui é, criado um método público no widget. Este método deve ser sobrescrito no *widgetBodyFunction*. Caso ele não seja sobrescrito, uma exceção do tipo "not implemented" será disparada sempre que o método for invocado.

####Exemplo:

```html
var op = ["setWidgetData","getWidgetData","clearData"]
// ao criar o widget as operações setWidgetData(), getWidgetData() e clearData() serão automaticamente injetadas no mesmo 
```

Opcionalmente, você pode utilizar o objeto do tipo *MethodInfo* para definir informações mais detalhadas sobre cada operação.

```html
var op = [
    {name:"nomeDaOperacao", description:"descrição da operação", friendlyName:"Nome amigável da operação",
        params:[
            {name:"nomeParametro", friendlyName:"nome amigável do parâmetro",description:"descrição do parâmetro",type:"nome do tipo de dados do parâmetro"}
        ]
    },
]
```

Ao utilizar este objeto, outras informações podem ser inclusas ao critério do desenvolvedor. A única propriedade obrigatória é a *"name"*.

Para recuperar informações sobre as operações do widget, você pode utilizar os métodos *getMethodDescriptors()*  ou *instance.getMethodDescriptor(n)* da instância do widget. 

####lista de eventos
É um array dos eventos que podem ser disparados pelo widget.

####Exemplo

```html
var ev = ["after-save","before-load"];
```



###http get helper
ruteZangada oferece um método para requisições http do tipo get. É recomendável o uso deste método para todas as requisições http get.

####Exemplo

```
ruteZangada.get("http://url.com?param=1",function(data,status){
    ...
});
```