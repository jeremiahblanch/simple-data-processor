import SimpleDataProcessor from '../src';

type Remote = {
  first_name: string | null;
  last_name: string | null;
};

type Local = {
  firstName: string | null;
  fullName: string;
  lastName: string | null;
};

const sdp = new SimpleDataProcessor<Local, Remote>({
  mine: {
    fields: {
      firstName: 'first_name',
      fullName: (dbUsr) => {
        const { first_name, last_name } = dbUsr as Remote;
        return `${first_name ?? ''} ${last_name ?? ''}`.trim();
      },
      lastName: 'last_name',
    },
  },
  theirs: {
    fields: {
      first_name: 'firstName',
      last_name: 'lastName',
    },
  },
});

const convertToLocal = sdp.convertToMine;
const convertToRemote = sdp.convertToTheirs;

const remoteKurt: Remote = {
  first_name: 'Kurt',
  last_name: 'Cobain',
};

const localKurt: Local = {
  firstName: 'Kurt',
  fullName: 'Kurt Cobain',
  lastName: 'Cobain',
};

test('correctly handles the right this context when mapping mine to theirs', () => {
  expect(convertToLocal(remoteKurt)).toStrictEqual(localKurt);
});

test('correctly handles the right this context when mapping theirs to mine', () => {
  expect(convertToRemote(localKurt)).toStrictEqual(remoteKurt);
});
