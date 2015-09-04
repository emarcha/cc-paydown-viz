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
        name: 'Discover',
        balance: 1000,
        apr: 0.2450,
        minPayment: 50,
        payment: 100
      },
      {
        name: 'Capital One',
        balance: 600,
        apr: 0.2899,
        minPayment: 30,
        payment: 75
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
      graphData = [];
      angular.forEach(accounts, function(account) {
        graphData.push({
          key: account.name,
          values: calculateValues(account.balance,
                                  account.apr,
                                  account.payment,
                                  (new Date()))
        });
      });
    };

    this.getGraphData = function getGraphData() {
      return graphData;
    };

    this.addAccount = function addAccount(newAccount) {
      newAccount.apr = newAccount.apr/100;
      if (!newAccount.minPayment) {
        var interest = (newAccount.balance * (newAccount.apr/12));
        newAccount.payment = newAccount.minPayment = (newAccount.balance * 0.03) + interest;
      } else {
        newAccount.payment = newAccount.minPayment;
      }
      accounts.push(newAccount);
      this.createGraphData();
    };

    this.updateAccount = function updateAccount(account, index) {
      accounts[index] = account;
      this.createGraphData();
    };

    this.removeAccount = function removeAccount(account) {
      accounts.splice(accounts.indexOf(account), 1);
      graphData = graphData.filter(function(e) {
        return e.key !== account.name;
      })
    };

    this.getAccounts = function getAccounts() {
      return accounts;
    };

  });
