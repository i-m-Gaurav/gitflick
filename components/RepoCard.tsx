import { Repository } from "@/services/github";
import { Star, Code2, GitFork, Globe, Eye, Scale, AlertCircle, Book, Archive, FileCode2 } from "lucide-react";
import { motion } from "framer-motion";

interface RepositoryCardProps {
  repository: Repository;
}

export const RepoCard = ({ repository }: RepositoryCardProps) => {
  // Format numbers with fallback to 0
  const formatNumber = (num: number | undefined) => (num || 0).toLocaleString();
  
  // Format file size
  const formatSize = (bytes: number) => {
    const kb = bytes * 1024; // GitHub API returns size in KB
    if (kb < 1024) return `${kb} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="relative h-screen w-full snap-start bg-gradient-to-br from-gray-900 via-black to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-y-auto"
      >
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Repository header with status badges */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
                className="w-16 h-16 rounded-full border-2 border-white/20"
              />
              <div>
                <h3 className="text-2xl font-bold text-white group">
                  {repository.name}
                  {repository.archived && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-200">
                      <Archive className="w-3 h-3 mr-1" />
                      Archived
                    </span>
                  )}
                </h3>
                <p className="text-lg text-white/80">by {repository.owner.login}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {repository.visibility === "public" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/20 text-green-200">
                  Public
                </span>
              )}
              {repository.has_wiki && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-400/20 text-purple-200">
                  <Book className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-xl leading-relaxed">
            {repository.description || "No description available"}
          </p>

          {/* Topics */}
          {repository.topics?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {repository.topics.map(topic => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
          
          {/* Main Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
              <Star className="w-6 h-6 text-yellow-400 mb-1" />
              <span className="text-lg font-bold text-white">{formatNumber(repository.stargazers_count)}</span>
              <span className="text-sm text-white/60">Stars</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
              <GitFork className="w-6 h-6 text-blue-400 mb-1" />
              <span className="text-lg font-bold text-white">{formatNumber(repository.forks_count)}</span>
              <span className="text-sm text-white/60">Forks</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
              <Eye className="w-6 h-6 text-purple-400 mb-1" />
              <span className="text-lg font-bold text-white">{formatNumber(repository.watchers_count)}</span>
              <span className="text-sm text-white/60">Watchers</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/5">
              <AlertCircle className="w-6 h-6 text-red-400 mb-1" />
              <span className="text-lg font-bold text-white">{formatNumber(repository.open_issues_count)}</span>
              <span className="text-sm text-white/60">Issues</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              {repository.language && (
                <div className="flex items-center text-white/80">
                  <Code2 className="w-4 h-4 mr-2 text-yellow-400" />
                  {repository.language}
                </div>
              )}
              <div className="flex items-center text-white/80">
                <FileCode2 className="w-4 h-4 mr-2 text-purple-400" />
                {formatSize(repository.size)}
              </div>
            </div>
            <div className="space-y-2">
              {repository.license && (
                <div className="flex items-center text-white/80">
                  <Scale className="w-4 h-4 mr-2 text-blue-400" />
                  {repository.license.name}
                </div>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            {repository.html_url && (
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white text-lg"
              >
                <Code2 className="w-5 h-5 mr-2" />
                View Repository
              </a>
            )}
            {repository.homepage && (
              <a
                href={repository.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 transition-colors rounded-lg text-white text-lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                Visit Site
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};