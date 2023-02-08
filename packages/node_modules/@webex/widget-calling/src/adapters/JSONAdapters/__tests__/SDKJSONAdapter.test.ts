import { SDKJSONAdapter } from '../SDKJSONAdapter';
import { mockDataSource } from '../../data';

describe('SDKJSONAdapter', () => {
  test('should have name defined', () => {
    expect(SDKJSONAdapter.name).toBe('SDKJSONAdapter');
  });

  test('should create instance', () => {
    const sdk = new SDKJSONAdapter(mockDataSource);

    expect(sdk).toBeDefined();
    expect(sdk.callHistoryAdapter).toBeDefined();
  });
});
