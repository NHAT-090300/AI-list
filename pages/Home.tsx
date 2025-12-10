import React, { useMemo } from "react";
import { TOOLS, CATEGORIES } from "../data";
import { TRANSLATIONS } from "../i18n";
import { Language } from "../types";
import ToolCard from "../components/ToolCard";
import { Frown } from "lucide-react";

interface HomeProps {
  searchQuery: string;
  selectedCategory: string;
  language: Language;
}

const Home: React.FC<HomeProps> = ({
  searchQuery,
  selectedCategory,
  language,
}) => {
  const t = TRANSLATIONS[language];

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      // 1. Filter by Category
      const categoryMatch =
        selectedCategory === "all" || tool.category === selectedCategory;

      // 2. Filter by Search Query
      const query = searchQuery.toLowerCase();
      const searchMatch =
        tool.name.toLowerCase().includes(query) ||
        tool.shortDescription.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query));

      return categoryMatch && searchMatch;
    });
  }, [searchQuery, selectedCategory]);

  const currentCategoryName =
    selectedCategory === "all"
      ? t.allTools
      : t.cat[selectedCategory] ||
        CATEGORIES.find((c) => c.id === selectedCategory)?.name ||
        "Tools";

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {currentCategoryName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t.showingResults.replace(
              "{{count}}",
              filteredTools.length.toString()
            )}
          </p>
        </div>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} language={language} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-100 dark:bg-dark-800 p-4 rounded-full mb-4">
            <Frown className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t.noToolsFound}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">
            {t.noToolsDesc}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
