import axios from 'axios';
import { Context } from 'koa';

export class NJDController {
  public static async m3u8 (ctx: Context) {
      try {
    const response = await axios.get("https://puddy.zipstreams.net/ha.m3u8?url="+ctx.request.query.url);
    
    
    
    console.log(response)

    ctx.body = response.data
      .replace(/\/ha\.m3u8\?url=/g, 'https://wolf.timfeid.com/ha.m3u8?url=')
      .replace(/#EXT-X-KEY:METHOD=AES-128,URI="/g, '#EXT-X-KEY:METHOD=AES-128,URI="https://puddy.zipstreams.net')
      } catch (e) {
          console.log(e)
      }
  }

  public static async get (ctx: Context) {
    const response = await axios.get("https://puddy.zipstreams.net/ha.m3u8?url=" + ctx.request.query.url);

    ctx.body = response.data
      .replace(/\/ha\.m3u8\?url=/g, 'https://wolf.timfeid.com/ha.m3u8?url=')
      .replace(/#EXT-X-KEY:METHOD=AES-128,URI="/g, '#EXT-X-KEY:METHOD=AES-128,URI="https://puddy.zipstreams.net')
  }
  
  public static async proxy (ctx: Context) {
    const response = await axios.get("https://puddy.zipstreams.net/" + ctx.request.query.url);

    ctx.body = response.data
  }

  public static async getUrl (ctx: Context) {
    // const response = await axios.get(`https://puddy.zipstreams.net/getM3U8.php?id=${ctx.params.id}&league=nhl&date=${ctx.params.date}&cdn=akc`);
    const url = `https://puddy.zipstreams.net/m3u8/${ctx.params.date}/${ctx.params.id}akc`
    console.log(url)
    const response = await axios.get(url);

    ctx.body = response.data
  }
}
