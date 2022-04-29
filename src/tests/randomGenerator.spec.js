/* eslint-disable no-undef */
import 'regenerator-runtime';
import config from 'config';

import loginRoutes from '../routes/loginRoutes';

jest.mock('config');
beforeAll(() => {
  config.get.mockReturnValue();
});
test('Check if method generates string', async () => {
  expect(typeof (loginRoutes.generateRandomString(4))).toBe('string');
});
