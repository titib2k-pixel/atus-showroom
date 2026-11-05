import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, X } from "lucide-react";

type MsgType = "user" | "atus" | "qrcode" | "menu";

interface Msg {
  id: number;
  type: MsgType;
  text?: string;
  amount?: string;
  menuItems?: { name: string; price: string }[];
}

interface SimulatorProps {
  universe: { id: string; title: string; desc: string; color: string; border: string };
  onBack: () => void;
}

// Vídeos de fundo para cada nicho (usando vídeos gratuitos do Pexels)
const BACKGROUNDS: Record<string, string> = {
  pizzaria: "https://videos.pexels.com/video-files/2832604/2832604-uhd_2560_1440_25fps.mp4",
  estadio: "https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4",
  salao: "https://videos.pexels.com/video-files/3998420/3998420-uhd_2560_1440_25fps.mp4",
  shopping: "https://videos.pexels.com/video-files/3015511/3015511-hd_1920_1080_24fps.mp4",
  cinema: "https://videos.pexels.com/video-files/855029/855029-hd_1920_1080_30fps.mp4",
};

const SCRIPTS: Record<string, { user: string[]; atus: string[]; menu: { name: string; price: string }[] }> = {
  pizzaria: {
    user: ["ola gostaria de uma Margherita", "uma mesa 7", "sim"],
    atus: [
      "Olá! Claro, uma Margherita. Quantas unidades você gostaria?",
      "Perfeito! Anotei:\n\n- 1 x Margherita (R$ 1,00)\n\nTotal: R$ 1,00\nMesa: 7\n\nEstá tudo correto?",
      "Perfeito! Anotei:\n\n- 1 x Margherita (R$ 1,00)\n\nTotal: R$ 1,00\nMesa: 7\n\nPedido registrado"
    ],
    menu: [
      { name: "Margherita", price: "R$ 1,00" },
      { name: "Calabresa", price: "R$ 1,00" },
      { name: "Portuguesa", price: "R$ 1,00" }
    ]
  },
  estadio: {
    user: ["Cerveja para cadeira 14", "Sim, quero 2", "Paguei"],
    atus: [
      "Olá! Cerveja gelada para a cadeira 14. Quantas você quer?",
      "Perfeito! Anotei:\n\n- 2 x Cerveja Long Neck (R$ 12,00)\n\nTotal: R$ 24,00\nCadeira: 14 - Setor Norte",
      "Pedido confirmado! Entregador a caminho."
    ],
    menu: [
      { name: "Cerveja Long Neck", price: "R$ 12,00" },
      { name: "Água", price: "R$ 5,00" },
      { name: "Refrigerante", price: "R$ 8,00" }
    ]
  },
  salao: {
    user: ["Quero cortar o cabelo", "15h está bom", "Confirmo"],
    atus: [
      "Olá! Temos horários hoje. Que tipo de corte você quer?",
      "Perfeito! Anotei:\n\n- Corte Masculino (R$ 35,00)\n\nHorário: 15h\nProfissional: Carlos",
      "Agendamento confirmado! Te esperamos às 15h."
    ],
    menu: [
      { name: "Corte Masculino", price: "R$ 35,00" },
      { name: "Barba", price: "R$ 20,00" },
      { name: "Pacote Completo", price: "R$ 50,00" }
    ]
  },
  shopping: {
    user: ["Tem promoção?", "Quero o cupom", "Obrigado"],
    atus: [
      "Olá! Temos 10% OFF na Sneaker Lab hoje. Quer o cupom?",
      "Perfeito! Cupom ATUS10 ativado.\n\nVálido por 2 horas.\nMostre no caixa da loja 45 - Piso 2",
      "Bom compras! 🛍️"
    ],
    menu: [
      { name: "Sneaker Lab - 10% OFF", price: "Cupom ATUS10" },
      { name: "Food Court - 15% OFF", price: "Cupom FOOD15" },
      { name: "Cinema - 2x1", price: "Cupom CINE2X1" }
    ]
  },
  cinema: {
    user: ["Poltrona G7 e combo", "Sim, quero pipoca grande", "Paguei"],
    atus: [
      "Olá! Poltrona G7 disponível. Quer adicionar combo de pipoca?",
      "Perfeito! Anotei:\n\n- Combo Grande (R$ 38,00)\n- Poltrona: G7\n\nTotal: R$ 38,00",
      "Pagamento confirmado! Bom filme! 🎬"
    ],
    menu: [
      { name: "Combo Pequeno", price: "R$ 25,00" },
      { name: "Combo Grande", price: "R$ 38,00" },
      { name: "Combo Casal", price: "R$ 55,00" }
    ]
  }
};

export default function Simulator({ universe, onBack }: SimulatorProps) {
  const script = SCRIPTS[universe?.id] || SCRIPTS.pizzaria;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
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
    const maxSteps = script.user.length;

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
            text: script.user[userIndex]
          }
        ]);
      }, 1500);

      // Resposta do ATUS
      setTimeout(() => {
        if (!alive) return;
        setTyping(true);
      }, 3000);

      setTimeout(() => {
        if (!alive) return;
        setTyping(false);
        
        const atusMsg = script.atus[atusIndex];
        
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "atus",
            text: atusMsg
          }
        ]);

        // Se for a segunda mensagem, mostra QR Code
        if (step === 1) {
          setTimeout(() => {
            if (!alive) return;
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                type: "qrcode",
                amount: "R$ 1,00"
              }
            ]);
          }, 2000);

          // Mostra menu após QR Code
          setTimeout(() => {
            if (!alive) return;
            setShowMenu(true);
          }, 4000);
        }

        step++;
        if (step >= maxSteps) {
          setTimeout(() => {
            if (alive) {
              setCycle((c) => c + 1);
              setMessages([]);
              setShowMenu(false);
              step = 0;
            }
          }, 10000);
        } else {
          setTimeout(run, 4000);
        }
      }, 4500);
    };

    const initialTimeout = setTimeout(run, 2000);
    return () => {
      alive = false;
      clearTimeout(initialTimeout);
    };
  }, [universe?.id, cycle, script]);

  const bgVideo = BACKGROUNDS[universe?.id] || BACKGROUNDS.pizzaria;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-black"
    >
      {/* Botão Voltar */}
      <button
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Voltar</span>
      </button>

      {/* Mockup do Celular - TAMANHO MAIOR */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="relative w-[380px] h-[760px] rounded-[3rem] border-[12px] border-gray-900 bg-black shadow-2xl overflow-hidden ring-2 ring-white/10"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-40" />

        {/* Vídeo de Fundo (Banner Vivo) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={bgVideo}
        />

        {/* Overlay Escuro para Legibilidade */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

        {/* Área de Mensagens */}
        <div className="absolute inset-0 pt-12 pb-20 px-4 overflow-y-auto flex flex-col gap-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`max-w-[85%] ${msg.type === "user" ? "ml-auto text-right" : "mr-auto text-left"}`}
              >
                {msg.type === "qrcode" ? (
                  <div className="flex flex-col items-center gap-2 my-4">
                    <div className="bg-white p-3 rounded-2xl shadow-2xl">
                      <div className="w-32 h-32 bg-black rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-28 h-28">
                          <rect x="10" y="10" width="25" height="25" fill="white" />
                          <rect x="15" y="15" width="15" height="15" fill="black" />
                          <rect x="65" y="10" width="25" height="25" fill="white" />
                          <rect x="70" y="15" width="15" height="15" fill="black" />
                          <rect x="10" y="65" width="25" height="25" fill="white" />
                          <rect x="15" y="70" width="15" height="15" fill="black" />
                          <rect x="40" y="10" width="5" height="5" fill="white" />
                          <rect x="50" y="10" width="5" height="5" fill="white" />
                          <rect x="40" y="20" width="5" height="5" fill="white" />
                          <rect x="45" y="40" width="10" height="10" fill="white" />
                          <rect x="60" y="45" width="5" height="5" fill="white" />
                          <rect x="70" y="50" width="10" height="10" fill="white" />
                          <rect x="40" y="65" width="5" height="5" fill="white" />
                          <rect x="50" y="70" width="10" height="10" fill="white" />
                          <rect x="65" y="65" width="5" height="5" fill="white" />
                          <rect x="75" y="75" width="10" height="10" fill="white" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-white text-sm font-semibold">Pague {msg.amount} com Pix</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      <p className="text-white/70 text-xs">Aguardando pagamento...</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-white text-sm leading-relaxed whitespace-pre-line drop-shadow-lg">
                    {msg.text}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mr-auto max-w-[70%]"
            >
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Menu de Produtos (Parte Inferior) */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-20 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/20 px-4 py-3 max-h-40 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-xs">Cardápio</span>
                <button onClick={() => setShowMenu(false)} className="text-white/60 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {script.menu.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0">
                  <span className="text-white text-sm">{item.name}</span>
                  <span className="text-white/80 text-sm">{item.price}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Fixo */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/20 px-4 py-3 flex items-center gap-3">
          <button className="text-white/60 hover:text-white">
            <span className="text-2xl">+</span>
          </button>
          <div className="flex-1 h-10 rounded-full bg-white/10 px-4 flex items-center border border-white/20">
            <span className="text-white/50 text-sm">Fale com o ATUS...</span>
          </div>
          <button className="text-white/60 hover:text-white">
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}