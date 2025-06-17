import { Link } from 'react-router-dom';
import { Pencil, Users, Clock, Share2, ArrowRight } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Pencil className="w-6 h-6" />,
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time, no matter where you are.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team Management',
      description: 'Invite team members, assign roles, and manage permissions easily.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Version History',
      description: 'Track changes and revert to previous versions whenever needed.'
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Easy Sharing',
      description: 'Share your whiteboards with anyone using secure links.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Collaborate & Create with{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Whiteboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The ultimate collaborative whiteboard platform for teams. Draw, write, and work together in real-time.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to collaborate
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help your team work together effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start collaborating?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of teams already using Whiteboard
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing; 