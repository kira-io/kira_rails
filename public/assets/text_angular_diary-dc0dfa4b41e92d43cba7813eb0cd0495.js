var myApp = angular.module('myApp', ['textAngular', 'ngRoute']);
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


  factory.delete_post = function(index){
    console.log(index)
    posts.splice(index,1)
  }

  factory.getEntries = function(callback){
    console.log("MADE IT TO THE FACTORY.getEntries");
    $http.get('/entries').success(function(data){
      console.log('\n\n\ngetEntries() in factory = data\n\n\n: ', data);
      entries = data;
      callback(entries);
    });
  }

  factory.getPosts = function(callback){
    $http.get('/get_posts').success(function(data){
      posts = data;
      callback(posts);
    });
  }

  factory.deletePosts = function(){
    var d = new Date()
    var time = Math.floor(Date.parse(d)/60000)
    for(i in posts){
      var created_at = Math.floor(Date.parse(posts[i].created_at)/60000)
      if(time - created_at >= 400){
        var post_id = posts[i].id
        posts.splice(i,1);
        socket.emit('client:limbo_room', {room_number: post_id})
      }
    }
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
  UsersFactory.getEntries(function(data){
    $scope.entries = data;
    console.log("UserController $scope.entries", $scope.entries);
  });

});

myApp.controller('PostsController', function($scope, UsersFactory, socket, $http){

  socket.emit('in_all_posts');

  UsersFactory.getPosts(function(data){
    for (var i=0; i< data.length; i++) {
      var total = Math.floor((Date.parse(new Date()) - Date.parse(data[i].created_at)) / 3600000 + data[i].joys);
      data[i].rank = total;
      data[i].time_ago = Math.floor((Date.parse(new Date()) - Date.parse(data[i].created_at))/ 3600000);
    };
    $scope.posts = data
    console.log("UserController $scope.posts", $scope.posts);
  });

  setInterval(function(){
    UsersFactory.deletePosts();

    $scope.$apply();

  }, 5000);

  $scope.giveJoy = function(post_id) {
    console.log('client clicked on', post_id);

    for(var i=0; i < $scope.posts.length; i++) {
      if($scope.posts[i].id == post_id) {
        $scope.posts[i].joys += 1;
      }
    }

    $http.post('./update_post', {post: post_id});
    socket.emit('client:give_joy', { id: post_id });
  };

  $scope.joinRoom = function(post_id) {
    socket.emit('client:join_room', { room: post_id } )
  }

  socket.on('server:update_joys', function(data) {
    for(var i=0; i < $scope.posts.length; i++) {
      if($scope.posts[i].id == data.post) {
        $scope.posts[i].joys += 1;
      }
    }
  });

  // for infinite scroll
  

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

myApp.factory('socket', function ($rootScope){
  // var socket = io.connect("http://192.168.15.202:7777", {force_connection: true});
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args)
          }
        });
      })
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function (){
        var args = arguments;
        $rootScope.$apply(function (){
          if(callback) {
            callaback.apply(socket, args);
          }
        });
      })
    }
  };
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
