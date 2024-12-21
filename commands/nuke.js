const { EmbedBuilder } = require('discord.js');
const { checkPermission } = require('./permissionCheck'); // Yetkilendirme kontrolü için import

module.exports = {
    name: 'nuke',
    description: 'Kanalı siler ve yeniden oluşturur.',
    async execute(message) {
        const allowedRoles = ['1319382710690643988']; // Yetkilendirilmiş rollerin ID'leri

        if (!checkPermission(message.member, allowedRoles)) {
            return message.reply('Bu komutu kullanmak için gerekli izne sahip değilsiniz.');
        }

        try {
            const oldChannel = message.channel;

            // Kanalın kopyasını al
            const copiedChannel = await oldChannel.clone({ reason: 'Nuke komutu ile kanal kopyalandı.' });

            // 2 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Eski kanalı sil
            await oldChannel.delete();

            // Yeni kanalın konumunu eski kanalın olduğu yere taşı
            await copiedChannel.setPosition(oldChannel.rawPosition);

            // Channel Nuked :) yazısı gönderen embed
            const embed = new EmbedBuilder()
                .setTitle('Kanal Yeniden Oluşturuldu!')
                .setColor(0x00ff00)
                .setDescription(`Başarılı bir şekilde kanal **${copiedChannel.name}** olarak yeniden oluşturuldu.`)
                .addField('Kanal Nuked :)', 'Yeni kanal başarıyla oluşturuldu.');

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Nuke işlemi sırasında hata oluştu:', error);
            message.channel.send('❌ Kanal silinirken bir hata oluştu.');
        }
    },
};
