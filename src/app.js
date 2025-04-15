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


// Routes declaration : USER
app.use("/api/user", userRouter);

// Routes declaration : Admin
app.use("/api/admin", adminRouter);

// Routes : Material received
app.use("/api/material-recieved", materialRecievedRouter);

// Routes : Material Issued
app.use("/api/material-issued", materialIssuedRouter);

// Routes : Inventory
app.use("/api/inventory", inventoryRouter);

// Routes : Order
app.use("/api/order", orderRouter);



export { app }