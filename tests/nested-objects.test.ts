import SimpleDataProcessor from '../src';
import { simpleFaker } from '@faker-js/faker';

type Cut = {
  createdAt: Date;
  id: string;
  length: number;
  note?: string;
};

type Piece = {
  createdAt: Date;
  cuts: Cut[];
  id: string;
  isPiece: true;
  lengthOriginal: number;
  lengthRemain: number;
  width: number;
};

type Local = {
  code: string;
  id: string;
  location: string | null;
  piece: Piece;
  productCode: string;
  shipmentCode: string;
};

type Remote = {
  code: string;
  created_at: string;
  cuts: Cut[];
  id: string;
  length_original: number;
  length_remain: number;
  location: string | null;
  product_code: string;
  shipment_code: string | null;
  width: number;
};

const sdp = new SimpleDataProcessor<Local, Remote>({
  mine: {
    fields: {
      code: 'code',
      id: 'id',
      location: 'location',
      piece: ({
        created_at,
        cuts,
        id,
        length_original,
        length_remain,
        width,
      }) => {
        return {
          createdAt: new Date(created_at as Date),
          cuts,
          id, // sharing the id with the roll
          isPiece: true,
          lengthOriginal: length_original,
          lengthRemain: length_remain,
          width,
        } as Piece;
      },

      productCode: 'product_code',
      shipmentCode: 'shipment_code',
    },
  },
  theirs: {
    fields: {
      code: 'code',
      created_at: (record) => (record.createdAt as Date).toISOString(),
      cuts: 'cuts',
      id: 'id',
      length_original: 'lengthOriginal',
      length_remain: 'lengthRemain',
      location: 'location',
      product_code: 'productCode',
      shipment_code: 'shipmentCode',
      width: 'width',
    },
    preProcess: ({ piece, ...values }: Local) => {
      const { createdAt, cuts, lengthOriginal, lengthRemain, width } =
        (piece as Piece) || {};

      return {
        createdAt,
        cuts,
        lengthOriginal,
        lengthRemain,
        width,
        ...values,
      };
    },
  },
});

const dates = [
  simpleFaker.date.past(),
  simpleFaker.date.past(),
  simpleFaker.date.past(),
  simpleFaker.date.past(),
];

const cuts: Cut[] = [
  {
    createdAt: dates[0],
    id: 'a',
    length: 3,
    note: 'This is 3m long',
  },
  {
    createdAt: dates[1],
    id: 'b',
    length: 2.9,
    note: 'This is 2.9m long',
  },
  {
    createdAt: dates[2],
    id: 'c',
    length: 7.6,
    note: 'This is 7m long',
  },
];

const remoteRoll: Remote = {
  code: '2024_2345r17',
  created_at: dates[3].toISOString(),
  cuts,
  id: 'roll',
  length_original: 30,
  length_remain: 19,
  location: 'bay01',
  product_code: '2345',
  shipment_code: '2024_s1',
  width: 4,
};

const localRoll: Local = {
  code: '2024_2345r17',
  id: 'roll',
  location: 'bay01',
  piece: {
    createdAt: dates[3],
    cuts,
    id: 'roll',
    isPiece: true,
    lengthOriginal: 30,
    lengthRemain: 19,
    width: 4,
  },
  productCode: '2345',
  shipmentCode: '2024_s1',
};

test('correctly maps a remote roll object to a local roll object with a piece sub object', () => {
  expect(sdp.convertToMine(remoteRoll)).toStrictEqual(localRoll);
});

test('correctly maps a local roll object with a piece sub object to a remote roll object', () => {
  expect(sdp.convertToTheirs(localRoll)).toStrictEqual(remoteRoll);
});
