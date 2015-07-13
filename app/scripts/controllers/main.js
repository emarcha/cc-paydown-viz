'use strict';

/**
 * @ngdoc function
 * @name ccPaydownVizApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ccPaydownVizApp
 */
angular.module('ccPaydownVizApp')
  .controller('MainCtrl', function () {

    this.options = {
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

    function calculateValues(balance, apr, payment, date) {
      var values = [[date.valueOf(), balance]];
      while (balance > payment) {
        var interest = balance * (apr/12);
        balance = balance - payment + interest;
        values.push([date.setMonth(date.getMonth() + 1), balance]);
      }
      values.push([(date.setMonth(date.getMonth() + 1)), 0]);
      return values;
    }

    this.saveNewAccount = function() {
      this.newAccount.apr = this.newAccount.apr/100;
      var interest = (this.newAccount.balance * (this.newAccount.apr/12));
      this.newAccount.payment = (this.newAccount.balance * .03) + interest;
      this.newAccount.values =
          calculateValues(this.newAccount.balance,
                          this.newAccount.apr,
                          this.newAccount.payment,
                          (new Date()));
      this.accounts.push(this.newAccount);
      this.newAccount = null;
    };

    this.removeAccount = function(account) {
      var index = this.accounts.indexOf(account);
      this.accounts.splice(index, 1);
    };

    this.accounts = [
      {
        balance: 1000,
        apr: .2999,
        key: 'Discover',
        values: [ [ 1436741982313, 1000 ],
          [ 1439333982313, 908.3333333333334 ],
          [ 1441925982313, 815.9027777777778 ],
          [ 1444517982313, 722.7019675925926 ],
          [ 1447113582313, 628.7244839891976 ],
          [ 1449705582313, 533.9638546891075 ],
          [ 1452297582313, 438.4135534781834 ],
          [ 1454889582313, 342.0669997571683 ],
          [ 1457481582313, 244.91755808847802 ],
          [ 1460069982313, 146.95853773921533 ],
          [ 1462661982313, 48.18319222037546 ],
          [ 1465253982313, 0 ] ],
        payment: 100
      }
    ];

  });
