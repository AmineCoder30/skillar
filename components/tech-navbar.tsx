"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { TechnologyId } from "@/lib/content-data";
import { technologies } from "@/lib/content-data";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TechNavbarProps {
  selectedTech: TechnologyId | null;
  onTechSelect: (tech: TechnologyId) => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export function TechNavbar({ selectedTech, onTechSelect }: TechNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTechnologies = useMemo(() => {
    if (!searchQuery.trim()) return technologies;

    const query = searchQuery.toLowerCase();
    return technologies.filter((tech) =>
      tech.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="border-r border-border/50 bg-card w-64 lg:w-72 flex flex-col">
      <div className="p-4 border-b border-border space-y-3 flex-shrink-0">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Technologies
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 md:gap-3 px-4 md:px-6 py-4">
          {filteredTechnologies.map((tech) => {
            const isSelected = selectedTech === tech.id;
            return (
              <Button
                key={tech.id}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                onClick={() => onTechSelect(tech.id)}
                className={`
                  group relative whitespace-nowrap h-10 md:h-11 
                  text-xs md:text-sm px-3 md:px-4 rounded-lg
                  transition-all duration-200 ease-in-out
                  hover:bg-accent justify-start
                  ${
                    isSelected
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : " hover:text-accent-foreground"
                  }
                `}
              >
                <span className="text-lg">
                  <img
                    src={tech.icon.src}
                    alt={tech.name}
                    className="h-4 w-4"
                  />
                </span>
                <span className="hidden sm:inline font-medium">
                  {tech.name}
                </span>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  );
}
