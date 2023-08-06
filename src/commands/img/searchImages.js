import axios, { all } from 'axios'
import { load } from 'cheerio'
import { EmbedBuilder, AttachmentBuilder } from 'discord.js'

const randInt = (x, y) => { return Math.floor(Math.random() * (y - x + 1)) + x }
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

export async function sendImages(ctx, tag, num) {
    const Color = [0x88d2d3, 0xffc1df, 0xffe664, 0x9aff99]
    let cnt = 1
    await ctx.followUp(`\` 開始 -> ${tag} - ${num}張\``)

    while(cnt <= num){
        const result = await getImages(tag)
        const randidx = randInt(0, result.images.length - 4)
        for (let i = 0; i < 4; i++) {     
            if(cnt > num) break
            
            const embed = new EmbedBuilder()
                .setColor(getRandomColor())
                .setTitle(`Tag: ${result.tag}  ${result.page}頁`)
                .setURL(result.url)
                .setImage(result.images[randidx + i])
                .setFooter({ text: `${cnt}.`});
                
            await ctx.followUp({ embeds: [embed] })
            await sleep(3000)
            cnt++
        }
    }
}

async function getRandomPage(tag, web) {
    try {
        const url = `https://${web}/post?tags=${tag}`
        const res = await axios.get(url)
        const $ = load(res.data)
        const pageNum = []
        $(".pagination a").each((index, element) => { pageNum.push($(element).text()) })
        const randomPage = randInt(1, pageNum[pageNum.length - 2] * 0.5)
        return randomPage
    } 
    catch (error) {
        console.error(error)
        throw error
    }
}
  
async function getImages(tag) {
    const webs = ['konachan.com', 'yande.re', 'konachan.com']
    const Web = webs[randInt(0, 2)]
    const tags = ['sex', 'cum', 'sex']    
    let randTag = tag
    if(tag == 'mix') randTag = tags[randInt(0, 2)]
    
    try {
        const randomPage = await getRandomPage(randTag, Web)        
        const url = `https://${Web}/post?page=${randomPage}&tags=${randTag}`
        const res = await axios.get(url)
        const $ = load(res.data)
        const allImage = []
        $("a.directlink.largeimg").each((index, element) => { allImage.push($(element).attr('href')) })
        return { url: url, images: allImage, tag: randTag, page: randomPage }
    } 
    catch (error) {
        console.error(error)
        throw error
    }
}

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return Number(`0x${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`)
}