---
layout: page
title: Bloom Filter
---

A `BloomFilter` is very space-efficient probabilistic set based on hash functions.

This means that, like with a classic `Set`, you can add items to it and ask whether the item exists in it. The twist is that if the filter answers no, you can be sure about it, but if the filter answers yes, it might be wrong.

Basically, a `BloomFilter` cannot answer with false negatives but can answer with false positives.

Moreover, because it stores information on byte arrays, a `BloomFilter` cannot have a dynamic size and one cannot iterate over its items since it does only store "traces" about inserted items.

For more information about the Heap, you can head [here](https://en.wikipedia.org/wiki/Bloom_filter).

```js
var BloomFilter = require('mnemonist/bloom-filter');
```

Note that by default, this implementation uses `murmurhash3` and is designed to store strings only.

## Constructor

The `BloomFilter` takes a single argument being its desired capacity.

Alternatively, you can provide a configuration object if you also need to tweaks some things such as its error rate etc.

```js
// Creating a bloom filter that can hold 50 items
var filter = new BloomFilter(50);

// Passing custom options
var filter = new BloomFilter({
  capacity: 2500,
  errorRate: .05
});
```

### Static #.from

Alternatively, one can build a `BloomFilter` from an arbitrary JavaScript iterable likewise:

```js
var filter = BloomFilter.from([1, 2, 3], options);
```

## Members

* [#.capacity](#capacity)
* [#.size](#size)

## Methods

*Mutation*

* [#.add](#add)

*Read*

* [#.test](#test)

### #.capacity

Total number of items the filter is able to store.

```js
var filter = new BloomFilter(5);

filter.capacity
>>> 5
```

### #.size

Number of items currently stored by the filter.

```js
var filter = new BloomFilter(5);
filter.add('hello');

filter.size
>>> 1
```

### #.add

Add the given item to the filter.

Will throw if the capacity of the filter is exceeded.

```js
var filter = new BloomFilter(5);
filter.add('hello');
```

### #.test

Will return `false` if the item is not present in the filter and `true` if the item may or may not be in the filter.

```js
var filter = new BloomFilter(5);
filter.add('hello');

filter.test('world');
>>> false

filter.test('hello');
>>> true
```