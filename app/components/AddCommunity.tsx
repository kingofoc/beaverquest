'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { ChannelType } from '@/lib/constants';

const BOT_USERNAME = 'beaverquestbot'; // replace with your actual bot username

export default function AddCommunity() {
  const router = useRouter();
  const { user } = useUser();

  const [step, setStep] = useState<'info' | 'forward' | 'verifying'>('info');
  const [form, setForm] = useState({ 
    name: '', 
    channelType: '' as ChannelType | '', 
    description: '', 
    iconUrl: '' 
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Give your community a name.');
      return;
    }

    setStep('forward');
  }

  function openBot() {
    window?.Telegram?.WebApp?.openTelegramLink(`https://t.me/${BOT_USERNAME}`);
  }

  async function handleVerify() {
    setError(null);
    setLoading(true);
    setStep('verifying');

    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: user?.userId,
          channelType: form.channelType,
          name: form.name,
          description: form.description || undefined,
          iconUrl: form.iconUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Verification failed. Try again.');
        setStep('forward');
        setLoading(false);
        return;
      }

      router.push(`/community/${data.community._id}`);
    } catch (err) {
      console.error('Error verifying community:', err);
      setError('Something went wrong. Try again.');
      setStep('forward');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Your Community</h1>
        <p className="text-sm mt-1 hint-color">
          Turn your channel into a community and earn from every gig your members complete.
        </p>
      </div>

      <hr className="border-0 h-0.5 gradient-bg rounded-lg" />

      {step === 'info' && (
        <form onSubmit={handleContinue} className="flex flex-col gap-6 mt-6">
          <Field label="Community Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="ex: GigsGram Announcements"
              maxLength={40}
              className="input outline-0 primary-bg rounded-lg px-2 py-4"
            />
          </Field>

          <Field label="Community Type">
            <select
              value={form.channelType}
              onChange={(e) => update('channelType', e.target.value)}
              className="input outline-0 primary-bg rounded-lg px-2 py-4 appearance-none"
            >
              <option value="">Channel Type</option>
            </select>
          </Field>

          <Field label="Description" hint="Optional">
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="What's your channel about?"
              rows={3}
              className="input resize-none outline-0 primary-bg rounded-lg px-2 py-4"
            />
          </Field>

          {error && <p className="text-sm text-center destructive-color">{error}</p>}

          <button
            type="submit"
            className="rounded-full py-3 font-bold text-center mt-1"
            style={{ backgroundColor: 'var(--tg-button-color)', color: 'var(--tg-button-text-color)' }}
          >
            Continue
          </button>
        </form>
      )}

      {step === 'forward' && (
        <div className="flex flex-col gap-6 mt-6">
          <div className="primary-bg rounded-2xl p-5 flex flex-col gap-4">
            <span>Complete this step below to verify your channel.</span>
            <StepRow number={1} text={`Add @${BOT_USERNAME} as an admin, with permission to send messages and see members`} />
            <StepRow number={2} text="Then forward any message from your channel to the bot" />
          </div>

          <button
            type="button"
            onClick={openBot}
            className="rounded-full py-3 font-bold text-center"
            style={{ backgroundColor: 'var(--tg-button-color)', color: 'var(--tg-button-text-color)' }}
          >
            Open Bot
          </button>

          {error && <p className="text-sm text-center destructive-color">{error}</p>}

          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            className="rounded-full py-3 font-bold text-center primary-bg disabled:opacity-50"
          >
            {loading ? 'Verifying...' : "I've forwarded it — verify now"}
          </button>

          <button
            type="button"
            onClick={() => setStep('info')}
            className="text-sm text-center hint-color"
          >
            Back
          </button>
        </div>
      )}

      {step === 'verifying' && (
        <div className="flex flex-col items-center justify-center mt-16 gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'var(--tg-secondary-bg-color)',
              borderTopColor: 'var(--tg-button-color)',
            }}
          />
          <p className="text-sm hint-color">Checking your channel...</p>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">
        {label}
        {hint && <span className="font-normal ml-1.5 hint-color">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function StepRow({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: 'var(--tg-button-color)', color: 'var(--tg-button-text-color)' }}
      >
        {number}
      </div>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}