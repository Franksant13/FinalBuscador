var socket = io();
var selectorBusqueda = 0;
var params = {
  "precioInicial":1000,
  "precioFinal":20000,
  "ciudad":"",
  "tipo":"",
};

//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$",
  //Busca en base al precio
  onFinish:function (data) {
    var inicial = data.from;
    var final = data.to;
    params.precioInicial = inicial;
    params.precioFinal = final;
  }
})

function setSearch() {
  var busqueda = $('#checkPersonalizada')
  busqueda.on('change', function(e){
    if (this.customSearch == false) {
      this.customSearch = true
      selectorBusqueda = 0;
    } else {
      this.customSearch = false
      //Llenar los select con info actualizada
      selectorBusqueda = 1;
      llenarSelects();
    }
    $('#personalizada').toggleClass('invisible')
  })
}
setSearch()

//Selecciona el valor de ciudad y tipo
$('#ciudad').change(function(){
  params.ciudad = this.value;
});
$('#tipo').change(function(){
  params.tipo = this.value;
});

//Busqueda
$('#buscar').click(function(){
  if(selectorBusqueda == 0){
    //Obtener todos los registros
    socket.emit("getAllRegistros");
    socket.on("getAllRegistros", function(value){
      $('.lista').html("");
      for(var i = 0; i < value.length; i++){
        $('.lista').append("<div class='card horizontal'> <div class='card-image'><img src='img/home.jpg'></div> <div class='card-stacked'><div class='card-content'> <div><b>Direccion: " + value[i].Direccion + " </b><p></p></div> <div><b>Ciudad: " + value[i].Ciudad + " </b><p></p></div> <div><b>Telefono: " + value[i].Telefono + " </b><p></p></div> <div><b>Codigo_Postal: " + value[i].Codigo_Postal + " </b><p></p></div> <div><b>Tipo: " + value[i].Tipo + " </b><p></p></div> <div><b>Precio: " + value[i].Precio + " </b><p></p></div> </div></div> </div>");
      }
    })
  }else{
    socket.emit("buscarRegistros", params);
    socket.on("buscarRegistros", function(value){
      $('.lista').html("");
      for(var i = 0; i < value.length; i++){
        $('.lista').append("<div class='card horizontal'> <div class='card-image'><img src='img/home.jpg'></div> <div class='card-stacked'><div class='card-content'> <div><b>Direccion: " + value[i].Direccion + " </b><p></p></div> <div><b>Ciudad: " + value[i].Ciudad + " </b><p></p></div> <div><b>Telefono: " + value[i].Telefono + " </b><p></p></div> <div><b>Codigo_Postal: " + value[i].Codigo_Postal + " </b><p></p></div> <div><b>Tipo: " + value[i].Tipo + " </b><p></p></div> <div><b>Precio: " + value[i].Precio + " </b><p></p></div> </div></div> </div>");
      }
    })
  }
})

//Llenar la informacion de los selects del buscador
function llenarSelects(){
  socket.emit("getCiudadesyTipos");
  socket.on("getCiudadesyTipos", function(ciudades, tipos){

    for(var i = 0; i < ciudades.length; i++){
      $('#ciudad').append("<option value='" + ciudades[i] + "'>" + ciudades[i] + "</option>");
    }

    for(var i = 0; i < tipos.length; i++){
      $('#tipo').append("<option value='" + tipos[i] + "'>" + tipos[i] + "</option>");
    }

  })
}


