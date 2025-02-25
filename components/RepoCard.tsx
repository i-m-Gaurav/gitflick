import { Repository } from "@/services/github";
import { Code2, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface RepositoryCardProps {
  repository: Repository;
}

export const RepoCard = ({ repository }: RepositoryCardProps) => {
  return (
    <div className="relative h-screen w-full snap-start bg-gradient-to-br from-gray-900 via-black to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 overflow-y-auto"
      >
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Repository header */}
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
                </h3>
                <p className="text-lg text-white/80">by {repository.owner.login}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 text-xl leading-relaxed">
            {repository.description || "No description available"}
          </p>

          {/* Additional Info */}
          <div className="space-y-2">
            {repository.language && (
              <div className="flex items-center text-white/80">
                <Code2 className="w-4 h-4 mr-2 text-yellow-400" />
                {repository.language}
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white text-lg"
            >
              <Globe className="w-5 h-5 mr-2" />
              View Repository
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};