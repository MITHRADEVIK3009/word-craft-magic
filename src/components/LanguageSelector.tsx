
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useUIState } from "@/lib/stateManager";
import { Check, Globe, Loader } from "lucide-react";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

export function LanguageSelector() {
  const { language, currentLanguage, setLanguageState } = useUIState();
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // Auto-detect language on first visit
    const hasVisited = localStorage.getItem('spark-visited');
    if (!hasVisited) {
      setLanguageState('auto-detect');
      localStorage.setItem('spark-visited', 'true');
    }
  }, [setLanguageState]);

  const handleLanguageChange = async (langCode: string) => {
    setLanguageState('loading');
    setIsTranslating(true);

    try {
      // Simulate translation loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLanguageState('changed');
      localStorage.setItem('preferred-language', langCode);
      
      toast({
        title: "Language Changed",
        description: `Interface updated to ${languages.find(l => l.code === langCode)?.name}`,
      });

      setTimeout(() => {
        setLanguageState('persisted');
        setIsTranslating(false);
      }, 500);

    } catch (error) {
      setLanguageState('error');
      setIsTranslating(false);
      toast({
        title: "Translation Error",
        description: "Failed to change language. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderLanguageDropdown = () => {
    if (language === 'closed') {
      return (
        <Button
          onClick={() => setLanguageState('opened')}
          variant="ghost"
          size="sm"
          className="text-cyan-300 hover:text-cyan-200 hover:bg-slate-800/50"
        >
          <Globe className="h-4 w-4 mr-2" />
          {languages.find(l => l.code === currentLanguage)?.flag} {languages.find(l => l.code === currentLanguage)?.name}
        </Button>
      );
    }

    if (language === 'opened') {
      return (
        <div className="relative">
          <Button
            onClick={() => setLanguageState('closed')}
            variant="ghost"
            size="sm"
            className="text-cyan-300 hover:text-cyan-200 hover:bg-slate-800/50"
          >
            <Globe className="h-4 w-4 mr-2" />
            {languages.find(l => l.code === currentLanguage)?.flag} {languages.find(l => l.code === currentLanguage)?.name}
          </Button>
          
          <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-cyan-500/20 rounded-lg shadow-xl z-50 min-w-48">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                onMouseEnter={() => {
                  setHoveredLang(lang.code);
                  setLanguageState('hovered');
                }}
                onMouseLeave={() => {
                  setHoveredLang(null);
                  setLanguageState('opened');
                }}
                className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-700 transition-colors ${
                  hoveredLang === lang.code ? 'bg-slate-700' : ''
                } ${
                  currentLanguage === lang.code ? 'bg-cyan-900/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-white">{lang.name}</span>
                </div>
                {currentLanguage === lang.code && (
                  <Check className="h-4 w-4 text-cyan-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (language === 'loading') {
      return (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="text-cyan-300"
        >
          <Loader className="h-4 w-4 mr-2 animate-spin" />
          Translating...
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="relative">
      {renderLanguageDropdown()}
      
      {language === 'auto-detect' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-cyan-500/20 rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Choose Your Language</h3>
            <p className="text-gray-300 mb-6">Select your preferred language for the interface</p>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  onClick={() => {
                    handleLanguageChange(lang.code);
                    setLanguageState('closed');
                  }}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-cyan-900/50"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {language === 'not-translated' && (
        <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-400">
          Partial Translation
        </Badge>
      )}

      {isTranslating && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Loader className="h-4 w-4 animate-spin text-cyan-400" />
            <span className="text-white">Updating interface...</span>
          </div>
        </div>
      )}
    </div>
  );
}
