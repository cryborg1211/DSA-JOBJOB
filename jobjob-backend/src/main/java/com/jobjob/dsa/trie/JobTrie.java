package com.jobjob.dsa.trie;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * JobTrie — case-insensitive prefix tree for job title search suggestions.
 *
 * DSA: Trie (Prefix Tree)
 * Insert: O(m) — m = length of the word
 * Search: O(m + k) — k = number of suggestion results
 * Space: O(ALPHABET_SIZE × N × m)
 *
 * Used by: GET /api/jobs/suggest?prefix=<query>
 */
@Component
public class JobTrie {

    private final TrieNode root = new TrieNode();

    /** Insert a job title into the Trie (normalised to lowercase) */
    public void insert(String word) {
        TrieNode current = root;
        for (char ch : word.toLowerCase().toCharArray()) {
            current.getChildren().putIfAbsent(ch, new TrieNode());
            current = current.getChildren().get(ch);
        }
        current.setEndOfWord(true);
    }

    /**
     * Return up to {@code limit} job titles that start with {@code prefix}.
     *
     * @param prefix the typed prefix
     * @param limit  maximum number of suggestions
     * @return list of matching titles
     */
    public List<String> suggest(String prefix, int limit) {
        List<String> results = new ArrayList<>();
        TrieNode current = root;

        // Navigate to the end of the prefix
        for (char ch : prefix.toLowerCase().toCharArray()) {
            if (!current.getChildren().containsKey(ch)) {
                return results; // No matches
            }
            current = current.getChildren().get(ch);
        }

        // DFS from that node to collect all words
        dfs(current, new StringBuilder(prefix), results, limit);
        return results;
    }

    /** Depth-first traversal collecting complete words */
    private void dfs(TrieNode node, StringBuilder current, List<String> results, int limit) {
        if (results.size() >= limit)
            return;
        if (node.isEndOfWord())
            results.add(current.toString());

        for (Map.Entry<Character, TrieNode> entry : node.getChildren().entrySet()) {
            current.append(entry.getKey());
            dfs(entry.getValue(), current, results, limit);
            current.deleteCharAt(current.length() - 1);
        }
    }

    /** Convenience overload — returns up to 10 suggestions */
    public List<String> suggest(String prefix) {
        return suggest(prefix, 10);
    }
}
