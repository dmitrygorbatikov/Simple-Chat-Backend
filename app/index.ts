import express from 'express'
import {createServer} from 'http'
import createSocketServer from "../socket"
import publicRoutes from '../routes/public'
import cors from 'cors'

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 5000

createSocketServer(server)

app.use(express.json())
app.use(cors())
app.use('/public', publicRoutes)

server.listen(PORT, () => console.log(`App has been started on PORT ${PORT}`))