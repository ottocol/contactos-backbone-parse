require './app/api/contactos_api'
require './app/web/servidor_web'


map '/api/contactos' do
  run ContactosAPI
end

map '/web' do
  run ServidorWeb
end

