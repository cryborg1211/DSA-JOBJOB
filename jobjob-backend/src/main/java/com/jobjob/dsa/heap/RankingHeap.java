package com.jobjob.dsa.heap;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * RankingHeap — wraps MaxHeap to rank MatchEntry objects by score descending.
 *
 * Usage:
 * 1. Push all candidate-job match scores with push()
 * 2. Call drainRanked() to get a sorted list (rank #1 = highest score)
 */
@Component
public class RankingHeap {

    /** A scored entry for ranking */
    public record MatchEntry(String id, String title, String company, double score)
            implements Comparable<MatchEntry> {
        @Override
        public int compareTo(MatchEntry other) {
            return Double.compare(this.score, other.score); // Max-Heap: higher score = higher priority
        }
    }

    private MaxHeap<MatchEntry> heap = new MaxHeap<>();

    /** Add a match entry to the heap */
    public void push(MatchEntry entry) {
        heap.offer(entry);
    }

    /**
     * Extract all entries ordered by score (highest first).
     * Resets the heap after draining.
     *
     * @return ordered list of MatchEntry, rank 1 = best match
     */
    public List<MatchEntry> drainRanked() {
        List<MatchEntry> ranked = new ArrayList<>();
        while (!heap.isEmpty()) {
            ranked.add(heap.poll());
        }
        heap = new MaxHeap<>(); // Reset
        return ranked;
    }

    /** Check if any entries are queued */
    public boolean isEmpty() {
        return heap.isEmpty();
    }
}
