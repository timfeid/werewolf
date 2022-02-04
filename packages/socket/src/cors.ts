export default function () {
  return (req: any, res: any) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true
    }
    res.writeHead(200, headers)
    res.end()
  }
}
