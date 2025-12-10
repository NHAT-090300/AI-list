
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../data';
import { TRANSLATIONS, LANGUAGES } from '../i18n';
import { Language } from '../types';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isDarkMode,
  toggleTheme,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  onSelectCategory,
  language,
  setLanguage
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-dark-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => onSelectCategory('all')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 hidden sm:block">
              Nexus
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-full leading-5 bg-gray-50 dark:bg-dark-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Controls: Language & Theme */}
          <div className="flex items-center gap-2">
            
            {/* Language Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              >
                <span className="text-xl leading-none">{currentLang?.flag}</span>
                <span className="text-sm font-medium hidden md:block">{currentLang?.code.toUpperCase()}</span>
                <Icons.ChevronDown className="h-3 w-3 ml-0.5" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-white dark:bg-dark-800 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden py-1 max-h-[80vh] overflow-y-auto z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700
                        ${language === lang.code ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
                      `}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Icons.Sun className="h-5 w-5" /> : <Icons.Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0 py-8 pr-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
            {t.categories}
          </h3>
          <nav className="space-y-1">
            {CATEGORIES.map((category) => {
              // Dynamically get icon component
              const IconComponent = (Icons as any)[category.icon] as LucideIcon;
              const isActive = selectedCategory === category.id;
              
              // Get translated name or fallback to original
              const translatedName = category.id === 'all' ? t.allTools : (t.cat[category.id] || category.name);

              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`group w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'
                      }`}
                    />
                  )}
                  <span className="truncate text-left">{translatedName}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Category Scroll (Top) */}
        <div className="lg:hidden w-full overflow-x-auto py-4 px-4 flex gap-2 no-scrollbar bg-white dark:bg-dark-950 sticky top-16 z-40 border-b border-gray-100 dark:border-gray-800">
            {CATEGORIES.map((category) => {
                const translatedName = category.id === 'all' ? t.allTools : (t.cat[category.id] || category.name);
                return (
                  <button
                      key={category.id}
                      onClick={() => onSelectCategory(category.id)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          selectedCategory === category.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                          : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                  >
                      {translatedName}
                  </button>
                );
            })}
        </div>

        {/* Main Content */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
