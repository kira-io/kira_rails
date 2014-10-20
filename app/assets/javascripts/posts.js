var socket = io.connect("http://192.168.15.202:7777", {force_connection: true});


  var room_number = 0;
  var user_name = 'kira';

  $(document).on('submit', 'form', function(){
      console.log($('#message').val().replace(/(<([^>]+)>)/ig,""));
      var message = $('#message').val().replace(/(<([^>]+)>)/ig,"");
      room_number = $(this).attr('id');

      socket.emit('client:emit_message', {room: room_number, name: user_name, message: message});

      $('#message').val('');
      return false;
  });

  socket.emit('disconnect', {room: room_number});

// $(document).on('submit', 'form', function(){
//     console.log($('#message').val().replace(/(<([^>]+)>)/ig,""));
//     var message = $('#message').val().replace(/(<([^>]+)>)/ig,"");
//     // room_number = $(this).attr('id');

//     socket.emit('client:emit_message', {room: room_number, name: user_name, message: message});

//     $('#message').val('');
//     return false;
// });

// socket.on('server:incoming_message', function(data){
//     console.log("INCOMING MESSAGE", data.name, data.message);
//     $('#chat_room').append("<p>" + data.name + ": " + data.message + "</p>");
// });

socket.on('server:expired_room', function (data){
    $('.room' + room_number).css('background-color', 'silver')
})

socket.on('server:incoming_message', function(data){
  console.log("INCOMING MESSAGE", data.name, data.message);
  $('#chat_room').append("<p>" + data.name + ": " + data.message + "</p>");
});

