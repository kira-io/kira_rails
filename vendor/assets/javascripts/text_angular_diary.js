var myApp = angular.module('myApp', ['textAngular', 'ngRoute']);

myApp.factory('UsersFactory', function($http){
  var entries = [];
  var posts = [];
  var factory = {};

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

  return factory;
});

myApp.controller('UserController', function($scope, UsersFactory){
  UsersFactory.getEntries(function(data){
    $scope.entries = data;
    console.log("UserController $scope.entries", $scope.entries);
  });
});

myApp.controller('PostsController', function($scope, UsersFactory){
  UsersFactory.getPosts(function(data){
    $scope.posts = data;
    console.log("UserController $scope.posts", $scope.posts);
  });
});

myApp.controller('TextAngularController', function($scope){
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