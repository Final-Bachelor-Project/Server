import express from 'express';

import userService from '../services/userService';
import serverErrorSafe from '../utils/serverErrorSafe';

const router = express.Router();

router.post('/', async (req, res) => {
    const user = await userService.createUser();

    res.status(200).send(user);
});

export default {
    router: serverErrorSafe(router)
}
