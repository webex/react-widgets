import {
  DirectionTypes,
  DispositionTypes,
} from '@webex-int/adapter-interfaces';

import {
  createCallHistoryItems,
  createMSUsers,
  webexDemoSpeedDials,
} from './index';
import { SDKJSONAdapter } from '../adapters/JSONAdapters';

const mockDatasource = {
  callHistory: {
    'user1-callHistory': createCallHistoryItems({ count: 75 }),
    'user2-callHistory': [],
    item1: {
      id: 1,
      name: 'Item 1',
      phoneNumber: '+16695441558',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      direction: DirectionTypes.OUTGOING,
      disposition: DispositionTypes.CANCELLED,
    },
  },
  speedDials: {
    'user1-speedDials': webexDemoSpeedDials,
    'user1-contacts': createMSUsers(50),
  },
};
export const mockAdapter = new SDKJSONAdapter(mockDatasource);
