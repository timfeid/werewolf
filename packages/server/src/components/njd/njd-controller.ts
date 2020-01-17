import axios from 'axios';
import { Context } from 'koa';

export class NJDController {
  public static async m3u8 (ctx: Context) {
    const response = await axios.get("https://njd.zipstreams.net/ha.m3u8?url="+ctx.request.query.url);

    ctx.body = response.data
      .replace(/\/ha\.m3u8\?url=/g, 'http://wolf.timfeid.com:8082/ha.m3u8?url=')
      .replace(/#EXT-X-KEY:METHOD=AES-128,URI="/g, '#EXT-X-KEY:METHOD=AES-128,URI="https://njd.zipstreams.net')
  }

  public static async get (ctx: Context) {
    const response = await axios.get("https://njd.zipstreams.net/ha.m3u8?url=" + ctx.request.query.url);

    ctx.body = response.data
      .replace(/\/ha\.m3u8\?url=/g, 'http://wolf.timfeid.com:8082/ha.m3u8?url=')
      .replace(/#EXT-X-KEY:METHOD=AES-128,URI="/g, '#EXT-X-KEY:METHOD=AES-128,URI="https://njd.zipstreams.net')
  }
}
