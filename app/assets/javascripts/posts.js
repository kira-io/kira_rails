var socket = io.connect("http://192.168.15.202:7777", {force_connection: true});

$(document).ready(function(){

	var room_number = null

	//user clicks on room name to join a room
	$(document).on('click', '.post_title', function(){
		console.log($(this).attr('id')); //grab room id #
		if(room_number == null){
			room_number = $(this).attr('id');
			socket.emit('join_room', {room: room_number})
		} else if(room_number != null){
			old_room = room_number
			room_number = $(this).attr('id');
			socket.emit('change_room', {prev_room: old_room, new_room: room_number})
		}
	});
	
	//listening for broadcast to room - test broadcast
	socket.on('message', function(data){
		console.log("data.message", data.name, data.message);
	});
 	
 	//emit message to chatroom
	$(document).on('submit', 'form', function(){
		console.log($('#message').val());
		var message = $('#message').val();

		if(message.replace(/\s/g,"") == ""){
			//if string is empty or spaces do nothing
		} else{
			socket.emit('emit_message', {room: room_number, name: 'andrew', message: message});
		}
		$('#message').val('');
		return false;
	});

	//append incoming message
	socket.on('incoming_message', function(data){
		console.log("INCOMING MESSAGE", data.name, data.message);
		$('#chat_room').append("<p>" + data.name + ": " + data.message + "</p>");
	});

});