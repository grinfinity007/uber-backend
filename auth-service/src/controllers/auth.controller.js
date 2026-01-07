import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const allowedRoles = ['user', 'driver'];

const registerUser = async (req, res) => {
  try{
    const {email, password, role} = req.body;
    if(!email || !password || !role){
      return res.status(400).json({message: "All email, password and role are required fields"});
    }
    if(!allowedRoles.includes(role)){
      return res.status(400).json({message: "Invalid Role"});
    };
    const normalizedEmail = email.toLowerCase();
    const existing = await pool.query(`
      SELECT email
      FROM auth_users
      WHERE email = $1`,
      [normalizedEmail]
    );
    if(existing.rows.length != 0){
      return res.status(409).json({message: "Email already in use."});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await pool.query(`
      INSERT INTO auth_users
      (email, password_hash, role)
      VALUES($1, $2, $3)
      RETURNING id, email, role, created_at`,
      [normalizedEmail, hashedPassword, role]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: user.rows[0]
    });
  }
  catch(error){
    console.error(error);
    return res.status(500).json({message: "Internal server error"});
  }
};

const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({message: "Both email and password are required"});
    }
    const normalizedEmail = email.toLowerCase();
    const result = await pool.query(`
      SELECT id, email, password_hash, role
      FROM auth_users
      WHERE email = $1`,
      [normalizedEmail]
    )
    if(result.rows.length == 0){
      return res.status(401).json({message: "Invalid email or password"});
    }
    const user = result.rows[0];
    const isCorrect = await bcrypt.compare(password, user.password_hash);
    if(!isCorrect){
      return res.status(401).json({message: "Invalid email or password"});
    }
    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
        iss: "auth-service",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m"
      }
    );
    return res.status(200).json({
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: 900
    });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({message: "Internal server error"});
  }
};

export {
  registerUser,
  loginUser
}