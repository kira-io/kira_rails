var socket = io.connect("http://192.168.15.202:7777", {force_connection: true});

$(document).ready(function(){

	var room_number = null;
	var user_name = null;
	// console.log('user-name', user_name)
	
	//user clicks on room name to join a room
	$(document).on('click', '.post_title', function(){
		console.log($(this).attr('id')); //grab room id #
		
		// user_name = $('#user_name').text();
		// console.log('user_name', user_name);

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
	socket.on('get_name', function(data){
		user_name = $('#user_name').text();
		// console.log('user_name', user_name);
		socket.emit('user_name', {name: user_name})
		// console.log("data.message", data.name, data.message);
	});

	socket.on('name', function(data){
		user_name = data.name
	})
 	
 	//emit message to chatroom
	$(document).on('submit', 'form', function(){
		console.log($('#message').val().replace(/(<([^>]+)>)/ig,""));
		var message = $('#message').val().replace(/(<([^>]+)>)/ig,"");
		


		if(message.replace(/\s/g,"") == ""){
			//if string is empty or spaces do nothing
		} else{
			socket.emit('emit_message', {room: room_number, name: user_name, message: message});
		}
		$('#message').val('');
		return false;
	});

	//append incoming message
	socket.on('incoming_message', function(data){
		// console.log("INCOMING MESSAGE", data.name, data.message);
		$('#chat_room').append("<p>" + data.name + ": " + data.message + "</p>");
	});

});