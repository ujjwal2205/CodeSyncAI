
import jwt from "jsonwebtoken";
const authMiddleware=(req:any,res:any,next:any)=>{
    try {
       
        const token=req.cookies.token;
        if(!token){
            
            return res.status(401).json({success:false,message:"Unauthorized"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET as string);
        req.user=req.user||{}; // Initialize req.user if it doesn't exist
        req.user.userId=(decoded as any).userId;
        next();
    } catch (error:any) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export default authMiddleware;