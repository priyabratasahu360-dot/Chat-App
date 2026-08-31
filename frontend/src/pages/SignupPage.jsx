import { useState } from "react";

import { useAuthStore } from "../store/useAuthStore";
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    MessageSquare,
    User
} from "lucide-react";

import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: ""
    });

    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullname.trim())
            return toast.error("Full name is required");

        if (!formData.email.trim())
            return toast.error("Email is required");

        if (!/\S+@\S+\.\S+/.test(formData.email))
            return toast.error("Invalid email format");

        if (!formData.password.trim())
            return toast.error("Password is required");

        if (formData.password.length < 6)
            return toast.error("Password must be atleast 6 characters");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm();

        if (success === true) {
            signup(formData);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#008080] p-4">

            {/* Retro Window */}
            <div className="w-full max-w-md bg-[#c0c0c0] border-2 border-white shadow-[4px_4px_0px_#000]">

                {/* Title Bar */}
                <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between">

                    <div className="flex items-center gap-2 font-bold text-sm">
                        <MessageSquare className="size-4" />
                        Chat App - Signup
                    </div>

                    
                </div>

                {/* Content */}
                <div className="p-6">

                    {/* Header */}
                    <div className="text-center mb-6">

                        <MessageSquare className="mx-auto size-10 text-[#000080] mb-2" />

                        <h1 className="text-xl font-bold text-black">
                            Create Account
                        </h1>

                        <p className="text-sm text-black mt-1">
                            Get started with your free account
                        </p>

                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Fullname */}
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">
                                Full Name:
                            </label>

                            <div className="relative">

                                <User className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-600" />

                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    value={formData.fullname}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            fullname: e.target.value
                                        })
                                    }
                                    className="w-full bg-white border-2 border-gray-600 border-t-black border-l-black px-8 py-2 text-sm text-black outline-none"
                                />

                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">
                                Email:
                            </label>

                            <div className="relative">

                                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-600" />

                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value
                                        })
                                    }
                                    className="w-full bg-white border-2 border-gray-600 border-t-black border-l-black px-8 py-2 text-sm text-black outline-none"
                                />

                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">
                                Password:
                            </label>

                            <div className="relative">

                                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-600" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value
                                        })
                                    }
                                    className="w-full bg-white border-2 border-gray-600 border-t-black border-l-black px-8 py-2 pr-10 text-sm text-black outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-4 text-gray-600" />
                                    ) : (
                                        <Eye className="size-4 text-gray-600" />
                                    )}
                                </button>

                            </div>
                        </div>

                        {/* Create Account Button */}
                        <div className="flex justify-center pt-2">

                            <button
                                type="submit"
                                disabled={isSigningUp}
                                className="min-w-40 bg-[#c0c0c0] text-black px-5 py-2 text-sm font-bold border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white"
                            >
                                {isSigningUp ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        Loading...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>

                        </div>

                        {/* Login */}
                        <div className="text-center border-t-2 border-gray-500 pt-4 mt-5">

                            <span className="text-sm text-black">
                                Already have an account?{" "}
                            </span>

                            <Link
                                to="/login"
                                className="text-[#000080] font-bold underline text-sm"
                            >
                                Login
                            </Link>

                        </div>

                    </form>
                </div>

                {/* Status Bar */}
                <div className="border-t-2 border-gray-500 px-2 py-1 text-xs text-black">
                    Chat App v1.0
                </div>

            </div>
        </div>
    );
};