const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { checkPermission } = require('./permissionCheck');

module.exports = {
    name: 'genkapat',
    description: 'Gen sistemini kapatır.',
    async execute(message) {
        const allowedRoles = ['1319382710690643988']; // Yetkilendirilmiş rollerin ID'leri
        if (!checkPermission(message.member, allowedRoles)) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Yetki Hatası!')
                .setColor(0xff0000)
                .setDescription('Bu komutu kullanma yetkiniz yok.')
                .setFooter({ text: 'EzGen sistemi devre dışıdır.' });

            return message.channel.send({ embeds: [errorEmbed] });
        }

        // Gen sistemi kapatıldığını belirten bir embed oluştur
        const embed = new EmbedBuilder()
            .setTitle('EzGen Sistemi Kapalı!')
            .setColor(0xff0000)
            .setDescription('Artık hesap üretme komutları devre dışı bırakılmıştır.')
            .setFooter({ text: 'EzGen tarafından sağlanmıştır.' });

        message.channel.send({ embeds: [embed] });

        // Komutları devre dışı bırakma
        message.client.commands.forEach(cmd => {
            if (cmd.name.startsWith('gen')) {  // gen ile başlayan tüm komutları devre dışı bırak
                cmd.enabled = false; // Komutu devre dışı bırak
            }
        });

        // Belirli platformlar için kontrol ve engelleme
        const restrictedPlatforms = ['netflix', 'blutv', 'exxen', 'craftrise'];

        if (restrictedPlatforms.some(platform => message.content.startsWith(`!gen ${platform}`))) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('Hata!')
                .setColor(0xff0000)
                .setDescription('Gen Sistemi Kapalıdır. Bu komutlar kullanılamaz.')
                .setFooter({ text: 'EzGen sistemi devre dışıdır.' });

            return message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
