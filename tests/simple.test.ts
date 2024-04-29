import SimpleDataProcessor from "../src";

const simpleRuleSet = {
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
};

const simpleMineData = {'fieldName': 'value'};
const simpleTheirData = {'field_name': 'value'};

const sdp = new SimpleDataProcessor(simpleRuleSet);

test('correctly maps a simple object from theirs to mine', () => {
  expect(sdp.convertToMine(simpleTheirData)).toStrictEqual(simpleMineData);
});

test('correctly maps a simple object from mine to theirs', () => {
  expect(sdp.convertToTheirs(simpleMineData)).toStrictEqual(simpleTheirData);
});
