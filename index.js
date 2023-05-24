import express from "express"
// import product from "./api/product"
const app = express();

app.use(express.json({ extended: false }));

app.get("/",(_,res)=>res.send('server running'));

const PORT = process.env.PORT || 8080;
app.listen(8080, () => console.log(`Server is running in port ${PORT}`));