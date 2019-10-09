import http from 'http'
import Socket from 'socket.io'

const server = http.createServer()

Socket(server)

server.listen(3009)
