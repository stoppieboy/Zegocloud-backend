require("dotenv").config()
const express = require("express");
const { TokenService } = require("./services/TokenService");
const { APIService } = require("./services/APIService");
const app = express()
app.use(express.json())

const port = process.env.PORT || 3000;

const tokenService = new TokenService
const apiService = new APIService(tokenService);

app.get("/", (req, res)=>{
    res.end('bye')
})

app.post("/create-room", async(req, res) => {
    const payload = {
        name: req.body.name,
        description: req.body.description,
        template_id: req.body.template_id,
        region: req.body.region
    }

    try{
        const roomData = await apiService.post("/rooms", payload);
        res.json(roomData);
    }catch{
        res.status(500).send("Internal server error");
    }
})

app.post("/auth-token", async(req, res) => {
    try{
        const token = tokenService.getAuthToken({
            room_id: req.body.room_id,
            user_id: req.body.use_id,
            role: req.body.role
        })
        res.json({
            token: token,
            msg: "Token generated successfully",
            success: true
        });
    }catch(err){
        console.log(err);
        res.status(500).send("Internal server error");
    }
});


app.listen(port, () => {
    console.log(`server running on ${port}`);
})