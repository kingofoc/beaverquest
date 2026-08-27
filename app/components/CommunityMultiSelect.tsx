'use client';
import { useState, useEffect, useMemo, useRef } from "react";

type CommunityOption = { communityName: string; communityType: string; memberCount: number };

export default function CommunityMultiSelect(
 {selected, onToggle} : {selected: string[]; onToggle: (country: string) => void;
}) {
 const [communities, setCommunities] = useState<CommunityOption[]>([]);
 const [loading, setLoading] = useState(true);
 const [open, setOpen] = useState(false);
 const [search, setSearch] = useState('');
 const [minUsers, setMinUsers] = useState(0);
 const wrapperRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  fetch('/api/communities')
   .then((res) => res.json())
   .then((data) => setCommunities(data.allCommunities ?? []))
   .catch((err) => console.error("Error loading communities:", err))
   .finally(() => setLoading(false));
 }, [])

 useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
   if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
    setOpen(false);
   }
  }
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside)
 }, [])

 const maxCount = useMemo(
  () => (communities.length > 0 ? Math.max(...communities.map((c) => c.memberCount)) : 0),
  [communities]
 );

 const filtered = useMemo(() => {
  return communities.filter(
   (c) => c.memberCount >= minUsers && c.communityType.toLowerCase().includes(search.toLowerCase())
  );
 }, [communities, search, minUsers]);

 const selectedCommunities = communities.filter((c) => selected.includes(c.communityName));
 const totalReach = selectedCommunities.reduce((sum, c) => sum + c.memberCount, 0);

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
            {filtered.map(({ communityName, communityType, memberCount }) => {
              const isSelected = selected.includes(communityName);
              return (
                <button
                  key={communityName}
                  type="button"
                  onClick={() => onToggle(communityName)}
                  className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-sm transition-colors ${
                    isSelected ? 'tertiary-bg-faded' : ''
                  }`}
                >
                  <span>{communityName}</span>
                  <span>{communityType}</span>
                  <span className="hint-color text-xs">{memberCount.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedCommunities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCommunities.map(({ communityName }) => (
            <button
              key={communityName}
              type="button"
              onClick={() => onToggle(communityName)}
              className="px-3 py-1.5 rounded-full text-xs font-medium tertiary-bg tertiary-text-color flex items-center gap-1.5"
            >
              {communityName}
              <span className="opacity-70">×</span>
            </button>
          ))}
        </div>
      )}

      {selectedCommunities.length > 0 && (
        <p className="text-xs mt-1.5 hint-color">
          ~{totalReach.toLocaleString()} potential hunters
        </p>
      )}
    </div>
 );
}

