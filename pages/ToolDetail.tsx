
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../data';
import { TRANSLATIONS } from '../i18n';
import { Language } from '../types';
import { ExternalLink, CheckCircle, ArrowLeft, Share2, Info } from 'lucide-react';

interface ToolDetailProps {
  language: Language;
}

const ToolDetail: React.FC<ToolDetailProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const tool = TOOLS.find((t) => t.id === id);
  
  // Find alternatives
  const alternatives = tool?.alternatives.map(altId => TOOLS.find(t => t.id === altId)).filter(Boolean) || [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.noToolsFound}</h2>
         <button onClick={() => navigate('/')} className="mt-4 text-blue-500 hover:underline">
            {t.backToDirectory}
         </button>
      </div>
    );
  }

  // Helper for generic category name
  const categoryName = t.cat[tool.category] || CATEGORIES.find(c => c.id === tool.category)?.name;
  const pricingLabel = t.pricing[tool.pricing as keyof typeof t.pricing] || tool.pricing;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t.backToDirectory}
      </button>

      {/* Header Section */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8 relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0"
             style={{ background: `linear-gradient(135deg, #3b82f6, #8b5cf6)` }}>
             {tool.name.substring(0, 2).toUpperCase()}
          </div>
          
          <div className="flex-1">
             <div className="flex flex-wrap items-center gap-3 mb-3">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
               <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {categoryName}
               </span>
               <span className={`px-3 py-1 rounded-full text-sm font-medium 
                  ${tool.pricing === 'Paid' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 
                    tool.pricing === 'Free' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                  {pricingLabel}
               </span>
             </div>
             <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
               {tool.fullDescription}
             </p>

             <div className="flex flex-wrap gap-3">
               <a 
                 href={tool.websiteUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
               >
                 {t.visitWebsite}
                 <ExternalLink className="ml-2 -mr-1 w-5 h-5" />
               </a>
               <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                 <Share2 className="mr-2 w-5 h-5" />
                 {t.share}
               </button>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Key Features */}
          <section>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                {t.keyFeatures}
             </h2>
             <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {tool.features.map((feature, idx) => (
                   <li key={idx} className="flex items-start">
                     <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                     </div>
                     <span className="ml-3 text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </section>

          {/* FAQ Placeholder */}
          <section>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                {t.faq}
             </h2>
             <div className="space-y-4">
                <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                   <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                     {t.isFree.replace('{{name}}', tool.name)}
                   </h4>
                   <p className="text-gray-600 dark:text-gray-400 text-sm">
                     {tool.pricing === 'Free' ? 'Yes, it is completely free.' : 
                      tool.pricing === 'Paid' ? 'No, this is a paid tool, but they may offer a trial.' :
                      'It offers a free tier with limited features, and paid plans for more power.'}
                   </p>
                </div>
                <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                   <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                     {t.bestFor.replace('{{name}}', tool.name)}
                   </h4>
                   <p className="text-gray-600 dark:text-gray-400 text-sm">
                     Based on its category ({categoryName}), it is best suited for tasks related to {categoryName?.toLowerCase()}.
                   </p>
                </div>
             </div>
          </section>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
           {/* Tags */}
           <div className="bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t.tags}</h3>
              <div className="flex flex-wrap gap-2">
                 {tool.tags.map(tag => (
                   <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                     {tag}
                   </span>
                 ))}
              </div>
           </div>

           {/* Alternatives Widget */}
           {alternatives.length > 0 && (
             <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.alternatives}</h3>
                <div className="space-y-4">
                   {alternatives.map((alt) => (
                     alt && (
                       <div key={alt.id} onClick={() => navigate(`/tool/${alt.id}`)} className="cursor-pointer bg-white dark:bg-dark-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                             {alt.name.substring(0, 2)}
                          </div>
                          <div>
                             <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{alt.name}</h4>
                             <p className="text-xs text-gray-500">{t.pricing[alt.pricing as keyof typeof t.pricing] || alt.pricing}</p>
                          </div>
                       </div>
                     )
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
