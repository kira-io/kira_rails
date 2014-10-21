var socket = io.connect("http://192.168.15.170:7777", {force_connection: true});

var room_number = 0;
var user_name = 'kira';
$(document).ready(function(){
  user_name = $('#user_name').text();
  socket.emit('client:send_user_name', {name: user_name})

  socket.on('server:user_name', function(data){
    user_name = data.name
  }); 
});

$(document).on('submit', 'form', function(){
  
  console.log($('#message').val().replace(/(<([^>]+)>)/ig,""));
  var message = $('#message').val().replace(/(<([^>]+)>)/ig,"");
  room_number = $(this).attr('id');

  // socket.emit('client:emit_message', {room: room_number, name: user_name, message: message});
  socket.emit('client:emit_message', {room: room_number, message: message});

  $('#message').val('');
  return false;
});

socket.emit('disconnect', {room: room_number});

socket.on('server:expired_room', function (data){
    $('.limbo' + data.room_num).css('background-color', 'silver')
    console.log('.limbo + roomnumber', data.room_num)
})

socket.on('server:incoming_message', function(data){
  console.log("INCOMING MESSAGE", data.name, data.message);
  // $('#chat_room').append("<p>" + data.name + ": " + data.message + "</p>");
  $('#chat_room').append("<p>" + user_name + ": " + data.message + "</p>");
});

