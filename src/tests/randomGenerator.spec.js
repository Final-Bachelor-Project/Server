/* eslint-disable no-undef */
import 'regenerator-runtime';
import config from 'config';

import authRoutes from '../routes/authRoutes';

jest.mock('config');
beforeAll(() => {
  config.get.mockReturnValue();
});
test('Check if method generates string', async () => {
  expect(typeof (authRoutes.generateRandomString(4))).toBe('string');
});
