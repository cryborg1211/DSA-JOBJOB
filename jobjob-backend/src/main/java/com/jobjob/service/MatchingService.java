package com.jobjob.service;

import com.jobjob.dsa.heap.RankingHeap;
import com.jobjob.dsa.similarity.CosineSimilarity;
import com.jobjob.dsa.trie.JobTrie;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * MatchingService — orchestrates the three DSA engines:
 * 1. JobTrie → prefix suggestions
 * 2. CosineSimilarity → CV vs JD similarity scoring
 * 3. RankingHeap → rank all jobs for a candidate
 *
 * NOTE: Vector computation (tokenisation + TF-IDF) is simplified here.
 * Replace buildVector() with a proper TF-IDF implementation as needed.
 */
@Service
public class MatchingService {

    private final JobTrie jobTrie;
    private final CosineSimilarity cosineSimilarity;
    private final RankingHeap rankingHeap;

    public MatchingService(JobTrie jobTrie, CosineSimilarity cosineSimilarity, RankingHeap rankingHeap) {
        this.jobTrie = jobTrie;
        this.cosineSimilarity = cosineSimilarity;
        this.rankingHeap = rankingHeap;
    }

    // ── Trie ──────────────────────────────────────────────────

    /** Returns job title suggestions for a given prefix */
    public List<String> suggest(String prefix) {
        return jobTrie.suggest(prefix, 10);
    }

    /** Build the Trie from all job titles in the database */
    public void rebuildTrie(List<String> jobTitles) {
        jobTitles.forEach(jobTrie::insert);
    }

    // ── Cosine Similarity ─────────────────────────────────────

    /**
     * Compare a CV vector against a JD vector.
     *
     * @return score in [0, 100] (percentage)
     */
    public int compareVectors(Map<String, Double> cvVector, Map<String, Double> jdVector) {
        double score = cosineSimilarity.compute(cvVector, jdVector);
        return (int) Math.round(score * 100);
    }

    public Set<String> getMatchedSkills(Map<String, Double> cv, Map<String, Double> jd) {
        return cosineSimilarity.intersectTerms(cv, jd);
    }

    public Set<String> getMissingSkills(Map<String, Double> cv, Map<String, Double> jd) {
        return cosineSimilarity.missingTerms(cv, jd);
    }

    // ── Ranking Heap ──────────────────────────────────────────

    /**
     * Rank a list of job entries by their cosine similarity score against a CV.
     *
     * @param cvVector   the candidate's TF-IDF vector
     * @param jobVectors map of jobId → JD TF-IDF vector
     * @return ordered list of RankingHeap.MatchEntry (highest score first)
     */
    public List<RankingHeap.MatchEntry> rankJobsForCandidate(
            Map<String, Double> cvVector,
            Map<String, Map<String, Double>> jobVectors) {

        // Push each job's score into the heap
        jobVectors.forEach((jobId, jdVec) -> {
            double score = cosineSimilarity.compute(cvVector, jdVec);
            // TODO: replace "Title" / "Company" with real DB lookups
            rankingHeap.push(new RankingHeap.MatchEntry(jobId, "Job " + jobId, "Company", score * 100));
        });

        return rankingHeap.drainRanked();
    }

    // ── Simplified TF-IDF Tokeniser ───────────────────────────

    /**
     * Build a naive skill frequency vector from a plain-text list of skills.
     * Replace with a proper TF-IDF implementation for production use.
     *
     * @param skills list of skill strings (e.g. ["Java", "React", "MySQL"])
     * @return term-frequency vector
     */
    public Map<String, Double> buildVector(List<String> skills) {
        Map<String, Double> vector = new HashMap<>();
        for (String skill : skills) {
            vector.merge(skill.toLowerCase().trim(), 1.0, Double::sum);
        }
        return vector;
    }
}
