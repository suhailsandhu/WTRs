import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Flame, MapPin, CheckCircle2, ArrowRight, Apple, Mail, Phone, ShieldCheck } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboarded, completeOnboarding, setUser, simulateLocation } = useApp();
  const [step, setStep] = useState<number>(1);
  const [authMode, setAuthMode] = useState<'SELECT' | 'EMAIL' | 'PHONE'>('SELECT');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isOnboarded) return null;

  const handleAppleAuth = async () => {
    setLoading(true);
    try {
      const res = await api.login({ provider: 'apple', email: 'apple.hooper@icloud.com', username: 'apple_baller' });
      setUser(res.user);
      localStorage.setItem('wtr_user_id', res.user.id);
      completeOnboarding();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const res = await api.login({ provider: 'google', email: 'sandhu.suhail@gmail.com', username: 'suhail_s' });
      setUser(res.user);
      localStorage.setItem('wtr_user_id', res.user.id);
      completeOnboarding();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await api.login({ provider: 'email', email, username });
      setUser(res.user);
      localStorage.setItem('wtr_user_id', res.user.id);
      completeOnboarding();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      const res = await api.login({ provider: 'phone', phone, username });
      setUser(res.user);
      localStorage.setItem('wtr_user_id', res.user.id);
      completeOnboarding();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          simulateLocation('REAL');
          setStep(3);
        },
        () => {
          // Fallback to Sacramento default
          simulateLocation('MIDTOWN');
          setStep(3);
        }
      );
    } else {
      setStep(3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] text-white flex flex-col justify-between p-6 sm:p-8 animate-in fade-in select-none">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black italic tracking-tighter uppercase font-display text-white">
            WTR
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">
            SACRAMENTO
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(idx => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === step ? 'w-6 bg-[#FF5722]' : idx < step ? 'w-2.5 bg-white' : 'w-2.5 bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Body */}
      <div className="max-w-sm mx-auto w-full my-auto py-6">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl">
              <Flame size={36} />
            </div>

            <div className="space-y-3">
              <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.9] font-display">
                WHERE'S <br />
                THE RUNS?
              </h2>
              <p className="text-base text-zinc-400 font-medium leading-normal pt-2">
                The instant pickup basketball radar. Open WTR and know exactly where games are active right now across Greater Sacramento.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-black italic uppercase tracking-widest text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>NEXT</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-[#FF5722] rounded-2xl flex items-center justify-center shadow-xl">
              <MapPin size={32} />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">
                LOCATION DISCOVERY
              </span>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.95] font-display">
                NEARBY COURT RECOGNITION
              </h2>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed pt-1">
                WTR prioritizes active runs closest to you. When you reach a gym like 24 Hour Fitness Downtown or Natomas, WTR detects your presence.
              </p>
            </div>

            <div className="pt-4 space-y-2.5">
              <button
                onClick={handleLocationPermission}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-black italic uppercase tracking-widest text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                ENABLE LOCATION ACCESS
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 text-zinc-500 hover:text-white font-bold uppercase tracking-wider text-xs"
              >
                Use Sacramento Default Location
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-white rounded-2xl flex items-center justify-center shadow-xl">
              <CheckCircle2 size={32} className="text-[#FF5722]" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">
                ZERO GUESSWORK
              </span>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.95] font-display">
                ONLY REAL RUNS COUNT
              </h2>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed pt-1">
                Being inside a fitness center is not a run. Arriving users confirm if they are actually hooping, giving everyone authentic numbers before driving over.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(4)}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-black italic uppercase tracking-widest text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>NEXT</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-white rounded-2xl flex items-center justify-center shadow-xl">
              <ShieldCheck size={32} />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">
                PRE-RUN SIGNALS
              </span>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.95] font-display">
                HEADING THERE & SCHEDULED RUNS
              </h2>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed pt-1">
                Tap <strong>Heading There</strong> to start a 25-minute ETA countdown so others know games are forming. Join or organize planned pickup runs anytime.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setStep(5)}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 font-black italic uppercase tracking-widest text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>CREATE ACCOUNT</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5722]">
                STEP 5 OF 5
              </span>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-tight font-display mt-1">
                JOIN WTR SACRAMENTO
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Create a free hooper profile to access live court runs and friends' activity.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg">
                {error}
              </div>
            )}

            {authMode === 'SELECT' && (
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAppleAuth}
                  disabled={loading}
                  className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Apple size={18} />
                  <span>CONTINUE WITH APPLE</span>
                </button>

                <button
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-3.5 bg-[#17171a] hover:bg-zinc-800 border border-zinc-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                </button>

                <button
                  onClick={() => setAuthMode('PHONE')}
                  className="w-full py-3.5 bg-[#17171a] hover:bg-zinc-800 border border-zinc-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Phone size={16} />
                  <span>CONTINUE WITH PHONE NUMBER</span>
                </button>

                <button
                  onClick={() => setAuthMode('EMAIL')}
                  className="w-full py-3.5 bg-[#17171a] hover:bg-zinc-800 border border-zinc-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Mail size={16} />
                  <span>EMAIL & USERNAME</span>
                </button>
              </div>
            )}

            {authMode === 'EMAIL' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="baller@sacramento.com"
                    className="w-full bg-[#17171a] border border-zinc-700 rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                    CHOOSE HOOPER HANDLE / TAG
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. midtown_chef (No real name needed)"
                    className="w-full bg-[#17171a] border border-zinc-700 rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('SELECT')}
                    className="py-3 px-4 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
                  >
                    {loading ? 'Creating...' : 'Enter WTR'}
                  </button>
                </div>
              </form>
            )}

            {authMode === 'PHONE' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(916) 555-0199"
                    className="w-full bg-[#17171a] border border-zinc-700 rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                    CHOOSE HOOPER HANDLE / TAG
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. sac_shooter (No real name needed)"
                    className="w-full bg-[#17171a] border border-zinc-700 rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('SELECT')}
                    className="py-3 px-4 bg-zinc-800 text-zinc-400 text-xs font-bold uppercase rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-wider rounded-lg transition-colors"
                  >
                    {loading ? 'Verifying...' : 'Verify & Enter'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center">
        <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">
          WTR — WHERE’S THE RUNS? · SACRAMENTO HOOPERS
        </p>
      </div>
    </div>
  );
};
