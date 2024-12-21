const { Client, GatewayIntentBits } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`${client.user.tag} bot çevrimiçi!`); // Botun ismini ve etiketini konsola yazdırır

        // Botun durumunu ayarla
        client.user.setPresence({
            activities: [{ name: 'EzGen 1.0.0' }], // Oynuyor kısmına "EzGen 1.0.0" yazacak
            status: 'online' // Durum çevrimiçi olacak
        });
    },
};
