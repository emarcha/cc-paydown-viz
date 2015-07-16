'use strict';

/**
 * @ngdoc service
 * @name ccPaydownVizApp.accounts
 * @description
 * # accounts
 * Service in the ccPaydownVizApp.
 */
angular.module('ccPaydownVizApp')
  .service('accounts', function () {

    var graphData;

    var accounts = [
      {
        balance: 1000,
        apr: .2999,
        name: 'Discover',
        minPayment: 100,
        payment: 100
      }
    ];

    function calculateValues(balance, apr, payment, date) {
      var values = [[date.valueOf(), balance]];
      date = new Date(date);
      while (balance > payment) {
        var interest = balance * (apr/12);
        balance = balance - payment + interest;
        values.push([date.setMonth(date.getMonth() + 1), balance]);
      }
      values.push([(date.setMonth(date.getMonth() + 1)), 0]);
      return values;
    }

    this.createGraphData = function createGraphData() {
      graphData = [
        {
          key: accounts[0].name,
          values: calculateValues(accounts[0].balance,
                                  accounts[0].apr,
                                  accounts[0].payment,
                                  (new Date()))
        }
      ]
    };

    this.getGraphData = function getGraphData() {
      return graphData;
    };

    this.getAccounts = function getAccounts() {
      return accounts;
    }

  });
