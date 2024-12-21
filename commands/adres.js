const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'adres',
    description: 'TC kimlik numarasına göre adres bilgisi al.',
    async execute(message, args) {
        if (!args[0]) {
            return message.channel.send('Lütfen bir TC kimlik numarası giriniz.');
        }

        const tc = args[0];

        try {
            const response = await axios.get(`https://srgla-api.glitch.me/adres.php?tc=${tc}`);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle('Adres Bilgi')
                .setColor(0x3498db)
                .addFields(
                    { name: 'TC Kimlik Numarası', value: tc, inline: true },
                    { name: 'Sonuç', value: JSON.stringify(data, null, 2), inline: false }
                )
                .setFooter({ text: 'EzGen tarafından sağlanmıştır.' });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Hata:', error.response ? error.response.data : error.message);
            message.channel.send('❌ Adres verisi çekilirken bir hata oluştu.');
        }
    },
};
