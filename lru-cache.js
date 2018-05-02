/**
 * Mnemonist LRUCache
 * ===================
 *
 * JavaScript implementation of the LRU Cache data structure. To save up
 * memory and allocations this implementation represents its underlying
 * doubly-linked list as static arrays and pointers. Thus, memory is allocated
 * only once at instantiation and JS objects are never created to serve as
 * pointers. This also means this implementation does not trigger too many
 * garbage collections.
 */
var Iterator = require('obliterator/iterator'),
    typed = require('./utils/typed-arrays.js');

// TODO: use singly linked list, hashmap points to precedent pointer instead

/**
 * LRUCache.
 *
 * @constructor
 * @param {number} capacity - Desired capacity.
 */
function LRUCache(capacity) {
  this.capacity = capacity;

  var PointerArray = typed.getPointerArray(capacity);

  this.forward = new PointerArray(capacity);
  this.backward = new PointerArray(capacity);
  this.keys = new Array(capacity);
  this.values = new Array(capacity);

  this.items = new Map();

  this.clear();
}

/**
 * Method used to clear the structure.
 *
 * @return {undefined}
 */
LRUCache.prototype.clear = function() {

  // Properties
  this.size = 0;
  this.head = 0;
  this.tail = 0;
  this.items.clear();
};

/**
 * Method used to splay a value on top.
 *
 * @param  {number}   pointer - Pointer of the value to splay on top.
 * @return {LRUCache}
 */
LRUCache.prototype.splayOnTop = function(pointer) {
  var oldHead = this.head;

  if (this.head === pointer)
    return this;

  if (this.tail === pointer) {
    this.tail = this.backward[pointer];
  }
  else {
    this.backward[this.forward[pointer]] = this.backward[pointer];
  }

  this.forward[this.backward[pointer]] = this.forward[pointer];

  this.backward[oldHead] = pointer;
  this.head = pointer;
  this.forward[pointer] = oldHead;

  return this;
};

/**
 * Method used to set the value for the given key in the cache.
 *
 * @param  {any} key   - Key.
 * @param  {any} value - Value.
 * @return {undefined}
 */
LRUCache.prototype.set = function(key, value) {
  var pointer,
      previousPointer;

  // The key already exists, we just need to update the value and splay on top
  var existingPointer = this.items.get(key);

  if (typeof existingPointer !== 'undefined') {
    this.splayOnTop(existingPointer);
    this.values[existingPointer] = value;

    return;
  }

  // The cache is not yet full
  if (this.size < this.capacity) {
    pointer = this.size;
    this.size++;
  }

  // Cache is full, we need to drop the last value
  else {
    pointer = this.tail;
    this.tail = this.backward[pointer];
    this.items.delete(this.keys[pointer]);
  }

  // Storing key & value
  this.items.set(key, pointer);
  this.keys[pointer] = key;
  this.values[pointer] = value;

  // Moving the item at the front of the list
  if (this.size > 1) {
    previousPointer = this.head;

    this.head = pointer;
    this.backward[previousPointer] = pointer;
    this.forward[pointer] = previousPointer;
  }
};

/**
 * Method used to check whether the key exists in the cache.
 *
 * @param  {any} key   - Key.
 * @return {boolean}
 */
LRUCache.prototype.has = function(key) {
  return this.items.has(key);
};

/**
 * Method used to get the value attached to the given key. Will move the
 * related key to the front of the underlying linked list.
 *
 * @param  {any} key   - Key.
 * @return {any}
 */
LRUCache.prototype.get = function(key) {
  var pointer = this.items.get(key);

  if (typeof pointer === 'undefined')
    return;

  this.splayOnTop(pointer);

  return this.values[pointer];
};

// TODO: #.keys, #.values

/**
 * Method used to create an iterator over the cache's entries from most
 * recently used to least recently used.
 *
 * @return {Iterator}
 */
LRUCache.prototype.entries = function() {
  var i = 0,
      l = this.size;

  var pointer = this.head,
      keys = this.keys,
      values = this.values,
      forward = this.forward;

  return new Iterator(function() {
    if (i >= l)
      return {done: true};

    var key = keys[pointer],
        value = values[pointer];

    i++;

    if (i < l)
      pointer = forward[pointer];

    return {
      done: false,
      value: [key, value]
    };
  });
};

/**
 * Convenience known methods.
 */
LRUCache.prototype.inspect = function() {
  var proxy = new Map();

  var iterator = this.entries(),
      step;

  while ((step = iterator.next(), !step.done))
    proxy.set(step.value[0], step.value[1]);

  // Trick so that node displays the name of the constructor
  Object.defineProperty(proxy, 'constructor', {
    value: LRUCache,
    enumerable: false
  });

  return proxy;
};

/**
 * Static @.from function taking an abitrary iterable & converting it into
 * a structure.
 *
 * @param  {Iterable} iterable - Target iterable.
 * @return {LRUCache}
 */
// LRUCache.from = function(iterable) {

// };

/**
 * Exporting.
 */
module.exports = LRUCache;
