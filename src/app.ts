import express from "express"
import cors from "cors"
import routes from "./infrastructure/router"
import settings from './domain/config'

const app = express()
app.use(cors())
app.use(express.json())
app.use(`/`,routes)

app.listen( settings.port_express, () => console.log(`Ready...${settings.port_express}`))