"use client";

import { useState } from "react";
import { Folder } from "lucide-react";

interface Project {
  id: number;
  name: string;
  client: string;
  lastEdited: string;
  status: "draft" | "published";
  documentCount: number;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Q3 Marketing Strategy",
    client: "TechCorp",
    lastEdited: "2 hours ago",
    status: "draft",
    documentCount: 12,
  },
  {
    id: 2,
    name: "Product Launch Campaign",
    client: "InnovateLab",
    lastEdited: "1 day ago",
    status: "published",
    documentCount: 8,
  },
  {
    id: 3,
    name: "Brand Guidelines",
    client: "DesignStudio",
    lastEdited: "3 days ago",
    status: "published",
    documentCount: 15,
  },
  {
    id: 4,
    name: "Social Media Content",
    client: "StartupXYZ",
    lastEdited: "5 hours ago",
    status: "draft",
    documentCount: 24,
  },
  {
    id: 5,
    name: "Annual Report",
    client: "FinanceGroup",
    lastEdited: "1 week ago",
    status: "published",
    documentCount: 6,
  },
  {
    id: 6,
    name: "Website Copy",
    client: "WebAgency",
    lastEdited: "2 days ago",
    status: "draft",
    documentCount: 18,
  },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState<"all" | "drafts" | "published">("all");

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);

  return (
    <div className="min-h-screen bg-off-white p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-5xl text-deep-black mb-2">
            Projects
          </h1>
          <p className="font-ui text-deep-black/60 text-sm uppercase tracking-wider">
            Manage your clients and campaigns
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex items-center gap-4 border-b border-stone pb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 font-ui text-sm uppercase tracking-wider transition-colors ${
              filter === "all"
                ? "text-deep-black border-b-2 border-deep-black font-medium"
                : "text-deep-black/60 hover:text-deep-black"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("drafts")}
            className={`px-4 py-2 font-ui text-sm uppercase tracking-wider transition-colors ${
              filter === "drafts"
                ? "text-deep-black border-b-2 border-deep-black font-medium"
                : "text-deep-black/60 hover:text-deep-black"
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-2 font-ui text-sm uppercase tracking-wider transition-colors ${
              filter === "published"
                ? "text-deep-black border-b-2 border-deep-black font-medium"
                : "text-deep-black/60 hover:text-deep-black"
            }`}
          >
            Published
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-stone p-6 hover:border-gold transition-all cursor-pointer group"
            >
              {/* Folder Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Folder size={24} className="text-gold" />
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-2">
                <h3 className="font-playfair text-xl text-deep-black group-hover:text-gold transition-colors">
                  {project.name}
                </h3>
                <p className="font-ui text-sm text-deep-black/60 uppercase tracking-wide">
                  {project.client}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-ui text-xs text-deep-black/50">
                    {project.documentCount} documents
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-ui uppercase tracking-wide ${
                      project.status === "published"
                        ? "bg-gold/20 text-gold"
                        : "bg-stone/30 text-deep-black/60"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="font-ui text-xs text-deep-black/40 pt-2 border-t border-stone/50">
                  Last edited {project.lastEdited}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Folder size={48} className="text-stone mx-auto mb-4" />
            <p className="font-playfair text-xl text-deep-black/60 mb-2">
              No {filter === "all" ? "" : filter} projects found
            </p>
            <p className="font-ui text-sm text-deep-black/50">
              Create your first project to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
