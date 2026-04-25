'use client';

import { ExternalLink, Github, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

type Repo = {
  fork: any;
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  created_at: string;
  updated_at: string;
};

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/asithaisuru/repos')
      .then((res) => res.json())
      .then((data) => {
        // filter + sort (important)
        const filtered = data
          .filter((repo: Repo) =>
            repo.name !== 'asithaisuru' && // skip profile repo
            !repo.name.toLowerCase().includes('test') &&
            !repo.fork
          )
          .sort(
            (a: Repo, b: Repo) =>
              b.stargazers_count - a.stargazers_count
          );

        setRepos(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="projects"
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-400">
            Real projects pulled directly from GitHub
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400">
            Loading projects...
          </p>
        )}

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {!loading &&
            repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-background/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                {/* Title */}
                <div className="flex items-center justify-between mb-0">
                  <h3 className="text-xl font-semibold">
                    {repo.name}
                  </h3>
                  <Github size={20} />
                </div>

                {/* Description */}
                <div className="text-gray-300 text-sm min-h-[60px] flex flex-col">
                  <span>Created At : {repo.created_at.slice(0, 7) || 'Unavailable'}</span>
                  <span>Updated At : {repo.updated_at.slice(0, 7) || 'Unavailable'}</span>
                </div>

                {/* Tech */}
                <p className="text-xs text-gray-400 mb-4">
                  {repo.language || 'Unknown tech'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star size={14} /> {repo.stargazers_count}
                  </span>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:underline text-sm"
                  >
                    View <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}