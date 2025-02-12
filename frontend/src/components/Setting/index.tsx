import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDropzone } from "react-dropzone";
import { updateUser, getUserData } from "@/services/api-login";
import { uploadFile, urlAvatar } from "@/services/api-media";

interface AvatarUrlResponse {
  url: string;
}

export const Settings = () => {
  const [name, setName] = useState("Pedro Duarte");
  const [avatarPreview, setAvatarPreview] = useState<string | null>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) throw new Error("Access token is missing");
      try {
        const userData = await getUserData(accessToken);
        setName(userData.name);
        if (userData.avatar_url) {
          const shortUrl = userData.avatar_url.split("/").pop();
          if (shortUrl) {
            const properAvatarUrlObj = await urlAvatar(shortUrl);
            if (
              properAvatarUrlObj &&
              typeof properAvatarUrlObj === "object" &&
              "url" in properAvatarUrlObj
            ) {
              setAvatarPreview((properAvatarUrlObj as AvatarUrlResponse).url);
            } else {
              console.error("Invalid avatar URL object", properAvatarUrlObj);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    try {
      const response = await uploadFile(file);
      const uploadedUrl = response?.fileUrl;
      if (uploadedUrl) {
        const filename = new URL(uploadedUrl).pathname.split("/").pop();
        if (filename) {
          const properAvatarUrl = await urlAvatar(filename);
          setAvatarUrl(properAvatarUrl);
        }
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUser({ name, avatar_url: avatarUrl });
      setAvatarPreview(null);
      console.log("User updated successfully:", response);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Label className="text-center">Avatar</Label>
            <div
              {...getRootProps()}
              className="w-full rounded border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the image here ...</p>
              ) : (
                <p>Drag 'n' drop an image here, or click to select one</p>
              )}
            </div>
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-20 h-20 object-cover rounded-full"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
