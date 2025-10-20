"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, Palette, Cpu, Eye, EyeOff } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useThemeContext } from "@/context/themeContext";

export function SettingsDialog() {
  const { settings, setSettings } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleThemeToggle = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  };

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const availableModels = [
    { value: "gpt-4", label: "GPT-4", description: "Most capable model" },
    {
      value: "gpt-4-turbo",
      label: "GPT-4 Turbo",
      description: "Faster and more efficient",
    },
    {
      value: "gpt-3.5-turbo",
      label: "GPT-3.5 Turbo",
      description: "Fast and cost-effective",
    },
    {
      value: "claude-3-opus",
      label: "Claude 3 Opus",
      description: "Anthropic's most powerful",
    },
    {
      value: "claude-3-sonnet",
      label: "Claude 3 Sonnet",
      description: "Balanced performance",
    },
  ];

  const availableLanguages = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
    { value: "fr", label: "Français" },
    { value: "es", label: "Español" },
  ];

  // Simple translation object for theme labels
  const t = {
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 border-t border-accent py-4 rounded-none text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your API key, model preferences, and application settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API & Model
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          {/* API & Model Tab */}
          <TabsContent value="api" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={settings.apiKey}
                  onChange={(e) =>
                    handleSettingChange("apiKey", e.target.value)
                  }
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Select
                value={settings.model}
                onValueChange={(value) => handleSettingChange("model", value)}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {model.description}
                          </div>
                        </div>
                        {model.value === "gpt-4" && (
                          <Badge variant="secondary" className="ml-2">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
                className="h-9 px-2 md:px-3"
              >
                {settings.theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">{t.lightMode}</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">{t.darkMode}</span>
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) =>
                  handleSettingChange("language", value)
                }
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save conversations</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically save your chat history
                </p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoSave", checked)
                }
              />
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Current Settings</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  Model: <span className="font-medium">{settings.model}</span>
                </p>
                <p>
                  Theme: <span className="font-medium">{settings.theme}</span>
                </p>
                <p>
                  Language:{" "}
                  <span className="font-medium">{settings.language}</span>
                </p>
                <p>
                  API Key:{" "}
                  <span className="font-medium">
                    {settings.apiKey
                      ? `${settings.apiKey.slice(0, 7)}...`
                      : "Not set"}
                  </span>
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
