'use strong';

const requireFromString = require('require-from-string');
const {rollup} = require('rollup');
const test = require('tape');

function runTest(description, isNaturalNumberString) {
  test(description, t => {
    t.strictEqual(isNaturalNumberString.name, 'isNaturalNumberString', 'should have a function name.');

    t.strictEqual(
      isNaturalNumberString('12'),
      true,
      'should return true if it takes a natural number string.'
    );

    t.strictEqual(
      isNaturalNumberString(String(Number.MAX_SAFE_INTEGER).repeat(2)),
      true,
      'should accept a string that represents a number larger than the maximum safe integer in JavaScript.'
    );

    t.strictEqual(
      isNaturalNumberString('1.5'),
      false,
      'should return false if it takes a floating point number string.'
    );

    t.strictEqual(
      isNaturalNumberString('04'),
      false,
      'should return false if the string starts with an unnecessary 0.'
    );

    t.strictEqual(
      isNaturalNumberString('3. 54 3', {}),
      false,
      'should return false if it takes a string including non-digit characters.'
    );

    t.strictEqual(
      isNaturalNumberString('0', {includeZero: false}),
      false,
      'should regard 0 as a non-natural number.'
    );

    t.strictEqual(
      isNaturalNumberString('0', {includeZero: true}),
      true,
      'should regard 0 as a natural number if `includeZero` option is enabled.'
    );

    t.strictEqual(
      isNaturalNumberString('-0', {includeZero: true}),
      true,
      'should regard -0 as a natural number if `includeZero` option is enabled.'
    );

    t.strictEqual(
      isNaturalNumberString(78),
      false,
      'should return false if it takes a non-string argument.'
    );

    t.throws(
      () => isNaturalNumberString('7', {includeZero: null}),
      /^TypeError.*null is neither true nor false\. `includeZero` option must be a Boolean value\./,
      'should throw a type error when the first argument is not an array.'
    );

    t.end();
  });
}

runTest('require(\'is-natural-number-string\')', require('.'));

global.window = {};
require('./' + require('./bower.json').main);

runTest('window.isNaturalNumberString', global.window.isNaturalNumberString);

rollup({entry: require('./package.json')['jsnext:main']}).then(bundle => {
  runTest('Module exports', requireFromString(bundle.generate({format: 'cjs'}).code));
});

