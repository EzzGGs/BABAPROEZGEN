const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const axios = require('axios'); // Axios kütüphanesini import ettik
const fs = require('fs'); // Dosya sistemi için import

module.exports = {
    name: 'uptime-setup',
    description: 'Uptime sistemi kurar.',
    async execute(message) {
        // Yetki kontrolü
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.channel.send('❌ Bu komutu kullanmak için "Kanalları Yönet" iznine sahip olmalısınız.');
        }

        // Uptime sistemi için veritabanı dosyası
        const uptimeFile = './uptimeLinks.json';

        // Uptime linklerini tutan dosyayı kontrol et
        let uptimeLinks = [];
        if (fs.existsSync(uptimeFile)) {
            uptimeLinks = JSON.parse(fs.readFileSync(uptimeFile, 'utf8'));
        }

        const embed = new EmbedBuilder()
            .setTitle('⏰ Uptime Sistemi')
            .setDescription('Aşağıdaki düğmeleri kullanarak uptime linklerinizi yönetin.')
            .setColor(0x00ff00);

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('add-site')
                    .setLabel('Link Ekle')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('view-sites')
                    .setLabel('Linklerim')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('remove-site')
                    .setLabel('Link Kaldır')
                    .setStyle(ButtonStyle.Danger)
            );

        const sentMessage = await message.channel.send({ embeds: [embed], components: [buttons] });

        // Event dinleyici ekle
        const filter = i => i.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 10 * 60 * 1000 }); // 10 dakika süreli

        collector.on('collect', async i => {
            if (i.customId === 'add-site') {
                i.reply({ content: 'Lütfen eklemek istediğiniz URL\'yi girin.', ephemeral: true });

                const response = await i.channel.awaitMessages({ filter, max: 1, time: 30000 }); // 30 saniye içinde mesaj al
                const siteUrl = response.first()?.content;

                if (siteUrl) {
                    uptimeLinks.push({ url: siteUrl, lastChecked: null });
                    fs.writeFileSync(uptimeFile, JSON.stringify(uptimeLinks, null, 2));
                    i.followUp({ content: `URL başarıyla eklendi: ${siteUrl}`, ephemeral: true });
                } else {
                    i.followUp({ content: 'Geçersiz giriş, işlem iptal edildi.', ephemeral: true });
                }
            }

            if (i.customId === 'view-sites') {
                const siteList = uptimeLinks.length > 0
                    ? uptimeLinks.map(link => `**${link.url}** - ${link.lastChecked ? `Son kontrol: ${new Date(link.lastChecked).toLocaleString()}` : 'Kontrol edilmedi'}`).join('\n')
                    : 'Hiç URL eklenmemiş.';

                i.reply({ content: siteList, ephemeral: true });
            }

            if (i.customId === 'remove-site') {
                i.reply({ content: 'Lütfen kaldırmak istediğiniz URL\'yi girin.', ephemeral: true });

                const response = await i.channel.awaitMessages({ filter, max: 1, time: 30000 }); // 30 saniye bekle
                const siteUrlToRemove = response.first()?.content;

                if (siteUrlToRemove) {
                    uptimeLinks = uptimeLinks.filter(link => link.url !== siteUrlToRemove);
                    fs.writeFileSync(uptimeFile, JSON.stringify(uptimeLinks, null, 2));
                    i.followUp({ content: `URL başarıyla kaldırıldı: ${siteUrlToRemove}`, ephemeral: true });
                } else {
                    i.followUp({ content: 'Geçersiz giriş, işlem iptal edildi.', ephemeral: true });
                }
            }
        });

        // Uptime kontrol fonksiyonu
        setInterval(() => {
            uptimeLinks.forEach(link => {
                axios.get(link.url)
                    .then(response => {
                        link.lastChecked = Date.now(); // Kontrol tarihi güncelle
                    })
                    .catch(() => {
                        // Hata alındığında bu linkin bozulduğunu işaretle
                        console.error(`Hata: ${link.url}`);
                    });
            });

            fs.writeFileSync(uptimeFile, JSON.stringify(uptimeLinks, null, 2)); // Güncellenmiş linkleri kaydet
        }, 3 * 60 * 1000); // 3 dakikada bir kontrol
    },
};
