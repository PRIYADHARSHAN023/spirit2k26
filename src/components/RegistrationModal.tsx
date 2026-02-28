import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, CreditCard, Upload, Smartphone, ArrowRight, ArrowLeft, MessageCircle, FileText, Cpu } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { EVENTS, Registration } from '../types';
import confetti from 'canvas-confetti';
import { InvitationCard } from './InvitationCard';
import { QRCodeSVG } from 'qrcode.react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: string;
}

const STEPS = [
  { id: 'type', title: 'Registration Type' },
  { id: 'details', title: 'Personal Details' },
  { id: 'events', title: 'Event Selection' },
  { id: 'payment', title: 'Payment' },
  { id: 'upload', title: 'Verification' }
];

const REGISTRATION_FEE = 200;
const UPI_ID = "prakashpriya43739@okhdfcbank";

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, initialEvent }) => {
  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm({
    defaultValues: {
      regType: 'Individual',
      teamName: '',
      teamMembers: '1',
      name: '',
      college: '',
      department: '',
      year: '1',
      gender: 'Male',
      phone: '',
      email: '',
      events: initialEvent ? [initialEvent] : [] as string[],
      paymentScreenshot: ''
    }
  });

  React.useEffect(() => {
    if (initialEvent) {
      setValue('events', [initialEvent]);
    }
  }, [initialEvent, setValue]);

  const [currentStep, setCurrentStep] = useState(0);

  // Server Warming: Ping the health endpoint when user is on payment/upload step
  React.useEffect(() => {
    if (currentStep >= 2) {
      fetch('/api/health').catch(() => { });
    }
  }, [currentStep]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [registeredData, setRegisteredData] = useState<Registration | null>(null);
  const [showInvitation, setShowInvitation] = useState(false);
  const [hasVisitedGoogleForm, setHasVisitedGoogleForm] = useState(false);

  const GOOGLE_FORM_LINK = "https://forms.gle/GAVCvgYcmMJ3BvSq5";
  const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/CCY2fmTVixxELmvQtiDGSq";

  const regType = watch('regType');
  const selectedEvents = watch('events');

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) {
      fieldsToValidate = ['regType'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['name', 'college', 'department', 'year', 'gender', 'phone', 'email'];
      if (regType === 'Team') {
        fieldsToValidate.push('teamName', 'teamMembers');
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ['events'];
      if (selectedEvents.length === 0) {
        alert('Please select at least one event');
        return;
      }
      if (selectedEvents.length > 3) {
        alert('Maximum 3 events allowed');
        return;
      }
    } else if (currentStep === 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const handleUPIPayment = (app: string) => {
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=SPIRIT2K26&am=${REGISTRATION_FEE}&cu=INR`;
    window.open(upiUrl, '_blank');
  };

  const onSubmit = async (data: any) => {
    // Optimistic Success: Immediately show the invitation card with local data
    const optimisticData: Registration = {
      ...data,
      registrationId: '', // Will be filled once server responds
      paymentStatus: 'Processing',
      createdAt: new Date().toISOString()
    };

    setRegisteredData(optimisticData);
    setIsSuccess(true);
    setShowInvitation(true);

    // Play confetti immediately for instant feedback
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2ff', '#bc13fe', '#00ffff']
    });

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        // Update with official data (including ID)
        setRegisteredData(result.registration);
      } else {
        const err = await response.json();
        // If it fails, we should probably tell them, but they are already on the success screen
        // Better to show a "Registration Error" inline or revert
        console.error('Registration failed', err);
        alert(`Registration failed: ${err.error}${err.details ? '\nDetails: ' + err.details : ''}`);
        setIsSuccess(false);
        setShowInvitation(false);
      }

    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setShowInvitation(false);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass w-full max-w-4xl rounded-[2rem] overflow-hidden relative flex flex-col max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>

            {isSuccess ? (
              <div className="p-12 text-center flex-1 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-neon-blue rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,242,255,0.4)]"
                >
                  <Check size={48} className="text-black" />
                </motion.div>
                <h2 className="text-4xl font-bold mb-4">Registration Successful!</h2>
                <p className="text-white/60 text-xl mb-12">Welcome to SPIRIT 2k26!</p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <a
                    href={WHATSAPP_GROUP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all font-bold"
                  >
                    <MessageCircle size={20} />
                    <span>Join WhatsApp Group</span>
                  </a>
                  <button
                    onClick={() => setShowInvitation(true)}
                    className="flex-1 flex items-center justify-center space-x-2 py-4 bg-neon-blue text-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all font-bold"
                  >
                    <FileText size={20} />
                    <span>Get Your Invitation</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="mt-8 text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                {/* Progress Header */}
                <div className="p-8 border-b border-white/10 bg-white/5">
                  <div className="flex justify-between items-center max-w-2xl mx-auto">
                    {STEPS.map((step, idx) => (
                      <div key={step.id} className="flex flex-col items-center relative flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${idx <= currentStep ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'bg-white/10 text-white/40'
                          }`}>
                          {idx < currentStep ? <Check size={20} /> : idx + 1}
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest mt-2 font-medium ${idx <= currentStep ? 'text-neon-blue' : 'text-white/20'
                          }`}>
                          {step.title}
                        </span>
                        {idx < STEPS.length - 1 && (
                          <div className={`absolute top-5 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-px transition-all duration-500 ${idx < currentStep ? 'bg-neon-blue' : 'bg-white/10'
                            }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
                    {currentStep === 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                      >
                        <div className="text-center mb-10">
                          <h3 className="text-3xl font-bold mb-2">Join the Future</h3>
                          <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Select Your Participation Mode</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <label className={`relative group cursor-pointer p-8 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${regType === 'Individual' ? 'bg-neon-blue/10 border-neon-blue shadow-[0_0_30px_rgba(0,242,255,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                            <input type="radio" {...register('regType')} value="Individual" className="hidden" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                              <div className={`p-4 rounded-2xl mb-6 transition-all duration-500 ${regType === 'Individual' ? 'bg-neon-blue text-black' : 'bg-white/10 text-white'}`}>
                                <Check size={24} />
                              </div>
                              <h4 className="text-xl font-bold mb-2">Individual</h4>
                              <p className="text-xs text-white/40 leading-relaxed uppercase tracking-wider font-medium">Standard entry for single participants</p>
                            </div>
                            {regType === 'Individual' && (
                              <motion.div layoutId="glow" className="absolute inset-0 bg-neon-blue/5 blur-3xl rounded-full" />
                            )}
                          </label>

                          <label className={`relative group cursor-pointer p-8 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${regType === 'Team' ? 'bg-neon-purple/10 border-neon-purple shadow-[0_0_30px_rgba(188,19,254,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                            <input type="radio" {...register('regType')} value="Team" className="hidden" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                              <div className={`p-4 rounded-2xl mb-6 transition-all duration-500 ${regType === 'Team' ? 'bg-neon-purple text-black' : 'bg-white/10 text-white'}`}>
                                <Cpu size={24} />
                              </div>
                              <h4 className="text-xl font-bold mb-2">Team Participation</h4>
                              <p className="text-xs text-white/40 leading-relaxed uppercase tracking-wider font-medium">Collaborate with your squad (Max 4)</p>
                            </div>
                            {regType === 'Team' && (
                              <motion.div layoutId="glow" className="absolute inset-0 bg-neon-purple/5 blur-3xl rounded-full" />
                            )}
                          </label>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-bold">{regType === 'Team' ? 'Squad Information' : 'Personal Details'}</h3>
                          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] uppercase tracking-widest text-neon-blue font-bold">
                            {regType} Account
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {regType === 'Team' && (
                            <>
                              <div className="space-y-2 md:col-span-1">
                                <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">Team / Squad Name</label>
                                <input {...register('teamName', { required: regType === 'Team' })} className="w-full glass-input" placeholder="Cyber Warriors" />
                              </div>
                              <div className="space-y-2 md:col-span-1">
                                <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">Team Members (1-4)</label>
                                <select {...register('teamMembers', { required: regType === 'Team' })} className="w-full glass-input">
                                  <option value="1">1 Member</option>
                                  <option value="2">2 Members</option>
                                  <option value="3">3 Members</option>
                                  <option value="4">4 Members</option>
                                </select>
                              </div>
                            </>
                          )}
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">Full Name {regType === 'Team' && '(Lead)'}</label>
                            <input {...register('name', { required: true })} className="w-full glass-input" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">College Name</label>
                            <input {...register('college', { required: true })} className="w-full glass-input" placeholder="XYZ College" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">Department</label>
                            <input {...register('department', { required: true })} className="w-full glass-input" placeholder="Information Technology" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">Year of Study</label>
                            <input
                              {...register('year', { required: true })}
                              className="w-full glass-input"
                              placeholder="e.g. 1st Year or 2026"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">Gender</label>
                            <select {...register('gender', { required: true })} className="w-full glass-input">
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">Phone Number</label>
                            <input {...register('phone', { required: true, pattern: /^[0-9]{10}$/ })} className="w-full glass-input" placeholder="9876543210" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-white/60 uppercase tracking-widest text-[9px]">Email ID</label>
                            <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} className="w-full glass-input" placeholder="john@example.com" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-between items-end mb-6">
                          <h3 className="text-2xl font-bold">Select Events</h3>
                          <span className={`text-sm font-mono ${selectedEvents.length > 0 && selectedEvents.length <= 3 ? 'text-neon-blue' : 'text-red-400'}`}>
                            {selectedEvents.length} / 3 Selected
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {EVENTS.map((event) => {
                            const isSelected = selectedEvents.includes(event.name);
                            const isDisabled = !isSelected && selectedEvents.length >= 3;
                            return (
                              <label key={event.id} className={`flex items-center p-4 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-neon-blue/10 border-neon-blue' : 'bg-white/5 border-white/10 hover:bg-white/10'
                                } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                <input
                                  type="checkbox"
                                  value={event.name}
                                  disabled={isDisabled}
                                  {...register('events', { validate: v => v.length >= 1 && v.length <= 3 })}
                                  className="hidden"
                                />
                                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-neon-blue border-neon-blue' : 'border-white/20'
                                  }`}>
                                  {isSelected && <Check size={14} className="text-black" />}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-bold">{event.name}</div>
                                  <div className="text-[10px] text-white/40 uppercase tracking-tighter">{event.category}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                        {selectedEvents.length === 0 && (
                          <p className="text-red-400 text-xs mt-4">Selection of at least one event is mandatory.</p>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 text-center"
                      >
                        <h3 className="text-2xl font-bold">Payment Integration</h3>
                        <div className="glass p-8 rounded-3xl inline-block mx-auto border-neon-blue/20">
                          <div className="text-4xl font-bold text-white mb-2">₹200</div>
                          <div className="text-white/40 text-sm mb-6">Registration Fee</div>

                          <div className="bg-white p-4 rounded-2xl mb-6 inline-block">
                            <img
                              src="/assets/payment-qr.jpg"
                              alt="Payment QR"
                              className="w-40 h-40 object-contain"
                            />
                          </div>

                          <div className="text-neon-blue font-mono text-sm mb-8">{UPI_ID}</div>

                          <div className="grid grid-cols-2 gap-3">
                            {['Google Pay', 'PhonePe', 'Paytm', 'Other UPI'].map(app => (
                              <button
                                key={app}
                                type="button"
                                onClick={() => handleUPIPayment(app)}
                                className="flex items-center justify-center space-x-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-xs font-medium"
                              >
                                <Smartphone size={14} />
                                <span>{app}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="text-white/40 text-sm max-w-md mx-auto">
                          Scan the QR or click on any UPI app to pay. After successful payment, take a screenshot and proceed to the next step.
                        </p>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6 text-center"
                      >
                        <div className="w-20 h-20 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Upload className="text-neon-blue" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold">Submit Your Payment</h3>

                        <div className="max-w-md mx-auto space-y-4">
                          <p className="text-white/60 text-sm">
                            Please upload your payment screenshot to our official verification form.
                            This is required to confirm your registration.
                          </p>

                          <a
                            href={GOOGLE_FORM_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setHasVisitedGoogleForm(true)}
                            className="flex items-center justify-center space-x-3 w-full py-4 bg-white/5 border border-white/20 rounded-2xl hover:bg-white/10 hover:border-neon-blue transition-all group"
                          >
                            <FileText className="text-neon-blue group-hover:scale-110 transition-transform" size={20} />
                            <span className="font-bold">Open Payment Form</span>
                            <ArrowRight size={16} className="text-white/40" />
                          </a>

                          <div className="p-4 bg-neon-blue/5 border border-neon-blue/20 rounded-2xl">
                            <p className="text-[10px] text-neon-blue uppercase tracking-widest font-bold">Important</p>
                            <p className="text-xs text-white/40 mt-1">
                              After submitting the Google Form, come back here and click "Complete Registration" to get your invitation card.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-12 flex justify-between items-center">
                      {currentStep > 0 ? (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex items-center space-x-2 px-6 py-3 text-white/60 hover:text-white transition-colors"
                        >
                          <ArrowLeft size={18} />
                          <span>Back</span>
                        </button>
                      ) : <div />}

                      {currentStep < STEPS.length - 1 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="btn-primary flex items-center space-x-2"
                        >
                          <span>Next Step</span>
                          <ArrowRight size={18} />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting || !hasVisitedGoogleForm}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>Complete Registration</span>
                              <Check size={18} />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {showInvitation && registeredData && (
          <InvitationCard
            registration={registeredData}
            onClose={() => setShowInvitation(false)}
          />
        )}
      </AnimatePresence>


    </AnimatePresence>
  );
};
