import axios from 'axios';
import { Context } from 'koa';

export class NJDController {
  public static async m3u8 (ctx: Context) {
    const response = await axios.get("https://njd.zipstreams.net/ha.m3u8?url="+ctx.request.query.url);

    ctx.body = response.data
      .replace(/\/ha\.m3u8\?url=/g, 'https://wolf.timfeid.com/ha.m3u8?url=')
      .replace(/#EXT-X-KEY:METHOD=AES-128,URI="/g, '#EXT-X-KEY:METHOD=AES-128,URI="https://njd.zipstreams.net')
  }

  public static async get (ctx: Context) {
    const response = await axios.get("https://njd.zipstreams.net/ha.m3u8?url=" + ctx.request.query.url);

    ctx.body = response.data
      .replace(/\/ha\.m3u8\?url=/g, 'https://wolf.timfeid.com/ha.m3u8?url=')
      .replace(/#EXT-X-KEY:METHOD=AES-128,URI="/g, '#EXT-X-KEY:METHOD=AES-128,URI="https://njd.zipstreams.net')
  }

  public static async getUrl (ctx: Context) {
    const response = await axios.get(`https://njd.zipstreams.net/getM3U8.php?id=${ctx.params.id}&league=nhl&date=${ctx.params.date}&cdn=akc`);

    ctx.body = response.data
  }
}
