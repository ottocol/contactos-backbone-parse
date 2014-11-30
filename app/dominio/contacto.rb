require 'json'

class Contacto
  attr_accessor :nombre, :apellidos, :telefono

  def initialize(nombre, apellidos, telefono)
    self.nombre = nombre
    self.apellidos = apellidos
    self.telefono = telefono
  end

  # truco: como id usamos el "object_id" de Ruby
  # que es único para cada objeto y asignado automáticamente por el sistema
  def id
    self.object_id
  end


  def to_json(*opts)
    {
        :id => self.id,
        :nombre => self.nombre,
        :apellidos => self.apellidos,
        :telefono => self.telefono
    }.to_json(*opts)
  end
end