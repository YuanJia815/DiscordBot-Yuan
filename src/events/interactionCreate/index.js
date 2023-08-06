import { Events } from 'discord.js'
import { useAppStore } from '@/store/app'
import { sendImages } from '@/commands/id/searchID'

export const event = {
    name: Events.InteractionCreate
}

export const action = async (interaction) => {
  const client = interaction.client
  if (interaction.isChatInputCommand()){
    const appStore = useAppStore()
    const commandAction = appStore.commandsActionMap.get(interaction.commandName)
    
    await commandAction(interaction)
  }
  else if (interaction.isStringSelectMenu()){
    const channel = client.channels.cache.get('1122542167483760791')
    await interaction.reply({ content : `已發送至 ${channel.name}`, ephemeral: true }).then(msg => {
      setTimeout(() => { msg.delete() }, 3000) } )
      
    await channel.send(await sendImages(interaction.values[0]) )
  }

}

