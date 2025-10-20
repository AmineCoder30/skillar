"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "@/context/themeContext";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import type { Language } from "@/lib/translations";
import type { TechnologyId, TopicId } from "@/lib/content-data";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [selectedTech, setSelectedTech] = useState<TechnologyId | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicId | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleTechSelect = (tech: TechnologyId) => {
    setSelectedTech(tech);
    setSelectedTopic(null);
  };

  const handleTopicSelect = (topic: TopicId) => {
    setSelectedTopic(topic);
  };

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex overflow-hidden relative">
          {/* Mobile sidebar toggle button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 left-4 z-50 lg:hidden bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>

          {/* Mobile overlay */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Unified Sidebar - Left Side */}
          <div
            className={`${
              isMobileSidebarOpen ? "fixed inset-y-0 left-0 z-40" : "hidden"
            } lg:block lg:relative lg:z-auto`}
          >
            <Sidebar
              selectedTech={selectedTech}
              selectedTopic={selectedTopic}
              onTechSelect={handleTechSelect}
              onTopicSelect={handleTopicSelect}
              isMobileOpen={isMobileSidebarOpen}
              onMobileClose={() => setIsMobileSidebarOpen(false)}
            />
          </div>

          {/* Main Chat Interface */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <ChatInterface
              technology={selectedTech}
              topic={selectedTopic}
              language={language}
            />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
