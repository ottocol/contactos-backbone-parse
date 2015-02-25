var MiRouter = Backbone.Router.extend({
        routes: {'hola' : 'saludar'},
        saludar: function(){
                console.log('Hola soy el router')
        }
});

var mi_router = new MiRouter()

Backbone.history.start()