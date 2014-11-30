require 'sinatra/base'
require 'json'
require_relative '../dominio/contacto'

class ContactosAPI < Sinatra::Base
  configure do
    @@lista_contactos = []
    @@lista_contactos << Contacto.new('Contacto1', 'Apellidos contacto 1', '555123456')
    @@lista_contactos << Contacto.new('Contacto2', 'Apellidos contacto 2', '555654321')
  end

  get '/' do
    status 200
    @@lista_contactos.to_json
  end

  get '/:id' do
    id = params[:id].to_i
    index = @@lista_contactos.index{|obj| obj.id==id}
    if !index.nil?
      status 200
      @@lista_contactos[index].to_json
    else
      status 404
      'contacto no existente'
    end
  end

  post '/' do
    begin
      datos = JSON.parse(request.body.read)
      status 201
      nuevo = Contacto.new(datos['nombre'], datos['apellidos'], datos['telefono'])
      @@lista_contactos << nuevo
      puts "[SERVIDOR] nuevo contacto creado: #{nuevo.to_json}"
      nuevo.to_json
    rescue JSON::ParserError => e
      status 400
      e
    end
  end

  put '/:id' do
    id = params[:id].to_i
    index = @@lista_contactos.index{|obj| obj.id==id}
    begin
      if !index.nil?
        datos = JSON.parse(request.body.read)
        contacto = @@lista_contactos[index]
        contacto.nombre = datos['nombre']
        contacto.apellidos = datos['apellidos']
        contacto.telefono = datos['telefono']
        status 200
        puts "[SERVIDOR] contacto actualizado: #{contacto.to_json}"
        contacto.to_json
      else
        status 404
        'contacto no existente'
      end
      rescue JSON::ParserError => pe
        status 400
        pe
    end
  end

  delete '/:id' do
    id = params[:id].to_i
    index = @@lista_contactos.index{|obj| obj.id==id}
    if !index.nil?
      @@lista_contactos.delete_at(index)
      status 200
    else
      status 404
      'contacto no existente'
    end
  end

end