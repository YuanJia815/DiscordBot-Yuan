import { Events } from 'discord.js'

export const event = {
    name: Events.MessageReactionAdd
}

export const action = async (reaction, user) => {
    await reaction.fetch()
    const client = reaction.client
    if(reaction.message.channelId !== '1122711474956148756') return
    const channel = client.channels.cache.get('1122542167483760791')
    const msg = reaction.message.embeds
    channel.send({ embeds: msg })
  }