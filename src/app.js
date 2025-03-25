import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())


//import routes
import userRouter from './routes/user.routes.js'
import materialRecievedRouter from './routes/materialRecieved.routes.js'
import materialIssuedRouter from './routes/materialIssued.routes.js'
import inventoryRouter from './routes/Inventory.routes.js'

//routes declaration : USER
app.use("/user",userRouter)

//routes : Material recieved
app.use("/material-recieved",materialRecievedRouter)

//routes : Material Issued
app.use("/material-issued",materialIssuedRouter)

//routes : Inventory
app.use("/inventory",inventoryRouter)


export { app }