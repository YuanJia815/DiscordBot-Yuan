import axios from 'axios'
import { load } from 'cheerio'

const tag = 'sex'

async function getRandomPage() {
  try {
    const res = await axios.get(`https://yande.re/post?tags=${tag}`)
    const $ = load(res.data)
    const pageNum = []
    $(".pagination a").each((index, element) => { pageNum.push($(element).text()) })
    const randomPage = Math.floor(Math.random() * pageNum[pageNum.length - 2] * 0.6 + 1)
    console.log(randomPage)
    return randomPage
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function getImages() {
  try {
    const randomPage = await getRandomPage()
    const res = await axios.get(`https://yande.re/post?page=${randomPage}&tags=${tag}`)
    const $ = load(res.data)
    const allImage = []
    $("a.directlink.largeimg").each((index, element) => { allImage.push($(element).attr('href')) })
    return allImage
  } catch (error) {
    console.error(error)
    throw error
  }
}

// const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
// for(let i = 0; i < 10; i++){
//   console.log(i);
//   await sleep(1000)
// }

const test = async () => {//  https://yande.re/post/show/1110286
    const res = await axios.get(`https://yande.re/post?tags=sex`)
    const $ = load(res.data)
    const arr = []// $('li a[target="_blank"]').attr('href')
    arr.push(`https://yande.re${$('a.thumb').attr('href')}`)
    const res1 = await axios.get(arr[0])
    const l = load(res1.data)
    arr.push(l('li a[target="_blank"]').attr('href'))

    console.log(arr)

}
test()
