const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { checkPermission } = require('./permissionCheck'); // Yetkilendirme kontrolü için import

module.exports = {
    name: 'ilkyazan',
    description: 'İlk Yazan etkinliğini başlatır.',
    async execute(message, args) {
        const allowedRoles = ['1319382710690643988']; // Yetkilendirilmiş rollerin ID'leri

        if (!checkPermission(message.member, allowedRoles)) {
            return message.reply('Bu komutu kullanmak için gerekli izne sahip değilsiniz.');
        }

        if (!args[0]) {
            return message.channel.send('Lütfen ödülü belirtin: `!ilkyazan (ödül)`');
        }

        const prize = args.join(' '); // Ödül bilgisi
        const channel = message.channel;

        // Kanalın mesaj gönderme iznini aç
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
            SendMessages: true,
        });

        // Embed mesajını gönder
        const embed = new EmbedBuilder()
            .setTitle('İlk Yazan Etkinliği Başladı!')
            .setDescription(`Bu kanalda ilk mesajı yazan kişi kazanacak!\n\n@everyone & @here\n\n🎁 Ödül: ${prize}`)
            .setColor('Green')
            .setFooter({ text: 'Etkinlik başladı, bol şans!' });

        await channel.send({ content: '@everyone @here', embeds: [embed] });

        // Etkinlik başlatıldıktan sonra ilk mesajı bekle
        const filter = (msg) => !msg.author.bot; // Bot mesajlarını yok say
        const collector = channel.createMessageCollector({ filter, max: 1 });

        collector.on('collect', async (msg) => {
            const winner = msg.author;

            // Kazananı duyur
            const winnerEmbed = new EmbedBuilder()
                .setTitle('Kazanan Belli Oldu!')
                .setDescription(`🎉 Tebrikler ${winner}! Bu kanalda ilk mesajı yazan kişi oldunuz!\n\n🎁 **Ödül:** ${prize}`)
                .setColor('Gold');

            await channel.send({ embeds: [winnerEmbed] });

            // Kanalın mesaj gönderme iznini kapat
            await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                SendMessages: false,
            });

            // Kazananı etiketle ve duyur
            await channel.send(`${winner} Kazandı! 🎉`);
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                // Hiç mesaj yazılmadıysa
                channel.send('Etkinlik sona erdi, ancak kimse mesaj yazmadı!');
                channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                    SendMessages: false,
                });
            }
        });
    },
};
