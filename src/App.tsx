import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pizza, Trophy, Scissors, ShoppingBag, Film, ArrowRight, Sparkles } from "lucide-react";
import Simulator from "./components/Simulator";

const universes = [
  { id: "pizzaria", title: "Pizzaria & Delivery", icon: Pizza, desc: "Pedidos na mesa, sem garçom, sem app. Pix em 41 segundos.", color: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/30", glow: "group-hover:shadow-amber-500/20" },
  { id: "estadio", title: "Estádio & Arena", icon: Trophy, desc: "Cerveja gelada entregue exatamente na cadeira. Sem perder o lance.", color: "from-emerald-500/20 to-green-600/20", border: "border-emerald-500/30", glow: "group-hover:shadow-emerald-500/20" },
  { id: "salao", title: "Salão & Estética", icon: Scissors, desc: "Agendamentos, lembretes e venda de produtos via chat inteligente.", color: "from-pink-500/20 to-rose-600/20", border: "border-pink-500/30", glow: "group-hover:shadow-pink-500/20" },
  { id: "shopping", title: "Shopping & Varejo", icon: ShoppingBag, desc: "Cupons vivos, mapas interativos e fidelização sem atrito.", color: "from-violet-500/20 to-purple-600/20", border: "border-violet-500/30", glow: "group-hover:shadow-violet-500/20" },
  { id: "cinema", title: "Cinema & Entretenimento", icon: Film, desc: "Reserva de poltrona e combo de pipoca direto da tela do celular.", color: "from-red-500/20 to-rose-600/20", border: "border-red-500/30", glow: "group-hover:shadow-red-500/20" },
];

export default function App() {
  const [selected, setSelected] = useState<any>(null);

  if (selected) {
    return (
      <AnimatePresence mode="wait">
        <Simulator key="simulator" universe={selected} onBack={() => setSelected(null)} />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">ATUS Experience Center</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white/60 uppercase mb-4">ATUS</h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light">Escolha o universo do seu negócio e <span className="text-white font-medium">veja a mágica acontecer</span> em tempo real.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full relative z-10">
        {(universes || []).map((u, index) => {
          const Icon = u.icon;
          return (
            <motion.div key={u.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} onClick={() => setSelected(u)} className={`group relative p-8 rounded-3xl glass ${u.border} ${u.glow} shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${u.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <Icon className="w-7 h-7 text-white/90" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{u.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">{u.desc}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                  <span>Ver demonstração</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-20 text-center text-white/30 text-xs tracking-widest uppercase">
        O futuro do atendimento sem atrito
      </motion.div>
    </div>
  );
}