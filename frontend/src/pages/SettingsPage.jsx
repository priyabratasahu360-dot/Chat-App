import {
  Settings,
  User,
  Bell,
  Lock,
  Palette,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNotificationStore } from "../store/useNotificationStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";

export const SettingsPage = () => {
  const {authUser} = useAuthStore();
  const {preferences, setNotificationPreferences, getNotificationPreferences} = useNotificationStore();

  useEffect(() => {
    if(!authUser) return;
    
    getNotificationPreferences(authUser._id);
  }, [authUser._id, getNotificationPreferences]);

  return (
    <div className="min-h-screen pt-16 bg-[#008080]">
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Retro Window */}
        <div className="bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000]">
          {/* Title Bar */}
          <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between">

            <div className="flex items-center gap-2 font-bold text-sm">
              <Settings className="size-4" />
              Chat App - Settings
            </div>
          </div>

          {/* Content */}
          <div className="p-6">

            {/* Heading */}
            <div className="mb-6">

              <h1 className="text-xl font-bold text-black">
                Settings
              </h1>

              <p className="text-sm text-black mt-1">
                Configure your Chat App
              </p>

            </div>

            {/* Settings Sections */}
            <div className="space-y-4">

              {/* Account */}
              <div className="border-2 border-gray-600 border-t-black border-l-black bg-[#d4d0c8]">

                <div className="bg-[#000080] text-white px-3 py-1 flex items-center gap-2">
                  <User className="size-4" />
                  <span className="font-bold text-sm">
                    Account
                  </span>
                </div>

                <div className="p-4">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-black">
                        Profile
                      </p>

                      <p className="text-xs text-gray-700">
                        Manage your profile information
                      </p>
                    </div>

                    <button
                      className="bg-[#c0c0c0] text-black px-4 py-1.5 text-sm font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
                    >
                        <Link to="/profile">
                      Open
                        </Link>
                    </button>
                  </div>

                </div>
              </div>

              {/* Notifications */}
              <div className="border-2 border-gray-600 border-t-black border-l-black bg-[#d4d0c8]">
                <div className="bg-[#000080] text-white px-3 py-1 flex items-center gap-2">
                  <Bell className="size-4" />
                  <span className="font-bold text-sm">
                    Notifications
                  </span>
                </div>

                <div className="p-4 border-b-2 border-gray-500 bg-[#e4e0d8]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-black font-bold">Disable ALL alerts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!preferences?.notificationsEnabled}
                      onChange={() => setNotificationPreferences(authUser?._id, "notificationsEnabled")}
                      className="w-5 h-5 accent-[#000080]"
                    />
                  </div>
                </div>
              {/* In-app notification */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-black">
                        In-app Notifications
                      </p>
                      <p className="text-xs text-gray-700">
                        Show notifications when you receive messages
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!preferences?.inApp}
                      disabled={!preferences?.notificationsEnabled}
                      onChange={() => setNotificationPreferences(authUser._id, "inApp")}
                      className="w-4 h-4 accent-[#000080]"
                    />
                  </div>
                </div>

                {/* Browser push notification */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-black">
                        Push Notifications(Not available)
                      </p>
                      <p className="text-xs text-gray-700">
                        Messages sent to your system even after you closed your browser tab
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!preferences?.push}
                      disabled
                      onChange={() => setNotificationPreferences(authUser._id, "push")}
                      className="w-4 h-4 accent-[#000080]"
                    />
                  </div>
                </div>

                {/* Email notification */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-black">
                        Email Notifications(Not available)
                      </p>
                      <p className="text-xs text-gray-700">
                        Get notifications in your mail inbox
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!preferences?.email}
                      disabled
                      onChange={() => setNotificationPreferences(authUser._id, "email")}
                      className="w-4 h-4 accent-[#000080]"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="border-2 border-gray-600 border-t-black border-l-black bg-[#d4d0c8]">

                <div className="bg-[#000080] text-white px-3 py-1 flex items-center gap-2">
                  <Lock className="size-4" />
                  <span className="font-bold text-sm">
                    Privacy
                  </span>
                </div>

                <div className="p-4 space-y-3">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-bold text-sm text-black">
                        Show Online Status
                      </p>

                      <p className="text-xs text-gray-700">
                        Allow other users to see when you're online (Unavailable)
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 accent-[#000080]"
                      disabled
                    />

                  </div>

                </div>
              </div>

              {/* Appearance */}
              <div className="border-2 border-gray-600 border-t-black border-l-black bg-[#d4d0c8]">

                <div className="bg-[#000080] text-white px-3 py-1 flex items-center gap-2">
                  <Palette className="size-4" />
                  <span className="font-bold text-sm">
                    Appearance
                  </span>
                </div>

                <div className="p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-bold text-sm text-black">
                        Theme
                      </p>

                      <p className="text-xs text-gray-700">
                        Current theme
                      </p>
                    </div>

                    <select
                      defaultValue="retro"
                      className="bg-white text-black border-2 border-gray-600 border-t-black border-l-black px-2 py-1 text-sm outline-none"
                    >
                      <option value="retro">
                        Retro(default)
                      </option>

                      <option value="classic" disabled>
                        Classic
                      </option>
                    </select>

                  </div>

                </div>
              </div>

              {/* About */}
              <div className="border-2 border-gray-600 border-t-black border-l-black bg-[#d4d0c8]">

                <div className="bg-[#000080] text-white px-3 py-1 flex items-center gap-2">
                  <Info className="size-4" />
                  <span className="font-bold text-sm">
                    About
                  </span>
                </div>

                <div className="p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-bold text-sm text-black">
                        Chat App
                      </p>

                      <p className="text-xs text-gray-700">
                        Version 1.0
                      </p>
                    </div>

                    <span className="text-xs text-gray-700">
                      MERN Chat Application
                    </span>

                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* Status Bar */}
          <div className="border-t-2 border-gray-500 px-2 py-1 text-xs text-black flex">
            <span>Chat App v1.0</span>
          </div>

        </div>

      </div>

    </div>
  );
};
