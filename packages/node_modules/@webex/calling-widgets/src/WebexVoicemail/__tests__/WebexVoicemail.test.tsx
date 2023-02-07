import React from 'react';
import { render } from '@testing-library/react';
import { WebexVoicemail } from '../WebexVoicemail';
import { SDKJSONAdapter } from '../../adapters/JSONAdapters';
import { AdapterProvider } from '../../contexts/AdapterContext';
import { createVoicemailItems } from '../../test-utils';

const mockedDate = new Date(Date.UTC(2017, 7, 9, 8));
Date.now = jest.fn(() => mockedDate.valueOf());

const mockAdapter = new SDKJSONAdapter({
  voicemails: createVoicemailItems({ date: mockedDate }),
});
beforeAll(() => {
  window.HTMLMediaElement.prototype.load = jest.fn();
  window.HTMLMediaElement.prototype.play = jest.fn();
  window.HTMLMediaElement.prototype.pause = jest.fn();
  window.HTMLMediaElement.prototype.addTextTrack = jest.fn();
});
describe('WebexVoicemail', () => {
  test('should render', () => {
    const { asFragment } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexVoicemail />
      </AdapterProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
