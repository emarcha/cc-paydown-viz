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

    $scope.accounts = null;
    $scope.data = null;

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
            return d3.time.format('%b %y')(new Date(d))
          },
          showMaxMin: false
        },

        yAxis: {
          axisLabel: 'Balance',
          tickFormat: function(d) {
            return d3.format('$.5n')(d);
          }
        }
      }
    };

    this.saveNewAccount = function() {
      this.newAccount.apr = this.newAccount.apr/100;
      if (!this.newAccount.minPayment) {
        var interest = (this.newAccount.balance * (this.newAccount.apr/12));
        this.newAccount.payment = this.newAccount.minPayment = (this.newAccount.balance * .03) + interest;
      } else {
        this.newAccount.payment = this.newAccount.minPayment;
      }
      this.newAccount.values =
          calculateValues(this.newAccount.balance,
                          this.newAccount.apr,
                          this.newAccount.minPayment,
                          (new Date()));
      $scope.accounts.push(this.newAccount);
      this.newAccount = null;
    };

    this.updateAccount = function(account) {
      account.values =
        calculateValues(account.balance,
                        account.apr,
                        account.minPayment,
                        account.values[0][1]);
    };

    this.removeAccount = function(account) {
      var index = $scope.accounts.indexOf(account);
      $scope.accounts.splice(index, 1);
    };

  });
