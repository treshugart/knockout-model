define(['require', 'knockout', 'knockoutCollection'], function(require, ko) {
  var model = function(ctor) {
    var factory = function(defaults) {
      var mod = model.create(ctor);
      mod(defaults);
      return mod;
    };

    factory.collection = function(defaults) {
      var col = require('knockoutCollection')(ctor)
      col(defaults);
      return col;
    };

    return factory;
  };

  model.create = function(ctor) {
    var val = typeof ctor === 'object' ? ctor : new ctor();
    var def = model.raw(val);
    var com = ko.computed({
      read: function() {
        return val;
      },
      write: function(newval) {
        if (newval && newval.hasOwnProperty) {
          var changed = false;

          for (var a in newval) {
            if (newval.hasOwnProperty(a) && typeof val[a] === 'function' && ko.isWriteableObservable(val[a])) {
              val[a](newval[a]);
              changed = true;
            }
          }

          if (changed) {
            com.notifySubscribers();
          }
        }

        return com;
      }
    });

    com.reset = function() {
      return com(def);
    };

    com.raw = function() {
      return model.raw(val);
    };


    return com;
  };

  model.raw = function(val) {
    var obj = {};

    for (var a in val) {
      if (typeof val[a] === 'undefined') {
        continue;
      }

      if (val[a].raw) {
        obj[a] = val[a].raw();
      } else if (ko.isObservable(val[a])) {
        obj[a] = val[a]();
      } else if (val.hasOwnProperty(a)) {
        obj[a] = val[a];
      }
    }

    return obj;
  };


  return model;
});