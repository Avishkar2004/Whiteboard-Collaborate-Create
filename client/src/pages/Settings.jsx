import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User as UserIcon, Mail, Image, Lock, Trash2 } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        username: user?.username || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar' && files && files[0]) {
            setForm((prev) => ({ ...prev, avatar: files[0] }));
            setAvatarPreview(URL.createObjectURL(files[0]));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-8 px-2 sm:px-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-left">Settings</h2>
                {/* Profile Section */}
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="relative mb-2 sm:mb-0">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="avatar preview"
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 shadow"
                                />
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-500 border-2 border-gray-200 shadow">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 cursor-pointer shadow hover:bg-indigo-700 transition-colors border-2 border-white">
                                <Image className="w-4 h-4" />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div className="text-center sm:text-left">
                            <div className="font-semibold text-base sm:text-lg text-gray-800">{user?.username}</div>
                            <div className="text-gray-500 text-xs sm:text-sm">{user?.email}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-2 sm:mt-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-base bg-gray-50"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-base bg-gray-50"
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 my-6 sm:my-8"></div>
                {/* Password Section */}
                <div className="mb-8">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-indigo-400" /> Change Password
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                        <input
                            type="password"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            placeholder="Current Password"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-base bg-gray-50"
                            disabled
                        />
                        <input
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            placeholder="New Password"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-base bg-gray-50"
                            disabled
                        />
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={form.confirmNewPassword}
                            onChange={handleChange}
                            placeholder="Confirm New Password"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-base bg-gray-50"
                            disabled
                        />
                    </div>
                </div>
                {/* Save Button */}
                <div className="flex justify-end mb-8">
                    <button
                        className="px-6 sm:px-7 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-colors opacity-60 cursor-not-allowed text-sm sm:text-base"
                        disabled
                    >
                        Save Changes
                    </button>
                </div>
                {/* Danger Zone */}
                <div className="border-t border-gray-200 pt-6 sm:pt-8">
                    <h3 className="text-sm sm:text-base font-semibold text-red-600 mb-3 sm:mb-4 flex items-center gap-2">
                        <Trash2 className="w-5 h-5" /> Danger Zone
                    </h3>
                    <button
                        className="px-5 sm:px-6 py-2 rounded-md bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition-colors opacity-60 cursor-not-allowed text-sm sm:text-base"
                        disabled
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings; 