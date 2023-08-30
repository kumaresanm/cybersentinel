'use strict'

const chatController = function(chatService) {
    chatService.clearMessages();
    this.chat = async function(req, res) {
        res.render('chat', {
            pageTitle: 'CyberSentinel Chat',
            pageDescription: ''
          });
    };
}

exports.ChatController = chatController;