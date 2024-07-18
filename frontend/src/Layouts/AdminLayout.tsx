import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { RxHamburgerMenu } from "react-icons/rx";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <div className="flex justify-between my-16 mx-12">
        <div className="text-2xl font-semibold">Admin Panel</div>
        <Sheet>
          <SheetTrigger className="text-2xl" asChild>
            <button><RxHamburgerMenu/></button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-4">
              <SheetTitle className="text-2xl">Admin Links</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="mx-4 flex flex-col gap-4">
              <NavLink
                to="."
                end
                className={({ isActive }) =>
                  isActive ? "underline underline-offset-4 text-xl" : " text-xl"
                }
              >
                Products
              </NavLink>
              <NavLink
                to="categories"
                className={({ isActive }) =>
                  isActive ? "underline underline-offset-4 text-xl" : " text-xl"
                }
              >
                Categories
              </NavLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <Outlet />
    </>
  );
};

export default AdminLayout;
