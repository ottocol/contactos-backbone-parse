var AgendaVista = Backbone.View.extend({
    initialize: function() {
        console.log("inicializando agenda")
        //Creamos y asociamos la colección a la propiedad "collection", la convención en Backbone
        this.collection = new Agenda()
        //Por defecto nos posicionaremos en el primer contacto de la agenda
        this.pos_actual = 0
        //Cuando se produzca un "reset", mostramos el modelo actual
        this.listenTo(this.collection, "reset", this.render_data)
        //Le pedimos la colección al servidor,
        //indicando que cuando se reciban los datos se dispare el evento "reset"
        this.collection.fetch({reset:true})
        //Mostramos la vista, así se muestra nada más hacer un new
        this.render()
    },
    //"el" es el nodo del DOM donde se coloca la vista.
    // En este caso con el id="agenda"
    el: "#agenda",
    //función usada en Backbone por convención para dibujar la vista
    render: function() {
        //En nuestro caso "render" dibuja el esqueleto de la vista, pero no los datos
        this.el.innerHTML = document.getElementById('agenda_template').innerHTML
    },
    //Muestra los datos del contacto actual
    render_data: function() {
        //modelo que está en la posición actual
        var modelo_act = this.collection.at(this.pos_actual)
        //Mostramos los datos del modelo en el formulario
        this.el.querySelector('#nombre').value = modelo_act.get("nombre")
        this.el.querySelector('#apellidos').value = modelo_act.get("apellidos")
        this.el.querySelector('#telefono').value = modelo_act.get("telefono")
    },
    //Ir al modelo anterior y mostrarlo
    ir_anterior: function () {
        if (this.pos_actual>0) {
            this.moverse_a(this.pos_actual-1)
        }
    },
    //Ir al modelo siguiente y mostrarlo
    ir_siguiente: function() {
        if (this.pos_actual<this.collection.length-1) {
            this.moverse_a(this.pos_actual+1)
        }
    },
    //Moverse a una determinada posición de la lista de contactos
    moverse_a: function(nueva_pos) {
        this.copiar_a_modelo()
        var modelo_act = this.collection.at(this.pos_actual)
        if(modelo_act.hasChanged()) {
            var resp = window.confirm("Han cambiado los datos ¿deseas guardarlos?")
            if (resp)
            //Guardamos los datos en el servidor
                this.guardar_actual()
            else
            //Deshacemos los cambios, volviendo a los valores previos
                modelo_act.set(modelo_act.previousAttributes())
        }
        this.pos_actual = nueva_pos;
        this.render_data();

    },
    //Guardar en el modelo actual los valores del formulario y enviarlo al servidor
    guardar_actual: function() {
        var modelo = this.collection.at(this.pos_actual)
        modelo.set("nombre", this.el.querySelector("#nombre").value)
        modelo.set("apellidos", this.el.querySelector("#apellidos").value)
        modelo.set("telefono", this.el.querySelector("#telefono").value)
        console.log("guardando modelo")
        console.log(modelo.guardar())
    },
    //Crear un modelo nuevo con datos vacíos y añadirlo a la colección
    insertar_nuevo: function() {
        this.collection.add(new Contacto())
        this.pos_actual = this.collection.length-1
        this.render_data()
    },
    //Copiar los datos de la vista al modelo
    copiar_a_modelo: function() {
        var modelo_act = this.collection.at(this.pos_actual)
        var nuevo_nombre =  this.el.querySelector("#nombre").value
        var nuevo_apellidos = this.el.querySelector("#apellidos").value
        var nuevo_telefono = this.el.querySelector("#telefono").value
        modelo_act.set({nombre: nuevo_nombre, apellidos: nuevo_apellidos,
            telefono: nuevo_telefono})
    },
    //Eventos de la vista
    //Formato: 'evento selector_objeto': 'funcion_a_llamar'
    events: {
        'click #boton_anterior': 'ir_anterior',
        'click #boton_siguiente': 'ir_siguiente',
        'click #boton_guardar': 'guardar_actual',
        'click #boton_nuevo': 'insertar_nuevo'
    }
})

