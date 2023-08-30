
(async () => {

    const { ChatController } = require('./controllers/chatController');
    const express = require('express');
    const handlebars = require('express-handlebars');

    const app = express();
    const port = 3000;

    const controller = new ChatController();

    app.engine('.handlebars', handlebars({
        extname: '.handlebars',
        helpers: { scriptJson: object => (object === null || object === undefined ? '{}' : JSON.stringify(object).replace(/\//g, '\\/')) }
    })).set('view engine', '.handlebars');

    app.get("/chat", controller.chat);

    app.listen(port, () => {
        console.log(`Server Listening at http://localhost:${port}`);
    });

})();