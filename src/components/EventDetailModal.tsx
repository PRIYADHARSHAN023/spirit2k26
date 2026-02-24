import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Users, FileText, Phone, Award, MapPin, User, ListChecks, Calendar } from 'lucide-react';
import { Event } from '../types';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  const isPaperPresentation = event.id === 'paper-pres';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: isPaperPresentation ? -90 : 0 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: isPaperPresentation ? 90 : 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className={`relative w-full max-w-2xl rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar ${
              isPaperPresentation ? 'bg-[#f5f5f0] text-black shadow-[0_0_50px_rgba(255,255,255,0.1)]' : 'glass text-white'
            }`}
          >
            <button
              onClick={onClose}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors z-10 ${
                isPaperPresentation ? 'hover:bg-black/5 text-black/40' : 'hover:bg-white/10 text-white/40'
              }`}
            >
              <X size={24} />
            </button>

            <div className="p-8 md:p-12">
              <div className="mb-8">
                <span className={`text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full ${
                  isPaperPresentation ? 'bg-black/5 text-black/60' : 'bg-neon-blue/10 text-neon-blue'
                }`}>
                  {event.category} Event
                </span>
                <h2 className={`text-4xl md:text-5xl font-bold mt-4 ${
                  isPaperPresentation ? 'font-serif' : 'neon-text-blue'
                }`}>
                  {event.name}
                </h2>
                <p className={`mt-4 text-lg ${isPaperPresentation ? 'text-black/60' : 'text-white/60'}`}>
                  {event.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {event.details.venue && (
                    <div className="flex items-start space-x-3">
                      <MapPin className={isPaperPresentation ? 'text-black/40' : 'text-neon-blue'} size={20} />
                      <div>
                        <div className={`text-xs uppercase font-bold ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Venue</div>
                        <div className="font-medium">{event.details.venue}</div>
                      </div>
                    </div>
                  )}
                  {event.details.timeSlot && (
                    <div className="flex items-start space-x-3">
                      <Clock className={isPaperPresentation ? 'text-black/40' : 'text-neon-blue'} size={20} />
                      <div>
                        <div className={`text-xs uppercase font-bold ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Time Slot</div>
                        <div className="font-medium">{event.details.timeSlot}</div>
                      </div>
                    </div>
                  )}
                  {event.details.date && (
                    <div className="flex items-start space-x-3">
                      <Calendar className={isPaperPresentation ? 'text-black/40' : 'text-neon-blue'} size={20} />
                      <div>
                        <div className={`text-xs uppercase font-bold ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Date</div>
                        <div className="font-medium">{event.details.date}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start space-x-3">
                    <Users className={isPaperPresentation ? 'text-black/40' : 'text-neon-blue'} size={20} />
                    <div>
                      <div className={`text-xs uppercase font-bold ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Team Size / Type</div>
                      <div className="font-medium">{event.details.teamSize} {event.details.type && `(${event.details.type})`}</div>
                    </div>
                  </div>
                  {event.details.handler && (
                    <div className="flex items-start space-x-3">
                      <User className={isPaperPresentation ? 'text-black/40' : 'text-neon-blue'} size={20} />
                      <div>
                        <div className={`text-xs uppercase font-bold ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Event Handler</div>
                        <div className="font-medium">{event.details.handler}</div>
                      </div>
                    </div>
                  )}
                  {event.details.timing && (
                    <div className="flex items-start space-x-3">
                      <Clock className={isPaperPresentation ? 'text-black/40' : 'text-neon-blue'} size={20} />
                      <div>
                        <div className={`text-xs uppercase font-bold ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Duration / Timing</div>
                        <div className="font-medium">{event.details.timing}</div>
                      </div>
                    </div>
                  )}
                  {event.details.selection && (
                    <div className="flex items-start space-x-3">
                      <Award className={isPaperPresentation ? 'text-black/40' : 'text-neon-blue'} size={20} />
                      <div>
                        <div className={`text-xs uppercase font-bold ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Selection Criteria</div>
                        <div className="font-medium">{event.details.selection}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {event.details.rounds && (
                    <div>
                      <div className={`text-xs uppercase font-bold mb-2 ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Rounds</div>
                      <ul className="space-y-2">
                        {event.details.rounds.map((round, i) => (
                          <li key={i} className="text-sm flex items-start space-x-2">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isPaperPresentation ? 'bg-black/20' : 'bg-neon-blue'}`} />
                            <span>{round}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {event.details.rules && (
                    <div>
                      <div className={`text-xs uppercase font-bold mb-2 ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Rules</div>
                      <ul className="space-y-1">
                        {event.details.rules.map((rule, i) => (
                          <li key={i} className="text-sm flex items-start space-x-2">
                            <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${isPaperPresentation ? 'bg-black/20' : 'bg-neon-blue'}`} />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {event.details.requirements && (
                    <div>
                      <div className={`text-xs uppercase font-bold mb-2 ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Requirements</div>
                      <ul className="space-y-1">
                        {event.details.requirements.map((req, i) => (
                          <li key={i} className="text-sm flex items-center space-x-2">
                            <span className={`w-1 h-1 rounded-full ${isPaperPresentation ? 'bg-black/20' : 'bg-neon-blue'}`} />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-2xl ${isPaperPresentation ? 'bg-black/5' : 'bg-white/5'}`}>
                    <div className={`text-xs uppercase font-bold mb-2 ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>Contact Person</div>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{event.details.contact.name}</div>
                      <a href={`tel:${event.details.contact.phone}`} className={`flex items-center space-x-1 text-sm ${isPaperPresentation ? 'text-black' : 'text-neon-blue'}`}>
                        <Phone size={14} />
                        <span>{event.details.contact.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <p className={`text-center text-sm ${isPaperPresentation ? 'text-black/40' : 'text-white/40'}`}>
                  Click "Final Registration" at the bottom of the events section to sign up.
                </p>
              </div>
            </div>
            
            {isPaperPresentation && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
