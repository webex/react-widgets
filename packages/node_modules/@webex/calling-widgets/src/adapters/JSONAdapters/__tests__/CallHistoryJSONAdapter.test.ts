import { CallHistoryJSONAdapter } from '../CallHistoryJSONAdapter';
import { mockDataSource } from '../../data';

describe('CallHistory JSON Adapter Interface', () => {
  const userID = 'user1';

  let id: string;
  let jsonAdapter: CallHistoryJSONAdapter;

  beforeEach(() => {
    id = 'item1';
    jsonAdapter = new CallHistoryJSONAdapter(mockDataSource.callHistory);
  });

  describe('getCallHistory()', () => {
    test('returns call history ids', (done) => {
      jsonAdapter.getAll(userID).subscribe((data) => {
        expect(data).toStrictEqual(['item1', 'item2', 'item3']);
        done();
      });
    });

    test('returns a data by ID', (done) => {
      jsonAdapter.getOne(id).subscribe((data) => {
        expect(data).toBeDefined();
        done();
      });
    });

    test('throws a proper error message', (done) => {
      const wrongPersonID = 'wrongID';

      jsonAdapter.getAll(wrongPersonID).subscribe(
        () => {},
        (error) => {
          expect(error.message).toBe(
            `Could not find call history for ID "${wrongPersonID}"`
          );
          done();
        }
      );
    });
  });
});
