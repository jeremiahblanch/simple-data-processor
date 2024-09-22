import SimpleDataProcessor from '../src';

const myData = {
  f1: 'dog',
  f2: 'cat',
  f3: 17,
};
const theirData = {
  fOne: 'dog',
  fTwo: 'cat',
  fThree: 17,
};

const sdp = new SimpleDataProcessor({
  mine: {
    fields: {
      f1: 'fOne',
      f2: 'fTwo',
      f3: 'fThree',
    },
  },
  theirs: {
    fields: {
      fOne: 'f1',
      fTwo: 'f2',
      fThree: 'f3',
    },
  },
});

test('correctly maps an object with multiple fields from theirs to mine', () => {
  expect(sdp.convertToMine(theirData)).toStrictEqual(myData);
});

test('correctly maps an object with multiple fields from mine to theirs', () => {
  expect(sdp.convertToTheirs(myData)).toStrictEqual(theirData);
});
