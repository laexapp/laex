"use client";

import { useMemo, useState } from "react";

import { projects } from "@/core/projects/projects";
import { searchProjects } from "@/core/search/searchProjects";

import SearchBox from "../components/SearchBox";
import FeaturedProjects from "../components/FeaturedProjects";

export default function FeaturedProjectsSection() {
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    if (!query.trim()) {
      return projects;
    }

    return searchProjects(projects, {
      query,
    }).map((result) => result.project);
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-7xl px-6">
        <SearchBox
          value={query}
          onChange={setQuery}
        />

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>
            {hasQuery
              ? `${filteredProjects.length} resultado${
                  filteredProjects.length === 1 ? "" : "s"
                } para "${query}"`
              : `${projects.length} proyectos disponibles`}
          </span>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <FeaturedProjects
          projects={filteredProjects}
        />
      ) : (
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur">
            <div className="mb-4 text-5xl">🔍</div>

            <h3 className="text-2xl font-bold text-white">
              No encontramos proyectos
            </h3>

            <p className="mt-3 text-gray-400">
              No existe ningún proyecto que coincida con{" "}
              <span className="font-semibold text-white">
                "{query}"
              </span>
              .
            </p>

            <button
              onClick={() => setQuery("")}
              className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
            >
              Mostrar todos los proyectos
            </button>
          </div>
        </div>
      )}
    </section>
  );
}