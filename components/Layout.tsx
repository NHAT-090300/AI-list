import React, { useState, useRef, useEffect, useCallback } from "react";
import { CATEGORIES } from "../data";
import { TRANSLATIONS, LANGUAGES } from "../i18n";
import { Language } from "../types";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const Layout: React.FC<LayoutProps> = React.memo(
  ({
    children,
    isDarkMode,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    onSelectCategory,
    language,
    setLanguage,
  }) => {
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const langMenuRef = useRef<HTMLDivElement>(null);

    const t = TRANSLATIONS[language];
    const currentLang = LANGUAGES.find((l) => l.code === language);

    // Close Language Dropdown when click outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          langMenuRef.current &&
          !langMenuRef.current.contains(event.target as Node)
        ) {
          setIsLangMenuOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Optimize function to reduce re-render
    const handleCategorySelect = useCallback(
      (id: string) => {
        onSelectCategory(id);
      },
      [onSelectCategory]
    );

    useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }, [isMobileMenuOpen]);

    return (
      <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""}`}>
        {/* HEADER */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-dark-900/70 border-b border-gray-200 dark:border-gray-800"
        >
          <div className="mx-auto max-w-screen-xl px-2 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Icons.Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => onSelectCategory("all")}
            >
              <motion.div
                whileHover={{ scale: 1.07 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold"
              >
                AI
              </motion.div>

              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 hidden sm:block">
                Nexus
              </span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-full sm:max-w-md relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-800"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language dropdown */}
              <div className="relative" ref={langMenuRef}>
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <span className="text-xl">{currentLang?.flag}</span>
                  <span className="text-sm font-medium hidden md:block">
                    {currentLang?.code.toUpperCase()}
                  </span>
                  <Icons.ChevronDown className="h-3 w-3" />
                </button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg bg-white dark:bg-dark-800 ring-1 ring-black/5 py-1 z-50"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            language === lang.code
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              : ""
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Switch */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {isDarkMode ? (
                  <Icons.Sun className="h-5 w-5" />
                ) : (
                  <Icons.Moon className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* MOBILE DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-dark-900 shadow-xl z-50 p-4 overflow-y-auto"
              >
                <h3 className="text-sm font-semibold text-gray-500 mb-4">
                  {t.categories}
                </h3>

                {CATEGORIES.map((category) => {
                  const IconComp = (Icons as any)[category.icon] as LucideIcon;
                  const isActive = selectedCategory === category.id;
                  const name =
                    category.id === "all"
                      ? t.allTools
                      : t.cat[category.id] || category.name;

                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleCategorySelect(category.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg mb-1 text-sm ${
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {IconComp && <IconComp className="mr-3 h-5 w-5" />}
                      {name}
                    </button>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* BODY */}
        <div className="flex flex-1 w-full mx-auto px-2 sm:px-4 md:px-6 lg:px-8 max-w-screen-xl">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 pr-6 pt-8 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-500 mb-4 px-2">
              {t.categories}
            </h3>

            <nav className="space-y-1">
              {CATEGORIES.map((category) => {
                const IconComp = (Icons as any)[category.icon] as LucideIcon;
                const isActive = selectedCategory === category.id;
                const name =
                  category.id === "all"
                    ? t.allTools
                    : t.cat[category.id] || category.name;

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`group w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {IconComp && (
                      <IconComp
                        className={`mr-3 h-5 w-5 ${
                          isActive ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                    )}
                    <span className="truncate">{name}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <motion.main
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex-1 py-4 sm:py-6 px-1 sm:px-4 lg:px-0 min-w-0"
          >
            {children}
          </motion.main>
        </div>
      </div>
    );
  }
);

export default Layout;
