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
    <div className="min-h-screen pb-32" style={{ backgroundColor: 'var(--tg-bg-color)', color: 'var(--tg-text-color)' }}>
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold">Publish a task</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--tg-hint-color)' }}>
          Set what you need done and how much it pays.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 flex flex-col gap-5">
        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => handleCategoryChange(e.target.value as Category)}
            className="input"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        {form.category && availableSubCategories.length > 0 && (
          <Field label="What should hunters do?">
            <select
              value={form.subCategory}
              onChange={(e) => update('subCategory', e.target.value)}
              className="input"
            >
              <option value="">Select an action</option>
              {availableSubCategories.map((sc) => (
                <option key={sc.label} value={sc.label}>{sc.label}</option>
              ))}
            </select>
          </Field>
        )}

        {form.category && availableSubCategories.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--tg-hint-color)' }}>
            This category is not available yet.
          </p>
        )}

        <Field label="Title">
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Join our Telegram channel"
            maxLength={80}
            className="input"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What does the hunter need to do?"
            rows={3}
            className="input resize-none"
          />
        </Field>

        <Field label="Guidelines" hint="What counts as valid proof">
          <textarea
            value={form.guidelines}
            onChange={(e) => update('guidelines', e.target.value)}
            placeholder="Submit a screenshot showing you joined"
            rows={3}
            className="input resize-none"
          />
        </Field>

        <Field label="Countries" hint="Leave empty for everyone">
          <div className="flex flex-wrap gap-2">
            {countries.map(({ country, count }) => {
              const selected = form.countries.includes(country);
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => toggleCountry(country)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5"
                  style={{
                    backgroundColor: selected ? 'var(--tg-button-color)' : 'var(--tg-secondary-bg-color)',
                    color: selected ? 'var(--tg-button-text-color)' : 'var(--tg-text-color)',
                  }}
                >
                  {country}
                  <span className="text-sm">{count}</span>
                </button>
              );
            })}
          </div>
          {form.countries.length > 0 && (
            <p className="text-xs mt-1" style={{ color: 'var(--tg-hint-color)' }}>
              {form.countries.length} selected · {countries
                .filter((c) => form.countries.includes(c.country))
                .reduce((sum, c) => sum + c.count, 0)
                .toLocaleString()} potential hunters
            </p>
          )}
        </Field>

        <Field label="Link" hint="Optional - channel, bot, or destination URL">
          <input
            type="url"
            value={form.url}
            onChange={(e) => update('url', e.target.value)}
            placeholder="https://t.me/yourchannel"
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          {selectedSubCategory && (
            <div
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{ backgroundColor: 'var(--tg-secondary-bg-color)' }}
            >
              <div>
                <p className="text-sm" style={{ color: 'var(--tg-hint-color)' }}>Reward per completion</p>
                <p className="text-lg font-bold">{reward} points</p>
              </div>
              <p className="text-sm" style={{ color: 'var(--tg-hint-color)' }}>
                ≈ ${(reward * TOKEN_TO_USDT).toFixed(2)}
              </p>
            </div>
          )}

          <Field label="Slots" hint="max completions">
            <input
              type="number"
              min="500"
              value={form.max}
              onChange={(e) => update('max', e.target.value)}
              placeholder="500"
              className=""
            />
          </Field>
        </div>

        <Field label="Verification">
          <div className="flex gap-2">
            <VerificationOption
              active={form.verificationType === 'manual'}
              onClick={() => update('verificationType', 'manual')}
              label="I'll review proof"
            />
            <VerificationOption
              active={form.verificationType === 'telegram'}
              onClick={() => update('verificationType', 'telegram')}
              label="Auto-verify Telegram"
            />
          </div>
        </Field>

        {form.verificationType === 'telegram' && (
          <Field label="Channel or bot username">
            <input
              type="text"
              value={form.verificationTarget}
              onChange={(e) => update('verificationTarget', e.target.value)}
              placeholder="@yourchannel"
              className="input"
            />
          </Field>
        )}

        <div
          className="rounded-2xl p-4 flex items-center justify-between mt-2"
          style={{ backgroundColor: 'var(--tg-secondary-bg-color)' }}
        >
          <div>
            <p className="text-sm" style={{ color: 'var(--tg-hint-color)' }}>Total cost</p>
            <p className="text-lg font-bold">{totalCost.toLocaleString()} tokens</p>
          </div>
          <p className="text-xs text-right" style={{ color: 'var(--tg-hint-color)' }}>
            {reward || 0} × {maxNum || 0} slots
          </p>
        </div>

        {error && (
          <p className="text-sm text-center" style={{ color: 'var(--tg-destructive-text-color, #ec3942)' }}>
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

        <p className="text-xs text-center" style={{ color: 'var(--tg-hint-color)' }}>
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
        {hint && <span className="font-normal ml-1.5" style={{ color: 'var(--tg-hint-color)' }}>· {hint}</span>}
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