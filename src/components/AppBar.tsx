import { Moon, Sun, Globe } from 'lucide-react';
import { useLanguage, languageNames, type Language } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { ThemeToggleMenu} from './theme/theme-toggle_menu';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function AppBar() {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ['pl', 'en', 'uk'];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto flex h-12 sm:h-14 md:h-16 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink-0">
          <img 
            src="/vite.svg" 
            alt="Logo" 
            className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 flex-shrink-0"
          />
          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold truncate">ZANT</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
          {/* Wybór języka */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-2.5 md:px-3 text-xs sm:text-sm h-8 sm:h-9"
                aria-label="Change language"
              >
                <Globe className="h-4 w-4 sm:h-4 md:h-[18px] md:w-[18px]" />
                <span className="hidden sm:inline whitespace-nowrap">
                  {languageNames[language]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px] sm:min-w-[160px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={language === lang ? 'bg-accent font-medium' : ''}
                >
                  {languageNames[lang]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Przełącznik tematu */}
          <ThemeToggleMenu></ThemeToggleMenu>
        </div>
      </div>
    </header>
  );
}

