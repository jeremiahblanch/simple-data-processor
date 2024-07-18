import SimpleDataProcessor from "../src";

const myData = {'fieldName': 'value'};
const theirData = {'field_name': 'value'};

const sdp = new SimpleDataProcessor({
  mine: {
    fields: {
      fieldName: 'field_name'
    },
  },
  theirs: {
    fields: {
      field_name: 'fieldName'
    },
  }
});

test('correctly maps a trivial object from theirs to mine', () => {
  expect(sdp.convertToMine(theirData)).toStrictEqual(myData);
});

test('correctly maps a trivial object from mine to theirs', () => {
  expect(sdp.convertToTheirs(myData)).toStrictEqual(theirData);
});
