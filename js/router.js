var MiRouter = Backbone.Router.extend({
        routes: {
        	'hola' : 'saludar',
    	},
        saludar: function(){
            console.log('Hola soy el router')
        }
});

