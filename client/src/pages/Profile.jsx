import { Mail, User as UserIcon, Hash } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function stringToColor(str) {
    // Simple hash to color
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        color += ('00' + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
    }
    return color;
}

const Profile = () => {
    const { user } = useAuth();
    if (!user) return <div className="flex justify-center items-center h-64">Loading...</div>;

    // Avatar logic
    const initials = user.username
        ? user.username.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';
    const avatarColor = stringToColor(user.username || 'User');

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-8 px-2 sm:px-4">
            <div className="relative w-full max-w-md sm:max-w-lg">
                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/70 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-10 flex flex-col items-center transition-transform duration-300">
                    {/* Avatar with Glow and Badge */}
                    <div className="relative mb-4 sm:mb-6">
                        <div
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl sm:text-6xl font-extrabold shadow-lg border-4 border-white ring-4 ring-indigo-300/60 bg-white/80"
                            style={{ background: avatarColor, color: '#fff', boxShadow: `0 0 32px 0 ${avatarColor}55` }}
                        >
                            {initials}
                        </div>
                        {/* Badge/accent */}
                        <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 border-2 border-white flex items-center justify-center shadow-md">
                            <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-1 sm:mb-2 tracking-tight text-center drop-shadow-sm">
                        {user.username}
                    </h2>
                    <div className="w-full flex flex-col gap-3 sm:gap-5 mt-4 sm:mt-6">
                        <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-base sm:text-lg">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                            <span className="font-semibold">Email:</span>
                            <span className="ml-1 text-gray-600 font-medium break-all">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-gray-700 text-base sm:text-lg">
                            <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                            <span className="font-semibold">User ID:</span>
                            <span className="ml-1 text-gray-600 font-medium break-all">{user.id}</span>
                        </div>
                    </div>
                    <div className="w-full border-t border-gray-200 my-6 sm:my-10"></div>
                    <div className="text-center text-xs sm:text-sm text-gray-400">This is your personal profile. More features coming soon!</div>
                </div>
                {/* Decorative Glow */}
                <div className="absolute -inset-2 rounded-2xl sm:rounded-3xl pointer-events-none z-[-1] bg-gradient-to-tr from-indigo-300/30 via-pink-200/20 to-purple-300/30 blur-2xl opacity-80"></div>
            </div>
        </div>
    );
};

export default Profile;
