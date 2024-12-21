const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const uptimeSites = new Map(); // Kullanıcı başına linkleri tutar
const LOG_KANAL_ID = '1318999836292415580'; // Log kanalının ID'sini buraya yazın.

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton() && interaction.type !== 5) return; // 5 = ModalSubmit

        const userId = interaction.user.id;

        // Link Ekleme
        if (interaction.customId === 'add-site') {
            const modal = new ModalBuilder()
                .setCustomId('add-site-modal')
                .setTitle('Link Ekle');

            const linkInput = new TextInputBuilder()
                .setCustomId('site-link')
                .setLabel('Uptime eklemek istediğiniz link:')
                .setStyle(TextInputStyle.Short);

            const actionRow = new ActionRowBuilder().addComponents(linkInput);
            modal.addComponents(actionRow);

            await interaction.showModal(modal);
        }

        if (interaction.customId === 'add-site-modal') {
            const siteLink = interaction.fields.getTextInputValue('site-link');

            if (!uptimeSites.has(userId)) uptimeSites.set(userId, []);
            const userSites = uptimeSites.get(userId);

            if (userSites.includes(siteLink)) {
                return interaction.reply({ content: 'Bu link zaten eklenmiş.', ephemeral: true });
            }

            userSites.push(siteLink);
            interaction.reply({ content: 'Link başarıyla eklendi!', ephemeral: true });

            const logChannel = interaction.client.channels.cache.get(LOG_KANAL_ID);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('✅ Yeni Uptime Linki')
                    .setDescription(`**Kullanıcı:** ${interaction.user.tag}\n**Link:** ${siteLink}`)
                    .setColor(0x00ff00);

                logChannel.send({ embeds: [logEmbed] });
            }
        }

        // Linkleri Görüntüleme
        if (interaction.customId === 'view-sites') {
            const userSites = uptimeSites.get(userId) || [];
            const embed = new EmbedBuilder()
                .setTitle('🔗 Kayıtlı Linkleriniz')
                .setDescription(userSites.length > 0 ? userSites.join('\n') : 'Henüz link eklenmedi.')
                .setColor(0x3498db);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Link Kaldırma
        if (interaction.customId === 'remove-site') {
            const userSites = uptimeSites.get(userId) || [];

            if (userSites.length === 0) {
                return interaction.reply({ content: 'Kayıtlı link bulunamadı.', ephemeral: true });
            }

            const options = userSites.map((site, index) => ({
                label: site,
                description: `Link: ${site}`,
                value: index.toString(),
            }));

            const selectMenu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('remove-site-select')
                        .setPlaceholder('Kaldırmak için bir link seçin.')
                        .addOptions(options)
                );

            await interaction.reply({ content: 'Kaldırmak istediğiniz linki seçin:', components: [selectMenu], ephemeral: true });
        }

        if (interaction.customId === 'remove-site-select') {
            const userSites = uptimeSites.get(userId) || [];
            const indexToRemove = parseInt(interaction.values[0], 10);

            const removedSite = userSites.splice(indexToRemove, 1)[0];
            uptimeSites.set(userId, userSites);

            interaction.update({ content: `Link başarıyla kaldırıldı: ${removedSite}`, components: [], ephemeral: true });

            const logChannel = interaction.client.channels.cache.get(LOG_KANAL_ID);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('❌ Link Kaldırıldı')
                    .setDescription(`**Kullanıcı:** ${interaction.user.tag}\n**Link:** ${removedSite}`)
                    .setColor(0xff0000);

                logChannel.send({ embeds: [logEmbed] });
            }
        }
    },
};
