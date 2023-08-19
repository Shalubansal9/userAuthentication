const mongoose = require('mongoose');

module.exports.init = async function()
{
    await mongoose.connect('mongodb+srv://auth:gAu3Qr070znJQSA2@cluster0.bzpu2gs.mongodb.net/auth?retryWrites=true&w=majority');
}