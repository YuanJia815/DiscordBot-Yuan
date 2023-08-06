import axios from 'axios'
import { load } from 'cheerio'
import dotenv from 'dotenv'
import { EmbedBuilder, AttachmentBuilder } from 'discord.js'
dotenv.config()

const API_URL = 'https://danbooru.donmai.us/posts';
const API_KEY = process.env.DANBOORU_KEY
const USERNAME = 'YuanJia'

const randInt = (x, y) => { return Math.floor(Math.random() * (y - x + 1)) + x }
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export const sendImages  = async (id) => {
    const ID = [[/^\d{6}$/, From_nhentai], [/^\d{7}$/, From_Danbooru], [/^[a-zA-Z]+-\d+$/, From_Av]]

    for (const key of ID) {
        if (key[0].test(id)) {
            return await key[1](id) 
        }
    }
}
const From_Av = async(id) => `https://missav.com/${id}/`

const From_Danbooru = async(id) => {// 7位數ID
    const res = await axios.get(`${API_URL}/${id}.json?login=${USERNAME}&api_key=${API_KEY}`)
    const data = res.data;
    const result = { id: data.id, url: data.large_file_url, pixiv: data.pixiv_id}
    if(data.pixiv_id){
        result.title = ` Pixiv artworks ID- ${data.pixiv_id}`
        result.titleURL = `https://www.pixiv.net/artworks/${data.pixiv_id}`
    } else {
        result.title = ` Posts ID- ${data.id}`
        result.titleURL = `https://danbooru.donmai.us/posts/${data.id}`
    } 
    const attachment = new AttachmentBuilder(result.url)
    const embed = new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(result.title)
        .setURL(result.titleURL)

    return { embeds: [embed], files: [attachment] }
  }

const From_nhentai = async(id) => {
    const embed = new EmbedBuilder()
    .setColor(getRandomColor())
    .setTitle(`nhentai ${id}`)
    .setURL(`https://nhentai.net/g/${id}`)
    return { embeds: [embed] }
}

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return Number(`0x${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`)
}