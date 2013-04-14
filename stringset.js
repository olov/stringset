// stringset.js
// MIT licensed, see LICENSE file
// Copyright (c) 2013 Olov Lassus <olov.lassus@gmail.com>

// A stringset that handles problematic items just fine
// For now "__proto__" is the only item that is handled specially
// Other problematic items, if available in a JS VM near you (let me know),
//   can easily be moved to the aux object
var StringSet = (function() {
    "use strict";

    var token = Object.create(null);

    function stringset(optional_array) {
        if (!(this instanceof stringset)) {
            return new stringset(optional_array);
        }
        this.obj = Object.create(null);
        this.aux = Object.create(null);
        if (optional_array) {
            this.addMany(optional_array);
        }
    }
    stringset.prototype.has = function(item) {
        return (item === "__proto__" ? "proto" in this.aux : item in this.obj);
    };
    stringset.prototype.add = function(item) {
        if (item === "__proto__") {
            this.aux.proto = token;
        } else {
            this.obj[item] = token;
        }
    };
    stringset.prototype.addMany = function(items) {
        if (!Array.isArray(items)) {
            throw new Error("StringSet expected array");
        }
        for (var i = 0; i < items.length; i++) {
            this.add(items[i]);
        }
        return this;
    };
    stringset.prototype.merge = function(set) {
        this.addMany(set.items());
        return this;
    };
    stringset.prototype['delete'] = function(item) {
        var existed = this.has(item);
        if (item === "__proto__") {
            delete this.aux.proto;
        } else {
            delete this.obj[item];
        }
        return existed;
    };
    stringset.prototype.items = function() {
        var items = Object.keys(this.obj);
        if (this.aux.proto) {
            items.push("__proto__");
        }
        return items;
    };
    stringset.prototype.clone = function() {
        var other = stringset();
        return other.merge(this);
    };
    stringset.prototype.isEmpty = function() {
        for (var item in this.obj) {
            return false;
        }
        return !("proto" in this.aux);
    };
    stringset.prototype.size = function() {
        var len = 0;
        for (var item in this.obj) {
            ++len;
        }
        return ("proto" in this.aux ? len + 1 : len);
    };
    stringset.prototype.toString = function() {
        return "{" + this.items().map(JSON.stringify).join(",") + "}";
    }
    return stringset;

})();

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = StringSet;
}
