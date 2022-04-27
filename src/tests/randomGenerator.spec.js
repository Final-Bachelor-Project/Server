/* eslint-disable no-undef */
import 'regenerator-runtime';

import loginRoutes from '../routes/loginRoutes';

test('Check if method generates string', async () => {
  expect(typeof (loginRoutes.generateRandomString(4))).toBe('string');
});
