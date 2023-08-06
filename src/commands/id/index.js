import { SlashCommandBuilder } from 'discord.js'
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

import { sendImages } from '@/commands/id/searchID'

export const command = new SlashCommandBuilder()
    .setName('id')
    .setDescription('尋找ID ~')
    .addStringOption(option =>
        option.setName('id')
            .setDescription('ID')
            .setRequired(true)
    )

export const action = async (ctx) => {
    const id = ctx.options.getString('id')
    await ctx.deferReply({ ephemeral: false })
    await ctx.followUp(await sendImages(id))
}
