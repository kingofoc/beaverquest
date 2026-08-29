'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, SUB_CATEGORIES_BY_CATEGORY, TOKEN_TO_USDT, Category } from '@/lib/constants';
import { useUser } from '@/context/UserContext';
import CountryMultiSelect from './CountryMultiSelect';
import CommunityMultiSelect from './CommunityMultiSelect';

type Step = 1 | 2 | 3;

type FormState = {
  category: Category | '';
  subCategory: string;
  title: string;
  description: string;
  guidelines: string;
  countries: string[];
  communities: string[];
  max: string;
  url: string;
  verificationType: 'manual' | 'telegram';
  verificationTarget: string;
};

const EMPTY_FORM: FormState = {
  category: '',
  subCategory: '',
  title: '',
  description: '',
  guidelines: '',
  countries: [],
  communities: [],
  max: '',
  url: '',
  verificationType: 'manual',
  verificationTarget: '',
};

export default function PublishGig() {
  const router = useRouter();
  const { user } = useUser();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(true);
  const [draftPrompt, setDraftPrompt] = useState<{ formData: FormState; step: Step } | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const availableSubCategories = form.category ? SUB_CATEGORIES_BY_CATEGORY[form.category] : [];
  const selectedSubCategory = availableSubCategories.find((sc) => sc.label === form.subCategory);
  const reward = selectedSubCategory?.reward ?? 0;
  const maxNum = Number(form.max) || 0;
  const totalCost = reward * maxNum;

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

  function toggleCommunity(community: string) {
    setForm((prev) => ({
      ...prev,
      communities: prev.communities.includes(community)
        ? prev.communities.filter((c) => c !== community)
        : [...prev.communities, community],
    }));
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // --- Step validation ---
  function validateStep1(): string | null {
    if (!form.category) return 'Choose a gig type.';
    if (!form.subCategory) return 'Choose a gig action.';
    if (!form.title.trim()) return 'Name your gig.';
    if (!form.description.trim()) return 'Describe your platform.';
    if (!form.guidelines.trim()) return 'Add gig guidelines.';
    return null;
  }

  function goNext() {
    setError(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }
    }
    setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  }

  function goBack() {
    setError(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!maxNum) {
      setError('Enter the number of clicks.');
      return;
    }

    if (form.verificationType === 'telegram' && !form.verificationTarget) {
      setError('Add the channel or bot username your task checks.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publisherId: user?.userId,
          category: form.category,
          subCategory: form.subCategory,
          title: form.title,
          description: form.description,
          guidelines: form.guidelines,
          country: form.countries,
          communities: form.communities,
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

      await deleteDraft(user?.userId);
      router.push('/publish/success');
    } catch (err) {
      console.error('Error publishing gig:', err);
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  // --- Draft: load on mount ---
  useEffect(() => {
    if (!user?.userId) return;

    fetch(`/api/gigs/draft?publisherId=${user.userId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.draft) {
          // Don't auto-apply - show a prompt and let the user decide
          setDraftPrompt({
            formData: { ...EMPTY_FORM, ...data.draft.formData },
            step: (data.draft.step ?? 1) as Step,
          });
        }
      })
      .catch((err) => console.error('Error loading draft:', err))
      .finally(() => setDraftLoading(false));
  }, [user?.userId, setDraftPrompt]);

  function continueDraft() {
    if (!draftPrompt) return;
    setForm(draftPrompt.formData);
    setStep(draftPrompt.step);
    setDraftPrompt(null);
  }

  function discardDraft() {
    setDraftPrompt(null);
    deleteDraft(user?.userId);
  }

  // --- Draft: debounced autosave on every change ---
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user?.userId || draftLoading || draftPrompt) return;

    // Don't save a completely empty, untouched form
    const isEmpty = JSON.stringify(form) === JSON.stringify(EMPTY_FORM);
    if (isEmpty) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      fetch('/api/gigs/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publisherId: user.userId,
          formData: form,
          step,
        }),
      }).catch((err) => console.error('Error saving draft:', err));
    }, 1000); // debounce: save 1s after the user stops typing/selecting

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [form, step, user?.userId, draftLoading, draftPrompt]);

  if (draftLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm hint-color">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Customize Your Gig</h1>
        <p className="text-sm mt-1 hint-color">
          Set what you need done and how much it pays.
        </p>
      </div>

      {draftPrompt && (
        <div className="primary-bg rounded-2xl p-4 mb-6 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--tg-secondary-bg-color)' }}
            >
              📝
            </div>
            <div>
              <p className="text-sm font-bold">You have an unfinished gig</p>
              <p className="text-xs hint-color mt-0.5">
                Pick up where you left off, or start a new one.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={discardDraft}
              className="flex-1 rounded-full py-2.5 text-sm font-medium secondary-bg"
            >
              Start Fresh
            </button>
            <button
              type="button"
              onClick={continueDraft}
              className="flex-1 rounded-full py-2.5 text-sm font-bold"
              style={{ backgroundColor: 'var(--tg-button-color)', color: 'var(--tg-button-text-color)' }}
            >
              Continue Draft
            </button>
          </div>
        </div>
      )}

      <StepIndicator current={step} />

      <hr className="border-0 h-0.5 gradient-bg rounded-lg mt-4" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
        {step === 1 && (
          <>
            <Field label="Choose Gig Type">
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value as Category)}
                className="input outline-0 rounded-lg px-2 py-4 primary-bg appearance-none"
              >
                <option value="">Select type</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
              <p className="text-sm hint-color">This gig action is not available yet.</p>
            )}

            <Field label="Name Your Gig">
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="ex: Follow GigsGram on X"
                maxLength={40}
                className="input outline-0 primary-bg rounded-lg px-2 py-4"
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

            <Field label="Gig Guidelines">
              <textarea
                value={form.guidelines}
                onChange={(e) => update('guidelines', e.target.value)}
                placeholder="ex: Go to our X page, follow us on X, submit your X account link to confirm you completed the task"
                rows={4}
                className="input resize-none outline-0 px-2 py-4 rounded-lg primary-bg"
              />
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
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Target Countries" hint="Leave empty for everyone">
              <CountryMultiSelect 
                selected={form.countries} 
                onToggle={toggleCountry} 
              />
            </Field>

            <Field label="Target Communities" hint="Leave empty for everyone">
              <CommunityMultiSelect 
                selected={form.communities} 
                onToggle={toggleCommunity} 
              />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              {selectedSubCategory && (
                <Field label="Reward Per Click">
                  <p className="primary-bg rounded-lg px-2 py-4 text-lg font-medium w-full">
                    {reward} points
                    <span className="ml-2 font-normal hint-color text-sm">
                      ≈ ${(reward * TOKEN_TO_USDT).toFixed(2)}
                    </span>
                  </p>
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
          </>
        )}

        {error && <p className="text-sm text-center destructive-color">{error}</p>}

        <div className="flex gap-3 mt-1">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="flex-1 rounded-full py-3 font-bold text-center primary-bg"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex-1 rounded-full py-3 font-bold text-center"
              style={{ backgroundColor: 'var(--tg-button-color)', color: 'var(--tg-button-text-color)' }}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full py-3 font-bold text-center disabled:opacity-50"
              style={{ backgroundColor: 'var(--tg-button-color)', color: 'var(--tg-button-text-color)' }}
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          )}
        </div>

        {step === 3 && (
          <p className="text-xs text-center hint-color">
            Your gig goes live after a quick review, usually within a few hours.
          </p>
        )}
      </form>
    </div>
  );
}

async function deleteDraft(publisherId: number | undefined) {
  if (!publisherId) return;
  try {
    await fetch(`/api/gigs/draft?publisherId=${publisherId}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Error deleting draft:', err);
  }
}

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className="flex-1 h-1.5 rounded-full transition-all"
          style={{
            backgroundColor: s <= current ? 'var(--tg-button-color)' : 'var(--tg-secondary-bg-color)',
          }}
        />
      ))}
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