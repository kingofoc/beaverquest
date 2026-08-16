'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, SUB_CATEGORIES_BY_CATEGORY, TOKEN_TO_USDT, Category } from '@/lib/constants';

type CountryOption = { country: string; count: number };

export default function PublishGig() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);

  useEffect(() => {
    fetch('/api/country')
    .then((res) => res.json())
    .then((data) => setCountries(data.countries ?? []))
    .catch((err) => console.error('Error loading countries:', err))
  }, []);

  const [form, setForm] = useState({
    category: '' as Category | '',
    subCategory: '',
    title: '',
    description: '',
    guidelines: '',
    countries: [] as string[],
    max: '',
    url: '',
    verificationType: 'manual' as 'manual' | 'telegram',
    verificationTarget: '',
  });

  const availableSubCategories = form.category ? SUB_CATEGORIES_BY_CATEGORY[form.category] : [];

  const selectedSubCategory = availableSubCategories.find((sc) => sc.label === form.subCategory);
  const reward = selectedSubCategory?.reward ?? 0;
  const maxNum = Number(form.max) || 0;
  const totalCost = reward * maxNum;

  // Reset subCategory whenever category changes, since old selection may not apply
  function handleCategoryChange(category: Category) {
    setForm((prev) => ({ ...prev, category, subCategory: '' }));
  }

  function toggleCountry(country: string) {
    setForm((prev) => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter((c) => c !== country)
        : [...prev.countries, country],
    }));
  }

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);

    if (!form.category || !form.subCategory || !form.title || !form.description || !form.guidelines || !form.countries || !maxNum) {
      setError('Fill in every field before publishing.');
      return;
    }

    if (form.verificationType === 'telegram' && !form.verificationTarget) {
      setError('Add the channel or bot username your task checks.');
      return;
    }

    setLoading(true);

    try {
      const userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publisherId: userId,
          category: form.category,
          subCategory: form.subCategory,
          title: form.title,
          description: form.description,
          guidelines: form.guidelines,
          country: form.countries,
          reward,
          max: maxNum,
          url: form.url || undefined,
          verificationType: form.verificationType,
          verificationConfig:
            form.verificationType === 'telegram'
              ? { action: 'join_channel', target: form.verificationTarget }
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again.');
        setLoading(false);
        return;
      }

      router.push('/publish/success');
    } catch (err) {
      console.error('Error publishing gig:', err);
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customize Your Gig</h1>
        <p className="text-sm mt-1 hint-color">
          Set what you need done and how much it pays.
        </p>
      </div>
      
      <hr className="border-0 h-0.5 gradient-bg rounded-lg divide-dashed"/>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
        <Field label="Choose Gig Type">
          <select
            value={form.category}
            onChange={(e) => handleCategoryChange(e.target.value as Category)}
            className="input outline-0 rounded-lg px-2 py-4 primary-bg appearance-none"
          >
            <option value="">Select type</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="tertiary-bg textiary-text-color">{c}</option>
            ))}
          </select>
        </Field>
          

        {form.category && availableSubCategories.length > 0 && (
          <Field label="Choose Gig Action">
            <select
              value={form.subCategory}
              onChange={(e) => update('subCategory', e.target.value)}
              className="input outline-0 rounded-lg px-2 py-4 primary-bg appearance-none"
            >
              <option value="">Select action</option>
              {availableSubCategories.map((sc) => (
                <option key={sc.label} value={sc.label}>{sc.label}</option>
              ))}
            </select>
          </Field>
        )}

        {form.category && availableSubCategories.length === 0 && (
          <p className="text-sm hint-color">
            This gig action is not available yet.
          </p>
        )}

        <Field label="Name Your Gig">
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="ex: Follow GigsGram on X"
            maxLength={40}
            className="input outline-0 primary-bg text-color rounded-lg px-2 py-4"
          />
        </Field>

        <Field label="Describe Your Platform">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="ex: GigsGram - a telegram mini app where you can browse gigs, publish gigs, watch ads and earn rewards"
            rows={4}
            className="input resize-none outline-0 px-2 py-4 rounded-lg primary-bg"
          />
        </Field>

        <Field label="Gig Guidelines" hint="">
          <textarea
            value={form.guidelines}
            onChange={(e) => update('guidelines', e.target.value)}
            placeholder="ex: Go to our X page, follow us on X, submit your X account link to confirm you completed the task"
            rows={4}
            className="input resize-none outline-0 px-2 py-4 rounded-lg primary-bg"
          />
        </Field>

        <Field label="Target Countries" hint="Leave empty for everyone">
          <div className="flex flex-wrap gap-2">
            {countries.map(({ country, count }) => {
              const selected = form.countries.includes(country);
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => toggleCountry(country)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5" ${selected ? 'tertiary-bg tertiary-text-color' : 'primary-bg text-color'}`}
                >
                  <span className="text-sm">{country} - {count}</span>
                </button>
              );
            })}
          </div>
          {form.countries.length > 0 && (
            <p className="text-xs mt-1 hint-color">
              {form.countries.length} selected · {countries
                .filter((c) => form.countries.includes(c.country))
                .reduce((sum, c) => sum + c.count, 0)
                .toLocaleString()} potential clicks
            </p>
          )}
        </Field>

        <Field label="Enter Gig Link" hint="Channel, bot, or destination URL">
          <input
            type="url"
            value={form.url}
            onChange={(e) => update('url', e.target.value)}
            placeholder="https://x.com/gigsgram"
            className="input outline-0 primary-bg rounded-lg px-2 py-4"
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          {selectedSubCategory && (
            <Field label="Reward Per Click">
              <p className="primary-bg rounded-lg px-2 py-4 text-lg font-medium w-full">{reward} points <span className="ml-2 font-normal hint-color text-sm">≈ ${(reward * TOKEN_TO_USDT).toFixed(2)}</span></p>
            </Field>
          )}

          <Field label="Number of Clicks">
            <input
              type="number"
              min="500"
              value={form.max}
              onChange={(e) => update('max', e.target.value)}
              placeholder="500"
              className="outline-0 primary-bg rounded-lg px-2 py-4"
            />
          </Field>
        </div>

        <Field label="Verification Type">
          <div className="flex gap-2">
            <VerificationOption
              active={form.verificationType === 'manual'}
              onClick={() => update('verificationType', 'manual')}
              label="I'll Review Proof"
            />
            <VerificationOption
              active={form.verificationType === 'telegram'}
              onClick={() => update('verificationType', 'telegram')}
              label="Auto-verify Telegram"
            />
          </div>
        </Field>

        {form.verificationType === 'telegram' && (
          <Field label="Channel or Bot Username">
            <input
              type="text"
              value={form.verificationTarget}
              onChange={(e) => update('verificationTarget', e.target.value)}
              placeholder="@gigsgram"
              className="input outline-0 rounded-lg primary-bg px-2 py-4"
            />
          </Field>
        )}

        <Field label="Total Cost">
          <div className="flex justify-between items-center px-2 py-4 rounded-lg primary-bg">
            <p className="text-lg font-bold">{totalCost.toLocaleString()} tokens</p>
            <p className="text-xs text-right hint-color">
            {reward || 0} × {maxNum || 500} slots
          </p>
          </div>
        </Field>

        {error && (
          <p className="text-sm text-center destructive-color">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full py-3 font-bold text-center mt-1 disabled:opacity-50"
          style={{ backgroundColor: 'var(--tg-button-color)', color: 'var(--tg-button-text-color)' }}
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>

        <p className="text-xs text-center hint-color">
          Your gig goes live after a quick review, usually within a few hours.
        </p>
      </form>
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

function VerificationOption({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-xl py-2.5 text-sm font-medium text-center transition-all"
      style={{
        backgroundColor: active ? 'var(--tg-button-color)' : 'var(--tg-secondary-bg-color)',
        color: active ? 'var(--tg-button-text-color)' : 'var(--tg-text-color)',
      }}
    >
      {label}
    </button>
  );
}