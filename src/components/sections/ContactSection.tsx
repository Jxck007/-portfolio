import React, { useState, useRef, useEffect } from 'react';
import PixelCard from '../ui/PixelCard';
import { SiGithub } from 'react-icons/si';
import { Mail, Linkedin, ArrowRight, Copy, Check, Send, CheckCircle2 } from 'lucide-react';
import type { RefObject } from 'react';

interface ContactSectionProps {
  sectionRef: RefObject<HTMLElement | null>;
  copiedEmail: boolean;
  onCopyEmail: () => void;
}

export default function ContactSection({ sectionRef, copiedEmail, onCopyEmail }: ContactSectionProps) {
  // Direct Mail Form States
  const [senderEmail, setSenderEmail] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailMessage, setMailMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderEmail || !mailMessage) return;

    const subjectText = encodeURIComponent(mailSubject || 'Engineering Inquiry from Portfolio');
    const bodyText = encodeURIComponent(
      `From: ${senderEmail}\n\nMessage:\n${mailMessage}\n\n---\nSent via Jack Nandakumar Portfolio Contact Form`
    );

    window.location.href = `mailto:jdnk007@gmail.com?subject=${subjectText}&body=${bodyText}`;
    setFormSubmitted(true);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setFormSubmitted(false);
      setSenderEmail('');
      setMailSubject('');
      setMailMessage('');
    }, 4000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="space-y-6 pt-6 text-left"
    >
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
            GET IN TOUCH DIRECTLY
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
            DIRECT MAIL & NETWORKS
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-[10px] font-mono text-zinc-200 w-fit">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>jdnk007@gmail.com</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Direct Mail Form with PixelCard Dispatch Button */}
        <div className="md:col-span-7 bg-zinc-950 border border-zinc-700 rounded-xl p-5 sm:p-6 shadow-2xl space-y-4">
          <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-white" />
            Send a Direct Message
          </h3>
          <p className="text-xs font-sans text-zinc-400">
            Fill out the details below to dispatch an engineering or collaboration inquiry directly to Jack.
          </p>

          {formSubmitted ? (
            <div className="p-5 rounded-lg bg-zinc-900 border border-zinc-600 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-white mx-auto animate-bounce" />
              <h4 className="font-mono text-sm font-bold text-white">Opening Email Client...</h4>
              <p className="text-xs text-zinc-300">
                Your message has been formatted and triggered. Thank you for getting in touch!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMail} className="space-y-3.5">
              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 tracking-wider mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 tracking-wider mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  placeholder="Engineering / Backend Collaboration"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 tracking-wider mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={mailMessage}
                  onChange={(e) => setMailMessage(e.target.value)}
                  placeholder="Describe your requirements, timeline, or engineering role..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              {/* Dispatch Direct Message Button with PixelCard Effect */}
              <PixelCard variant="monochrome" className="w-full h-auto rounded-xl border border-zinc-700 overflow-hidden">
                <button
                  type="submit"
                  className="cursor-target w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01]"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>DISPATCH DIRECT MESSAGE</span>
                </button>
              </PixelCard>
            </form>
          )}
        </div>

        {/* Right: Quick Copy and Verified Social Profile Pixel Cards */}
        <div className="md:col-span-5 space-y-4">
          {/* Quick Copy Email Card */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
              Direct Email Contact
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-700">
              <span className="font-mono text-xs text-white">jdnk007@gmail.com</span>
              <button
                onClick={onCopyEmail}
                className="cursor-target px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-mono flex items-center gap-1 transition-all"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Verified Profile Pixel Cards */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
              Verified Profile Buttons
            </span>

            <div className="space-y-3">
              <PixelCard variant="default" className="w-full h-auto rounded-xl border border-zinc-800 hover:border-zinc-500 transition-colors">
                <a
                  href="https://github.com/Jxck007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target flex items-center justify-between p-3 w-full transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white text-base inline-flex"><SiGithub /></span>
                    <div className="text-left">
                      <span className="font-mono text-xs font-bold text-white block">GitHub Profile</span>
                      <span className="text-[10px] font-mono text-zinc-400">@Jxck007</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </a>
              </PixelCard>

              <PixelCard variant="blue" className="w-full h-auto rounded-xl border border-zinc-800 hover:border-zinc-500 transition-colors">
                <a
                  href="https://www.linkedin.com/in/jegadeesh-nandakumar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-target flex items-center justify-between p-3 w-full transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Linkedin className="text-white w-4 h-4" />
                    <div className="text-left">
                      <span className="font-mono text-xs font-bold text-white block">LinkedIn Network</span>
                      <span className="text-[10px] font-mono text-zinc-400">Jegadeesh Nandakumar</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </a>
              </PixelCard>

              <PixelCard variant="yellow" className="w-full h-auto rounded-xl border border-zinc-800 hover:border-zinc-500 transition-colors">
                <button
                  onClick={onCopyEmail}
                  className="cursor-target flex items-center justify-between p-3 w-full transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="text-white w-4 h-4" />
                    <div className="text-left">
                      <span className="font-mono text-xs font-bold text-white block">Direct Mail</span>
                      <span className="text-[10px] font-mono text-zinc-400">jdnk007@gmail.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white">
                    {copiedEmail ? 'Copied!' : 'Copy Email'}
                  </span>
                </button>
              </PixelCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
