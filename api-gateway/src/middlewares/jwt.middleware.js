import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({message: "Authorization token missing"});
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.iss !== "auth-service"){
      return res.status(401).json({message: "Invalid token issuer"});
    }
    req.user = {
      id: decoded.sub,
      role: decoded.role
    };
    next();
  } 
  catch (error) {
    return res.status(401).json({message: "Invalid or expired token"});
  }
}

export {
  verifyJWT
}