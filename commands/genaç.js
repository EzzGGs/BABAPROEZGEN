const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { checkPermission } = require('./permissionCheck');

module.exports = {
    name: 'genaç',
    description: 'Gen sistemini tekrar açar.',
    async execute(message) {
        const allowedRoles = ['1319382710690643988']; // Yetkilendirilmiş rollerin ID'leri
        if (!checkPermission(message.member, allowedRoles)) {
            return message.channel.send('Bu komutu kullanma yetkiniz yok.');
        }

        const platformFiles = ['netflix.txt', 'craftrise.txt', 'blutv.txt', 'exxen.txt'];
        const blacklistFiles = platformFiles.map(file => `blacklist_${path.basename(file, '.txt')}.json`);

        try {
            // Temiz kara listeyi oluştur
            for (const blacklistFile of blacklistFiles) {
                fs.writeFileSync(blacklistFile, '[]');
            }

            const embed = new EmbedBuilder()
                .setTitle('EzGen Sistemi Açıldı!')
                .setColor(0x00ff00)
                .setDescription('Hesap üretme komutları tekrar aktif hale getirildi.')
                .setFooter({ text: 'EzGen tarafından sağlanmıştır.' });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Gen sistemi açılırken hata:', error);
            message.channel.send('❌ Gen sistemi tekrar açılırken bir hata oluştu.');
        }
    },
};
