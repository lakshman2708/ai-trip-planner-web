import React, { useState, useEffect } from "react";
import { Button } from '../ui/button'
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'

function Header() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [openDialog, setopenDialog] = useState(false);
  useEffect(() => {
    console.log("User object from localStorage:", user)
  }, [])
  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log("Access Token Info:", codeResp);
      GetUserProfile(codeResp);
    },
    onError: (error) => console.log("Login Failed:", error),
  });


  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log("User Profile:", resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setopenDialog(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      });
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src='/logo.svg' alt='logo' />
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <a href='/create-trip'>
            <Button variant="outline" className='rounded-full'>+ Create Trip</Button>
            </a>
            <a href='/my-trips'>
            <Button variant="outline" className='rounded-full'>My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture || '/placeholder.png'}
                  className="h-[35px] w-[35px] rounded-full"
                  onError={(e) => { e.target.src = '/placeholder.png' }}
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer' onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Logout</h2>
              </PopoverContent>
            </Popover>

          </div>
        ) : (
          <Button onClick={() => setopenDialog(true)}>Sign In</Button>
        )}
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              Sign in to the App with Google authentication securely.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center mt-4">
            <img src="/logo.svg" alt="Logo" />
            <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
            <p className="text-sm text-gray-600">
              Continue with Google authentication
            </p>

            <Button onClick={login} className="w-full mt-5 flex gap-4 items-center">
              <FcGoogle className="h-7 w-7" />
              Sign In With Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header
