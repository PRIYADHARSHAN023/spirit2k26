import React from 'react';
import { motion } from 'motion/react';
import { EVENTS } from '../types';
import { cn } from '../lib/utils';

interface EventCardProps {
  event: typeof EVENTS[0];
  onClick: (event: typeof EVENTS[0]) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onClick(event)}
      className="glass p-6 rounded-2xl group relative overflow-hidden transition-all duration-500 hover:neon-border cursor-pointer"
    >
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl group-hover:bg-neon-blue/20 transition-all duration-500" />
      
      <h3 className="text-xl font-bold mb-2 group-hover:neon-text-blue transition-all duration-300">
        {event.name}
      </h3>
      <p className="text-white/60 text-sm mb-6 min-h-[40px]">
        {event.description}
      </p>
      
      <div className="flex space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(event);
          }}
          className="w-full py-2 rounded-lg border border-neon-blue/30 text-neon-blue text-sm font-semibold hover:bg-neon-blue hover:text-black transition-all duration-300"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};
