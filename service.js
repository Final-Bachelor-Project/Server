import express from 'express';
import config from 'config';
import bodyparser from 'body-parser';

let service;
const start = async () => {
    const app = express();

    const port = config.get(`port`);

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(express.static(`public`));

    service = app.listen(port);
    console.log(`Now listening to port`, port);
};

const stop = async () => {
    await service.close();
};

export default {
    start, stop
};