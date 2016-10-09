(function() {

  var extend = fabric.util.object.extend,
      originalSet = 'originalState';

  /*
    Depends on `stateProperties`
  */
  function saveProps(origin, destination, props) {
    var tmpObj = { }, deep = true;
    props.forEach(function(prop) {
      tmpObj[prop] = origin[prop];
    });
    extend(origin[destination], tmpObj, deep);
  }

  function _isEqual(origValue, currentValue) {
    if (origValue instanceof Array) {
      if (origValue.length !== currentValue.length) {
        return false
      }
      var _currentValue = currentValue.concat().sort(),
          _origValue = origValue.concat().sort();
      return !_origValue.some(function(v, i) {
        return !_isEqual(_currentValue[i], v);
      });
    }
    else if (origValue instanceof Object) {
      for (var key in origValue) {
        if (!_isEqual(origValue[key], currentValue[key])) {
          return false;
        }
      }
      return true;
    }
    else {
      return origValue === currentValue;
    }
  }


  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

    /**
     * Returns true if object state (one of its state properties) was changed
     * @param {String} [propertySet] optional name for the set of property we want to save
     * @return {Boolean} true if instance' state has changed since `{@link fabric.Object#saveState}` was called
     */
    hasStateChanged: function(propertySet) {
      propertySet = propertySet || originalSet;
      return !_isEqual(this[propertySet], this);
    },

    /**
     * Saves state of an object
     * @param {Object} [options] Object with additional `stateProperties` array to include when saving state
     * @return {fabric.Object} thisArg
     */
    saveState: function(options) {
      var propertySet = options.propertySet || originalSet;
      saveProps(this, propertySet, this.stateProperties);
      if (options && options.stateProperties) {
        saveProps(this, propertySet, options.stateProperties);
      }
      return this;
    },

    /**
     * Setups state of an object
     * @param {Object} [options] Object with additional `stateProperties` array to include when saving state
     * @return {fabric.Object} thisArg
     */
    setupState: function(options) {
      options.propertySet = options.propertySet || originalSet;
      this.originalState = { };
      this.saveState(options);
      return this;
    }
  });
})();
