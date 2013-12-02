define(['require', 'knockout', 'knockoutModel'], function(require, ko) {
  return function(ctor) {
    var koModel = require('knockoutModel');
    var val = [];
    var com = ko.computed({
      read: function() {
        return val;
      },
      write: function(newval) {
        val.splice(0);

        if (newval) {
          for (var a = 0; a < newval.length; a++) {
            val.push(ensure(newval[a]));
          }
        }

        return notify();
      }
    });

    com.reset = function() {
      com([]);
      return notify();
    };

    com.raw = function() {
      var arr = [];

      for (var a = 0; a < val.length; a++) {
        arr[a] = koModel.raw(val[a]);
      }

      return arr;
    };

    com.insert = function(at, data) {
      val.splice(at, 0, ensure(data));
      return notify();
    };

    com.prepend = function(data) {
      return com.insert(0, data);
    };

    com.append = function(data) {
      return com.insert(val.length, data);
    };

    com.at = function(index) {
      return index < 0 || typeof val[index] === 'undefined' ?
        false :
        val[index];
    };

    com.first = function() {
      return com.at(0);
    };

    com.last = function() {
      return com.at(val.length - 1);
    };

    com.remove = function(index) {
      if (typeof index === 'object') {
        index = com.find(index);
      }

      if (typeof index === 'number' && typeof val[index] !== 'undefined') {
        val.splice(index, 1);
      }

      return notify();
    };

    com.unshift = function() {
      var data = val.unshift();
      notify();
      return data;
    };

    com.pop = function() {
      var data = val.pop();
      notify();
      return data;
    };

    com.find = function(data) {
      return val.indexOf(data);
    };


    return com;


    function ensure(data) {
      var mod = koModel.create(ctor);
      mod(data);
      return mod();
    };

    function notify() {
      com.notifySubscribers();
      return com;
    }
  };
});