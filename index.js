import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs"
import User from "./userSchema.js";
import { database } from "./database.js";
import cors from "cors"

console.log("backend started");

const app =express();
app.use(express.json());
app.use(cors());


const PORT=process.env.PORT;

app.post("/api/create-user",async(req,res)=>{
    const {username,password,email}=req.body;
     if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    try{
         const existingUser = await User.findOne({ email });
         if(existingUser)return res.status(400).json({ message: "user exsits" });

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser=await User.create({
            name: username,
            password: hashedPassword,
            email:email,
          });
          
          return res.status(200).json({message:"user saved"});

    }
    catch(e){
        console.log(e)
        return res.status(400).json({ message:"user creation failed due to internal errors",error:e
         })
    }
})
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

   
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Login failed due to internal error" });
  }
});


app.listen(PORT,async()=>{
    console.log(`listening on port ${PORT}`);
    await database();
})