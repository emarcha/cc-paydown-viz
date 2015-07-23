'use strict';

/**
 * @ngdoc function
 * @name ccPaydownVizApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ccPaydownVizApp
 */
angular.module('ccPaydownVizApp')
  .controller('MainCtrl', function ($scope, accounts) {

    var vm = this;

    var testAccounts = [
      {
        name: 'Discover',
        apr: 24.5,
        currentBalance: 1000,
        dueDate: '08/02/2015',
        minPayment: 50
      },
      {
        name: 'Capital One',
        apr: 28.99,
        currentBalance: 600,
        dueDate: '08/15/2015',
        minPayment: 50
      }
    ];

    accounts.addAccount(testAccounts[0]);
    accounts.addAccount(testAccounts[1]);

    $scope.$watch(accounts.getAccounts, function() {
      vm.accounts = accounts.getAccounts();
    });

    $scope.$watch(accounts.getGraphData, function() {
      vm.data = accounts.getGraphData();
    });

    vm.options = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 78
        },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        average: function(d) { return d.mean; },

        color: d3.scale.category10().range(),
        transitionDuration: 300,
        useInteractiveGuideline: true,
        clipVoronoi: false,

        xAxis: {
          axisLabel: 'Date',
          tickFormat: function(d) {
            return d3.time.format('%b %y')(new Date(d));
          },
          showMaxMin: false
        },

        yAxis: {
          axisLabel: 'Balance',
          tickFormat: function(d) {
            return d3.format('$,.2f')(d);
          }
        }
      }
    };

    vm.saveNewAccount = function() {
      accounts.addAccount(vm.newAccount);
      vm.newAccount = null;
    };

//    $scope.updateAccount = function(account, index) {
//      accounts.updateAccount(account, index);
//    };

    vm.removeAccount = function(account) {
      accounts.removeAccount(account);
    };

  });
