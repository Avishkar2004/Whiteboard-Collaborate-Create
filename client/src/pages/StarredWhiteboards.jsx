import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Globe, Lock } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useWhiteboardStore from '../store/whiteboardStore';


const StarredWhiteboards = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const {
        starredBoards,
        loading,
        error,
        fetchStarredBoards,
    } = useWhiteboardStore();

    useEffect(() => {
        if (token) {
            fetchStarredBoards(token);
        }
    }, [token, fetchStarredBoards]);



    if (loading) return <p>Loading starred boards...</p>;
    if (error) return <p>Error: {error}</p>;

    if (!Array.isArray(starredBoards) || starredBoards.length === 0) {
        return (
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-900">No starred whiteboards</h3>
                <p className="mt-1 text-sm text-gray-500">Star some boards to see them here!</p>
            </Motion.div>
        );
    }

    return (
        <Motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
        >
            {starredBoards.map((board) => (
                <Motion.div
                    key={board._id}
                    layout
                    onClick={() => navigate(`/whiteboard/${board._id}`)}
                    className="group bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-all duration-300"
                >
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 mb-2">
                            {board.name}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span className='text-sm text-gray-600'>by {user?.username || "You"}</span>
                            {board.isPublic ? (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                    <Globe className="h-3 w-3" /> Public
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                    <Lock className="h-3 w-3" /> Private
                                </span>
                            )}
                        </div>
                        <div className="mt-2 text-xs text-gray-400">
                            {new Date(board.lastModified).toLocaleDateString()}
                        </div>
                    </div>
                </Motion.div>
            ))
            }
        </Motion.div >
    );
};

export default StarredWhiteboards;