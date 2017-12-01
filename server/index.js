var bodyParser = require('body-parser');
var http = require('http');
var express = require('express');
var fs = require('fs');
var path = require('path');

var io = require('socket.io');

var port = port = process.env.PORT || 3000;
var app = express();
var Server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

Server.listen(port, function () {
    console.log("Server corriendo en puerto " + port);
});


io = io.listen(Server);

io.sockets.on("connection",function(socket) {

    //obtener todos los registros
    socket.on("getAllRegistros", function () {

        var filePath = path.join(__dirname, 'data.json');
        fs.readFile(filePath, 'utf8', function(err,data){
            if (!err) {
                var envioDatos = JSON.parse(data);
                console.log('Datos leidos: ' + envioDatos);
                socket.emit("getAllRegistros", envioDatos);
            } else {
                console.log(err);
            }
        });
    });

    //obtener ciudades y tipos
    socket.on("getCiudadesyTipos", function () {

        function remove_duplicates(arr) {
            var obj = {};
            var ret_arr = [];
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i]] = true;
            }
            for (var key in obj) {
                ret_arr.push(key);
            }
            return ret_arr;
        }

        var filePath = path.join(__dirname, 'data.json');
        fs.readFile(filePath, 'utf8', function(err,data){
            if (!err) {
                var ciudad = [];
                var tipo = [];
                var datos = JSON.parse(data);
                for(var i = 0; i < datos.length; i++){
                    ciudad.push(datos[i].Ciudad);
                    tipo.push(datos[i].Tipo);
                }
                ciudad = remove_duplicates(ciudad);
                tipo = remove_duplicates(tipo);

                socket.emit("getCiudadesyTipos", ciudad, tipo);
            } else {
                console.log(err);
            }
        });
    });

    //obtener resultado de la busqueda
    socket.on("buscarRegistros", function (params) {

        var filePath = path.join(__dirname, 'data.json');
        fs.readFile(filePath, 'utf8', function(err,data){
            if (!err) {

                var datos = JSON.parse(data);
                var vectorEnvio = [];

                if(params.ciudad == "" && params.tipo == ""){

                    //Busca solo por precio
                    for(var i = 0; i < datos.length; i++){
                        var precio = datos[i].Precio;
                        precio = precio.split("$");
                        precio = precio[1];
                        precio = precio.split(",");
                        precio = precio[0] + precio[1];
                        if(parseInt(precio) >= parseInt(params.precioInicial) && parseInt(precio) <= parseInt(params.precioFinal)){
                            vectorEnvio.push(datos[i]);
                        }
                    }
                    socket.emit("buscarRegistros", vectorEnvio);

                }else if(params.ciudad != "" && params.tipo == ""){

                    //Busca por precio y por ciudad
                    for(var i = 0; i < datos.length; i++){
                        var precio = datos[i].Precio;
                        precio = precio.split("$");
                        precio = precio[1];
                        precio = precio.split(",");
                        precio = precio[0] + precio[1];
                        if(parseInt(precio) >= parseInt(params.precioInicial) && parseInt(precio) <= parseInt(params.precioFinal) && params.ciudad == datos[i].Ciudad){
                            vectorEnvio.push(datos[i]);
                        }
                    }
                    socket.emit("buscarRegistros", vectorEnvio);

                }else if(params.ciudad == "" && params.tipo != ""){

                    //Busca por precio y por tipo
                    for(var i = 0; i < datos.length; i++){
                        var precio = datos[i].Precio;
                        precio = precio.split("$");
                        precio = precio[1];
                        precio = precio.split(",");
                        precio = precio[0] + precio[1];
                        if(parseInt(precio) >= parseInt(params.precioInicial) && parseInt(precio) <= parseInt(params.precioFinal) && params.tipo == datos[i].Tipo){
                            vectorEnvio.push(datos[i]);
                        }
                    }
                    socket.emit("buscarRegistros", vectorEnvio);

                }else if(params.ciudad != "" && params.tipo != ""){

                    //Busca por precio, por tipo y por ciudad
                    for(var i = 0; i < datos.length; i++){
                        var precio = datos[i].Precio;
                        precio = precio.split("$");
                        precio = precio[1];
                        precio = precio.split(",");
                        precio = precio[0] + precio[1];
                        if(parseInt(precio) >= parseInt(params.precioInicial) && parseInt(precio) <= parseInt(params.precioFinal) && params.tipo == datos[i].Tipo && params.ciudad == datos[i].Ciudad){
                            vectorEnvio.push(datos[i]);
                        }
                    }
                    socket.emit("buscarRegistros", vectorEnvio);

                }

            } else {
                console.log(err);
            }
        });



    })


});

