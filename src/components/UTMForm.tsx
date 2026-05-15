import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCcw, Link as LinkIcon, Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UTMParams {
  url: string;
  source: string;
  medium: string;
  name: string;
  term: string;
  content: string;
}

interface UTMFormProps {
  onGenerate: (url: string, params: UTMParams) => void;
}

const Tooltip = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block ml-1.5 group">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-slate-400 hover:text-indigo-500 transition-colors"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] leading-relaxed rounded-lg shadow-xl pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const UTMForm: React.FC<UTMFormProps> = ({ onGenerate }) => {
  const [params, setParams] = useState<UTMParams>({
    url: '',
    source: '',
    medium: '',
    name: '',
    term: '',
    content: '',
  });

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!params.url) {
      setGeneratedUrl('');
      return;
    }

    try {
      const urlObj = new URL(params.url.startsWith('http') ? params.url : `https://${params.url}`);
      const searchParams = new URLSearchParams(urlObj.search);

      if (params.source) searchParams.set('utm_source', params.source);
      if (params.medium) searchParams.set('utm_medium', params.medium);
      if (params.name) searchParams.set('utm_campaign', params.name);
      if (params.term) searchParams.set('utm_term', params.term);
      if (params.content) searchParams.set('utm_content', params.content);

      urlObj.search = searchParams.toString();
      setGeneratedUrl(urlObj.toString());
    } catch (e) {
      setGeneratedUrl('Invalid URL');
    }
  }, [params]);

  const handleCopy = () => {
    if (generatedUrl && generatedUrl !== 'Invalid URL') {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      onGenerate(generatedUrl, params);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setParams({
      url: '',
      source: '',
      medium: '',
      name: '',
      term: '',
      content: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="label-text">
            Website URL <span className="text-red-500">*</span>
            <Tooltip text="The full website URL (e.g. https://www.google.com) you want to track." />
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LinkIcon className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="example.com"
              value={params.url}
              onChange={(e) => setParams({ ...params, url: e.target.value })}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
            <Info className="h-3 w-3" /> The full website URL (e.g. https://www.google.com)
          </p>
        </div>

        <div>
          <label className="label-text">
            Campaign Source <span className="text-red-500">*</span>
            <Tooltip text="The platform where the traffic originates (e.g. google, newsletter, twitter)." />
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="google, newsletter, twitter"
            value={params.source}
            onChange={(e) => setParams({ ...params, source: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-500">Referrer: (e.g. google, facebook)</p>
        </div>

        <div>
          <label className="label-text">
            Campaign Medium <span className="text-red-500">*</span>
            <Tooltip text="The marketing medium used (e.g. cpc, banner, email, social)." />
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="cpc, banner, email"
            value={params.medium}
            onChange={(e) => setParams({ ...params, medium: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-500">Marketing medium: (e.g. cpc, banner, email)</p>
        </div>

        <div>
          <label className="label-text">
            Campaign Name <span className="text-red-500">*</span>
            <Tooltip text="Identifies a specific product promotion or strategic campaign (e.g. spring_sale)." />
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="spring_sale"
            value={params.name}
            onChange={(e) => setParams({ ...params, name: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-500">Product, promo code, or slogan</p>
        </div>

        <div>
          <label className="label-text">
            Campaign Term
            <Tooltip text="Used for paid search to identify the keywords for this ad." />
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="running+shoes"
            value={params.term}
            onChange={(e) => setParams({ ...params, term: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-500">Identify the paid keywords</p>
        </div>

        <div className="md:col-span-2">
          <label className="label-text">
            Campaign Content
            <Tooltip text="Used to differentiate similar content, or links within the same ad (e.g. logolink vs textlink)." />
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="logolink, textlink"
            value={params.content}
            onChange={(e) => setParams({ ...params, content: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-500">Use to differentiate ads</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Generated URL</h3>
          <button
            onClick={resetForm}
            className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCcw className="h-3 w-3" /> Reset Form
          </button>
        </div>
        
        <div className="relative group">
          <div className="w-full min-h-[80px] p-4 bg-slate-900 rounded-xl text-slate-300 font-mono text-sm break-all selection:bg-indigo-500/30">
            {generatedUrl || 'Fill in the fields above to generate a URL...'}
          </div>
          
          <AnimatePresence>
            {generatedUrl && generatedUrl !== 'Invalid URL' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleCopy}
                className={`absolute right-3 top-3 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                  copied 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy URL
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
