"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Globe } from "lucide-react";
import type { Language } from "@/lib/translations";
import { translations } from "@/lib/translations";

interface TopNavbarProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const languages = [
  { code: "en" as Language, name: "English", flag: "🇬🇧" },
  { code: "ar" as Language, name: "العربية", flag: "🇸🇦" },
  { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
  { code: "es" as Language, name: "Español", flag: "🇪🇸" },
];

export function TopNavbar({
  theme,
  onThemeToggle,
  language,
  onLanguageChange,
}: TopNavbarProps) {
  const t = translations[language];

  return (
    <div className="h-14 border-b border-border bg-card px-3 md:px-4 flex items-center justify-between">
      <div className="flex items-center gap-1 md:gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 px-2 md:px-3">
              <Globe className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">
                {languages.find((l) => l.code === language)?.flag}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
