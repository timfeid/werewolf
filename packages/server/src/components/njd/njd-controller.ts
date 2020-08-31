import axios from 'axios'
import { Context } from 'koa'
import { Canvas, createCanvas, registerFont, loadImage } from 'canvas'

export class NJDController {
  public static async m3u8 (ctx: Context) {
    try {
      const response = await axios.get('https://puddy.zipstreams.net/ha.m3u8?url='+ctx.request.query.url)



      console.log(response)

      ctx.body = response.data
        .replace(/\/ha\.m3u8\?url=/g, 'https://wolf.timfeid.com/ha.m3u8?url=')
        .replace(/#EXT-X-KEY:METHOD=AES-128,URI="/g, '#EXT-X-KEY:METHOD=AES-128,URI="https://puddy.zipstreams.net')
    } catch (e) {
      console.log(e)
    }
  }

  public static async get (ctx: Context) {
    const response = await axios.get('https://puddy.zipstreams.net/ha.m3u8?url=' + ctx.request.query.url)

    ctx.body = response.data
      .replace(/\/ha\.m3u8\?url=/g, 'https://wolf.timfeid.com/ha.m3u8?url=')
      .replace(/#EXT-X-KEY:METHOD=AES-128,URI="/g, '#EXT-X-KEY:METHOD=AES-128,URI="https://puddy.zipstreams.net')
  }

  public static async proxy (ctx: Context) {
    const response = await axios.get('https://puddy.zipstreams.net/' + ctx.request.query.url)

    ctx.body = response.data
  }

  public static async getUrl (ctx: Context) {
    // const response = await axios.get(`https://puddy.zipstreams.net/getM3U8.php?id=${ctx.params.id}&league=nhl&date=${ctx.params.date}&cdn=akc`)
    const url = `https://puddy.zipstreams.net/m3u8/${ctx.params.date}/${ctx.params.id}akc`
    console.log(url)
    const response = await axios.get(url)

    ctx.body = response.data
  }

  public static async getImage (koaCtx: Context) {
    const canvas = createCanvas(1920, 1080)
    const ctx = canvas.getContext('2d')

    // const homeImage = await axios.get('https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/1.svg')
    // console.log(homeImage.data)

    ctx.fillStyle = '#ffffff'
    ctx.imageSmoothingEnabled = true

    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'

    const homeImageUrl = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${koaCtx.params.homeId}.svg`
    const awayImageUrl = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${koaCtx.params.awayId}.svg`
    const [homeImg, awayImg] = await Promise.all([
      loadImage(homeImageUrl),
      loadImage(awayImageUrl),
    ])
    ctx.drawImage(homeImg, 0, 540 - homeImg.naturalHeight / 2)
    ctx.drawImage(awayImg, 1000, 540 - homeImg.naturalHeight / 2)

    ctx.antialias = 'gray'
    ctx.font = 'bold 80px Arial'
    ctx.fillText('vs', 960, 540)


    koaCtx.response.body = canvas.toBuffer()
    koaCtx.response.type = 'image/png'
  }
}
