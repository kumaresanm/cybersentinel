'use strict'

const chatController = function() {
    this.chat = async function(req, res) {
        res.render('chat', {
            pageTitle: 'CyberSentinel Chat',
            pageDescription: ''
          });
    };
}

exports.ChatController = chatController;