import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Star, Clock, Users, LayoutGrid } from 'lucide-react';

const YourDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Whiteboards', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'shared', label: 'Shared with Me', icon: <Users className="w-5 h-5" /> },
    { id: 'recent', label: 'Recent', icon: <Clock className="w-5 h-5" /> },
    { id: 'starred', label: 'Starred', icon: <Star className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Whiteboards Dashboard</h1>
        <Link
          to="/create-board"
          className="px-4 py-2 bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 group"
        >
          <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span>New Whiteboard</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/50 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Whiteboard Cards - Replace with actual data */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Link
            key={item}
            to={`/whiteboard/${item}`}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100"></div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                Whiteboard {item}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Last edited 2 hours ago</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600">
                  A
                </div>
                <span className="text-sm text-gray-600">You</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default YourDashboard; 