import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, X, FileText, Image as ImageIcon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Registration } from '../types';

interface InvitationCardProps {
  registration: Registration;
  onClose: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({ registration, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadAsPNG = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `SPIRIT2k26_Invitation_${registration.registrationId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download PNG', err);
    }
  };

  const downloadAsPDF = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SPIRIT2k26_Invitation_${registration.registrationId}.pdf`);
    } catch (err) {
      console.error('Failed to download PDF', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <div className="w-full flex justify-end mb-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Invitation Card */}
        <div
          ref={cardRef}
          className="w-full aspect-[3/4.5] bg-[#0a0a0a] rounded-[2rem] border-2 border-neon-blue/30 p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.15)]"
        >
          {/* Background Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl -ml-16 -mb-16" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-2xl font-black tracking-tighter flex items-center justify-center space-x-1 mb-1">
              <span className="text-neon-blue">SPIRIT</span>
              <span className="text-white">2k26</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              Department of Information Technology
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Participant Info */}
          <div className="space-y-6 mb-8">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Official Participant</div>
              <div className="text-2xl font-bold neon-text-blue">{registration.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Registration ID</div>
                {registration.registrationId ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-neon-purple font-bold"
                  >
                    {registration.registrationId}
                  </motion.div>
                ) : (
                  <div className="h-5 w-24 bg-white/5 rounded animate-pulse border border-white/10" />
                )}
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Gender</div>
                <div className="text-white/80">{registration.gender}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">College</div>
                <div className="text-white/80 line-clamp-1">{registration.college}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[9px] uppercase tracking-widest text-white/30 mb-0.5">Department</div>
                <div className="text-white/80">{registration.department} ({registration.year} Year)</div>
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-widest text-white/30 mb-2">Registered Events</div>
              <div className="flex flex-wrap gap-1.5">
                {registration.events.map((event, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/60">
                    {event}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Event Details Footer */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between mb-8">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                <span className="text-[10px] font-bold text-white/80">MARCH 10, 2026</span>
              </div>
              <div className="text-[9px] text-white/40 uppercase tracking-wider">Main Auditorium, JJCET</div>
            </div>
            <div className="bg-white p-1.5 rounded-lg min-w-[60px] min-h-[60px] flex items-center justify-center">
              {registration.registrationId ? (
                <QRCodeSVG
                  value={registration.registrationId || registration.email}
                  size={48}
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <div className="w-12 h-12 bg-black/5 rounded animate-pulse" />
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black">
              Official Participant – SPIRIT 2k26
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="mt-8 flex space-x-4 w-full">
          <button
            onClick={downloadAsPNG}
            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/80 font-bold"
          >
            <ImageIcon size={18} />
            <span>PNG</span>
          </button>
          <button
            onClick={downloadAsPDF}
            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-neon-blue text-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all font-bold"
          >
            <FileText size={18} />
            <span>PDF</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
