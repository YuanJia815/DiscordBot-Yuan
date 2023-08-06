import { SlashCommandBuilder, MessageEmbed, Colors  } from 'discord.js'
import { sendImages } from '@/commands/img/searchImages'

export const command = new SlashCommandBuilder()
    .setName('img')
    .setDescription('auto image!')
    .addStringOption(option =>
        option.setName('tag')
            .setDescription('圖片類型')
            .setRequired(true)
            .addChoices(
				{ name: 'sex', value: 'sex' },
				{ name: 'mix', value: 'mix' }
			)
    )
    .addIntegerOption(option =>
        option.setName('number')
            .setDescription('圖片數量')
            .setRequired(true)
    )//const num = ctx.options.getInteger('number')

export const action = async (ctx) => {
    const tag = ctx.options.getString('tag')
    const num = ctx.options.getInteger('number')
    await ctx.deferReply({ ephemeral: false })

    await sendImages(ctx, tag, num);
}
