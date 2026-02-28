import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Download,
  Trash2,
  Lock,
  Users,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Eye,
  Calendar,
  IndianRupee,
  Filter,
  LogOut,
  FileText
} from 'lucide-react';
import { Registration, EVENTS } from '../types';
import { InvitationCard } from './InvitationCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = ['#00f2ff', '#bc13fe', '#00ffff', '#ff4e00', '#00FF00'];

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [selectedRegForInvitation, setSelectedRegForInvitation] = useState<Registration | null>(null);
  const [adminRole, setAdminRole] = useState<string>('ALL');

  const fetchRegistrations = async (role: string = adminRole) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/registrations?role=${role}`);
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setAdminRole(data.role);
        fetchRegistrations(data.role);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [isRegistering, setIsRegistering] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: adminEmail, password }),
      });
      if (response.ok) {
        alert('Admin registered successfully! Please login.');
        setIsRegistering(false);
      } else {
        const err = await response.json();
        alert(err.error || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  const deleteRegistration = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry? This ID will NOT be recycled.')) return;
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchRegistrations();
      }
    } catch (error) {
      console.error(error);
    }
  };


  const exportToExcel = () => {
    const data = filteredRegistrations.map(r => ({
      'Reg ID': r.registrationId,
      Name: r.name,
      College: r.college,
      Department: r.department,
      Year: r.year,
      Gender: r.gender,
      Phone: r.phone,
      Email: r.email,
      Events: r.events.join(', '),
      Payment: r.paymentStatus,
      Date: r.created_at
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "SPIRIT_2k26_Registrations.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'pt');
    const data = filteredRegistrations.map(r => [
      r.registrationId, r.name, r.college, r.department, r.gender, r.events.join(', '), r.paymentStatus
    ]);
    (doc as any).autoTable({
      head: [['Reg ID', 'Name', 'College', 'Dept', 'Gender', 'Events', 'Payment']],
      body: data,
    });
    doc.save("SPIRIT_2k26_Registrations.pdf");
  };

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === 'All' || r.events.includes(eventFilter);
    const matchesGender = genderFilter === 'All' || r.gender === genderFilter;
    return matchesSearch && matchesEvent && matchesGender;
  });

  // Analytics Data
  const isSuperAdmin = adminRole === 'ALL';
  const totalReg = registrations.length;
  const maleCount = registrations.filter(r => r.gender === 'Male').length;
  const femaleCount = registrations.filter(r => r.gender === 'Female').length;
  const otherCount = registrations.filter(r => r.gender === 'Other').length;
  const totalRevenue = totalReg * 200;

  const eventCounts = (isSuperAdmin ? EVENTS : EVENTS.filter(e => e.name === adminRole)).map(event => ({
    name: event.name,
    count: registrations.filter(r => r.events.includes(event.name)).length,
    suggestion: registrations.filter(r => r.events.includes(event.name)).length * 10 // 10 mins per participant
  }));

  const genderData = [
    { name: 'Male', value: maleCount },
    { name: 'Female', value: femaleCount },
    { name: 'Other', value: otherCount },
  ].filter(d => d.value > 0);

  const highestEvent = [...eventCounts].sort((a, b) => b.count - a.count)[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass w-full max-w-7xl rounded-[2.5rem] overflow-hidden relative flex flex-col max-h-[95vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={24} />
        </button>

        {!isLoggedIn ? (
          <div className="p-12 flex flex-col items-center justify-center flex-1">
            <div className="w-20 h-20 bg-neon-purple/20 rounded-3xl flex items-center justify-center mb-8 border border-neon-purple/30">
              <Lock className="text-neon-purple" size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-2">{isRegistering ? 'Admin Registration' : 'Admin Access'}</h2>
            <div className="mb-8 text-center space-y-2">
              <p className="text-white/40 text-xs">
                Super Admin Login: <span className="text-neon-blue">admin2k26</span> / <span className="text-neon-blue">admin@2k26</span>
              </p>
              <p className="text-white/40 text-xs">
                Event Handler Hint: <span className="text-neon-purple">[EventName]@2026</span> (Login ID & Password same)
              </p>
            </div>

            <form onSubmit={isRegistering ? handleAdminRegister : handleLogin} className="w-full max-w-sm space-y-4">
              <input
                type="text"
                placeholder="Username / Login ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full glass-input"
                required
              />
              {isRegistering && (
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full glass-input"
                  required
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input"
                required
              />
              <button type="submit" className="w-full btn-primary py-4">
                {isRegistering ? 'Register Admin' : 'Enter Command Center'}
              </button>
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-white/40 hover:text-white transition-colors text-xs"
              >
                {isRegistering ? 'Already have an account? Login' : 'Need to register a custom admin? Click here'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-3xl font-bold">Command Center</h2>
                  <p className="text-white/40 text-sm mt-1">
                    {adminRole === 'ALL' ? 'SPIRIT 2k26 Real-time Analytics' : `Admin: ${adminRole}`}
                  </p>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60"
                >
                  <LogOut size={20} />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={exportToExcel} className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm">
                  <Download size={16} />
                  <span>Excel</span>
                </button>
                <button onClick={exportToPDF} className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm">
                  <Download size={16} />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                {[
                  { label: 'Total Registrations', value: totalReg, icon: <Users size={20} />, color: 'neon-blue' },
                  { label: 'Male Participants', value: maleCount, icon: <Users size={20} />, color: 'neon-cyan' },
                  { label: 'Female Participants', value: femaleCount, icon: <Users size={20} />, color: 'neon-purple' },
                  { label: 'Other Gender', value: otherCount, icon: <Users size={20} />, color: 'white/40' },
                  { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: <IndianRupee size={20} />, color: 'emerald-400', superOnly: true },
                ].filter(stat => !stat.superOnly || isSuperAdmin).map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-3xl border-white/5">
                    <div className={`p-3 rounded-xl bg-white/5 text-white w-fit mb-4`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="glass p-8 rounded-[2rem] border-white/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold flex items-center space-x-2">
                      <BarChartIcon size={20} className="text-neon-blue" />
                      <span>Event Participation</span>
                    </h3>
                    {highestEvent && highestEvent.count > 0 && (
                      <div className="text-[10px] uppercase tracking-widest px-3 py-1 bg-neon-blue/10 text-neon-blue rounded-full">
                        Hot: {highestEvent.name}
                      </div>
                    )}
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventCounts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#00f2ff' }}
                        />
                        <Bar dataKey="count" fill="#00f2ff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-8 rounded-[2rem] border-white/5">
                  <h3 className="text-xl font-bold mb-8 flex items-center space-x-2">
                    <PieChartIcon size={20} className="text-neon-purple" />
                    <span>Gender Distribution</span>
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Duration Suggestions */}
              <div className="glass p-8 rounded-[2rem] border-white/5 mb-12">
                <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                  <Calendar size={20} className="text-neon-cyan" />
                  <span>Estimated Event Durations</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {eventCounts.filter(e => e.count > 0).map((e, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-sm font-bold text-white mb-1">{e.name}</div>
                      <div className="text-xs text-white/40">{e.count} Participants</div>
                      <div className="text-neon-cyan text-sm font-mono mt-2">~{e.suggestion} Minutes</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name, college, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full glass-input pl-12"
                  />
                </div>
                <div className="flex gap-4">
                  {isSuperAdmin && (
                    <div className="relative">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <select
                        value={eventFilter}
                        onChange={(e) => setEventFilter(e.target.value)}
                        className="glass-input pl-10 appearance-none pr-10"
                      >
                        <option value="All">All Events</option>
                        {EVENTS.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value)}
                      className="glass-input pl-10 appearance-none pr-10"
                    >
                      <option value="All">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="glass rounded-[2rem] overflow-hidden border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-white/40">
                        <th className="px-6 py-4">Reg ID</th>
                        <th className="px-6 py-4">Participant</th>
                        <th className="px-6 py-4">College & Dept</th>
                        <th className="px-6 py-4">Gender</th>
                        <th className="px-6 py-4">Events</th>
                        <th className="px-6 py-4">Payment</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
                              <div className="text-white/40 text-sm animate-pulse">Fetching records...</div>
                            </div>
                          </td>
                        </tr>
                      ) : filteredRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-white/20">
                            No registrations found matching your criteria.
                          </td>
                        </tr>
                      ) : filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-mono text-neon-blue font-bold text-xs">{reg.registrationId}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="font-bold text-sm">{reg.name}</div>
                              {reg.regType === 'Team' && (
                                <span className="text-[9px] px-2 py-0.5 bg-neon-purple/20 text-neon-purple border border-neon-purple/30 rounded-full font-bold uppercase tracking-widest leading-none">Team</span>
                              )}
                            </div>
                            {reg.regType === 'Team' && (
                              <div className="text-neon-purple font-mono text-[10px] mb-1">
                                {reg.teamName} ({reg.teamMembers} Members)
                              </div>
                            )}
                            <div className="text-xs text-white/40">{reg.email}</div>
                            <div className="text-[10px] text-white/20 font-mono">{reg.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">{reg.college}</div>
                            <div className="text-xs text-white/40">{reg.department} ({reg.year} Year)</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs">{reg.gender}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {reg.events.map((e, i) => (
                                <span key={i} className="text-[9px] px-2 py-0.5 bg-white/5 rounded-full border border-white/10 text-white/60">
                                  {e}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${reg.paymentStatus === 'Completed' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]' : 'bg-amber-400'}`} />
                              <span className="text-xs">{reg.paymentStatus}</span>
                              {reg.paymentScreenshot && (
                                <button
                                  onClick={() => setSelectedScreenshot(reg.paymentScreenshot)}
                                  className="p-1.5 hover:bg-white/10 rounded-lg text-neon-blue transition-colors"
                                  title="View Screenshot"
                                >
                                  <Eye size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedRegForInvitation(reg)}
                                className="p-2 text-white/20 hover:text-neon-blue hover:bg-neon-blue/10 rounded-xl transition-all"
                                title="View Invitation"
                              >
                                <FileText size={18} />
                              </button>
                              <button
                                onClick={() => deleteRegistration(reg.id!)}
                                className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                title="Delete Participant"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Screenshot Modal */}
      <AnimatePresence>
        {selectedScreenshot && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-8 bg-black/95 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                <X size={24} />
              </button>
              <img src={selectedScreenshot} className="w-full h-auto rounded-3xl shadow-2xl border border-white/10" alt="Payment Verification" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invitation Card Modal */}
      <AnimatePresence>
        {selectedRegForInvitation && (
          <InvitationCard
            registration={selectedRegForInvitation}
            onClose={() => setSelectedRegForInvitation(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .glass-input {
          @apply bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue transition-all text-white placeholder:text-white/20;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
