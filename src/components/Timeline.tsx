import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  FileText, 
  Code, 
  Puzzle, 
  Rocket, 
  Layout, 
  UserCheck, 
  Smile, 
  MapPin
} from 'lucide-react';

const timelineData = [
  { time: 'Full Day', event: 'Paper Presentation', venue: 'Seminar Hall 1', icon: <FileText /> },
  { time: '11:10 – 12:10', event: 'Bug Buster', venue: 'Infozone', icon: <Code /> },
  { time: '11:10 – 12:10', event: 'Web Design', venue: 'Work Station', icon: <Layout /> },
  { time: '11:10 – 12:10', event: 'Blind Drawing', venue: 'Class Room', icon: <Puzzle /> },
  { time: '12:00 – 1:00', event: 'Startup', venue: 'Work Station', icon: <Rocket /> },
  { time: '12:00 – 1:00', event: 'Prompt Prodigy', venue: 'Infozone', icon: <Code /> },
  { time: '12:00 – 1:00', event: 'Connection', venue: 'Class Room', icon: <Puzzle /> },
  { time: '02:00 – 03:00', event: 'Stress Interview', venue: 'Class Room', icon: <UserCheck /> },
  { time: '02:00 – 03:00', event: 'Emoji Story', venue: 'Class Room', icon: <Smile /> },
];

export const Timeline: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Event <span className="neon-text-purple">Timeline</span></h2>
        <p className="text-white/40 uppercase tracking-widest text-sm">Follow the Pulse of SPIRIT 2k26</p>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-neon-cyan opacity-30" />

        <div className="space-y-12">
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex items-center ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex-row`}
            >
              {/* Icon Circle */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full glass border-neon-purple/50 flex items-center justify-center z-10 bg-[#050505]">
                <div className="text-neon-purple scale-75">
                  {item.icon}
                </div>
              </div>

              {/* Content Card */}
              <div className={`ml-12 md:ml-0 w-full md:w-[45%] ${
                index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
              }`}>
                <div className="glass p-6 rounded-2xl hover:neon-border transition-all duration-300 group">
                  <div className="text-neon-blue font-mono text-sm mb-1 group-hover:neon-text-blue transition-all">
                    {item.time}
                  </div>
                  <h4 className="text-lg font-bold text-white/90 mb-2">
                    {item.event}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-white/40 group-hover:text-white/60 transition-colors justify-start md:justify-end group-even:md:justify-start">
                    <MapPin size={12} className="text-neon-purple" />
                    <span>{item.venue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
