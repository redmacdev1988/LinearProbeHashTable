
/*****
LINEAR PROBING
******/
 'use strict';

// https://en.wikipedia.org/wiki/Linear_probing

class KVPair {
  constructor(key, value, hash) {
    this.key = key;
    this.value = value;
    this.hash = hash;
  }
}

var MAX = 7;
var LOAD_FACTOR = 0.5;
var GROWTH_RATE = 2;

class LinearProbe {
  constructor() {
      this.array = new Array(MAX);
      let _self = this;
      let _grow = MAX;

      function hash(key) {
        if (typeof key !== "string") {console.log(`hash - input must be string!`); return null;}
        let value = 0;
        for (let i = 0; i < key.length; i++) { value += key[i].charCodeAt(0); }
        return (value * key.length) % _grow;
      } // function

      var sa_probeAndInsert = function probeAndInsert(kvPair, startingIndex, lastIndex) {
        if (startingIndex >= lastIndex) {return -1;}
        for (let i = startingIndex; i < lastIndex; i++) {
            if (!this.array[i]) { this.array[i] = kvPair; return i; }
        }
        console.log(`probe - uh oh, cannot find location for ${kvPair}`);
        return -1;
      } // function

      function loadFactor() {
          let count = 0.00;
          for (let i = 0; i < _self.array.length; i++) {
              if (_self.array[i]) count++;
          }
          let result = count / _grow;
          return result.toFixed(2);
      }

      this.growArray = function() {
        console.log("load factor 50% reached, let's double the array! ----- √")
        let oldArray = this.array;
        _grow = _grow * GROWTH_RATE;
        this.array = new Array (_grow);
        for (let i = 0; i < oldArray.length; i++) {
          let entry = oldArray[i];
          if (entry) { this.insert(entry); }
        }
      }

      this.insert = function(kvPair) {
        if (kvPair.constructor.name === "KVPair") {
          let index = hash(kvPair.key);
          kvPair.hash = index;
          if (!this.array[index]) {this.array[index] = kvPair;}
          else {
            let indexInserted = sa_probeAndInsert.call(this, kvPair, index, this.array.length);
            if (indexInserted !== -1) console.log(`insert - collision happened at ${index}... probed and inserted (${kvPair.key}) at ${indexInserted}`);
            else {console.log(`insert - !!! can't find a valid spot for ${kvPair.key}:${kvPair.value}`);return -1;}
          }
        } // if KVPair
      }

      this.insertAndCheckLoad = function(kvPair) {
        if(this.insert(kvPair)!==-1) {
          if (loadFactor() > LOAD_FACTOR) {this.growArray();}
          else {console.log(`insertAndCheckLoad - balance load is fine`);}
        } else {console.log(`Error: ${kvPair} not inserted`);}
      }

      this.retrieveIndex = function(key) {
        let index = hash(key);
        for (let i = index; i < this.array.length; i++) {
            let item = this.array[i];
            if (!item) {console.log(`(retrieveIndex) - index ${i} is empty. ${key} not found`);return null;}
            if (item && (item.key === key)) {return i;}
        }
      }

      this.delete = function(toDeleteKey) {
        let toDeleteIndex = this.retrieveIndex(toDeleteKey);
        if (!this.array[toDeleteIndex]) {console.log(`Sorry! this element does not exist`);return false;}
        let toDeleteHash = this.array[toDeleteIndex].hash;
        if (this.array[toDeleteIndex]) {
          this.array[toDeleteIndex] = null;
          for (let i = toDeleteIndex+1; i < this.array.length; i++ ) {
            if (!this.array[i]) { console.log(`cell ${i} is empty. We're done`);return true;}
            else {
              if (this.array[i].hash <= toDeleteHash) {
                  this.array[toDeleteIndex] = this.array[i];
                  toDeleteIndex = i;
                  toDeleteHash = this.array[i].hash;
                  this.array[i] = null;
              }
            }
          } // for
          console.log(`Sorry! this element does not exist`);return false;
        }
        else {console.log(`Sorry! this element does not exist`);return false;}
      }

      this.print = function() {
        console.log(`-------- length of array: ${this.array.length} --------`);
        for (let i = 0; i < this.array.length; i++) {
          if (this.array[i] && this.array[i].key)
          console.log(`${i} - (${this.array[i].hash}) ${this.array[i].key}, ${this.array[i].value}`);
          else
          console.log(`${i}`);
        }
        console.log(`=============================================`);
      }
  } // constructor
} // LinearProbe


let l = new LinearProbe();
l.insertAndCheckLoad(new KVPair("first", "Ricky"));
l.insertAndCheckLoad(new KVPair("last", "Tee"));
l.insertAndCheckLoad(new KVPair("age", "30"));
l.insertAndCheckLoad(new KVPair("city", "Shenzhen"));
l.insertAndCheckLoad(new KVPair("birth city", "China"));
l.insertAndCheckLoad(new KVPair("employer", "Home"));
l.insertAndCheckLoad(new KVPair("job", "Software Engineer"));
l.print();

if(l.delete("city")) {
  console.log("√ deleting");
} else {
  console.log("X item not found");
}

l.print();

console.log(l.retrieveIndex("job"));      // 9
console.log(l.retrieveIndex("food"));     // null
console.log(l.retrieveIndex("age"));      // 7
console.log(l.retrieveIndex("employer")); // 3
