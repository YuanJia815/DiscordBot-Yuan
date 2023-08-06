import { SlashCommandBuilder } from 'discord.js'
import { sendImages } from '@/commands/danbooru/searchImages'

export const command = new SlashCommandBuilder()
    .setName('danbooru')
    .setDescription('隨機的實用素材~')
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('Tag類型')
            .setRequired(true)
            .addChoices(
				{ name: 'sex', value: 'sex' },
				{ name: 'video', value: 'video sex' }
			)
    )
    .addIntegerOption(option =>
        option.setName('number')
            .setDescription('素材數量')
            .setRequired(true)
    )//const num = ctx.options.getInteger('number')

export const action = async (ctx) => {
    const tag = ctx.options.getString('tag')
    const num = ctx.options.getInteger('number')
    await ctx.deferReply({ ephemeral: false })

    await sendImages(ctx, tag, num);
}
