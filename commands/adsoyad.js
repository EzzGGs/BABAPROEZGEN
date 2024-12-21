const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'adsoyad',
    description: 'Ad Soyad bilgisi sorgular.',
    async execute(message, args) {
        if (args.length < 4) {
            return message.channel.send('Lütfen tam ad, soyad ve şehir bilgisi giriniz. Örnek: `!adsoyad mustafa mete koçak sivas`');
        }

        const [ad, ...rest] = args;
        const soyad = rest.slice(0, rest.length - 1).join(' ');
        const sehir = rest[rest.length - 1];

        try {
            const response = await axios.get(`https://srgla-api.glitch.me/adsoyad.php?ad=&soyad=&il=`, {
                params: { ad, soyad, sehir },
            });
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle('Ad Soyad Bilgi')
                .setColor(0x9b59b6)
                .addFields(
                    { name: 'Ad', value: ad, inline: true },
                    { name: 'Soyad', value: soyad, inline: true },
                    { name: 'Şehir', value: sehir, inline: true },
                    { name: 'Sonuç', value: JSON.stringify(data, null, 2), inline: false }
                )
                .setFooter({ text: 'EzGen tarafından sağlanmıştır.' });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Hata:', error.response ? error.response.data : error.message);
            message.channel.send('❌ Ad Soyad bilgisi sorgulanırken bir hata oluştu.');
        }
    },
};
