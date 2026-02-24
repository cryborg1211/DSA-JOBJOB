package com.jobjob.dsa.similarity;

import org.springframework.stereotype.Component;

import java.util.*;

/**
 * CosineSimilarity — computes cosine similarity between two TF-IDF vectors.
 *
 * DSA: HashMap-based sparse vector arithmetic
 * Time: O(n + m) — n, m = unique terms in each vector
 * Space: O(n + m)
 *
 * Formula:
 * similarity = dot(A, B) / (||A|| × ||B||)
 *
 * Used by MatchingService to score CV vs JD overlap.
 */
@Component
public class CosineSimilarity {

    /**
     * Compute cosine similarity between two sparse TF-IDF vectors.
     *
     * @param vecA CV vector (term → weight)
     * @param vecB JD vector (term → weight)
     * @return similarity score in [0.0, 1.0]
     */
    public double compute(Map<String, Double> vecA, Map<String, Double> vecB) {
        if (vecA.isEmpty() || vecB.isEmpty())
            return 0.0;

        double dot = dotProduct(vecA, vecB);
        double normA = norm(vecA);
        double normB = norm(vecB);

        if (normA == 0.0 || normB == 0.0)
            return 0.0;
        return dot / (normA * normB);
    }

    /** Dot product — only iterates over the smaller vector */
    private double dotProduct(Map<String, Double> a, Map<String, Double> b) {
        double sum = 0.0;
        // Iterate the smaller map for efficiency
        Map<String, Double> smaller = a.size() <= b.size() ? a : b;
        Map<String, Double> larger = a.size() <= b.size() ? b : a;

        for (Map.Entry<String, Double> entry : smaller.entrySet()) {
            Double val = larger.get(entry.getKey());
            if (val != null)
                sum += entry.getValue() * val;
        }
        return sum;
    }

    /** Euclidean norm */
    private double norm(Map<String, Double> vec) {
        double sumSq = 0.0;
        for (double v : vec.values())
            sumSq += v * v;
        return Math.sqrt(sumSq);
    }

    /**
     * Find terms present in both vectors (matched skills).
     */
    public Set<String> intersectTerms(Map<String, Double> vecA, Map<String, Double> vecB) {
        Set<String> result = new HashSet<>(vecA.keySet());
        result.retainAll(vecB.keySet());
        return result;
    }

    /**
     * Find terms in vecB (JD) that are absent from vecA (CV) — missing skills.
     */
    public Set<String> missingTerms(Map<String, Double> cvVec, Map<String, Double> jdVec) {
        Set<String> missing = new HashSet<>(jdVec.keySet());
        missing.removeAll(cvVec.keySet());
        return missing;
    }
}
