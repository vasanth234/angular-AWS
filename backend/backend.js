const express = require('express')
const cors = require("cors")
const dotenv = require("dotenv")

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb")

const register = require("./routes/register")
const login = require("./routes/login")

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

// ✅ DynamoDB client
const client = new DynamoDBClient({
  region: "ap-south-2", // India region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

// ✅ Document client (easy JSON handling)
const docClient = DynamoDBDocumentClient.from(client)

// make it accessible in routes
app.set("db", docClient)

app.use("/register", register)
app.use("/applog", login)

app.listen(3002, () => {
  console.log('connected server')
})