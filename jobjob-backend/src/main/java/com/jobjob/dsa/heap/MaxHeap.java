package com.jobjob.dsa.heap;

import java.util.ArrayList;
import java.util.List;

/**
 * MaxHeap<T extends Comparable<T>> — generic array-based max-heap.
 *
 * DSA: Binary Heap (Max-Heap)
 * Insert (offer): O(log n)
 * Extract max: O(log n)
 * Peek: O(1)
 * Build heap: O(n)
 *
 * Used by RankingHeap to sort match results by score.
 */
public class MaxHeap<T extends Comparable<T>> {

    private final List<T> data = new ArrayList<>();

    /** Insert element and sift up to restore heap property */
    public void offer(T item) {
        data.add(item);
        siftUp(data.size() - 1);
    }

    /** Remove and return the maximum element */
    public T poll() {
        if (data.isEmpty())
            throw new IllegalStateException("Heap is empty");
        T max = data.get(0);
        T last = data.remove(data.size() - 1);
        if (!data.isEmpty()) {
            data.set(0, last);
            siftDown(0);
        }
        return max;
    }

    /** Peek at the maximum without removing */
    public T peek() {
        if (data.isEmpty())
            throw new IllegalStateException("Heap is empty");
        return data.get(0);
    }

    public boolean isEmpty() {
        return data.isEmpty();
    }

    public int size() {
        return data.size();
    }

    // ── Internal helpers ───────────────────────────────────────

    private void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (data.get(i).compareTo(data.get(parent)) > 0) {
                swap(i, parent);
                i = parent;
            } else
                break;
        }
    }

    private void siftDown(int i) {
        int n = data.size();
        while (true) {
            int largest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            if (left < n && data.get(left).compareTo(data.get(largest)) > 0)
                largest = left;
            if (right < n && data.get(right).compareTo(data.get(largest)) > 0)
                largest = right;
            if (largest != i) {
                swap(i, largest);
                i = largest;
            } else
                break;
        }
    }

    private void swap(int a, int b) {
        T tmp = data.get(a);
        data.set(a, data.get(b));
        data.set(b, tmp);
    }
}
