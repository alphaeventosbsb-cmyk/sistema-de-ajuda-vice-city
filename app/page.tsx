'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Search, Terminal, Copy, Check, ShieldAlert, Users, Shield, Skull, Crown, Globe, HeartPulse, Wrench, BookOpen, Send, Loader2, Bot, User, AlertTriangle, ClipboardEdit, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { commandsData, Command, CommandCategory } from '@/data/commands';
import { punishmentsData, Punishment } from '@/data/punishments';
import Markdown from 'react-markdown';
import { GeneralRules } from '@/app/components/GeneralRules';

const categoryIcons: Record<CommandCategory, React.ReactNode> = {
  ADM: <ShieldAlert className="w-4 h-4" />,
  EVENTOS: <Users className="w-4 h-4" />,
  POLICIA: <Shield className="w-4 h-4" />,
  ILEGAL: <Skull className="w-4 h-4" />,
  DIRETORES: <Crown className="w-4 h-4" />,
  GERAL: <Globe className="w-4 h-4" />,
  HOSPITAL: <HeartPulse className="w-4 h-4" />,
  MECANICA: <Wrench className="w-4 h-4" />,
};

const categoryColors: Record<CommandCategory, string> = {
  ADM: 'bg-red-500/10 text-red-400 border-red-500/20',
  EVENTOS: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  POLICIA: 'bg-blue-600/10 text-blue-500 border-blue-600/20',
  ILEGAL: 'bg-green-500/10 text-green-400 border-green-500/20',
  DIRETORES: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  GERAL: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  HOSPITAL: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  MECANICA: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

type Tab = 'COMANDOS' | 'REGRAS' | 'PUNICOES' | 'DENUNCIA';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('COMANDOS');
  
  // Commands State
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CommandCategory | 'ALL'>('ALL');

  // Punishments State
  const [punishmentsQuery, setPunishmentsQuery] = useState('');

  // Denuncia State
  const [denunciaForm, setDenunciaForm] = useState({
    id: '',
    dc: '',
    motivo: '',
    tempo: '',
    punicao: '',
    idDenunciante: '',
    status: 'Aplicado',
    provas: ''
  });
  const [copiedDenuncia, setCopiedDenuncia] = useState(false);

  // Rules Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: 'Olá! Eu sou o assistente de regras da Vice City. O que você gostaria de saber sobre as regras da cidade?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'REGRAS') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Commands Filter Logic
  const results = useMemo(() => {
    let filtered = commandsData;
    
    if (activeCategory !== 'ALL') {
      filtered = filtered.filter(cmd => cmd.category === activeCategory);
    }

    const cleanQuery = query
      .toLowerCase()
      .replace(/como /g, '')
      .replace(/fazer /g, '')
      .replace(/para /g, '')
      .replace(/o que é /g, '')
      .replace(/quero /g, '')
      .replace(/[?]/g, '')
      .trim();

    if (!cleanQuery) {
      return filtered;
    }

    const fuseInstance = new Fuse(filtered, {
      keys: ['name', 'description', 'tags'],
      threshold: 0.4,
      ignoreLocation: true,
      useExtendedSearch: true,
    });
    
    return fuseInstance.search(cleanQuery).map(result => result.item);
  }, [query, activeCategory]);

  // Punishments Filter Logic
  const punishmentsResults = useMemo(() => {
    if (!punishmentsQuery.trim()) {
      return punishmentsData;
    }

    const fuseInstance = new Fuse(punishmentsData, {
      keys: ['infraction', 'punishment'],
      threshold: 0.4,
      ignoreLocation: true,
    });
    
    return fuseInstance.search(punishmentsQuery).map(result => result.item);
  }, [punishmentsQuery]);

  // Denuncia Filter & Logic
  const generatedDenunciaText = `ID: ${denunciaForm.id}
DC: ${denunciaForm.dc}
MOTIVO: ${denunciaForm.motivo}
TEMPO: ${denunciaForm.tempo}
PUNIÇÃO: ${denunciaForm.punicao}
ID DENUNCIANTE: ${denunciaForm.idDenunciante || 'ID denunciante'}
STATUS: ${denunciaForm.status}
PROVAS: ${denunciaForm.provas}`;

  const handleCopyDenuncia = () => {
    navigator.clipboard.writeText(generatedDenunciaText);
    setCopiedDenuncia(true);
    setTimeout(() => setCopiedDenuncia(false), 2000);
  };

  const handleMotivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const motivo = e.target.value;
    const punishment = punishmentsData.find(p => p.infraction === motivo);
    
    if (punishment) {
      // Try to extract time if it has "MESES"
      const match = punishment.punishment.match(/(\d+)\s*MESES/);
      const tempo = match ? `${match[1]} MESES` : '';
      
      let punicaoStr = punishment.punishment;
      if (match) {
        punicaoStr = punicaoStr.replace(match[0], '').trim();
        if (punicaoStr.startsWith('+')) punicaoStr = punicaoStr.substring(1).trim();
      }
      
      setDenunciaForm(prev => ({ 
        ...prev, 
        motivo, 
        tempo, 
        punicao: punicaoStr || punishment.punishment 
      }));
    } else {
      setDenunciaForm(prev => ({ ...prev, motivo }));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(`/${text}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const rulesContext = commandsData.map(c => `Comando: /${c.name} - ${c.description}`).join('\n'); // Fallback if rulesData is too large, but let's import rulesData
      
      const { default: rulesData } = await import('@/data/rules.json');
      const formattedRules = rulesData.map((r: any) => `--- SEÇÃO: ${r.path} ---\n${r.text}`).join('\n\n');

      const systemInstruction = `Você é um assistente especialista nas regras e comandos da cidade "Vice City" de GTA RP (Lotus Group).
Sua função é responder às dúvidas dos jogadores sobre as regras da cidade e ajudá-los a encontrar os comandos corretos.

Diretrizes:
1. Responda baseando-se EXCLUSIVAMENTE nas regras e comandos fornecidos abaixo.
2. Se o jogador perguntar sobre como fazer algo (ex: "como prender alguém"), busque nos comandos fornecidos e indique o comando correto e sua categoria.
3. Se o jogador perguntar sobre regras, cite a seção da regra (ex: "De acordo com a seção Geral/Punições...") quando possível.
4. Se a resposta não estiver nas regras ou comandos, diga educadamente que não encontrou essa informação.
5. Formate sua resposta em Markdown para facilitar a leitura (use negrito, listas, blocos de código para os comandos, etc).

COMANDOS DA CIDADE:
${rulesContext}

REGRAS DA CIDADE:
${formattedRules}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });
      
      if (response.text) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: response.text! }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: 'Desculpe, ocorreu um erro ao buscar a resposta.' }]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      let errorMessage = 'Erro de conexão. Tente novamente mais tarde.';
      
      if (error?.message?.includes('API key not valid') || error?.message?.includes('API_KEY_INVALID')) {
        errorMessage = 'Erro: Chave da API do Gemini inválida ou não configurada. Por favor, verifique suas configurações no AI Studio (Settings > Secrets > GEMINI_API_KEY).';
      } else if (error?.message?.includes('API key is required')) {
        errorMessage = 'Erro: A chave da API do Gemini não foi encontrada. Configure a variável GEMINI_API_KEY no AI Studio.';
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Header / Hero */}
      <div className="relative overflow-hidden border-b border-white/5 bg-black/50 shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0a] to-[#0a0a0a]"></div>
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-8 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.15)]">
              <Terminal className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight mb-4">
            Assistente <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">GTA RP</span>
          </h1>
          <p className="text-zinc-400 text-center text-lg max-w-2xl mx-auto mb-8">
            Encontre comandos rapidamente ou tire dúvidas sobre as regras da cidade Vice City.
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-2 max-w-2xl mx-auto bg-zinc-900/50 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md flex-wrap">
            <button
              onClick={() => setActiveTab('COMANDOS')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'COMANDOS' 
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Comandos
            </button>
            <button
              onClick={() => setActiveTab('REGRAS')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'REGRAS' 
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Regras da Cidade
            </button>
            <button
              onClick={() => setActiveTab('PUNICOES')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'PUNICOES' 
                  ? 'bg-rose-500/20 text-rose-300 shadow-sm border border-rose-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Punições
            </button>
            <button
              onClick={() => setActiveTab('DENUNCIA')}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'DENUNCIA' 
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <ClipboardEdit className="w-4 h-4" />
              Gerar Punição
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 flex flex-col">
        {activeTab === 'COMANDOS' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full"
          >
            {/* Search Bar */}
            <div className="relative mb-8 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl leading-5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-lg shadow-lg backdrop-blur-sm"
                placeholder="Ex: quero prender alguem..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === 'ALL' 
                    ? 'bg-zinc-100 text-zinc-900 shadow-md' 
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-white/5'
                }`}
              >
                Todos
              </button>
              {(['ADM', 'EVENTOS', 'POLICIA', 'ILEGAL', 'DIRETORES', 'GERAL', 'HOSPITAL', 'MECANICA'] as CommandCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${
                    activeCategory === cat 
                      ? categoryColors[cat].replace('/10', '/20').replace('text-', 'bg-').replace('400', '500').replace('500', '600') + ' text-white shadow-lg' 
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border-white/5'
                  }`}
                >
                  {categoryIcons[cat]}
                  <span className="capitalize">{cat.toLowerCase()}</span>
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="space-y-4 pb-10">
              <AnimatePresence mode="popLayout">
                {results.length > 0 ? (
                  results.map((cmd) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={cmd.id}
                      className="group bg-zinc-900/40 border border-white/5 rounded-2xl p-5 hover:bg-zinc-900/80 hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-lg font-bold text-indigo-300 tracking-tight">
                            /{cmd.name}
                          </span>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border flex items-center gap-1.5 ${categoryColors[cmd.category]}`}>
                            {categoryIcons[cmd.category]}
                            {cmd.category}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          {cmd.description}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleCopy(cmd.name, cmd.id)}
                        className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium text-sm transition-colors border border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        {copiedId === cmd.id ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-16 h-16 mx-auto bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                      <Search className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-medium text-zinc-300 mb-2">Nenhum comando encontrado</h3>
                    <p className="text-zinc-500">
                      Tente buscar com outras palavras ou verifique se a categoria correta está selecionada.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : activeTab === 'PUNICOES' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full"
          >
            {/* Search Bar for Punishments */}
            <div className="relative mb-8 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-rose-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl leading-5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all text-lg shadow-lg backdrop-blur-sm"
                placeholder="Buscar infração (ex: VDM, RDM, Desacato)..."
                value={punishmentsQuery}
                onChange={(e) => setPunishmentsQuery(e.target.value)}
              />
            </div>

            {/* Punishments Table */}
            <div className="bg-zinc-900/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10">
                      <th className="py-4 px-6 font-medium text-zinc-400 text-sm uppercase tracking-wider">Infração</th>
                      <th className="py-4 px-6 font-medium text-zinc-400 text-sm uppercase tracking-wider">Punição</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence>
                      {punishmentsResults.length > 0 ? (
                        punishmentsResults.map((punishment, index) => (
                          <motion.tr 
                            key={punishment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="hover:bg-white/5 transition-colors group"
                          >
                            <td className="py-4 px-6 font-medium text-zinc-200 group-hover:text-rose-300 transition-colors">
                              {punishment.infraction}
                            </td>
                            <td className="py-4 px-6 text-zinc-400 font-mono">
                              {punishment.punishment}
                            </td>
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="py-12 text-center text-zinc-500">
                            Nenhuma punição encontrada para &quot;{punishmentsQuery}&quot;.
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'DENUNCIA' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-6 h-full"
          >
            {/* Form */}
            <div className="flex-1 bg-zinc-900/30 border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                <ClipboardEdit className="w-5 h-5" />
                Gerar Registro de Punição
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">ID do Infrator</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={denunciaForm.id}
                      onChange={e => setDenunciaForm(prev => ({ ...prev, id: e.target.value }))}
                      placeholder="Ex: 58745"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Discord ID (DC)</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={denunciaForm.dc}
                      onChange={e => setDenunciaForm(prev => ({ ...prev, dc: e.target.value }))}
                      placeholder="Ex: 14241486..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Motivo (Infração)</label>
                  <input
                    type="text"
                    list="infractions-list"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    value={denunciaForm.motivo}
                    onChange={handleMotivoChange}
                    placeholder="Selecione ou digite..."
                  />
                  <datalist id="infractions-list">
                    {punishmentsData.map(p => (
                      <option key={p.id} value={p.infraction} />
                    ))}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Tempo</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={denunciaForm.tempo}
                      onChange={e => setDenunciaForm(prev => ({ ...prev, tempo: e.target.value }))}
                      placeholder="Ex: 1000 MESES"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Punição</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={denunciaForm.punicao}
                      onChange={e => setDenunciaForm(prev => ({ ...prev, punicao: e.target.value }))}
                      placeholder="Ex: CAMISA DE FORÇA + ADV"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">ID Denunciante</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={denunciaForm.idDenunciante}
                      onChange={e => setDenunciaForm(prev => ({ ...prev, idDenunciante: e.target.value }))}
                      placeholder="ID denunciante"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Status</label>
                    <select
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                      value={denunciaForm.status}
                      onChange={e => setDenunciaForm(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="Aplicado">Aplicado</option>
                      <option value="Pendente">Pendente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Provas (Links ou Arquivo)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      value={denunciaForm.provas}
                      onChange={e => setDenunciaForm(prev => ({ ...prev, provas: e.target.value }))}
                      placeholder="Link do vídeo/print ou anexe ao lado"
                    />
                    <label className="flex items-center justify-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-xl cursor-pointer transition-colors" title="Anexar arquivo">
                      <Paperclip className="w-5 h-5 text-zinc-400" />
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={e => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            setDenunciaForm(prev => ({ ...prev, provas: files[0].name }));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 bg-zinc-900/50 border border-white/10 rounded-3xl p-6 shadow-2xl relative">
                <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Pré-visualização (Discord)</h3>
                <pre className="font-mono text-sm text-zinc-300 whitespace-pre-wrap bg-black/30 p-4 rounded-xl border border-white/5">
                  {generatedDenunciaText}
                </pre>
                
                <button
                  onClick={handleCopyDenuncia}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {copiedDenuncia ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copiar para o Discord
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-6 h-[800px]"
          >
            {/* Rules Content */}
            <div className="flex-1 bg-zinc-900/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-4 bg-zinc-900/80 border-b border-white/5 backdrop-blur-md shrink-0">
                <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Regras Gerais
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
                <GeneralRules />
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col bg-zinc-900/30 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-zinc-900/80 border-b border-white/5 backdrop-blur-md shrink-0">
                <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Assistente IA de Regras
                </h2>
              </div>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-400' 
                        : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                    }`}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-zinc-800/80 border border-white/5 text-zinc-200 rounded-tl-sm'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-zinc-800/80 border border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span className="text-zinc-400 text-sm">Consultando as regras...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-zinc-900/80 border-t border-white/5 backdrop-blur-md shrink-0">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Pergunte algo sobre as regras (ex: O que é VDM?)"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isLoading}
                    className="absolute right-2 w-10 h-10 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

