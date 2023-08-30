
const { ChatController } = require('./controllers/chatController');
const express = require('express');
const { engine } = require('express-handlebars');

(async () => {
    const app = express();
    const port = 3000;

    const controller = new ChatController();

    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', './views');

    app.get("/chat", controller.chat);

    app.listen(port, () => {
        console.log(`Server Listening at http://localhost:${port}`);
    });

})();