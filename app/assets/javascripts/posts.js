var socket = io.connect("http://192.168.15.228:7777", {force_connection: true});

var room_number = 0;
var user_name = 'kira';
var user_id;

$(document).ready(function(){
  user_name = $('#user_name').text();
  user_id = $('.leave_room_to_user').attr('data-user-id');
  room_number = $('.chat_form').attr('id');
  socket.emit('client:send_user_name', {name: user_name, id: user_id})
  // socket.emit('client:send_user_name', {name: user_name})

  // socket.on('server:user_name', function(data){
  //   user_name = data.name
  // });
  socket.on('server:user_name', function(data){
    console.log('SERVER:USER NAME', data)
    user_name = data.name;
    user_id = data.id;
    // socket.emit('room_count', {room: room_number, name: user_name})
  }); 
});

// $('#post').load(function(){
//   console.log("#POST.LOAD") 
// })

$(document).on('submit', '.chat_form', function(){
  console.log($('#message').val().replace(/(<([^>]+)>)/ig,""));
  var message = $('#message').val().replace(/(<([^>]+)>)/ig,"");
  room_number = $(this).attr('id');
  socket.emit('client:emit_message', {room: room_number, name: user_name, message: message});
  $('#message').val('');
  return false;
});

$(document).on('submit', '#message_box', function(){
  $.post($(this).attr('action'), $(this).serialize(), function(data){
    $('#message_box').hide();
  }, 'json');
  return false;
});

$(document).on('click', 'button#pm', function(){
  $('#message_box').toggle();
});

socket.emit('disconnect', {room: room_number});

socket.on('server:expired_room', function (data){
  $('.limbo' + data.room_num).css('background-color', 'silver')
  console.log('.limbo + roomnumber', data.room_num)
})

socket.on('server:incoming_message', function(data){
  console.log("INCOMING MESSAGE", data.name, data.message);
  $('#chat_room').append("<p>" + data.name + ": " + data.message + "</p>");
});
socket.on('server:new_user', function(data){
  if(data.num_users == 1){
    $('#chat_room').append("<p style='text-align: center'>" + data.name + " has joined the room.</p><p style='text-align: center'>There is " + data.num_users + " user in the room.</p>");
  } else{
    $('#chat_room').append("<p style='text-align: center'>" + data.name + " has joined the room.</p><p style='text-align: center'>There are " + data.num_users + " users in the room.</p>");
  }
});

// socket.on('server:new_user', function(data){ //
//   $('#chat_room').append("<p>" + data.name + " has joined the room.</p>");
// });
$(document).on('click', '.leave_room_to_user', function(){
  console.log('clicked .leave_room_to_user / user_name', user_name);
  socket.emit('client:leave_room', {name: user_name});
  window.location.href = "/users/" + user_id;
});
$(document).on('click', '.leave_room_to_posts', function(){
  console.log('clicked .leave_room_to_posts / user_name', user_name);
  socket.emit('client:leave_room', {name: user_name});
  window.location.href = "/posts"
});
$(document).on('click', '.leave_room_to_logout', function(){
  console.log('clicked .leave_room_to_logout / user_name', user_name);
  socket.emit('client:leave_room', {name: user_name});
   window.location.href = "/signout"
});

socket.on('server:client_exit', function(data){
  console.log('server:client_exit', data)
  if(data.num_users == 1){
    $('#chat_room').append("<p style='text-align: center'>" + data.name + " has left the room.</p><p style='text-align: center'>There is " + data.num_users + " user in the room.</p>");
  } else{
    $('#chat_room').append("<p style='text-align: center'>" + data.name + " has left the room.</p><p style='text-align: center'>There are " + data.num_users + " users in the room.</p>");
  }
});

$(window).load(function(){
  room_number = $('form').attr('id');
  console.log('user has refreshed paged');
  console.log('room_number', room_number);
  socket.emit('client:join_room_from_reload', {name: user_name, room: room_number}); 
});

window.onpopstate=function(){
  socket.emit('client:leave_room', {name: user_name});
}
