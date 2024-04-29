import SimpleDataProcessor from "../src";

const getAge = (dateOfBirth: string) => Math.floor((Number(new Date()) - Number(new Date(dateOfBirth))) / (365 * 24 * 60 * 60 * 1000));

const sdp = new SimpleDataProcessor({
  mine: {
    fields: {
      fullName: ({ firstName, lastName }: any) => [firstName, lastName].join(' '),
      age: ({dateOfBirth}: any) => getAge(dateOfBirth),
      dateOfBirth: 'dateOfBirth',
      favoriteFood: 'favorite_food',
      songs: 'songs',
    },
    postProcess: ({ songs, ...fields}: any) => {
      const loveSongs = songs.filter((s: any) => s.toLowerCase().includes('love'));
      const mindSongs = songs.filter((s: any) => s.toLowerCase().includes('mind'));

      return {
        ...fields,
        songs,
        loveSongs,
        mindSongs,
      }
    },
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
      songs: 'songs',
    }
  }
});

const myData = {
  'fullName': 'Elvis Presley',
  dateOfBirth: '1935-01-08',
  'age': getAge('1935-01-08'),
  'favoriteFood': 'Deep fried peanut butter and banana sandwiches',
  loveSongs: ['Burning Love', 'I Can\'t Help Failling In Love With You'],
  mindSongs: ['Always on My Mind', 'Suspicious Minds'],
  songs: ['Always on My Mind', 'Suspicious Minds', 'Jailhouse Rock', 'Burning Love', 'I Can\'t Help Failling In Love With You']

};
const theirData = {
  firstName: 'Elvis',
  lastName: 'Presley',
  dateOfBirth: '1935-01-08',
  favorite_food: 'Deep fried peanut butter and banana sandwiches',
  songs: ['Always on My Mind', 'Suspicious Minds', 'Jailhouse Rock', 'Burning Love', 'I Can\'t Help Failling In Love With You']
};


test('correctly maps an object with data about Elvis Presley using post processing from theirs to mine', () => {
  expect(sdp.convertToMine(theirData)).toStrictEqual(myData);
});

test('correctly maps an object with data about Elvis Presley using pre processing from mine to theirs', () => {
  expect(sdp.convertToTheirs(myData)).toStrictEqual(theirData);
});