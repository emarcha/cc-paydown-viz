'use strict';

/**
 * @ngdoc service
 * @name ccPaydownVizApp.accounts
 * @description
 * # accounts
 * Service in the ccPaydownVizApp.
 */
angular.module('ccPaydownVizApp')
  .service('AccountSrv', function () {

    this.graphData = [];
    this.accounts = [];

    function findValues(account) {
      var values = [];
      angular.forEach(account.months, function(month) {
        values.push(
          [month.date, month.balance]
        )
      });
      return values;
    }

    function generateMonths(account) {
      var months = [];
      var balance = account.currentBalance;
      var dueDate = new Date(account.dueDate);
      var payment = account.minPayment;
      var interest = balance * (account.apr/12);

      months.push(
        {
          date: (new Date(dueDate)),
          balance: balance,
          interest: interest,
          payment: payment
        }
      );

      while (balance > payment) {
        interest = balance * (account.apr/12);
        balance = balance - payment + interest;
        months.push(
          {
            date: dueDate.setMonth(dueDate.getMonth() + 1),
            balance: balance,
            interest: interest,
            payment: payment
          }
        );
      }

      months.push(
        {
          date: dueDate.setMonth(dueDate.getMonth() + 1),
          balance: 0,
          interest: 0,
          payment: 0
        }
      );

      return months;
    }

    function createGraphData(accounts) {
      var data = [];
      angular.forEach(accounts, function(account) {
        data.push({
          key: account.name,
          values: findValues(account)
        });
      });
      return data;
    }

    this.addAccount = function addAccount(newAccount) {
      // Change the APR to decimal form
      newAccount.apr = newAccount.apr/100;

      // Calculate the minimum payment if not there
      if (!newAccount.minPayment) {
        var interest = (newAccount.balance * (newAccount.apr/12));
        newAccount.minPayment = (newAccount.balance * 0.03) + interest;
      }

      // Create each month of payment
      newAccount.months = generateMonths(newAccount);

      // Add to accounts
      this.accounts.push(newAccount);

      // Update graph data
      this.graphData = createGraphData(this.accounts);
    };

    this.updateAccount = function updateAccount(account, index) {
      accounts[index] = account;
      this.createGraphData();
    };

    this.removeAccount = function removeAccount(account) {
      this.accounts.splice(this.accounts.indexOf(account), 1);
      this.graphData = this.graphData.filter(function(e) {
        return e.key !== account.name;
      })
    };

  });
