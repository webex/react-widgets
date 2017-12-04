import dotenv from 'dotenv';
import MockDate from 'mockdate';

dotenv.config();

// Set up fake localstorage for tests
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Reflect.defineProperty(window, 'localStorage', {value: localStorageMock});
Reflect.defineProperty(window, 'performance', {
  value: {
    now: jest.fn().mockReturnValue(10)
  }
});

// Date will always be the same for all tests
MockDate.set(new Date('2017'));

window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

jest.mock('uuid', () => (
  {
    v4: jest.fn(() => 'f187283e-73db-4d0f-ab27-6e804eb7eb50')
  }
));
