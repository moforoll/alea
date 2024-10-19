// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs"
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import {signToken} from "@/utils/jwt"
import { createClient } from "@supabase/supabase-js";
type Data = {
  message: string;
};
const saltRounds = 10
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey:string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export  default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
    // Getting username and passwrod from request body
    const {username, password } = req.body
    if(!username || username.length < 4 ){
        return res.status(422).json({message:"Invalid Credentials"})
    }
    //Creating the hashed password

    let hashedPassword = await bcrypt.hash(password, saltRounds)
    // Sending the final data
    const data = {
        username:username,
        password: hashedPassword,
        balance: "10000"
    }
    const supabase = createClient(supabaseUrl, supabaseKey)
    const {error:supabaseError } : PostgrestSingleResponse<null> = await supabase
  .from('general')
  .insert(data)

  if(supabaseError){
    return res.status(422).json({message:"There was an error processing your information"})

  }

  const token: any =  signToken(data)
  const cookieOptions = 'Path=/; HttpOnly; Max-Age=84600; Secure; SameSite=Strict';

  res.setHeader('Set-Cookie', `token=${token}; ${cookieOptions}`);

  return res.status(200).json({message: "Success"});
}
