const { EmbedBuilder } = require('discord.js');
const { checkPermission } = require('./permissionCheck');

module.exports = {
    name: 'duyur',
    description: 'Sunucudaki herkese DM ile duyuru gönderir.',
    async execute(message, args) {
        const allowedRoles = ['1319382710690643988']; // Yetkilendirilmiş rollerin ID'leri
        if (!checkPermission(message.member, allowedRoles)) {
            return message.channel.send('Bu komutu kullanma yetkiniz yok.');
        }

        const announcement = args.join(' '); // Kullanıcının girdiği tüm argümanları alır
        if (!announcement) return message.channel.send('Lütfen duyurulacak mesajı girin.');

        const members = message.guild.members.cache; // Sunucudaki tüm üyeleri alır
        let successful = 0;
        let failed = 0;

        members.forEach(member => {
            member.send({ 
                embeds: [ 
                    new EmbedBuilder()
                        .setTitle('Duyuru')
                        .setColor(0x00ff00)
                        .setDescription(announcement)
                        .setFooter({ text: `Gönderen: ${message.author.tag}` })
                ] 
            }).catch(() => failed++); // DM gönderirken hata alırsa failed artırır
            successful++;
        });

        const embed = new EmbedBuilder()
            .setTitle('Duyuru Başarılı!')
            .setColor(0x00ff00)
            .setDescription(`${successful} üyeye duyuru gönderildi.`)
            .addFields(
                { name: 'Başarısız Gönderimler', value: `${failed}`, inline: true }
            );

        message.channel.send({ embeds: [embed] });
    },
};
