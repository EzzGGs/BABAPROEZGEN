const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "ban",
    description: "Bir kullanıcıyı sunucudan yasaklar.",
    usage: "!ban @kullanıcı [sebep]",
    async execute(message, args) {
        // Komutu kullanabilenleri sınırla
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply("❌ Bu komutu kullanmak için gerekli yetkiye sahip değilsiniz!");
        }

        // Hedef kullanıcıyı kontrol et
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply("❌ Lütfen banlamak istediğiniz kullanıcıyı etiketleyin.");
        }

        const member = message.guild.members.cache.get(targetUser.id);
        if (!member) {
            return message.reply("❌ Bu kullanıcı bu sunucuda bulunmuyor.");
        }

        if (!member.bannable) {
            return message.reply("❌ Bu kullanıcıyı yasaklamak için yetkim yok.");
        }

        const reason = args.slice(1).join(" ") || "Sebep belirtilmedi.";

        // DM ile bilgilendirme
        const embed = new EmbedBuilder()
            .setTitle("Banlandınız!")
            .setColor(0xff0000)
            .setDescription(
                `EzGen Sunucusundan bir moderatör tarafından yasaklandınız.\n\n**Sebep:** ${reason}`
            )
            .setFooter({ text: "Bu bir otomatik bildirimdir." });

        try {
            await targetUser.send({ embeds: [embed] });
            const dmMessage = await targetUser.send("😄"); // Gülen emoji göndermek
            await dmMessage.react("😄"); // Emojiye tepki eklemek
        } catch (error) {
            console.error("DM gönderilemedi:", error.message);
        }

        // Ban işlemi (3 saniye gecikmeli)
        setTimeout(async () => {
            try {
                await member.ban({ reason });
                message.reply(`✅ ${targetUser.tag} başarıyla sunucudan yasaklandı.`);
            } catch (error) {
                console.error("Ban işlemi sırasında bir hata oluştu:", error.message);
                message.reply("❌ Ban işlemi sırasında bir hata oluştu.");
            }
        }, 3000);
    },
};
