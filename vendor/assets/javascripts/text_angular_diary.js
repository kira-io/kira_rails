var myApp = angular.module('myApp', ['textAngular', 'ngRoute', 'infinite-scroll']);
myApp.config([ "$httpProvider", function($httpProvider) {
      $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    }
]);

myApp.factory('socket', function ($rootScope) {

  return {
    on: function(eventName, callback) {
          socket.on(eventName, function() {
            var args = arguments;
            $rootScope.$apply(function() {
              if(callback) {
                callback.apply(socket, args);
              }
            });
          })
        },
  emit: function(eventName, data, callback) {
          socket.emit(eventName, data, function (){
            var args = arguments;
            $rootScope.$apply(function(){
              if(callback) {
                callback.apply(socket, args);
              }
            });
          });
        }
  };
});


myApp.factory('UsersFactory', function($http, socket){
  var entries = [];
  var posts = [];
  var factory = {};

  factory.getEntries = function(callback){
    console.log("MADE IT TO THE FACTORY.getEntries");
    $http.get('/entries').success(function(data){
      console.log('\n\n\ngetEntries() in factory = data\n\n\n: ', data);
      
      for(var i=0; i < data.entries.length; i++) {
        for(var j=0; j < data.location.length; j++) {
          if(data.entries[i].entry_location_id == data.location[j].id) {
            data.entries[i].city = data.location[j].city;
            data.entries[i].country = data.location[j].country;
          }
        }
      }       
      entries = data.entries;
      callback(entries);
    });
  }

  factory.getPosts = function(callback){
    $http.get('/get_posts').success(function(data){
      console.log('data from get posts', data)
      posts = data.post;

      for(i=0; i < posts.length; i++){
        for(j=0; j < data.joy_count.length; j++){
          if(posts[i].id == data.joy_count[j].post_id){
            posts[i].clicked = true;
          }
        }
      }

      for(var i=0; i < posts.length; i++) {
        for(var j=0; j < data.location.length; j++) {
          if(posts[i].location_id == data.location[j].id) {
            posts[i].city = data.location[j].city;
            posts[i].country = data.location[j].country;
          }
        }
      }  

      console.log('posts', posts);
      callback(posts, data.user);
    });
  }

  factory.deletePosts = function(callback){
    console.log('hello');
    var d = new Date()
    var time = Math.floor(Date.parse(d)/60000)
    for(i in posts){
      var created_at = Math.floor(Date.parse(posts[i].created_at)/60000)
      if(time - created_at >= 1440){
        var post_id = posts[i].id
        posts.splice(i,1);
        socket.emit('client:limbo_room', {room_number: post_id})
      }
    }
    callback(posts);
  }

  factory.getMessages = function(callback){
    $http.get('/get_messages').success(function(data){
      messages = data;
      callback(messages);
    });
  }
  return factory;
});

myApp.controller('UserController', function($scope, UsersFactory){
  var all_entries;

  UsersFactory.getEntries(function(data){
    console.log('getEntries data', data);
    $scope.entries = [];

    all_entries = data;  

    console.log('originial all_entries', all_entries);

    all_entries.sort(function(one,two){
      return two.id - one.id;
    });

    console.log('sorted all_entries', all_entries);

    var entry_array_create_length = 0;

    if(all_entries.length > 5){
      entry_array_create_length = 5;
    } else {
      entry_array_create_length = all_entries.length;
    }

    for(var i = 0; i < entry_array_create_length; i++){
      $scope.entries.push(all_entries[i]);
    }

    console.log("UserController $scope.entries", $scope.entries);
  });


  // for infinite scroll
  $scope.loadMore = function(){
    if($scope.entries){
      start = $scope.entries.length;
      console.log("start # of entries:", start);
      console.log("all_entries", all_entries);
      console.log("$scope.entries before:", $scope.entries);
      for(var i = start; i < start + 1; i++){
        if($scope.entries.length == all_entries.length){
          break;
        }
        if(all_entries[i] == undefined) {
          break;
        }
        $scope.entries.push(all_entries[i]);
      }
      console.log("$scope.entries after:", $scope.entries);
    }
  }


});

myApp.controller('PostsController', function($scope, UsersFactory, socket, $http){
  var all_posts;

  socket.emit('in_all_posts');

  socket.on('server:message_sent_to', function(data){
    if ($scope.user_id == data.user_id) {
      var message_icon = document.getElementById('message_icon');
      var current_user = $scope.user_id;
      message_icon.innerHTML = "<a href='/posts/" + current_user + "/messages'><span style='color:orange' class='glyphicon glyphicon-envelope'></span></a>";
    }
  });

  UsersFactory.getPosts(function(data, data2){
    console.log('getPosts data', data);
    $scope.user_id = data2;
    $scope.posts = [];
    for (var i=0; i< data.length; i++) {
      var total = Math.floor((Date.parse(new Date()) - Date.parse(data[i].created_at)) / 3600000 + data[i].joys);
      data[i].rank = total;
      data[i].time_ago = Math.floor((Date.parse(new Date()) - Date.parse(data[i].created_at))/ 3600000);
    };
    all_posts = data;  

    console.log('originial all_posts', all_posts);

    all_posts.sort(function(one,two){
      return two.rank - one.rank;
    });

    console.log('sorted all_posts', all_posts);

    var post_array_create_length = 0;

    if(all_posts.length > 5){
      post_array_create_length = 5;
    } else {
      post_array_create_length = all_posts.length;
    }

    for(var i = 0; i < post_array_create_length; i++){
      $scope.posts.push(all_posts[i]);
    }

    console.log("PostsController $scope.posts", $scope.posts);
  });
  
  setInterval(function(){
    UsersFactory.deletePosts(function(data){
      $scope.posts = data;
    });
    $scope.$apply();
  }, 10000);

  $scope.giveJoy = function(post_id) {
    // console.log('client clicked on', post_id);

    $http.post('./update_post', {post: post_id}).success(function(data){
      if(data == 'success'){
        console.log('success posting joy', data)
        for(var i=0; i < $scope.posts.length; i++) {
          if($scope.posts[i].id == post_id) {
            $scope.posts[i].joys += 1;
            $scope.posts[i].clicked = true;
          }
        }
        socket.emit('client:give_joy', { id: post_id });
        var joy_count = document.getElementById('joy_count');
        joy_count.innerHTML = parseInt(joy_count.innerHTML) - 1;
      } else{
          console.log('error posting joy', data);
          // $scope.errors = data;
      }
    });

  };

  $scope.joinRoom = function(post_id) {
    var user_name;
    $(document).ready(function(){ //
      user_name = $('#user_name').text();
      console.log('user_name', user_name);
    });
    socket.emit('client:join_room', { room: post_id, name: user_name } ); //
  }

  socket.on('server:update_joys', function(data) {
    for(var i=0; i < $scope.posts.length; i++) {
      if($scope.posts[i].id == data.post) {
        $scope.posts[i].joys += 1;
      }
    }
  });

  // for infinite scroll
  $scope.loadMore = function(){

    if($scope.posts){
      start = $scope.posts.length;
      console.log("start # of posts:", start);
      console.log("all_posts", all_posts);
      console.log("$scope.posts before:", $scope.posts);
      for(var i = start; i < start + 1; i++){
        if($scope.posts.length == all_posts.length){
          break;
        }
        if(all_posts[i] == undefined) {
          break;
        }
        $scope.posts.push(all_posts[i]);
      }
      console.log("$scope.posts after:", $scope.posts);
    }
  }

});

myApp.controller('MessagesController', function($scope, UsersFactory){
  UsersFactory.getMessages(function(data){
    $scope.messages = data;
    console.log("UserController $scope.messages", $scope.messages);
  });
});

myApp.controller('TextAngularController', function($scope, UsersFactory){
  $scope.submit_diary = function(){
    console.log("hello from diary post");
    console.log("diary_entry.post", $scope.diary_entry.post);
  }
});

myApp.config(function($provide){
  $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
    // $delegate is the taOptions we are decorating
    // register the tool with textAngular

    var tool_colors = ['colorGold', 'colorOrange', 'colorRed', 'colorFuchsia', 'colorPurple', 'colorMaroon', 'colorNavy', 'colorBlue', 'colorAqua', 'colorLime', 'colorGreen', 'colorOlive', 'colorBlack', 'colorGray', 'colorSilver'];
    var class_colors = ['gold', 'orange', 'red', 'fuchsia', 'purple', 'maroon', 'navy', 'blue', 'aqua', 'lime', 'green', 'olive', 'black', 'gray', 'silver'];
    // function to add color selectors to toolbar
    var register_tool = function(tool_name, class_name){
      icon_class = "fa fa-square " + class_name;
      taRegisterTool(tool_name, {
        iconclass: icon_class,
        action: function(){
          this.$editor().wrapSelection('forecolor', class_name)
        }
      });
    }
    // loop to add color selectors to toolbar
    for (var i = 0; i < tool_colors.length; i++){
      register_tool(tool_colors[i], class_colors[i]);
      taOptions.toolbar[1].push(tool_colors[i]);
    }

    return taOptions;
  }]);
});
