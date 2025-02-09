import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

import { Settings } from "../Setting";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Header: FC = () => {
  const [openEditModal, setOpenEditModal] = useState(false);

  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        <Button className="flex items-center gap-2" variant="default">
          <Plus size={16} /> Create Quest
        </Button>

        <nav className="flex gap-20">
          <Link to="/popular-quests" className="text-gray-700 hover:text-black">
            Popular Quests
          </Link>
          <Link
            to="/completed-quests"
            className="text-gray-700 hover:text-black"
          >
            Completed Quests
          </Link>
          <Link
            to="/popular-authors"
            className="text-gray-700 hover:text-black"
          >
            Popular Authors
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 focus:outline-none">
              <Avatar>
                <AvatarImage src="/user-avatar.jpg" alt="User Avatar" />
                <AvatarFallback>UA</AvatarFallback>
              </Avatar>
              <span className="text-gray-800 font-medium">Username</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => setOpenEditModal(true)}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-red-500">
              <LogOut size={16} />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
          <Settings />
        </Dialog>
      </div>
    </header>
  );
};
