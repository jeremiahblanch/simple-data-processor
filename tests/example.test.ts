import SimpleDataProcessor from "../src";

const getAge = (dateOfBirth: string) => Math.floor((Number(new Date()) - Number(new Date(dateOfBirth))) / (365 * 24 * 60 * 60 * 1000));

const sdp = new SimpleDataProcessor({
  mine: {
    fields: {
      fullName: ({ firstName, lastName }: any) => [firstName, lastName].join(' '),
      age: ({dateOfBirth}: any) => getAge(dateOfBirth),
      dateOfBirth: 'dateOfBirth',
      favoriteFood: 'favorite_food'
    }
  },
  theirs: {
    preProcess: (({ fullName, ...fields }: any) => {
      const [firstName, lastName] = fullName.split(' ');

      return {
        firstName,
        lastName,
        ...fields
      }
    }),
    fields: {
      firstName: 'firstName',
      lastName: 'lastName',
      dateOfBirth: 'dateOfBirth',
      favorite_food: 'favoriteFood',
    }
  }
});


const myData = {
  'fullName': 'Elvis Presley',
  dateOfBirth: '1935-01-08',
  'age': getAge('1935-01-08'),
  'favoriteFood': 'Deep fried peanut butter and banana sandwiches',
};
const theirData = {
  firstName: 'Elvis',
  lastName: 'Presley',
  dateOfBirth: '1935-01-08',
  favorite_food: 'Deep fried peanut butter and banana sandwiches',
};


test('correctly maps an object with data about Elvis Presley from theirs to mine', () => {
  expect(sdp.convertToMine(theirData)).toStrictEqual(myData);
});

test('correctly maps an object with data about Elvis Presley from mine to theirs', () => {
  expect(sdp.convertToTheirs(myData)).toStrictEqual(theirData);
});