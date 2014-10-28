var socket = io.connect("https://kiramean.herokuapp.com:7777/socket.io/socket.io.js", {force_connection: true});

var room_number = 0;
var user_name = 'kira';
var user_id;
var socket_id;
$(document).ready(function(){
  user_name = $('#user_name').text();
  user_id = $('.leave_room_to_user').attr('data-user-id');
  room_number = $('.chat_form').attr('id');
  socket.emit('client:send_user_name', {name: user_name, id: user_id})

  socket.on('server:user_name', function(data){
    console.log('SERVER:USER NAME', data)
    user_name = data.name;
    user_id = data.id;
    socket_id = data.socket_id;
  }); 
  socket.emit('room_count', {room: room_number})
});

socket.on('room_count1', function(data){
  console.log("ROOMCOUNT DATA", data) 
  var num_users = data.num_users;
  num += 1000;
  if(num_users == 0){
    num_users++;
  }
  if(num_users == 1){
    $('#chat_room').append("<p style='text-align: center;'>There is " + num_users +" user in the room.</p>").scrollTop(num)
  }else{
    $('#chat_room').append("<p style='text-align: center;'>There are " + num_users +" users in the room.</p>").scrollTop(num)
  }
});

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
    console.log("DATA--",data);
    $('#errors').html('');
    if(data.user) {
      $('#errors').append("<p>" + data.success + ".</p>");
    } else {
      for(i in data){
        $('#errors').append("<p>" + data[i] + ".</p>");
      }
    }
    $('#message_box').hide();
    console.log('The user I sent the message to', data);
    socket.emit('client:message_sent_to', {user_id: data.user.id});
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
});

var num = 1000;
socket.on('server:incoming_message', function(data){
  num += 1000;
  console.log('num', num)
  console.log("INCOMING MESSAGE", data.name, data.message);
  $('#chat_room').append("<p><strong>" + data.name + ":</strong> " + data.message + "</p>").scrollTop(num);
});

socket.on('server:new_user', function(data){
  num += 1000;
  if(data.num_users == 1){
    $('#chat_room').append("<p style='text-align: center;'>" + data.name + " has joined the room.</p><p style='text-align: center'>There is " + data.num_users + " user in the room.</p>").scrollTop(num);
  } else{
    $('#chat_room').append("<p style='text-align: center'>" + data.name + " has joined the room.</p><p style='text-align: center'>There are " + data.num_users + " users in the room.</p>").scrollTop(num);
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
  num += 1000;
  console.log('server:client_exit', data)
  if(data.num_users == 1){
    $('#chat_room').append("<p style='text-align: center'>" + data.name + " has left the room.</p><p style='text-align: center'>There is " + data.num_users + " user in the room.</p>").scrollTop(num);
  } else{
    $('#chat_room').append("<p style='text-align: center'>" + data.name + " has left the room.</p><p style='text-align: center'>There are " + data.num_users + " users in the room.</p>").scrollTop(num);
  }
});

$(window).load(function(){
  room_number = $('.chat_form').attr('id');
  console.log('user has refreshed paged');
  console.log('room_number', room_number);
  socket.emit('client:join_room_from_reload', {name: user_name, room: room_number}); 
});

window.onpopstate=function(){
  socket.emit('client:leave_room', {name: user_name});
}
