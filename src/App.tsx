import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ParticleBackground } from './components/ParticleBackground';
import { EventCard } from './components/EventCard';
import { RegistrationModal } from './components/RegistrationModal';
import { AdminPanel } from './components/AdminPanel';
import { EventDetailModal } from './components/EventDetailModal';
import { Timeline } from './components/Timeline';
import { Event, EVENTS } from './types';
import {
  Cpu,
  Gamepad2,
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Clock,
  Zap
} from 'lucide-react';
import Countdown from 'react-countdown';

export default function App() {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openRegistration = (eventName?: string) => {
    setSelectedEvent(eventName);
    setIsRegModalOpen(true);
  };

  const openDetails = (event: Event) => {
    setDetailEvent(event);
    setIsDetailOpen(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Event date: March 10, 2026
  const eventDate = new Date('2026-03-10T09:00:00');

  const categories = [
    { name: 'Technical Events', icon: <Cpu className="text-neon-blue" />, type: 'Technical' },
    { name: 'Non-Technical Events', icon: <Gamepad2 className="text-neon-purple" />, type: 'Non-Technical' },
    { name: 'Online Events', icon: <Globe className="text-neon-cyan" />, type: 'Online' },
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-neon-blue selection:text-black bg-[#050505]">
      <ParticleBackground />

      <div className={`transition-all duration-500 ${isDetailOpen || isRegModalOpen ? 'blur-md scale-[0.98] pointer-events-none' : ''}`}>
        {/* Navbar */}
        <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'glass py-4' : 'py-6'}`}>
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold tracking-tighter flex items-center space-x-2"
            >
              <span className="text-neon-blue">SPIRIT</span>
              <span className="text-white">2k26</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/70">
              {['Home', 'About', 'Events', 'Timeline', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="hover:text-neon-blue transition-colors"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => openRegistration()}
                className="px-6 py-2 rounded-full bg-neon-blue text-black font-bold hover:shadow-[0_0_20px_rgba(0,242,255,0.6)] transition-all animate-pulse-slow"
              >
                Register Now
              </button>
            </div>

            {/* Mobile Register Button */}
            <button
              onClick={() => openRegistration()}
              className="md:hidden p-2 rounded-full bg-neon-blue text-black"
            >
              <Zap size={20} />
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8 flex flex-col items-center space-y-4"
            >
              <div className="h-24 md:h-32 flex items-center justify-center">
                <img
                  src="/assets/college-logo.png"
                  alt="College Logo"
                  className="h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'text-3xl font-bold neon-text-blue text-center';
                      fallback.innerText = 'JJ COLLEGE OF ENGINEERING AND TECHNOLOGY';
                      parent.appendChild(fallback);
                    }
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="h-10 md:h-14 flex items-center justify-center">
                <img
                  src="input_file_1.png"
                  alt="Accreditations"
                  className="h-full object-contain opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-neon-blue font-mono tracking-[0.3em] uppercase text-sm mb-4"
            >
              Department of Information Technology Presents
            </motion.p>

            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">SPIRIT</span>
              <span className="text-neon-blue drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">2k26</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 font-light">
              Ignite The Innovation Within You
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollTo('events')}
                className="btn-primary"
              >
                Explore Events
              </button>
              <button
                onClick={() => scrollTo('about')}
                className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 glass p-8 rounded-3xl flex flex-col items-center"
          >
            <div className="flex items-center space-x-2 text-neon-purple mb-4">
              <Clock size={20} />
              <span className="text-sm font-mono uppercase tracking-widest">Countdown to Ignition</span>
            </div>
            <Countdown
              date={eventDate}
              renderer={({ days, hours, minutes, seconds }) => (
                <div className="flex space-x-4 md:space-x-8">
                  {[
                    { label: 'Days', value: days },
                    { label: 'Hours', value: hours },
                    { label: 'Mins', value: minutes },
                    { label: 'Secs', value: seconds },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center">
                      <span className="text-3xl md:text-5xl font-bold text-white">{String(item.value).padStart(2, '0')}</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 cursor-pointer"
            onClick={() => scrollTo('about')}
          >
            <ChevronDown className="text-white/20" size={32} />
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                About <span className="neon-text-blue">SPIRIT</span>
              </h2>
              <div className="space-y-6 text-white/60 leading-relaxed text-lg">
                <p>
                  SPIRIT 2k26 is the flagship national-level technical symposium organized by the Department of Information Technology. It serves as a nexus for the brightest minds to converge, compete, and collaborate.
                </p>
                <p>
                  Our mission is to foster innovation and provide a platform for students to showcase their technical prowess and creative thinking through a diverse range of events.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="glass p-4 rounded-2xl">
                    <div className="text-3xl font-bold text-neon-blue mb-1">12+</div>
                    <div className="text-xs uppercase tracking-wider text-white/40">Events</div>
                  </div>
                  <div className="glass p-4 rounded-2xl">
                    <div className="text-3xl font-bold text-neon-purple mb-1">500+</div>
                    <div className="text-xs uppercase tracking-wider text-white/40">Participants</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden glass p-2">
                <img
                  src="https://picsum.photos/seed/tech/800/800"
                  alt="Tech Symposium"
                  className="w-full h-full object-cover rounded-2xl opacity-50"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-neon-blue/20 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-48 h-48 bg-neon-purple/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">The <span className="neon-text-blue">Arena</span></h2>
              <p className="text-white/40 uppercase tracking-[0.3em] text-sm">Choose Your Battleground</p>
            </div>

            {categories.map((cat) => (
              <div key={cat.name} className="mb-20 last:mb-0">
                <div className="flex items-center space-x-4 mb-10">
                  <div className="p-3 glass rounded-xl">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">{cat.name}</h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {EVENTS.filter(e => e.category === cat.type).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={openDetails}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Final Registration Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 text-center"
            >
              <div className="glass p-12 rounded-[3rem] border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-3xl font-bold mb-4 relative z-10">Ready to Ignite the Innovation?</h3>
                <p className="text-white/40 mb-8 relative z-10">Join 500+ participants in the ultimate tech symposium.</p>
                <button
                  onClick={() => setIsRegModalOpen(true)}
                  className="btn-primary px-12 py-5 text-xl relative z-10 hover:scale-105 transition-transform"
                >
                  Final Registration
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="py-24 bg-[#050505]">
          <Timeline />
        </section>

        {/* Agenda Section */}
        <section id="agenda" className="py-24 px-6 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">SPIRIT 2K26 <span className="neon-text-blue">Agenda</span></h2>
              <p className="text-white/40 uppercase tracking-widest text-sm">March 10, 2026 — Save the Date</p>
            </div>

            <div className="glass rounded-3xl overflow-hidden border-white/5">
              <div className="grid grid-cols-1 divide-y divide-white/5">
                {[
                  { time: '08:30 – 11:00', event: 'Spot Registration' },
                  { time: '09:45 – 10:00', event: 'Photo Session' },
                  { time: '10:00 – 11:00', event: 'Inauguration' },
                  { time: '11:00 – 11:10', event: 'Tea Break' },
                  { time: '11:10 – 01:00', event: 'Morning Events' },
                  { time: '01:00 – 02:00', event: 'Lunch' },
                  { time: '02:00 – 03:30', event: 'Afternoon Events' },
                  { time: '03:45 – 04:45', event: 'Valedictory' },
                  { time: '04:45 – 05:00', event: 'Wind Up' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group">
                    <div className="text-neon-blue font-mono text-lg mb-2 sm:mb-0 group-hover:neon-text-blue transition-all">
                      {item.time}
                    </div>
                    <div className="text-xl font-bold text-white/80 group-hover:text-white transition-colors">
                      {item.event}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="glass rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] -mr-48 -mt-48" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
              <div>
                <h2 className="text-4xl font-bold mb-8">Get in <span className="neon-text-blue">Touch</span></h2>
                <p className="text-white/60 mb-10 text-lg">
                  Have questions? Our team is here to help you navigate through the innovation journey.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: <Phone size={20} />, label: 'P.Kiruba sri', value: '8072418528', href: 'tel:+918072418528' },
                    { icon: <Phone size={20} />, label: 'R.chandhru', value: '8870595506', href: 'tel:+918870595506' },
                    { icon: <Mail size={20} />, label: 'Email', value: 'spirit2k26official@gmail.com', href: 'mailto:spirit2k26official@gmail.com' },
                    { icon: <MapPin size={20} />, label: 'Location', value: 'J.J.College of engineering and technology', href: 'https://share.google/79UHTlel1F5r6Vll2' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.label === 'Location' ? '_blank' : undefined}
                      rel={item.label === 'Location' ? 'noopener noreferrer' : undefined}
                      className="flex items-start space-x-4 group/item"
                    >
                      <div className="p-3 bg-white/5 rounded-xl text-neon-blue group-hover/item:bg-neon-blue group-hover/item:text-black transition-all">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-white/40 mb-1">{item.label}</div>
                        <div className="text-white/80 group-hover/item:text-white transition-colors">{item.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="glass p-8 rounded-3xl border-neon-blue/20">
                  <h3 className="text-xl font-bold mb-6">Follow the Journey</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.instagram.com/tech_._spirit?igsh=MXFpNXd2OXZmNGprYQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 rounded-2xl hover:bg-neon-blue hover:text-black transition-all duration-300"
                    >
                      <Instagram size={24} />
                    </a>
                  </div>
                  <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-sm text-white/60 italic">
                      "Innovation distinguishes between a leader and a follower."
                    </p>
                    <p className="text-xs text-neon-blue mt-2 font-mono">— Steve Jobs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-white/40 text-sm">
              © 2026 SPIRIT 2k26 IT Department. All rights reserved.
            </div>

            <div className="flex items-center space-x-8">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-white/20 hover:text-neon-purple text-xs uppercase tracking-widest transition-colors"
              >
                Admin Login
              </button>
              <div className="flex space-x-6">
                <a
                  href="https://www.instagram.com/tech_._spirit?igsh=MXFpNXd2OXZmNGprYQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals - Outside the blurred container */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        initialEvent={selectedEvent}
      />

      <EventDetailModal
        event={detailEvent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
