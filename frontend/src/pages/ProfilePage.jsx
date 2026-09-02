import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail, CircleUserRound} from "lucide-react";

export const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePicture: base64Image });
    };
  };

  const formatted = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="min-h-screen pt-16 bg-[#008080]">
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Retro Window */}
        <div className="bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000]">
          {/* Title Bar */}
          <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <User className="size-4" />
              Chat App - Profile
            </div>
          </div>

          {/* Window Content */}
          <div className="p-6">
            {/* Heading */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-black">Profile</h1>

              <p className="text-sm text-black mt-1">
                Your profile information
              </p>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-32 h-32 bg-white border-2 border-gray-600 border-t-black border-l-black p-1">
                  <img
                    src={
                      selectedImage || authUser.profilePicture || <CircleUserRound className="size-8"/>
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Camera Button */}
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-[#c0c0c0] text-black cursor-pointer border-2 border-white border-r-black border-b-black ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <Camera className="size-4" />

                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>

              <p className="text-xs text-black">
                {isUpdatingProfile
                  ? "Updating..."
                  : "Click the camera icon to upload your photo"}
              </p>
            </div>

            {/* Profile Information */}
            <div className="mt-6 space-y-4">
              {/* Fullname */}
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-black mb-1">
                  <User className="size-4" />
                  Fullname
                </div>

                <p className="px-3 py-2 bg-white text-black border-2 border-gray-600 border-t-black border-l-black text-sm">
                  {authUser?.fullname}
                </p>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-black mb-1">
                  <Mail className="size-4" />
                  Email Address
                </div>

                <p className="px-3 py-2 bg-white text-black border-2 border-gray-600 border-t-black border-l-black text-sm">
                  {authUser?.email}
                </p>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-6 bg-[#d4d0c8] border-2 border-gray-600 border-t-black border-l-black p-4">
              <h2 className="text-sm font-bold text-black mb-3">
                Account Information
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-500">
                  <span className="font-bold text-black">Member Since</span>

                  <span className="text-black">{formatted}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="font-bold text-black">Account Status</span>

                  <span className="text-green-700 font-bold">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="border-t-2 border-gray-500 px-2 py-1 text-xs text-black">
            Chat App v1.0 | Profile
          </div>
        </div>
      </div>
    </div>
  );
};
