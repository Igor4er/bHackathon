import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Plus, LogOut, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Settings } from "../Setting";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { PATHNAMES } from "@/constants/routes";
import { getUserData } from "@/services/api-login";
import { urlAvatar } from "@/services/api-media";

export const Header: FC = () => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [name, setName] = useState("Pedro Duarte");
  const [avatarPreview, setAvatarPreview] = useState<string | null>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) {
          throw new Error("Access token is missing");
        }
        const userData = await getUserData(accessToken);
        console.log(userData);
        setName(userData.name);
        if (userData.avatar_url) {
          const normalizedUrl = await urlAvatar(userData.avatar_url);
          setAvatarPreview(normalizedUrl);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleCreateQuestClick = () => {
    navigate(PATHNAMES.ADDQUEST);
  };

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    navigate(PATHNAMES.LOGIN);
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        <Button
          className="flex items-center gap-2"
          variant="default"
          onClick={handleCreateQuestClick}
        >
          <Plus size={16} /> Create Quest
        </Button>

        <nav className="flex gap-20">
          <Link to="/popular-quests" className="text-gray-700 hover:text-black">
            • Popular Quests •
          </Link>
          <Link
            to="/completed-quests"
            className="text-gray-700 hover:text-black"
          >
            • Completed Quests •
          </Link>
          <Link
            to="/popular-authors"
            className="text-gray-700 hover:text-black"
          >
            • Popular Authors •
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 focus:outline-none">
              <Avatar>
                <AvatarImage
                  src={avatarPreview || "/user-avatar.jpg"}
                  alt="User Avatar"
                />
                <AvatarFallback>UA</AvatarFallback>
              </Avatar>
              <span className="text-gray-800 font-medium">{name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => setOpenEditModal(true)}>
              <Pencil size={16} />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-500"
              onSelect={handleLogOut}
            >
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
