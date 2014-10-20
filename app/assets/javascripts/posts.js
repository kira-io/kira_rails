var socket = io.connect("http://192.168.15.202:7777", {force_connection: true});


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
    // room_number = $(this).attr('id');

    socket.emit('client:emit_message', {room: room_number, name: user_name, message: message});

    $('#message').val('');
    return false;
});

socket.on('server:incoming_message', function(data){
    console.log("INCOMING MESSAGE", data.name, data.message);
    $('#chat_room').append("<p>" + data.name + ": " + data.message + "</p>");
});

socket.on('server: expired_room', function (data){
    $('body').css('background-color', 'silver')
})
// $(document).ready(function(){
//     var room_id = $("#room_id").attr("data-room");
//     console.log("ROOOM IIIDDDD", room_id);
    
//     var created_at = $('#created_at').attr('data-created');
//     console.log("CREATED_AT", created_at)
//     var current_time = Math.floor(((Date.parse(created_at)/3600000)));
//     var target_time = current_time + 24


//     // if new date is greater than or equal to target time, then put room in limbo
//     var limbo = setInterval(function(){
//         var d = new Date();
//         limbo_time = Date.parse(d/3600000);

//         // if(limbo_time >= target_time){
//             console.log("ROOM IN LIMBO")
//             console.log("POST ID", room_id)
//             socket.emit('client:room_expired',{post_id: room_id})
//             // clearInterval(limbo)
//         // }
//     }, 60000)

        // console.log("ROOM IN LIMBO")
        // socket.emit('client:room_expired',{post_id: room_id})

    // socket.on('server: room_expired', function(data){
    //     console.log('data', data)
    //     console.log('hello')
    // })
// })
