import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";

const SECRET = "something";
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, status } = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
    const user = {
      firstName,
      lastName,
      email,
      password: hashedpwd,
      status
    };
    const result = await userModel.create(user);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (isMatch) {
        const userObj = {
          firstName: existingUser.firstName,
          email: existingUser.email,
          role: existingUser.role,
          status: existingUser.status,
        };
        const token = jwt.sign(userObj, SECRET, { expiresIn: "1h" });
        res.status(200).json({ user: userObj, token });
      } else {
        res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const showusers = async (req, res) => {
  try {
    const result = await userModel.find();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const result = await userModel.findByIdAndUpdate(id, body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const deleteUser =  async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const profile = async(req,res)=>{
    try {
        const id = req.params.id
        const result = await userModel.findOne({_id:id});
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(400).json({message:"Something went wrong"})
    }
}

export { register, login, showusers, deleteUser, updateUser, profile };


