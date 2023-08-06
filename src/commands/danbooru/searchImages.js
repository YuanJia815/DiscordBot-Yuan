import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js'
import { EmbedBuilder, AttachmentBuilder } from 'discord.js'
import axios from 'axios'
import { load } from 'cheerio'
import dotenv from 'dotenv'
dotenv.config()
const API_URL = 'https://danbooru.donmai.us/posts.json';
const API_KEY = process.env.DANBOORU_KEY
const USERNAME = process.env.DANBOORU_NAME

const randInt = (x, y) => { return Math.floor(Math.random() * (y - x + 1)) + x }
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const isMP4Url = (url) => { return url.toLowerCase().endsWith('.mp4') }

export async function sendImages(ctx, tag, num) {
    await ctx.followUp(`\` Start < Tag: ${tag} -${num} > \``)
    const page_temp = []
    const video = async(ctx, tag, num) => {
        for(let cnt = 1; cnt <= num; cnt += 1){
            const images = await getImages(tag, page_temp)
            await ctx.followUp({ content: `${cnt}.\n${images[randInt(0, images.length-1)].url}`})
            await sleep(1000)
        }
    }
    const image = async(ctx, tag, num) => {
        for(let cnt = 1; cnt <= num; cnt += 1){
            const images = await getImages(tag, page_temp)
            const attachments = images.map((imageUrl) => new AttachmentBuilder(imageUrl.url))
            const options = images.map((element, index) => {
                return { label: ` ${(index + 1)}.  ${element.id}`, value: `${element.id}` }
            })
            const select_menu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("selectID")
                    .setPlaceholder(" 選擇ID ~")
                    .addOptions(options)
            )    
            await ctx.followUp({ content: ` [ ${cnt} ]   Tag: ${tag}  ${images[0].page}頁`, components: [select_menu], files: attachments })
            await sleep(150)
        }
    }
    if(tag.includes('video')) await video(ctx, tag, num)
    else await image(ctx, tag, num)

    await ctx.followUp(`\` The End \``)
}

async function getImages(tag, page_temp) {
    const historyPage = page_temp
    const images = []
    do{
        let page = 1
        do{
            page = await getRandomPage(tag)     
        } while(historyPage.includes(page))
        historyPage.push(page)

        const res = await axios.get(`${API_URL}?login=${USERNAME}&api_key=${API_KEY}&tags=${tag}&page=${page}`)
        const data = res.data;
        //console.log(data)
        const imgs = data
        .map(post => {
            if (!post || !post.large_file_url || !post.id || post.large_file_url.endsWith('.webm')
                || post.tag_string.includes('bara') || post.tag_string.includes('male_focus')) return null
            if (!tag.includes('video') && post.large_file_url.endsWith('.mp4')) return null

            return { id: post.id, url: post.large_file_url, page: page }       
        }) .filter(item => item !== null)
    
        
        for (let i = 0; i < 5; i += 1) {
            const randint = randInt(0, imgs.length - 1)
            images.push(imgs[randint])
            imgs.splice(randint, 1)
        }
    } while(!images)
    
    page_temp = historyPage 
    return images
  }
  
async function getRandomPage(tag) {
    try {
        const url = `https://danbooru.donmai.us/posts?tags=${tag}`
        const resp = await axios.get(url)
        const $ = load(resp.data)
        const pageNum = []
        $(".paginator-page").each((index, element) => { pageNum.push($(element).text()) })
        const max = pageNum[pageNum.length - 1]  > 1000 ? 1000 : pageNum[pageNum.length - 1]
        const randomPage = randInt(1, max)
        return randomPage
    } 
    catch (error) {
        console.error(error)
        throw error
    }
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return Number(`0x${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`)
}


// for (const img of images) {     
//     if(cnt > num) break             
//     const embed = new EmbedBuilder()
//       .setColor(getRandomColor())
//       .setDescription(` ${cnt}.  sauce: https://danbooru.donmai.us/posts/${img.id}`)
//       .setImage(img.url)
//     const attach = new AttachmentBuilder(img.url)
//     if(isMP4Url(img.url)) await ctx.followUp({ content: `${cnt}.`, files: [attach] })
//     else {
//         await ctx.followUp({ embeds: [embed] })
//         await sleep(3300)
//     }
// cnt++
// }