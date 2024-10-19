import jwt, { JwtPayload } from "jsonwebtoken"
// type data{
    
// }
export const privateKey = process.env.NODE_ENV
export  function signToken(data: JwtPayload)  {
    jwt.sign(data, privateKey, {expiresIn:"7d"}, function(err, token) {
        // if (err){
        //     return err 
        // }
        return token
      });
}

export function verifyToken(token: any){
    jwt.verify(token, privateKey, function(err:any, decoded:any) {
        if(err){
            return err
        }
        return decoded
      });
}