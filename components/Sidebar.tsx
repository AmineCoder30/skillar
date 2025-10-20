"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import type { TechnologyId, TopicId } from "@/lib/content-data";
import { technologies, topics } from "@/lib/content-data";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SettingsDialog } from "@/components/settings-dialog";
import type { Language } from "@/lib/translations";

interface SidebarProps {
  selectedTech: TechnologyId | null;
  selectedTopic: TopicId | null;
  onTechSelect: (tech: TechnologyId) => void;
  onTopicSelect: (topic: TopicId) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({
  selectedTech,
  selectedTopic,
  onTechSelect,
  onTopicSelect,
  isMobileOpen = true,
  onMobileClose,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTech, setExpandedTech] = useState<TechnologyId | null>(
    selectedTech
  );

  // Filter technologies based on search
  const filteredTechnologies = useMemo(() => {
    if (!searchQuery.trim()) return technologies;

    const query = searchQuery.toLowerCase();
    return technologies.filter(
      (tech) =>
        tech.name.toLowerCase().includes(query) ||
        topics[tech.id]?.some((topic) =>
          topic.name.toLowerCase().includes(query)
        )
    );
  }, [searchQuery]);

  // Filter topics for a specific technology based on search
  const getFilteredTopics = (techId: TechnologyId) => {
    const techTopics = topics[techId] || [];

    if (!searchQuery.trim()) return techTopics;

    const query = searchQuery.toLowerCase();
    return techTopics.filter((topic) =>
      topic.name.toLowerCase().includes(query)
    );
  };

  const handleTechSelect = (techId: TechnologyId) => {
    // If clicking the same tech, toggle expansion
    if (selectedTech === techId) {
      setExpandedTech(expandedTech === techId ? null : techId);
    } else {
      // Select new tech and expand it
      onTechSelect(techId);
      setExpandedTech(techId);
    }
  };

  const handleTopicSelect = (topicId: TopicId) => {
    onTopicSelect(topicId);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Auto-expand selected technology
  React.useEffect(() => {
    if (selectedTech && expandedTech !== selectedTech) {
      setExpandedTech(selectedTech);
    }
  }, [selectedTech]);

  return (
    <div
      className={`w-64 lg:w-72 border-r border-border h-screen bg-card flex flex-col ${
        !isMobileOpen ? "hidden lg:flex" : "flex"
      } lg:flex`}
    >
      {/* Header with search */}
      <div className="p-4 border-b border-border space-y-3  flex-shrink-0">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-primary  flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              SK
            </span>
          </div>
          <h1 className="text-base md:text-lg font-bold">Skillar</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search technologies or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>
      <h2 className="font-semibold text-sm p-4 text-muted-foreground uppercase tracking-wide">
        Technologies & Topics
      </h2>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 ">
        <div className="p-2 space-y-1 ">
          {filteredTechnologies.map((tech) => {
            const isSelected = selectedTech === tech.id;
            const isExpanded = expandedTech === tech.id;
            const filteredTopics = getFilteredTopics(tech.id);
            const hasTopics = filteredTopics.length > 0;

            return (
              <Collapsible
                key={tech.id}
                open={isExpanded}
                onOpenChange={(open) => {
                  if (!open && expandedTech === tech.id) {
                    setExpandedTech(null);
                  } else if (open) {
                    setExpandedTech(tech.id);
                  }
                }}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isSelected ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleTechSelect(tech.id)}
                    className={`
                      w-full justify-between h-10 px-3 rounded-lg
                      transition-all duration-200 ease-in-out
                      hover:bg-accent group
                      ${
                        isSelected
                          ? "bg-secondary text-secondary-foreground shadow-sm"
                          : "hover:text-accent-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        <img
                          src={tech.icon.src}
                          alt={tech.name}
                          className="h-4 w-4"
                        />
                      </span>
                      <span className="font-medium text-sm">{tech.name}</span>
                    </div>
                    {hasTopics && (
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </Button>
                </CollapsibleTrigger>

                {hasTopics && (
                  <CollapsibleContent className="space-y-1 mt-1">
                    <div className="ml-4 pl-4 border-l-2 border-border/50 space-y-1">
                      {filteredTopics.map((topic) => (
                        <Button
                          key={topic.id}
                          variant={
                            selectedTopic === topic.id ? "secondary" : "ghost"
                          }
                          size="sm"
                          onClick={() => handleTopicSelect(topic.id)}
                          className={`
                            w-full justify-start h-9 px-3 rounded-md
                            text-xs transition-all duration-200
                            hover:bg-accent/50
                            ${
                              selectedTopic === topic.id
                                ? "bg-secondary/60 text-secondary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }
                          `}
                        >
                          {topic.name}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          })}

          {filteredTechnologies.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No technologies or topics found
            </p>
          )}
        </div>
      </ScrollArea>
      <SettingsDialog />
    </div>
  );
}
