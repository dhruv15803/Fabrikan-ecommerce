import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import { AppContextType } from "../types";
import { RxAvatar } from "react-icons/rx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import axios from "axios";
import { backendUrl } from "../App";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const { loggedInUser, setLoggedInUser } = useContext(
    AppContext
  ) as AppContextType;
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(response);
      if (response.data.success) {
        setLoggedInUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 border-b">
        <div className="text-2xl font-semibold">
          <Link
            className="text-gray-600 hover:text-black hover:duration-300"
            to="/"
          >
            Fabrikan
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/cart')} className="flex items-center gap-1 cursor-pointer">
            <ShoppingCart />
            <span>Cart</span>
          </div>
          {loggedInUser !== null ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-1 cursor-pointer text-gray-500 hover:text-black hover:duration-300">
                    <span className="text-4xl">
                      <RxAvatar />
                    </span>
                    <span className="text-lg">{loggedInUser?.firstName}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{loggedInUser.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {loggedInUser.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Your orders</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logoutUser}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} variant="outline">
                Login
              </Button>
              <Button onClick={() => navigate("/register")} variant="default">
                Register
              </Button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
