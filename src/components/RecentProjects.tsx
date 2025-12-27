'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from './ui/ProjectCard';

interface Project {
  id: number;
  title: string;
  category: string;
  short_description: string;
  image_url: string;
  location?: string;
  completion_date?: string;
}

export default function RecentProjects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [activeCategory]);

  const loadProjects = async () => {
    try {
      const url = activeCategory === 'all' 
        ? '/api/projects/recent'
        : `/api/projects/recent?category=${activeCategory}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.slice(0, 6)); // Show max 6 projects
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recent Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a look at some of our recently completed projects across the Upstate
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveCategory('handyman')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeCategory === 'handyman'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔧 Handyman Services
          </button>
          <button
            onClick={() => setActiveCategory('remodeling')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeCategory === 'remodeling'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🏗️ Remodeling
          </button>
          <button
            onClick={() => setActiveCategory('additions')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeCategory === 'additions'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ➕ Additions
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No projects found in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/services"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
}
