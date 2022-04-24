import express from 'express';

import userService from '../services/userService';

const router = express.Router();

router.post('/', userService.createUser);

export default {
    router: router
}
