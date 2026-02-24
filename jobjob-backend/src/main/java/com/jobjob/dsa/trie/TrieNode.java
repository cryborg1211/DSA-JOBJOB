package com.jobjob.dsa.trie;

import java.util.HashMap;
import java.util.Map;

/**
 * TrieNode — a single node in the prefix tree.
 * Each node holds a map of children keyed by character,
 * and a flag marking whether it is a complete word/phrase.
 */
public class TrieNode {

    /** Child nodes, keyed by the next character */
    private final Map<Character, TrieNode> children = new HashMap<>();

    /** True if this node marks the end of an inserted word */
    private boolean endOfWord = false;

    public Map<Character, TrieNode> getChildren() {
        return children;
    }

    public boolean isEndOfWord() {
        return endOfWord;
    }

    public void setEndOfWord(boolean endOfWord) {
        this.endOfWord = endOfWord;
    }
}
