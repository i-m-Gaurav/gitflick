"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Repository, fetchRandomRepositories } from "@/services/github";
import { RepoCard } from "@/components/RepoCard";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load more repositories function
  const loadMoreRepositories = useCallback(async (clearExisting = false) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const newRepos = await fetchRandomRepositories();
      
      if (newRepos.length > 0) {
        setRepositories(prev => clearExisting ? newRepos : [...prev, ...newRepos]);
        setError(null);
      } else if (repositories.length === 0) {
        setError("No repositories found. Please try again later.");
      }
    } catch (error) {
      console.error("Error loading repositories:", error);
      setError(error instanceof Error ? error.message : "Failed to load repositories. Please try again later.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [repositories.length]);

  // Initial load
  useEffect(() => {
    loadMoreRepositories();
  }, [loadMoreRepositories]);

  // Handle scroll event for infinite scrolling with debounce
  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || loadingRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollPosition = scrollTop + clientHeight;
    
    // Load more when reaching 90% of the scroll height (reduced from 80%)
    if (scrollPosition >= scrollHeight * 0.9) {
      loadMoreRepositories();
    }
  }, [loadMoreRepositories, loading]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      let timeoutId: NodeJS.Timeout;
      
      const debouncedScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => handleScroll(), 500); // 500ms debounce
      };
      
      container.addEventListener("scroll", debouncedScroll);
      return () => {
        container.removeEventListener("scroll", debouncedScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [handleScroll]);

  // Show error state
  if (error && repositories.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadMoreRepositories();
            }}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show initial loading state
  if (loading && repositories.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading amazing GitHub repositories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mix button */}
      {/* <button
        onClick={() => loadMoreRepositories(true)}
        disabled={loading}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:scale-100"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Shuffle className="w-5 h-5" />
        )}
        <span className="font-medium">{loading ? 'Loading...' : 'Mix'}</span>
      </button> */}

      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-auto snap-y snap-mandatory bg-black"
      >
        {repositories.map((repo) => (
          <RepoCard key={repo.id} repository={repo} />
        ))}
        
        {/* Loading indicator for more content */}
        {loading && repositories.length > 0 && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Error message for rate limit */}
        {error && repositories.length > 0 && (
          <div className="text-center p-8 text-white/80">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}