(() => {
  const socket = io();
  const games = io('/games');
  let user = {};
  const app = angular.module('index', []);
  app.controller('IndexController', ['$http', '$scope', function($http, $scope) {
    $http.get('/users')
      .then((res) => {
        $scope.user = res.data;
        user = $scope.user
        games.emit('connectUser', user._id)
      }, (res) => {
        console.log(res.data);
      });
  }]) 

  app.controller('ProfileController', ['$http', '$window', function($http, $window) {
    
  }])

  app.controller('SocialController', ['$scope', function($scope) {
    this.chatMessages = [];
    
    this.sidebar = true
    this.showSideBar = function() {
      this.sidebar = true
    }
    this.hideSideBar = function() {
      this.sidebar = false
    }

    this.chat = function() {
      this.username = user.username;
      const data = {
        username: this.username,
        message: this.message
      }
      socket.emit('chat message', data)
      this.message = '';
      return false;
    }

    socket.on('chat message', (dataChat) => {
      this.chatMessages.push(dataChat)
      $scope.$apply()
    })
  }])

  app.controller('GameController', ['$http', '$scope', function($http, $scope) {
    this.isDisplayHostBtn = true;
    this.isDisplayHost = false;
    this.isDisplayJoinZone = true;
    this.caroRooms = [];

    
    this.host = () => {
      games.emit('hostRoom', user._id)
    }
    games.on('hostRoom', () => {
      this.isDisplayHost = true;
      this.isDisplayHostBtn = false;
      this.isDisplayJoinZone = false;
      $scope.$apply();
    })
    this.leave = () => {
      games.emit('leaveRoom', user._id)
    }
    games.on('leaveRoom', () => {
      this.isDisplayHostBtn = true;
      this.isDisplayHost = false;
      this.isDisplayJoinZone = true;
      $scope.$apply();
    })

    games.on('newRoom', (caroRooms) => {
      const rooms = []
      for (let id of caroRooms) {
        $http.get(`/users/${id}`)
          .then((res) => {
            rooms.push(res.data)
          })
      }
      this.caroRooms.length = 0;
      this.caroRooms = rooms
      $scope.$apply(); 
    })
  }])

  app.directive('messageLine', () => {
    return {
      restrict: 'E',
      templateUrl: '/directive/message-lines.html',
    }
  })

  app.directive('hostZone', () => {
    return {
      restrict: 'E',
      templateUrl: '/directive/host-zone.html'
    }
  })
  app.directive('roomList', () => {
    return {
      restrict: 'E',
      templateUrl: '/directive/room-lists.html'
    }
  })

})();