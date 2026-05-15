import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UTMForm } from './components/UTMForm';
import { UTMHistory, HistoryItem } from './components/UTMHistory';
import { Layout, BarChart3, Settings, HelpCircle, Github } from 'lucide-react';

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('utm_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('utm_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = (url: string, params: any) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      url,
      originalUrl: params.url,
      params: {
        source: params.source,
        medium: params.medium,
        name: params.name,
      },
      timestamp: Date.now(),
    };
    setHistory([newItem, ...history].slice(0, 50)); // Keep last 50
  };

  const handleDelete = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Layout className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">UTM Builder</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Campaign Tracker</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Presets</a>
            <div className="h-4 w-px bg-slate-200"></div>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Build Campaign URL</h2>
                  <p className="text-sm text-slate-500">Fill in the parameters to generate your tracking link.</p>
                </div>
              </div>

              <UTMForm onGenerate={handleGenerate} />
            </motion.div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-indigo-600 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-indigo-200"
            >
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Quick Tip
                </h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Always use consistent naming conventions for your campaigns. 
                  Lowercase letters and underscores are recommended to avoid data fragmentation in your analytics tools.
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </motion.div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 sticky top-28"
            >
              <UTMHistory 
                items={history} 
                onDelete={handleDelete} 
                onClear={handleClear} 
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2026 UTM Campaign Builder. Professional marketing utility.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
