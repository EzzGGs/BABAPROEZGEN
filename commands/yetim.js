const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'yetim',
    description: 'TC Kimlik numarası ile yetim bilgisi sorgular.',
    async execute(message, args) {
        if (args.length !== 1) {
            return message.channel.send('Lütfen bir TC kimlik numarası giriniz. Örnek: `!yetim 12345678901`');
        }

        const tc = args[0];

        // TC Kimlik numarasının geçerli olup olmadığını kontrol ediyoruz
        if (!/^\d{11}$/.test(tc)) {
            return message.channel.send('❌ Lütfen geçerli bir 11 haneli TC kimlik numarası giriniz.');
        }

        try {
            const response = await axios.get(`https://srgla-api.glitch.me/yetim.php`, {
                params: { tc },
            });
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle('Yetim Bilgi')
                .setColor(0x8e44ad)
                .addFields(
                    { name: 'TC Kimlik Numarası', value: tc, inline: true },
                    { name: 'Sonuç', value: JSON.stringify(data, null, 2), inline: false }
                )
                .setFooter({ text: 'EzGen tarafından sağlanmıştır.' });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Hata:', error.response ? error.response.data : error.message);
            message.channel.send('❌ Yetim bilgisi sorgulanırken bir hata oluştu.');
        }
    },
};
