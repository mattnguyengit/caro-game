(() => {
  const socket = io();
  const username = document.getElementById('username').innerHTML;
  const app = angular.module('index', []);
  app.controller('IndexController', ['$http' , '$window', function($http, $window) {
  }]) 

  app.controller('ProfileController', ['$http', '$window', function($http, $window) {
  }])

  app.controller('SocialController', ['$http', '$scope', function($http, $scope) {
    this.username = username;
    this.chatMessages = [];
    
    this.sidebar = true
    this.showSideBar = function() {
      this.sidebar = true
    }
    this.hideSideBar = function() {
      this.sidebar = false
    }
   
    this.chat = function() {
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

  app.directive('messageLine', () => {
    return {
      restrict: 'E',
      templateUrl: '/directive/message-lines.html',
    }
  })

})();