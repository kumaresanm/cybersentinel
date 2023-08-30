const { ChatController } = require('./controllers/chatController');
const express = require('express');
const { engine } = require('express-handlebars');
const { ChatService } = require('./services/chatservice');

(async () => {
  const app = express();
  const port = 3000;

  const controller = new ChatController();
  const chatService = new ChatService();
  // Create an instance of express-handlebars and define the json helper
  const hbs = engine({
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      }
    }
  });

  app.engine('handlebars', hbs);
  app.set('view engine', 'handlebars');
  app.set('views', './views');

  app.get("/chat", controller.chat);
  app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
      const botResponse = await chatService.createCompletion(userMessage);
      res.json({ botResponse });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  app.listen(port, () => {
    console.log(`Server Listening at http://localhost:${port}`);
  });

})();
