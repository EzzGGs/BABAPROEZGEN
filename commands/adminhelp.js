const { EmbedBuilder } = require('discord.js');
const { checkPermission } = require('./permissionCheck'); // Daha önce oluşturduğunuz permissionCheck.js dosyasını kullanın

module.exports = {
    name: 'adminyardım',
    description: 'Botun yardım menüsünü gösterir.',
    execute(message) {
        // Yetkilendirme kontrolü
        const allowedRoles = ['1319382710690643988']; // Yetkilendirilmiş rollerin ID'leri buraya yazılır
        if (!checkPermission(message.member, allowedRoles)) {
            return message.channel.send('Bu komutu kullanma yetkiniz yok.');
        }

        const embed = new EmbedBuilder()
            .setTitle('✨ EzGen ✨')
            .setColor(0x00ff00)
            .setDescription(`
             ✨Sorgu Komutları               
📌  !tc = tc den kişisel bilgileri
📌  !gsm = tc den gsm
📌  !adres = tc den adres
📌  !aile = tc den aile bilgileri
📌  !adsoyad = ad soyad dan kişisel bilgileri
📌  !kızlıksoyad = kişinin kızlık soyadını gösterir
📌  !yetim = yetim sorgula

              ✨Moderasyon Komutları   
🔒  !duyur = mesajı dm yoluyla duyurur
🔒  !nuke = kanalı silip yeniden oluşturur
🔒  !uptime-setup = uptime sistemini kurar 
🔒  !ilkyazan = ilk yazan etkinliği başlatır
🔒  !cekiliş = çekiliş başlatır


            ✨gen komutları
📌  !gen netflix = netflix hesabı 
📌  !gen exxen = exxen hesabı
📌  !gen craftrise = craftrise hesabı
📌  !gen blutv = blutv hesabı
🔒  !genaç = gen sistemini açar
🔒  !genkapat = gen sistemini kapar

Codded By EzzGGs
            `);

        message.channel.send({ embeds: [embed] });
    },
};
