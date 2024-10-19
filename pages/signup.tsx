"use client"
import {z} from "zod"
import { useForm } from "react-hook-form"
import {useState} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/router'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import Link from "next/link"


const FormSchema = z.object({
    username:z.string().min(4, {message:"Username must be more than 4 characters"}),
    password:z.string().min(7, {message: "Password must not be less than 7 characters"})

})




export default function SignUp() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const router = useRouter()
const [signUpError, setSignUpError] = useState(null)
async function  onSubmit(data: z.infer<typeof FormSchema>) {

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      };

      
      try {
        const response = await fetch('/api/auth/signup', options)
        if (!response.ok) {
            const error = await response.json()
            throw Error(`${error.message}`)
        }
        router.push('/dashboard')
        const json = await response.json();
        console.log(json);
      } catch(err: any){
        setSignUpError(err)
      }
  }

  return (
    <div className="w-full flex items-center justify-center h-screen">
        <Card className="bg-black border-[#27272A] text-white">
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Enter your email and password to signup to your account</CardDescription>
                </CardHeader>
        <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" w-[400px] space-y-[20px]">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
               <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormDescription>
                This is your password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Link href="/login" className="hover:underline text-sm hover:text-[#e0e0e0]">Already have an account?</Link>
        <Button type="submit" className="w-full bg-white text-black hover:bg-[#e0e0e0]">Submit</Button>
      </form>
    </Form>
    </CardContent>
    </Card>
    </div>
  )
}
