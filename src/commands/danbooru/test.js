import axios from 'axios'
import { load } from 'cheerio'
import dotenv from 'dotenv'
dotenv.config()

const randInt = (x, y) => { return Math.floor(Math.random() * (y - x + 1)) + x }
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function getImages() {
    
    try {     
        const url = `https://www.pixiv.net/artworks/110168255`
        const res = await axios.get(url)
        const $ = load(res.data)

        //const href = $('a.sc-d98f2c-0').attr('href')
        const href = []
        $("a.sc-d98f2c-0").each((index, element) => { href.push($(element).attr('href')) })
        const title = $('div.sc-1asno00-0.feBRRY').attr('title')
        const src = $('div.sc-1asno00-0.feBRRY img').attr('src')

        return [href, title, src]
    } 
    catch (error) {
        console.error(error)
        throw error
    }
}

// const [href, title, src] = await getImages()
// console.log('href:', href);
// console.log('title:', title);
// console.log('src:', src); 


 const func = (c) => {
    const A = [1, 2, 3, 4, 5, 6]
    const B = (A) => {
        console.log(A.includes(6))
    }
    B(A)
 }


func(5)