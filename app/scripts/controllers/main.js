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

    accounts.createGraphData();

    $scope.$watch(accounts.getAccounts, function() {
      $scope.accounts = accounts.getAccounts();
    });

    $scope.$watch(accounts.getGraphData, function() {
      $scope.data = accounts.getGraphData();
    });

    $scope.options = {
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

    $scope.saveNewAccount = function() {
      accounts.addAccount($scope.newAccount);
      $scope.newAccount = null;
    };

    $scope.removeAccount = function(account) {
      accounts.removeAccount(account);
    };

  });
