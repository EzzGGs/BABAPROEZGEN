const { PermissionsBitField } = require('discord.js');

module.exports = {
    checkPermission: (member, allowedRoles) => {
        if (!member || !member.roles || !allowedRoles || !Array.isArray(allowedRoles)) {
            return false; // Geçersiz durum
        }

        const hasPermission = allowedRoles.some(role => member.roles.cache.has(role));

        return hasPermission; // Belirli rollerden birine sahip mi kontrol eder
    }
};
