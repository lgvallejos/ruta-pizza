

var dataJSON = {};
var restaurantes = [];
var marcador = [];
var ventanainfo = [];
var id;

$.getJSON( "https://calm-hollows-29056.herokuapp.com/api/pizzerias")
.done(function( data, textStatus, jqXHR ) {
  dataJSON = data;


  function initialize() {

    var styleArray = [
    {
      featureType: 'all',
      stylers: [
      { saturation: -80 }
      ]
    },{
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
      { hue: '#00ffee' },
      { saturation: 50 }
      ]
    },{
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [
      { visibility: 'off' }
      ]
    }
    ];

    var mapOptions = {
      zoom: 13,
      center: new google.maps.LatLng(-34.609476, -58.425979),
      styles: styleArray
    };

    var map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
    var vars = {};

    var contentString = {};

    for( i in dataJSON){
      console.log(dataJSON[i].descripcion);
      var valRep='';
      if (dataJSON[i].valorPlatoMax){
              //con match y el regex obtengo solo el valor numérico
              var valorPlato = parseInt(dataJSON[i].valorPlatoMax.match(/\d+/));

              if (valorPlato <= 200) {
                var valPlato = '<span class="ion-social-usd"></span> <b> (menor a $200)</b>';
              }
              if (valorPlato > 200 && valorPlato < 600) {

                var valPlato = '<span class="ion-social-usd"></span><span class="ion-social-usd"></span> <b> (entre $200 y $600)</b>';
              }
              if (valorPlato >= 600) {
                var valPlato = '<span class="ion-social-usd"></span><span class="ion-social-usd"></span><span class="ion-social-usd"></span> <b> (mayor a $600)</b>';
              }
            }
            if (dataJSON[i].reputacion){
              var reputation = parseInt(dataJSON[i].reputacion.match(/\d+/));
              for (j=1;j<=reputation;j++){
                valRep +='<span class="ion-ios-star"></span>';
              }
            }
            
            contentString['content'+i] = '<div id="content">'+
            '<a id="editar" href="#">Editar</a>'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Pizzería '+ dataJSON[i].nombre +'</h1>'+
            '<div id="bodyContent">'+
            '<p>Dirección: ' + dataJSON[i].direccion + '</p>'+
            '<p>Descripción: ' + dataJSON[i].descripcion + '</p>'+
            '<p>Valor promedio: ' + valPlato + '</p>'+
            '<p>Reputación: ' + valRep + '</p>'+
            '<p>Web: <a href="http://' + dataJSON[i].link + '" target="_blank">'+ dataJSON[i].link +'</a></p>'+
            '<img class="imagen" src="assets/pizza.gif" >'+
            '<img class="imagen" style="border:5px solid black;" src="assets/' + dataJSON[i].imagen + '" >'+
            '<input type="hidden" id="idpizza" value="'+dataJSON[i]._id+'">'+
            '</div>'+
            '</div>';

            /*infowindow['info'+i] = new google.maps.InfoWindow({
              content: contentString['content'+i]
            });*/
            var image = 'assets/pizza3.png';
        // Creamos marcadores
        vars['marcador' + i] = new google.maps.Marker({position: {lat: parseFloat(dataJSON[i].lat), lng: parseFloat(dataJSON[i].lng)},title:dataJSON[i].nombre, icon:image});
        vars['marcador' + i].setMap(map);
        //alert(dataJSON[i].position.lat);
        infoBox(map,vars['marcador' + i],contentString['content'+i],dataJSON[i].direccion,dataJSON[i].nombre);
        /*vars['marcador' + i].addListener('click', function() {
              infowindow['info'+i].open(map, vars['marcador' + i]);
            });*/
        //var marker2 = new google.maps.Marker({position: {lat: -34.6041209, lng: -58.3800874},title:"El palacio de la pizza"});
        
        

        
        //marker2.setMap(map);
      }

          //genero rutas
          var wayA;
          var wayB;
          var control = document.createElement('DIV');
          control.style.padding = '1px';
          control.style.border = '1px solid #000';
          control.style.backgroundColor = 'white';
          control.style.cursor = 'pointer';

          control.index = 1;


          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

          google.maps.event.addDomListener(control, 'click', function() {
            doMark = false;



          });

          google.maps.event.addListener(map, "click", function(event) {
            if (!wayA) {
              wayA = {

                position: event.latLng,
                map: map

              };
            } else if (!wayB) {
              $('#directionsPanel').show();
              wayB = {

                position: event.latLng,
                map: map

              };


              ren = new google.maps.DirectionsRenderer({
                'draggable': true
              });
              ren.setMap(map);
              ren.setPanel(document.getElementById("directionsPanel"));
              ser = new google.maps.DirectionsService();

              ser.route({
                'origin': wayA.position,
                'destination': wayB.position,
                'travelMode': google.maps.DirectionsTravelMode.DRIVING
              }, function(res, sts) {
                if (sts == 'OK') ren.setDirections(res);
              })

            }
          });

  //fin genero rutas

}








google.maps.event.addDomListener(window, 'load', initialize);
})
.fail(function( jqXHR, textStatus, errorThrown ) {
 console.log( "Algo ha fallado: " +  textStatus );
}); 

var infowindow = {}; 
function infoBox(map,marker,data,direc,nombr) {
  infowindow['info'+i] = new google.maps.InfoWindow();
        // Attaching a click event to the current marker
        google.maps.event.addListener(marker, "click", function(e) {
          infowindow['info'+i].setContent(data);
          infowindow['info'+i].open(map, marker);

        });

        ventanainfo.push ({'nombre':nombr,'direccion':direc});
        marcador.push( marker );
        

        (function(marker, data) {
          // Attaching a click event to the current marker
          google.maps.event.addListener(marker, "click", function(e) {
            infowindow['info'+i].setContent(data);
            infowindow['info'+i].open(map, marker);

          });
        })(marker, data);
        
        
      }


      function validar(){
        
        
        eventsholded={'lat': $('#latitud').val(), 'lng': $('#longitud').val(), 'nombre': $('#nombre').val(), 'direccion': $('#direccion').val(), 'descripcion': $('#descripcion').val(), 'valorPlatoMax': $('#valor').val(), 'reputacion': $('#reputacion').val(), 'link': $('#link').val(), 'imagen': $('#foto').val().split('\\').pop()};
        $.ajax
        ({
          type: "POST",
          dataType : 'json',
          url: 'https://calm-hollows-29056.herokuapp.com/api/pizzerias',
          data: eventsholded,
          success: function () {alert("Thanks!"); },
          failure: function() {alert("Error!");}
        });


        location.reload();

        


      }

      function editardata(){

        eventsholded={'lat': $('#latitud').val(), 'lng': $('#longitud').val(), 'nombre': $('#nombre').val(), 'direccion': $('#direccion').val(), 'descripcion': $('#descripcion').val(), 'valorPlatoMax': $('#valor').val(), 'reputacion': $('#reputacion').val(), 'link': $('#link').val(), 'imagen': $('#foto').val().split('\\').pop()};
        console.log(eventsholded);
        $.ajax
        ({
          type: "PUT",
          dataType : 'json',
          async: false,
          url: 'https://calm-hollows-29056.herokuapp.com/api/pizzerias/'+id,
          data: eventsholded,
          success: function () {alert("Thanks!"); },
          failure: function() {alert("Error!");}
        });
        location.reload();

      }

      $(document).on('click','#editar',function(){
       $('#editardata').show();
       $('#enviardata').hide();
       $.getJSON( "https://calm-hollows-29056.herokuapp.com/api/pizzerias")
       .done(function( data, textStatus, jqXHR ) {
        //dataJSON = data.mapa.items;
        dataJSON = data;
        for (i in dataJSON){
          if (dataJSON[i]._id == $('#idpizza').val()){
                 //alert($('#idpizza').val());
                 $('#nombre').val(dataJSON[i].nombre);
                 $('#direccion').val(dataJSON[i].direccion);
                 $('#latitud').val(dataJSON[i].lat);
                 $('#longitud').val(dataJSON[i].lng);
                 //$('#foto').val(dataJSON[i].imagen);
                 $('#valor').val(dataJSON[i].valorPlatoMax);
                 $('#reputacion').val(dataJSON[i].reputacion);
                 $('#link').val(dataJSON[i].link);
                 $('#descripcion').val(dataJSON[i].descripcion);
                 id=$('#idpizza').val();
               }
             }
           })
     });


      $(document).on('click','.leftarrow',function(){
       $('.cuadro').animate({
        opacity: 0.25,
        left: "-=50",
        height: "toggle"
      }, 100, function() {
        $('.rightarrow').show();
    // Animation complete.
    
  });
       
     });

      $(document).on('click','.rightarrow',function(){
        $('.rightarrow').hide();
        $('.cuadro').animate({
          opacity: 1,
          left: "+=50",
          height: "toggle"
        }, 100, function() {

    // Animation complete.
    console.log('animacion completada');
  });
        
      });

      $(document).on('click','#indicaciones',function(){
        $('.flechabajo').show();
        $('#directionsPanel').animate({
          opacity: 1,
          top: "-=50",
          height: "toggle"
        }, 100, function() {

    // Animation complete.
    console.log('animacion completada');
  });
        
      });

      $(document).on('click','.flechabajo',function(){
        $('.flechabajo').hide();
        $('#directionsPanel').animate({
          opacity: 1,
          top: "+=50",
          height: "toggle"
        }, 100, function() {

    // Animation complete.
    console.log('animacion completada');
  });
        
      });

      $(document).on('click','#buscar',function(){
        $('#formulario').show();
        $('.cuadro').css('margin-top','40px');
        $('#directionsPanel').css('margin-top','40px');
        if ($('input[name=options]:checked').val() == "Nombre" && $('#buscarv').val() !== ''){
          for (i in marcador){
            if (marcador[i].title.toLowerCase().indexOf($('#buscarv').val().toLowerCase()) !== -1) {
              new google.maps.event.trigger( marcador[i], 'click' );
            }
          }
        }

        if ($('input[name=options]:checked').val() == "Direccion" && $('#buscarv').val() !== ''){
          for (j in ventanainfo){
            if(ventanainfo[j].direccion.toLowerCase().indexOf($('#buscarv').val().toLowerCase()) !== -1) {
              for (i in marcador){
                if (marcador[i].title.toLowerCase().indexOf(ventanainfo[j].nombre.toLowerCase()) !== -1) {
                  new google.maps.event.trigger( marcador[i], 'click' );
                }
              }
            }
          }
          
        }
        
        
      });

