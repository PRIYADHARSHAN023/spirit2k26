import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, X, FileText, Image as ImageIcon, Share2 } from 'lucide-react';
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
      const node = cardRef.current;
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 3,
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
          margin: '0'
        }
      });
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
      const node = cardRef.current;
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 3,
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
          margin: '0'
        }
      });
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

  const shareInvitation = async () => {
    if (cardRef.current === null) return;
    try {
      const node = cardRef.current;
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 3,
        width: node.offsetWidth,
        height: node.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
          margin: '0'
        }
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `SPIRIT2k26_Invitation.png`, { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'SPIRIT 2k26 Invitation',
          text: `Hey! I just registered for SPIRIT 2k26. Join me there!`,
          files: [file]
        });
      } else {
        await downloadAsPNG();
      }
    } catch (err) {
      console.error('Failed to share', err);
      if (err instanceof Error && err.name !== 'AbortError') {
        await downloadAsPNG();
      }
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
          <div className="flex flex-col items-center mb-6">
            <img
              src="/assets/college-logo.png"
              alt="College Logo"
              className="h-12 object-contain mb-4"
            />
            <div className="text-[9px] uppercase tracking-[0.1em] text-white/60 font-medium mb-1">
              Department of Information Technology
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-neon-blue font-black mb-4">
              Presents
            </div>
            <div className="text-3xl font-black tracking-tighter flex items-center justify-center space-x-1">
              <span className="text-neon-blue">SPIRIT</span>
              <span className="text-white">2k26</span>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Participant Info */}
          <div className="space-y-6 mb-8">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
                {registration.regType === 'Team' ? `Team: ${registration.teamName}` : 'Official Participant'}
              </div>
              <div className={`font-bold neon-text-blue leading-tight ${registration.regType === 'Team' ? 'text-xl' : 'text-2xl'}`}>
                {registration.name}
              </div>
              {registration.regType === 'Team' && registration.memberNames && registration.memberNames.filter(n => n.trim() !== '').length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
                  {registration.memberNames.filter(n => n.trim() !== '').map((member, idx) => (
                    <span key={idx} className="text-sm text-white/60 font-medium">
                      {member}
                    </span>
                  ))}
                </div>
              )}
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
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                <span className="text-[10px] font-bold text-white/80">MARCH 10, 2026</span>
              </div>
              <div className="text-[9px] text-white/40 uppercase tracking-wider">Main Auditorium, JJCET</div>
            </div>
            <div className="bg-white p-1 rounded-xl w-24 h-24 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <img
                src="/assets/college-qr.jpg"
                alt="College Address"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black">
              Official Participant – SPIRIT 2k26
            </div>
          </div>
        </div>

        {/* Download & Share Buttons */}
        <div className="mt-8 grid grid-cols-3 gap-3 w-full">
          <button
            onClick={downloadAsPNG}
            className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/80"
          >
            <ImageIcon size={20} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">PNG</span>
          </button>
          <button
            onClick={downloadAsPDF}
            className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/80"
          >
            <FileText size={20} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
          </button>
          <button
            onClick={shareInvitation}
            className="flex flex-col items-center justify-center p-3 bg-neon-blue text-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"
          >
            <Share2 size={20} className="mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Share</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
