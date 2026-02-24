import { useState, useRef, useEffect } from 'react';
import { Search, Zap } from 'lucide-react';
import { useTrieSearch } from '../../hooks/useTrieSearch';

interface TrieSearchInputProps {
    onSelect: (value: string) => void;
    placeholder?: string;
}

/**
 * TrieSearchInput — powered by the backend JobTrie (Trie DSA)
 * Presents animated prefix suggestions on each keystroke.
 */
export function TrieSearchInput({
    onSelect,
    placeholder = 'Search jobs...',
}: TrieSearchInputProps) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const { suggestions, loading, search, clear } = useTrieSearch();
    const containerRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setHighlighted(-1);
        search(val);
        setOpen(true);
    };

    const handleSelect = (value: string) => {
        setQuery(value);
        setOpen(false);
        clear();
        onSelect(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
        if (e.key === 'ArrowUp') setHighlighted((h) => Math.max(h - 1, 0));
        if (e.key === 'Enter' && highlighted >= 0) handleSelect(suggestions[highlighted]);
        if (e.key === 'Escape') setOpen(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const highlightMatch = (text: string) => {
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1 || !query) return <span>{text}</span>;
        return (
            <>
                <span className="font-semibold text-teal-400">{text.slice(0, idx + query.length)}</span>
                <span>{text.slice(idx + query.length)}</span>
            </>
        );
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
                <input
                    className="input-field pl-10 pr-4"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setOpen(true)}
                    placeholder={placeholder}
                    aria-autocomplete="list"
                    aria-expanded={open}
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                )}
            </div>

            {/* Dropdown */}
            {open && suggestions.length > 0 && (
                <ul
                    className="absolute z-50 mt-1 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-teal-glow overflow-hidden animate-slide-in"
                    role="listbox"
                >
                    {suggestions.map((s, i) => (
                        <li
                            key={s}
                            role="option"
                            aria-selected={i === highlighted}
                            onClick={() => handleSelect(s)}
                            onMouseEnter={() => setHighlighted(i)}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 ${i === highlighted
                                    ? 'bg-[var(--color-teal-glow)] text-[var(--color-teal-300)]'
                                    : 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]'
                                }`}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <Search className="w-3 h-3 shrink-0 text-[var(--color-text-muted)]" />
                            {highlightMatch(s)}
                        </li>
                    ))}
                    {/* DSA badge */}
                    <li className="px-4 py-1.5 border-t border-[var(--color-border)] flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
                        <Zap className="w-3 h-3 text-teal-400" />
                        Powered by Trie Search
                    </li>
                </ul>
            )}
        </div>
    );
}
