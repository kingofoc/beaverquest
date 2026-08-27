'use client';
import { useState, useEffect, useMemo, useRef } from 'react';

type CountryOption = { country: string; count: number };

export default function CountryMultiSelect({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (country: string) => void;
}) {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [minUsers, setMinUsers] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/country')
      .then((res) => res.json())
      .then((data) => setCountries(data.countries ?? []))
      .catch((err) => console.error('Error loading countries:', err))
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maxCount = useMemo(
    () => (countries.length > 0 ? Math.max(...countries.map((c) => c.count)) : 0),
    [countries]
  );

  const filtered = useMemo(() => {
    return countries.filter(
      (c) =>
        c.count >= minUsers &&
        c.country.toLowerCase().includes(search.toLowerCase())
    );
  }, [countries, search, minUsers]);

  const selectedCountries = countries.filter((c) => selected.includes(c.country));
  const totalReach = selectedCountries.reduce((sum, c) => sum + c.count, 0);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="input outline-0 rounded-lg px-3 py-4 primary-bg w-full text-left"
      >
        {selected.length > 0 ? `${selected.length} countries selected` : 'Everyone (no restriction)'}
      </button>

      {open && (
        <div className="absolute z-20 top-full left-0 w-full mt-2 rounded-lg primary-bg shadow-lg overflow-hidden">
          <div className="p-3 flex flex-col gap-2 secondary-bg">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 rounded-lg outline-0 primary-bg text-sm"
            />
            {maxCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs hint-color whitespace-nowrap">Min users</span>
                <input
                  type="range"
                  min={0}
                  max={maxCount}
                  value={minUsers}
                  onChange={(e) => setMinUsers(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-xs hint-color whitespace-nowrap">{minUsers}+</span>
              </div>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto">
            {loading && <p className="px-3 py-3 text-sm hint-color">Loading...</p>}
            {!loading && filtered.length === 0 && (
              <p className="px-3 py-3 text-sm hint-color">No countries match</p>
            )}
            {filtered.map(({ country, count }) => {
              const isSelected = selected.includes(country);
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => onToggle(country)}
                  className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-sm transition-colors ${
                    isSelected ? 'tertiary-bg-faded' : ''
                  }`}
                >
                  <span>{country}</span>
                  <span className="hint-color text-xs">{count.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCountries.map(({ country }) => (
            <button
              key={country}
              type="button"
              onClick={() => onToggle(country)}
              className="px-3 py-1.5 rounded-full text-xs font-medium tertiary-bg tertiary-text-color flex items-center gap-1.5"
            >
              {country}
              <span className="opacity-70">×</span>
            </button>
          ))}
        </div>
      )}

      {selectedCountries.length > 0 && (
        <p className="text-xs mt-1.5 hint-color">
          ~{totalReach.toLocaleString()} potential hunters
        </p>
      )}
    </div>
  );
}