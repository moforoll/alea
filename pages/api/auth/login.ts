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
    const supabase = createClient(supabaseUrl, supabaseKey)
    // Fetching user with username
    const { data, error } = await supabase
    .from('general')
    .select()
    .eq("username", username)
    if(error){
        return res.status(404).json({message:"User not found"})
    }
    // Checking if the passwords match
    const crossCheck = await bcrypt.compare(password, data[0].password)
    if(!crossCheck){
        return res.status(401).json({message:"Incorrect Password"})
    }

  const token: any =  signToken(data[0])
  const cookieOptions = 'Path=/; HttpOnly; Max-Age=84600; Secure; SameSite=Strict';

  res.setHeader('Set-Cookie', `token=${token}; ${cookieOptions}`);

  return res.status(200).json({message: "Success"});
}
