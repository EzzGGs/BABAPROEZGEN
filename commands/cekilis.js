const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { checkPermission } = require('./permissionCheck');

module.exports = {
    name: 'çekiliş',
    description: 'Çekiliş başlatır.',
    async execute(message, args) {
        const allowedRoles = ['1319382710690643988']; // Yetkilendirilmiş rollerin ID'leri buraya yazılır

        if (!checkPermission(message.member, allowedRoles)) {
            return message.channel.send('Bu komutu kullanma yetkiniz yok.');
        }

        // Girdi doğrulaması
        if (!args[0] || !args[1] || !args[2]) {
            return message.channel.send('Lütfen doğru formatta kullanın: `!çekiliş (süre) (kazanan sayısı) (ödül)`');
        }

        const duration = parseInt(args[0]); // Süre (saniye)
        const winnerCount = parseInt(args[1]); // Kazanan sayısı
        const prize = args.slice(2).join(' '); // Ödül

        if (isNaN(duration) || isNaN(winnerCount) || winnerCount < 1) {
            return message.channel.send('Lütfen geçerli bir süre ve kazanan sayısı giriniz.');
        }

        const participants = new Set(); // Katılımcıları depolamak için bir Set

        // Embed mesajı
        const embed = new EmbedBuilder()
            .setTitle('🎉 Çekiliş Başladı! 🎉')
            .setDescription(`Katılmak için "Katıl" butonuna tıklayın! Çekiliş sonunda **${winnerCount} kişi** kazanacak.\n\n🎁 **Ödül:** ${prize}\n⏳ **Süre:** ${duration} saniye`)
            .setColor('Blue')
            .setFooter({ text: 'Çekiliş başladı, bol şans!' });

        // Butonlar
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('join')
                .setLabel('Katıl')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('leave')
                .setLabel('Çık')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('participants')
                .setLabel('Katılımcılar')
                .setStyle(ButtonStyle.Secondary)
        );

        const messageSent = await message.channel.send({ embeds: [embed], components: [row] });

        // Buton dinleyicisi
        const collector = messageSent.createMessageComponentCollector({
            time: duration * 1000, // Saniyeyi milisaniyeye çevir
        });

        collector.on('collect', async (interaction) => {
            if (interaction.isButton()) {
                if (interaction.customId === 'join') {
                    if (participants.has(interaction.user.id)) {
                        return interaction.reply({
                            content: 'Zaten çekilişe katıldınız!',
                            ephemeral: true,
                        });
                    }
                    participants.add(interaction.user.id);
                    return interaction.reply({
                        content: 'Çekilişe başarıyla katıldınız! 🎉',
                        ephemeral: true,
                    });
                }

                if (interaction.customId === 'leave') {
                    if (!participants.has(interaction.user.id)) {
                        return interaction.reply({
                            content: 'Zaten çekilişte değilsiniz!',
                            ephemeral: true,
                        });
                    }
                    participants.delete(interaction.user.id);
                    return interaction.reply({
                        content: 'Çekilişten başarıyla çıktınız!',
                        ephemeral: true,
                    });
                }

                if (interaction.customId === 'participants') {
                    const participantList = Array.from(participants).map((id) => `<@${id}>`).join('\n') || 'Kimse katılmadı.';
                    return interaction.reply({
                        content: `Şu ana kadar katılanlar:\n${participantList}`,
                        ephemeral: true,
                    });
                }
            }
        });

        collector.on('end', async () => {
            // Katılımcıları kontrol et
            if (participants.size === 0) {
                return message.channel.send('Çekilişe kimse katılmadı. Çekiliş iptal edildi.');
            }

            // Kazananları seç
            const winners = Array.from(participants).sort(() => 0.5 - Math.random()).slice(0, winnerCount);

            const resultEmbed = new EmbedBuilder()
                .setTitle('🎉 Çekiliş Sonuçları 🎉')
                .setDescription(
                    winners.length > 0
                        ? `Kazananlar:\n${winners.map((id) => `<@${id}>`).join('\n')}\n\n🎁 **Ödül:** ${prize}`
                        : 'Kimse kazanmadı.'
                )
                .setColor('Gold')
                .setFooter({ text: 'Çekiliş sona erdi!' });

            message.channel.send({ embeds: [resultEmbed] });
        });
    },
};
