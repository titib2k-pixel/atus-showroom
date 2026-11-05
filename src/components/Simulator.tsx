import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, MessageCircle, CheckCircle2, ShoppingBag, QrCode, Clock } from "lucide-react";

type MsgType = "user" | "atus" | "qrcode" | "payment" | "delivery";

interface Msg {
  id: number;
  type: MsgType;
  text?: string;
  amount?: string;
  qrData?: string;
  timestamp: string;
}

interface SimulatorProps {
  universe: { id: string; title: string; desc: string; color: string; border: string };
  onBack: () => void;
}

const SCRIPTS: Record<string, { user: string[]; atus: string[] }> = {
  pizzaria: {
    user: ["Cheguei na mesa 7. O que recomendam?", "Quero 1 pizza + uma coca gelada", "Paguei ✅", "Qual o tempo de entrega?"],
    atus: [
      "Boa noite! 🍕 A mais pedida é a **Calabresa Artesanal** (R$ 42) com borda recheada. Quer ver o cardápio em vídeo?",
      "Perfeito! 📋 **1 Pizza Calabresa Grande** + **Coca-Cola 2L gelada**\n\nTotal: **R$ 57,00**\n\nVou gerar seu QR Code Pix agora...",
      "✅ **Pagamento confirmado!** Cozinha já foi avisada. Seu pedido #482 está sendo preparado!",
      "⏱️ Tempo estimado: **25 minutos**. Entregador vai até a mesa 7. Bom apetite! 🎉"
    ]
  },
  estadio: {
    user: ["Setor Norte, cadeira 14. Cerveja!", "Pagou ✅", "Mais uma rodada!"],
    atus: [
      " **2 Cervejas geladas** a caminho da cadeira 14 - Setor Norte.\n\nTotal: **R$ 24,00**\n\nVocê não perdeu nenhum lance! ⚽",
      "✅ **Pagamento recebido!** Entregador já sabe EXATAMENTE onde você está. Chegando em 3 min! 🏟️",
      "🍻 **Mais 2 cervejas** confirmadas! Total R$ 24. Pedido #892 saindo do bar!"
    ]
  },
  salao: {
    user: ["Tem horário para hoje à tarde?", "15h com a Ana", "Quero fazer as unhas também"],
    atus: [
      "Tenho sim! 💇‍♀️ **15h com a stylist Ana** ou **16h30 com o Carlos**. Qual prefere?",
      "✨ **Agendado!** 15h com Ana - Corte + Escova\n\nTe mando lembrete 30min antes. Até lá! 💫",
      "💅 Perfeito! Adicionei **Manicure** às 15h30. Pacote completo: R$ 85. Quer agendar?"
    ]
  },
  shopping: {
    user: ["Tem alguma promo rolando agora?", "Quero!", "Onde fica a loja?"],
    atus: [
      "🎟️ **SIM!** O banner vivo liberou **10% OFF** na Sneaker Lab pra quem interagir agora. Cupom: ATUS10",
      "✅ **Cupom aplicado!** 🛍️ Mostre essa tela no caixa. Válido por 2 horas.",
      "🗺️ **Sneaker Lab** - Piso 2, Loja 45. Quer que eu te guie pelo mapa vivo até lá?"
    ]
  },
  cinema: {
    user: ["Poltrona G7. Combo de pipoca!", "Top! Pagando agora", "Chegou?"],
    atus: [
      "🍿 **Combo Grande** (pipoca + 2 refrigerantes) a caminho da **G7**.\n\nTotal: **R$ 38,00**",
      "✅ **Recebido!** O entregador chega antes do trailer acabar. Bom filme! 🎬",
      "️ **Sim!** Entregador está a 2 minutos da G7. Aproveite o filme!"
    ]
  }
};

export default function Simulator({ universe, onBack }: SimulatorProps) {
  const script = SCRIPTS[universe?.id] || SCRIPTS.pizzaria;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [cycle, setCycle] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  useEffect(() => {
    let step = 0;
    let alive = true;
    const maxSteps = script.user.length + script.atus.length;

    const getCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    };

    const run = () => {
      if (!alive) return;

      const userIndex = step % script.user.length;
      const atusIndex = step % script.atus.length;

      // Mensagem do usuário
      setTimeout(() => {
        if (!alive) return;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "user",
            text: script.user[userIndex],
            timestamp: getCurrentTime()
          }
        ]);
      }, 1000);

      // Resposta do ATUS
      setTimeout(() => {
        if (!alive) return;
        setTyping(true);
      }, 2500);

      setTimeout(() => {
        if (!alive) return;
        setTyping(false);
        
        const atusMsg = script.atus[atusIndex];
        
        // Adiciona mensagem de texto do ATUS
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "atus",
            text: atusMsg,
            timestamp: getCurrentTime()
          }
        ]);

        // Se for mensagem de pagamento, adiciona QR Code depois
        if (atusMsg.includes("QR Code") || atusMsg.includes("R$")) {
          setTimeout(() => {
            if (!alive) return;
            const amount = atusMsg.match(/R\$ [\d,]+/)?.[0] || "R$ 57,00";
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                type: "qrcode",
                amount: amount,
                timestamp: getCurrentTime()
              }
            ]);
          }, 1500);

          // Confirmação de pagamento
          setTimeout(() => {
            if (!alive) return;
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 2,
                type: "payment",
                text: "Pagamento confirmado!",
                timestamp: getCurrentTime()
              }
            ]);
          }, 4000);

          // Confirmação de entrega/pedido
          setTimeout(() => {
            if (!alive) return;
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 3,
                type: "delivery",
                text: "Pedido sendo preparado!",
                timestamp: getCurrentTime()
              }
            ]);
          }, 6000);
        }

        step++;
        if (step >= maxSteps) {
          setTimeout(() => {
            if (alive) {
              setCycle((c) => c + 1);
              setMessages([]); // Limpa e recomeça
              step = 0;
            }
          }, 8000);
        } else {
          setTimeout(run, 3000);
        }
      }, 4000);
    };

    const initialTimeout = setTimeout(run, 1500);
    return () => {
      alive = false;
      clearTimeout(initialTimeout);
    };
  }, [universe?.id, cycle, script]);

  const getBubbleColor = (type: MsgType) => {
    switch (type) {
      case "user":
        return "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-br-md";
      case "atus":
        return "bg-white/10 text-white/90 rounded-2xl rounded-bl-md border border-white/10";
      case "qrcode":
        return "bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/40 rounded-2xl p-4";
      case "payment":
        return "bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-3";
      case "delivery":
        return "bg-violet-500/20 border border-violet-500/40 rounded-2xl p-3";
      default:
        return "bg-white/10";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center p-4 md:p-8 relative overflow-hidden bg-[#050507]"
    >
      {/* Efeito JARVIS - Fundo com glow dinâmico */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br ${universe?.color || "from-cyan-500/20 to-blue-600/20"} rounded-full blur-[150px] opacity-40 pointer-events-none animate-pulse-slow`} />
      
      {/* Grid futurista de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Botão Voltar - Estilo JARVIS */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 transition-all group shadow-lg shadow-cyan-500/20"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold tracking-wide">VOLTAR</span>
      </button>

      {/* Cabeçalho - Estilo JARVIS */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase">Sistema ATUS Ativo</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 uppercase">
          {universe?.title || "Demonstração"}
        </h2>
        <p className="text-cyan-200/60 text-sm mt-2 max-w-md mx-auto font-light">{universe?.desc}</p>
      </motion.div>

      {/* Mockup do Celular - TAMANHO MAIOR */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-lg">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative w-[360px] h-[720px] rounded-[3.5rem] border-[10px] border-gray-800 bg-black shadow-2xl overflow-hidden ring-1 ring-white/10"
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-30" />

          {/* Header do Chat - Estilo WhatsApp/JARVIS */}
          <div className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-r ${universe?.color || "from-cyan-600 to-blue-700"} backdrop-blur-xl px-4 py-3 flex items-center gap-3 shadow-lg`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold tracking-wide">ATUS</p>
              <p className="text-cyan-200 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Online · Respondendo
              </p>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-white/80" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white/80" />
              </div>
            </div>
          </div>

          {/* Área de Mensagens - Scroll de baixo para cima */}
          <div className="absolute inset-0 pt-16 pb-4 px-3 overflow-y-auto flex flex-col gap-2 bg-gradient-to-b from-gray-900/50 to-black">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[88%] ${msg.type === "user" ? "ml-auto" : "mr-auto"}`}
                >
                  {msg.type === "qrcode" ? (
                    <div className={`${getBubbleColor(msg.type)} backdrop-blur-md`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-300 text-xs font-semibold">PIX - {msg.amount}</span>
                        <QrCode className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="bg-white p-2 rounded-lg">
                        <div className="w-32 h-32 bg-black rounded flex items-center justify-center">
                          <QrCode className="w-24 h-24 text-white" />
                        </div>
                      </div>
                      <p className="text-amber-200/80 text-[10px] mt-2 text-center">Escaneie para pagar</p>
                    </div>
                  ) : msg.type === "payment" ? (
                    <div className={`${getBubbleColor(msg.type)} backdrop-blur-md flex items-center gap-2`}>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-emerald-300 text-xs font-bold">✅ PAGAMENTO CONFIRMADO</p>
                        <p className="text-emerald-200/70 text-[10px]">{msg.timestamp}</p>
                      </div>
                    </div>
                  ) : msg.type === "delivery" ? (
                    <div className={`${getBubbleColor(msg.type)} backdrop-blur-md flex items-center gap-2`}>
                      <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-violet-300 text-xs font-bold">️ PEDIDO EM PREPARO</p>
                        <p className="text-violet-200/70 text-[10px]">Saindo em breve...</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`${getBubbleColor(msg.type)} backdrop-blur-md px-3 py-2`}>
                      <p 
                        className="text-[11px] leading-snug whitespace-pre-line"
                        style={{ textShadow: msg.type === "user" ? "0 1px 4px rgba(0,0,0,0.5)" : "none" }}
                        dangerouslySetInnerHTML={{ __html: msg.text || "" }}
                      />
                      <p className={`text-[9px] mt-1 ${msg.type === "user" ? "text-blue-200/60 text-right" : "text-white/40"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mr-auto max-w-[70%] bg-white/10 rounded-2xl rounded-bl-md px-3 py-2 backdrop-blur-md border border-white/10"
              >
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:-.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Falso - Estilo WhatsApp */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-900/90 backdrop-blur-xl border-t border-white/10 flex items-center gap-2">
            <div className="flex-1 h-10 rounded-full bg-white/5 px-4 flex items-center border border-white/10">
              <span className="text-white/40 text-[11px]">Fale com o ATUS...</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Efeito de scan JARVIS */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-cyan-500/5 to-transparent animate-pulse" />
        </motion.div>
      </div>

      {/* Badge de Status - Estilo JARVIS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-6 flex items-center gap-3 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md"
      >
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-cyan-300 text-xs font-bold tracking-widest uppercase">Sistema em Operação</span>
        <Clock className="w-4 h-4 text-cyan-400" />
      </motion.div>
    </motion.div>
  );
}