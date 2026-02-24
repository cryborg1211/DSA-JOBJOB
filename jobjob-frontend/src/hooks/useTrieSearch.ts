import { useState, useCallback, useRef } from 'react';
import { jobService } from '../services/jobService';

/**
 * useTrieSearch — debounced Trie-backed search hook
 *
 * Calls GET /api/jobs/suggest?prefix=<query> after the user stops typing.
 * The backend queries the in-memory JobTrie built from all job titles.
 */
export function useTrieSearch(debounceMs = 250) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback((prefix: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        if (!prefix.trim()) {
            setSuggestions([]);
            return;
        }

        timerRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const { data } = await jobService.searchSuggestions(prefix);
                setSuggestions(data);
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, debounceMs);
    }, [debounceMs]);

    const clear = useCallback(() => setSuggestions([]), []);

    return { suggestions, loading, search, clear };
}
