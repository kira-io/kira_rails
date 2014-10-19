var socket = io.connect("http://192.168.15.127:7777", {force_connection: true});


var room_number =0;
var user_name = 'kira';

$(document).on('click', '.post_title', function(){
    console.log($(this).attr('id')); //grab room id #

    user_name = $('#user_name').text();
    if(room_number == 0){
        room_number = $(this).attr('id');
        console.log('I WANT TO JOIN THIS ROOM', room_number);
        socket.emit('client:join_room', {room: room_number});
    } else {
        old_room = room_number;
        room_number = $(this).attr('id');
        socket.emit('client:change_room', {prev_room: old_room, new_room: room_number});
    }
});



$(document).on('submit', 'form', function(){
    console.log($('#message').val().replace(/(<([^>]+)>)/ig,""));
    var message = $('#message').val().replace(/(<([^>]+)>)/ig,"");
    room_number = $(this).attr('id');

    socket.emit('client:emit_message', {room: room_number, name: user_name, message: message});

    $('#message').val('');
    return false;
});

socket.on('server:incoming_message', function(data){
    console.log("INCOMING MESSAGE", data.name, data.message);
    $('#chat_room').append("<p>" + data.name + ": " + data.message + "</p>");
});
