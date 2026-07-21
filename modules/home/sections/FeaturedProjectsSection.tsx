"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { projects } from "@/core/projects/projects";
import { searchProjects } from "@/core/search/searchProjects";
import { searchAssistant } from "@/core/assistant/searchAssistant";

import SearchBox from "../components/SearchBox";
import FeaturedProjects from "../components/FeaturedProjects";

export default function FeaturedProjectsSection() {
  const [query, setQuery] = useState("");

  const assistant = useMemo(() => {
    return searchAssistant(projects, query);
  }, [query]);

  const filteredProjects = useMemo(() => {
    if (!query.trim()) {
      return projects;
    }

    return searchProjects(projects, {
      query,
    }).map((result) => result.project);
  }, [query]);

  const hasQuery = query.trim().length > 0;

  const showAssistant = assistant !== null;

  const showProjects =
    !showAssistant && filteredProjects.length > 0;

  const showEmpty =
    !showAssistant &&
    hasQuery &&
    filteredProjects.length === 0;

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-7xl px-6">
        <SearchBox
          value={query}
          onChange={setQuery}
        />

        {showAssistant && (
          <div
            className="
              mt-8
              overflow-hidden
              rounded-3xl
              border
              border-cyan-500/30
              bg-gradient-to-br
              from-cyan-500/10
              via-slate-900
              to-slate-950
              p-8
              shadow-[0_20px_60px_rgba(6,182,212,.15)]
            "
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  LAEX Assistant
                </span>

                <h2 className="mt-5 text-3xl font-black text-white">
                  {assistant.title}
                </h2>

                <p className="mt-4 max-w-3xl leading-8 text-slate-300">
                  {assistant.message}
                </p>

                <p className="mt-6 text-sm text-cyan-200">
                  Proyecto encontrado por LAEX Assistant.
                </p>
              </div>

              <Link
                href={`/proyectos/${assistant.project.id}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-cyan-500/40
                  bg-cyan-500/10
                  px-8
                  py-4
                  font-semibold
                  text-cyan-300
                  transition-all
                  duration-300
                  hover:bg-cyan-500
                  hover:text-slate-950
                "
              >
                Explorar proyecto →
              </Link>
            </div>
          </div>
        )}

        {!showAssistant && (
          <div className="mt-5 flex items-center justify-between text-sm text-gray-400">
            <span>
              {hasQuery
                ? `${filteredProjects.length} resultado${
                    filteredProjects.length === 1 ? "" : "s"
                  } para "${query}"`
                : `${projects.length} proyectos disponibles`}
            </span>
          </div>
        )}
      </div>

      {showProjects && (
        <FeaturedProjects
          projects={filteredProjects}
        />
      )}

      {showEmpty && (
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur">
            <div className="mb-4 text-5xl">
              🔍
            </div>

            <h3 className="text-2xl font-bold text-white">
              No encontramos proyectos
            </h3>

            <p className="mt-3 text-gray-400">
              No existe ningún proyecto que coincida con{" "}
              <span className="font-semibold text-white">
                "{query}"
              </span>.
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