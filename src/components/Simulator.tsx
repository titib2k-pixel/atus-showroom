import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";

type Msg = { from: "user" | "atus"; text: string };

interface SimulatorProps {
  universe: { id: string; title: string; desc: string; color: string; border: string; };
  onBack: () => void;
}

const SCRIPTS: Record<string, Msg[]> = {
  pizzaria: [
    { from: "user", text: "Cheguei na mesa 7. O que recomendam?" },
    { from: "atus", text: "Boa noite! 👋 A mais pedida é a Calabresa artesanal (R$ 42)." },
    { from: "user", text: "Quero 1 + uma coca gelada" },
    { from: "atus", text: "Fechado: R$ 57. Pix na tela e cozinha avisada. 🍕" },
    { from: "user", text: "Paguei ✅" },
    { from: "atus", text: "Recebido! Pedido saindo pra mesa 7. Bom apetite! 🎉" },
  ],
  estadio: [
    { from: "user", text: "Setor Norte, cadeira 14. Cerveja!" },
    { from: "atus", text: "🍺 2 geladas a caminho da cadeira 14. Total R$ 24." },
    { from: "user", text: "Pagou ✅" },
    { from: "atus", text: "Confirmado! O entregador já sabe onde você está. 🏟️" },
  ],
  salao: [
    { from: "user", text: "Tem horário para hoje à tarde?" },
    { from: "atus", text: "Tenho sim! 💇‍♀️ 15h com a Ana ou 16h30 com o Carlos." },
    { from: "user", text: "15h com a Ana" },
    { from: "atus", text: "Agendado! ✨ Te mando lembrete 30min antes." },
  ],
  shopping: [
    { from: "user", text: "Tem alguma promo rolando agora?" },
    { from: "atus", text: "Tem! 🎟️ 10% OFF na Sneaker Lab pra quem interagir agora." },
    { from: "user", text: "Quero!" },
    { from: "atus", text: "Cupom na mão ✅ Te guio até a loja pelo mapa vivo. 🗺️" },
  ],
  cinema: [
    { from: "user", text: "Poltrona G7. Combo de pipoca!" },
    { from: "atus", text: "🍿 Combo grande a caminho da G7. R$ 38." },
    { from: "user", text: "Top! Pagando agora" },
    { from: "atus", text: "Recebido! O entregador chega antes do trailer. 🎬" },
  ],
};

export default function Simulator({ universe, onBack }: SimulatorProps) {
  // 🛡️ Blindagem: Fallback para pizzaria se o id não existir
  const script = SCRIPTS[universe?.id] || SCRIPTS.pizzaria;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let i = 0;
    let alive = true;

    const run = () => {
      if (!alive || i >= script.length) {
        if (alive) setFinished(true);
        return;
      }
      const next = script[i];
      if (next?.from === "atus") {
        setTyping(true);
        setTimeout(() => {
          if (!alive) return;
          setTyping(false);
          setMessages((m) => [...m, next]);
          i++;
          setTimeout(run, 600);
        }, 1400);
      } else {
        setMessages((m) => [...m, next]);
        i++;
        setTimeout(run, 900);
      }
    };

    const t = setTimeout(run, 800);
    return () => { alive = false; clearTimeout(t); };
  }, [universe?.id]);

  const safeMessages = messages || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${universe?.color || "from-white/10 to-white/5"} rounded-full blur-[150px] opacity-30 pointer-events-none`} />

      <button onClick={onBack} className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full glass text-white/80 hover:text-white transition group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 relative z-10">
        <h2 className="text-3xl md:text-4xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 uppercase">
          {universe?.title || "Demonstração"}
        </h2>
        <p className="text-white/50 text-sm mt-2 max-w-md mx-auto">{universe?.desc}</p>
      </motion.div>

      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-md">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="relative w-[300px] h-[600px] rounded-[3rem] border-[8px] border-white/10 bg-black shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-20" />

          <div className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-r ${universe?.color || "from-white/10 to-white/5"} backdrop-blur-md px-4 py-3 flex items-center gap-2`}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-xs font-bold tracking-wide">ATUS</p>
              <p className="text-white/70 text-[9px]">Online · Respondendo</p>
            </div>
          </div>

          <div className="absolute inset-0 pt-16 pb-4 px-3 overflow-y-auto flex flex-col gap-2">
            <AnimatePresence>
              {safeMessages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }} className={`max-w-[85%] rounded-2xl px-3 py-2 text-[11px] leading-snug ${m.from === "user" ? "ml-auto bg-white/15 text-white rounded-br-sm" : "mr-auto bg-white/5 text-white/90 rounded-bl-sm"}`} style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {m?.text || "..."}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mr-auto flex gap-1 rounded-2xl bg-white/5 px-3 py-2">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70" />
              </motion.div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center gap-2">
            <div className="flex-1 h-8 rounded-full bg-white/10 px-3 flex items-center">
              <span className="text-white/40 text-[10px]">Fale com o ATUS...</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white/60" />
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {finished && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mt-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300 tracking-wide">DEMONSTRAÇÃO CONCLUÍDA</span>
            </div>
            <p className="text-white/70 text-sm max-w-md">Quer ver isso funcionando com <span className="text-white font-semibold">a sua marca</span>?</p>
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-white to-white/80 text-black font-bold text-sm tracking-wide hover:scale-105 transition-transform shadow-lg shadow-white/20">
              Ver com a minha marca →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}