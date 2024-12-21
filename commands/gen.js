const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'gen',
    description: 'Hesap oluşturma komutları.',
    async execute(message, args) {
        const fileMap = {
            netflix: 'netflix.txt',
            craftrise: 'craftrise.txt',
            blutv: 'blutv.txt',
            exxen: 'exxen.txt',
        };

        const usedAccounts = new Set(); // Kara liste için Set
        const allowedChannelId = '1319359162584530954'; // Belirli kanal ID (değiştirilebilir)

        if (!args[0] || !fileMap[args[0]]) {
            return message.channel.send('Lütfen geçerli bir platform seçin: netflix, craftrise, blutv, exxen');
        }

        if (message.channel.id !== allowedChannelId) {
            return message.channel.send('Bu komutu yalnızca gen kanalında kullanabilirsiniz.');
        }

        const fileName = fileMap[args[0]];

        // Kara listeyi oku
        const blacklistFile = `blacklist_${args[0]}.json`;
        let blacklist = [];

        try {
            if (fs.existsSync(blacklistFile)) {
                blacklist = JSON.parse(fs.readFileSync(blacklistFile, 'utf8'));
            }
        } catch (err) {
            console.error('Kara liste okunamadı:', err);
        }

        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                console.error('Hata:', err);
                return message.channel.send(`❌ ${args[0]} dosyası okunurken bir hata oluştu.`);
            }

            const lines = data.split('\n').filter(line => !blacklist.includes(line)); // Kara listeye bak ve stok dışı olanları filtrele
            if (lines.length === 0) {
                return message.channel.send('❌ Stok tükenmiştir.');
            }

            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            const [account, password] = randomLine.split(':');

            // Kara listeye ekle
            blacklist.push(randomLine);
            fs.writeFileSync(blacklistFile, JSON.stringify(blacklist, null, 2));

            const embed = new EmbedBuilder()
                .setTitle(`EzGen / ${args[0].toUpperCase()} Hesap`)
                .setColor(0xff5733)
                .setDescription(`Hesap: ${account}\nŞifre: ${password}`)
                .setFooter({ text: 'EzGen tarafından sağlanmıştır.' });

            message.channel.send({ embeds: [embed] });
        });
    },

    cooldown: 15, // 15 saniyelik cooldown
};
