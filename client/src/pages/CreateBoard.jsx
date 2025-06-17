import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Lock, Globe, Image, FileText } from 'lucide-react';

const CreateBoard = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: 'private',
        template: 'blank'
    });

    const templates = [
        {
            id: 'blank',
            name: 'Blank Canvas',
            icon: <FileText className="w-6 h-6" />,
            description: 'Start with a clean slate'
        },
        {
            id: 'meeting',
            name: 'Meeting Notes',
            icon: <Users className="w-6 h-6" />,
            description: 'Perfect for team meetings'
        },
        {
            id: 'brainstorm',
            name: 'Brainstorming',
            icon: <Image className="w-6 h-6" />,
            description: 'Ideal for creative sessions'
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Add API call to create board
        console.log('Creating board:', formData);
        // For now, just navigate to the dashboard
        navigate('/home');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Whiteboard</h1>
                <p className="text-gray-600">Start collaborating with your team</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Board Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Enter board title"
                        required
                    />
                </div>

                {/* Description Input */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Describe your whiteboard"
                        rows={3}
                    />
                </div>

                {/* Visibility Options */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visibility
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, visibility: 'private' })}
                            className={`flex items-center gap-2 p-4 border rounded-lg transition-all ${formData.visibility === 'private'
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-indigo-200'
                                }`}
                        >
                            <Lock className="w-5 h-5" />
                            <div className="text-left">
                                <span className="block font-medium">Private</span>
                                <span className="text-sm text-gray-500">Only you can access</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, visibility: 'public' })}
                            className={`flex items-center gap-2 p-4 border rounded-lg transition-all ${formData.visibility === 'public'
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-indigo-200'
                                }`}
                        >
                            <Globe className="w-5 h-5" />
                            <div className="text-left">
                                <span className="block font-medium">Public</span>
                                <span className="text-sm text-gray-500">Anyone with the link</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Template Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose Template
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, template: template.id })}
                                className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${formData.template === template.id
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-indigo-200'
                                    }`}
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                    {template.icon}
                                </div>
                                <span className="font-medium">{template.name}</span>
                                <span className="text-sm text-gray-500 text-center">{template.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create Board
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBoard; 