var MiRouter = Backbone.Router.extend({
        routes: {'hola' : 'saludar'},
        saludar: function(){
                console.log('Hola router')
        }
});

var mi_router = new MiRouter()

Backbone.History.start()