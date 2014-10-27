var myApp = angular.module('myApp', ['textAngular', 'ngRoute', 'infinite-scroll']);

// Add authentication token so angular can make calls to rails
myApp.config([ "$httpProvider", function($httpProvider) {
      $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    }
]);

//  Writing AngularJS App with Socket.IO
//  http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
myApp.factory('socket', ['$rootScope', function ($rootScope) {
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
}]);


myApp.factory('UsersFactory', ['$http', 'socket', function($http, socket){
  var entries = [];
  var posts = [];
  var factory = {};

  factory.getEntries = function(callback){
    // Get entries and location JSON
    $http.get('/entries').success(function(data){
      for(var i=0; i < data.entries.length; i++) {
        for(var j=0; j < data.location.length; j++) {
          // Combine into one object to display together in ng-repeat
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
    // Get posts, joycounts, users, and location JSON
    $http.get('/get_posts').success(function(data){
      console.log('data from get posts', data)
      posts = data.post;
      // Combine joycounts and location to one post object for ng-repeat
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
      // Send over user to set current user on client side
      callback(posts, data.user);
    });
  }

  // Check current time - post.created_at to see if it is greater than 24 hours
  factory.deletePosts = function(callback){
    var d = new Date()
    // Turns current time into minutes since January 1st 1970
    var time = Math.floor(Date.parse(d)/60000)
    for(i in posts){
      // Turns created_at into minutes since January 1st 1970
      var created_at = Math.floor(Date.parse(posts[i].created_at)/60000)
      // 1440 minutes in a day
      if(time - created_at >= 1440){
        var post_id = posts[i].id
        // If older than 24 hours, delete from posts and send room into limbo
        posts.splice(i,1);
        socket.emit('client:limbo_room', {room_number: post_id})
      }
    }
    callback(posts);
  }

  // Get current users's messages in JSON
  factory.getMessages = function(callback){
    $http.get('/get_messages').success(function(data){
      messages = data;
      callback(messages);
    });
  }
  return factory;
}]);

myApp.controller('UserController', ['$scope', 'UsersFactory', function($scope, UsersFactory){
  var all_entries;

  UsersFactory.getEntries(function(data){
    $scope.entries = [];
    all_entries = data;

    // Sorting entries to put most recent on top
    all_entries.sort(function(one,two){
      return one.id - two.id;
    });

    console.log('sorted all_entries', all_entries);

    // Set length, default to 0
    var entry_array_create_length = 0;

    // If less than 5 we push that many in, more than 5 than push 5 for initial load
    if(all_entries.length > 5){
      entry_array_create_length = 5;
    } else {
      entry_array_create_length = all_entries.length;
    }
    for(var i = 0; i < entry_array_create_length; i++){
      $scope.entries.push(all_entries[i]);
    }
  });

  // for infinite scroll
  $scope.loadMore = function(){
    if($scope.entries){
      var start = $scope.entries.length;
      // start + 1 to display last entry
      for(var i = start; i < start + 1; i++){
        // Break loop at correct length to get last entry
        if($scope.entries.length == all_entries.length){
          break;
        }
        // Don't display black dot undefined posts
        if(all_entries[i] == undefined) {
          break;
        }
        $scope.entries.push(all_entries[i]);
      }
    }
  }
}]);

myApp.controller('PostsController', ['$scope', 'UsersFactory', 'socket' ,'$http', function($scope, UsersFactory, socket, $http){
  var all_posts;

  // initial connection when posts/index.html.erb is rendered
  socket.emit('in_all_posts');

  // change icon displayed when a new message is sent to user
  socket.on('server:message_sent_to', function(data){
    if ($scope.user_id == data.user_id) {
      var message_icon = document.getElementById('message_icon');
      var current_user = $scope.user_id;
      message_icon.innerHTML = "<a href='/posts/" + current_user + "/messages'><span style='color:orange' class='glyphicon glyphicon-envelope'></span></a>";
    }
  });

  // data is posts & data2 is user id
  UsersFactory.getPosts(function(data, data2){
    console.log('getPosts data', data);
    $scope.user_id = data2;
    $scope.posts = [];
    // ranking of posts for display order
    for (var i=0; i< data.length; i++) {
      var total = Math.floor((Date.parse(new Date()) - Date.parse(data[i].created_at)) / 3600000 + data[i].joys);
      data[i].rank = total;
      data[i].time_ago = Math.floor((Date.parse(new Date()) - Date.parse(data[i].created_at))/ 3600000);
    };
    all_posts = data;

    // sort by rank for infinite scroll display
    all_posts.sort(function(one,two){
      return two.rank - one.rank;
    });

    // set length, default to 0
    var post_array_create_length = 0;

    if(all_posts.length > 5){
      post_array_create_length = 5;
    } else {
      post_array_create_length = all_posts.length;
    }
    for(var i = 0; i < post_array_create_length; i++){
      $scope.posts.push(all_posts[i]);
    }
  });

  // call deletePosts every minute
  setInterval(function(){
    UsersFactory.deletePosts(function(data){
      // callback function to update $scope.posts with current data
      $scope.posts = data;
    });
    // notify angular that $scope has changed with $apply()
    $scope.$apply();
  }, 10000);

  $scope.giveJoy = function(post_id) {
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

}]);

myApp.controller('MessagesController', ['$scope', 'UsersFactory', function($scope, UsersFactory){
  UsersFactory.getMessages(function(data){
    $scope.messages = data;
    console.log("UserController $scope.messages", $scope.messages);
  });
}]);

myApp.controller('TextAngularController', ['$scope', 'UsersFactory', function($scope, UsersFactory){
  $scope.submit_diary = function(){
    console.log("hello from diary post");
    console.log("diary_entry.post", $scope.diary_entry.post);
  }
}]);

myApp.config(['$provide', function($provide){
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
}]);
