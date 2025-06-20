import { Users, Clock, Star, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Pencil className="w-8 h-8 text-indigo-600" />,
    title: 'Real-Time Collaboration',
    desc: 'Work together with your team on whiteboards in real time, from anywhere.'
  },
  {
    icon: <Users className="w-8 h-8 text-purple-600" />,
    title: 'Easy Sharing',
    desc: 'Invite others and share boards instantly with a simple link.'
  },
  {
    icon: <Clock className="w-8 h-8 text-emerald-600" />,
    title: 'Autosave & History',
    desc: 'Never lose your work. All changes are saved automatically with version history.'
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: 'Beautiful & Intuitive UI',
    desc: 'Enjoy a modern, clean, and responsive interface designed for productivity.'
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const Features = () => (
  <motion.section
    className="max-w-5xl mx-auto py-16 px-4 text-center"
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
  >
    <motion.h2
      className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      Features
    </motion.h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
      {features.map((f, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-xl transition-shadow"
          variants={item}
        >
          {f.icon}
          <h3 className="mt-4 text-xl font-semibold text-gray-800">{f.title}</h3>
          <p className="mt-2 text-gray-500">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default Features; 