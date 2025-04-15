import express from "express"
import cookieParser from "cookie-parser"
import "./scheduler.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())


//import routes
import userRouter from './routes/user.routes.js'
import adminRouter from './routes/admin.routes.js'
import materialRecievedRouter from './routes/materialRecieved.routes.js'
import materialIssuedRouter from './routes/materialIssued.routes.js'
import inventoryRouter from './routes/Inventory.routes.js'
import orderRouter from './routes/order.routes.js'


//routes declaration : Admin
app.use("/admin",adminRouter)

//routes : Material recieved
app.use("/material-recieved",materialRecievedRouter)

//routes : Material Issued
app.use("/material-issued",materialIssuedRouter)



export { app }