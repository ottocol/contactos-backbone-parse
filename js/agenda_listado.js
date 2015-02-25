//EL MAL: una variable global para indicar que se está editando un contacto
//y que no vamos a dejar editar los otros. Podríamos evitarla pero complicaríamos el código
var editando = false


//Vista de Backbone que representa un único contacto
var ContactoVista = Backbone.View.extend({
    //queremos que la vista "cuelgue" de un div
    //Esto es solo para ilustrar, ya que <div> es lo que se usa por defecto
    tagName: 'div',

    //queremos que la etiqueta de la que "cuelga" la vista tenga la class="contacto"
    //Así podremos darle un estilo apropiado con CSS
    className: 'contacto',

    //plantilla Mustache para modo visualización
    template: document.getElementById("contacto_tmpl").innerHTML,

    //plantilla Mustache para modo edición
    templateEdit: document.getElementById("contacto_edit_tmpl").innerHTML,

    //donde se genera el HTML de la vista
    render: function() {
        //Rendering de la plantilla de mustache
        //1er parámetro: plantilla, 2º: objeto JSON con los datos
        //Aquí usamos el toJSON() de Backbone en vez del stringify estándar
        this.el.innerHTML = Mustache.render(this.template, this.model.toJSON())
        //por convenio el "render" de backbone devuelve this para poder encadenar llamadas al estilo jQuery
        return this
    },

    //donde se genera el HTML de la vista en modo edición
    render_edit: function() {
        this.el.innerHTML = Mustache.render(this.templateEdit, this.model.toJSON())
        //ponemos el foco de teclado en el campo de texto con el nombre
        document.getElementById("nombre_edit").focus()
        return this
    },

    //Se dispara al pulsar sobre el botón "editar" del contacto en modo visualización
    editar: function() {
        //Si ya estamos editando, esto no tiene sentido
        if (editando)
            return
        editando = true
        //pasamos a modo edición
        this.render_edit()
     },

    //Se dispara al pulsar sobre el botón "guardar"
    guardar: function() {
        //tomamos los nuevos valores
        this.model.set("nombre", this.el.querySelector("#nombre_edit").value)
        this.model.set("apellidos", this.el.querySelector("#apellidos_edit").value)
        this.model.set("telefono", this.el.querySelector("#telefono_edit").value)
        //guardamos en el servidor
        this.model.guardar()
        editando = false
        //Pasamos a modo visualización
        this.render()
    },

    borrar: function() {
      //borramos el modelo del servidor  
      this.model.destroy()
      //borramos la vista
      this.remove()
    },

    //Cada contacto tiene su propio botón de editar y borrar
    //(guardar si está en modo edición)
    events: {
        'click .boton_editar' : 'editar',
        'click .boton_guardar' : 'guardar',
        'click .boton_borrar' : 'borrar'
    }

})


//Vista de Backbone que representa a la lista entera de contactos
//Tiene una subvista por cada contacto
var ListaContactosVista = Backbone.View.extend({
    //La vista "cuelga" de la etiqueta cuyo id="agenda"
    el: '#agenda',

    //plantilla HTML (aquí no usamos Mustache)
    template: document.getElementById("listado_tmpl").innerHTML,

    initialize: function() {
        this.collection = new Agenda()
        //Le pedimos la agenda de contactos al servidor. Asíncrono!!
        this.collection.fetch({reset:true})
        //Cuando se produzca el "reset", dibujamos la vista.
        //Antes la colección todavía no habrá llegado del servidor
        this.listenTo(this.collection, "reset", this.render)
        //Especificar qué significa "this" en la función renderContacto
        //El primer parámetro indica qué debe ser "this". O sea, en renderContacto,
        //"this" apuntará al objeto actual (esta vista)
        _.bindAll(this, "renderContacto")
        //Lo anterior también se podría hacer con JS estándar así:
        //this.renderContacto = this.renderContacto.bind(this)

    },

    render: function() {
        this.el.innerHTML = this.template
        //para cada contacto de la colección, llamamos a "renderContacto"
        this.collection.each(this.renderContacto)
        return this.el
    },

    //Como hemos visto, llamado para cada contacto de la colección por el "each"
    //El "each" de backbone (en realidad de underscore) pasa automáticamente
    //como argumento el objeto actual de la iteración
    renderContacto: function(contacto) {
        //Creamos una subvista para este contacto
        var contactoVista = new ContactoVista({model: contacto})
        //añadimos el HTML de la subvista a la vista "madre" (nosotros)
        this.$el.append(contactoVista.render().$el)
        return this
    },

    //Disparado al pulsar sobre el botón de nuevo contacto
    nuevo: function() {
        var nuevo_contacto = new Contacto()
        nuevo_contacto.set("nombre", this.el.querySelector('#nombre').value)
        nuevo_contacto.set("apellidos", this.el.querySelector('#apellidos').value)
        nuevo_contacto.set("telefono", this.el.querySelector('#telefono').value)
        this.collection.add(nuevo_contacto)
        //Escuchamos el evento "sync" sobre el objeto nuevo_contacto
        //que se produce cuando los datos se sincronizan OK con el servidor
        //(en este caso cuando se haya guardado con save() como luego haremos)
        //vuelta de tuerca: cuando se produzca el evento, queremos llamar a
        //la función renderContacto pasándole como argumento "nuevo_contacto"
        //la magia del "bind" de JS estándar hace el resto
        //ver: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Example.3A_Partial_Functions
        this.listenToOnce(nuevo_contacto, "sync",
            this.renderContacto.bind(this, nuevo_contacto))
        //ahora guardamos el contacto. Cuando se guarde OK se disparará el evento "sync"
        nuevo_contacto.guardar()
    },
    events: {
        'click #boton_nuevo': 'nuevo'
    }
})