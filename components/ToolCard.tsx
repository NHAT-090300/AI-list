
import React from 'react';
import { Tool, Language } from '../types';
import { TRANSLATIONS } from '../i18n';
import * as Icons from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  tool: Tool;
  language: Language;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, language }) => {
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  // Helper for pricing badge color
  const getPricingColor = (type: string) => {
    switch (type) {
      case 'Free': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Paid': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'Freemium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Waitlist': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Open Source': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pricingLabel = t.pricing[tool.pricing as keyof typeof t.pricing] || tool.pricing;

  // Generate a consistent pseudo-random gradient based on ID for the logo placeholder
  const generateGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c1 = Math.abs(hash % 360);
    const c2 = (c1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${c1}, 70%, 60%), hsl(${c2}, 70%, 50%))`;
  };

  return (
    <div 
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
    >
      <div className="p-5 flex flex-col h-full">
        {/* Header: Icon + Badge */}
        <div className="flex justify-between items-start mb-4">
          <div 
            className="w-12 h-12 rounded-lg shadow-inner flex items-center justify-center text-white font-bold text-lg"
            style={{ background: generateGradient(tool.id) }}
          >
            {tool.name.substring(0, 2).toUpperCase()}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPricingColor(tool.pricing)}`}>
            {pricingLabel}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
          {tool.shortDescription}
        </p>

        {/* Footer: Tags + Arrow */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2 overflow-hidden">
             {/* Only show first tag to keep card clean */}
             {tool.tags.slice(0, 1).map(tag => (
               <span key={tag} className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-dark-900 px-2 py-1 rounded">
                 #{tag}
               </span>
             ))}
          </div>
          <div className="text-blue-500 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <Icons.ArrowRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
