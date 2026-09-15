import * as React from "react";
import { FileText, Folder, FileSignature, MessageCircle, Lightbulb, Send, Smile, Bot, Sparkles, Plus, ArrowUp, Image as ImageIcon, Globe, MoreHorizontal } from "lucide-react";
import { Badge } from "./badge";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { Card } from "./card";
import { Textarea } from "./textarea";

export function ChatIntranet({ className }: { className?: string } = {}) {
  const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Agrega mensaje de usuario
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue("");
    setIsTyping(true);

    // Simula respuesta de la IA
    setTimeout(() => {
      setIsTyping(false);

      const respuestasVariadas = [
        `He revisado tu consulta sobre "${text}". Según nuestros documentos, la información está actualizada en el sistema. ¿Te ayudo con algo más específico?`,
        `¡Excelente pregunta! Referente a "${text}", nuestras políticas indican que todo está en orden. ¿Necesitas que abra el archivo completo?`,
        `Analizando tu petición de "${text}"... Te confirmo que puedes encontrar los formatos relacionados directamente en tu panel de descargas.`,
        `Entendido. He procesado la información sobre "${text}". Todo cuadra perfectamente con las normativas actuales de la intranet.`
      ];

      const respuestaAleatoria = respuestasVariadas[Math.floor(Math.random() * respuestasVariadas.length)];

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: respuestaAleatoria
      }]);
    }, 1500);
  };

  return (
    <div className={`flex flex-col bg-background rounded-xl border border-border shadow-md overflow-hidden w-full h-full min-h-[600px] ${className || ""}`}>

      {/* Premium Header */}
      <div className="px-6 py-4 relative bg-surface border-b border-border flex items-center justify-between sticky top-0 z-20 shadow-xs">
        {/* Gradient Border Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/60 via-info/40 to-transparent"></div>

        <div className="flex items-center gap-3 relative z-10">
          <Avatar className="size-8 sm:size-10 shadow-xs border border-primary/20 bg-primary/10">
            <AvatarFallback className="text-primary font-bold text-xs !bg-transparent">
              <Bot className="size-4 sm:size-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <h3 className="font-semibold text-foreground text-sm tracking-wide leading-none">Asistente GRisk IA</h3>
            <span className="text-[10px] text-success font-medium flex items-center gap-1 mt-1">
              <span className="size-1.5 rounded-full bg-success animate-pulse inline-block" />
              En línea
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 p-4 sm:p-6 flex flex-col relative ${messages.length > 0 ? "overflow-y-auto scrollbar-thin" : "overflow-hidden"}`}>
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Welcome Text */}
            <div className="text-center space-y-4 relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Badge tone="info" appearance="soft" className="mx-auto rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider mb-2">Eficiencia con IA</Badge>
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/80 tracking-tight text-center">
                Bienvenido a GRisk IA
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                Alcanza tus objetivos de gestión territorial con eficiencia potenciada por IA. Asegurando una administración inteligente y procesos optimizados.
              </p>

            </div>

          </div>
        ) : (
          <div className="space-y-6 flex-1 w-full pb-4">
            {messages.map((msg, i) => (
              msg.role === 'assistant' ? (
                <div key={i} className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-surface border border-border shadow-sm">
                    <Bot className="size-5 text-primary" />
                  </div>
                  <div className="max-w-[85%] rounded-[1.25rem] rounded-tl-sm bg-white dark:bg-surface border border-border shadow-sm text-left px-5 py-4">
                    <div className="text-sm text-foreground leading-relaxed">
                      {msg.text && msg.text.split('\n').map((line, j) => (
                        <React.Fragment key={j}>
                          {line}
                          {j < msg.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-col items-end gap-1 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="max-w-[85%] rounded-[1.25rem] rounded-tr-sm bg-white dark:bg-surface border border-border text-foreground px-5 py-4 text-sm shadow-sm leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              )
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-[0_0_12px_rgba(var(--primary),0.25)] animate-pulse overflow-hidden">
                  <Bot className="size-5 text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-surface border border-border px-4 py-3 shadow-sm flex items-center gap-1.5 h-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-info opacity-70" />
                  <div className="size-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 rounded-full bg-info/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="size-2 rounded-full bg-danger/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Input Area */}
      <div className="p-4 sm:p-6 shrink-0 w-full bg-background relative z-10 flex justify-center pb-8">
        {/* Ambient radial glow behind the composer */}
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/20 blur-[100px] pointer-events-none rounded-full transition-opacity duration-700 ${isFocused ? "opacity-100" : "opacity-0"}`} />

        <div
          className={`relative w-full max-w-4xl rounded-3xl p-[1px] transition-all duration-300 ease-out group ${isFocused ? "shadow-[0_8px_30px_rgb(0,0,0,0.12)] -translate-y-1" : "shadow-md hover:shadow-lg hover:-translate-y-0.5"
            }`}
        >
          {/* Animated gradient border on focus */}
          <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 pointer-events-none ${isFocused ? "bg-gradient-to-r from-primary via-secondary to-primary opacity-100" : "bg-border opacity-50 group-hover:opacity-100"
            }`} />

          <div className={`relative bg-surface/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] w-full flex flex-col p-4 sm:p-5 transition-all duration-300`}>
            <div className="flex items-start gap-3">
              <div className={`mt-2.5 transition-all duration-500 ${isTyping ? "animate-pulse text-primary" : "text-muted-foreground"}`}>
                <Sparkles className="size-5" />
              </div>
              <textarea
                placeholder="Escribe tu consulta aquí..."
                value={inputValue}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(inputValue);
                  }
                }}
                className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground/60 resize-none outline-none border-0 ring-0 focus:ring-0 focus:outline-none focus:border-0 p-1 min-h-[48px]"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {/* Empty left side placeholder for potential future actions */}
              </div>
              <Button
                size="icon"
                variant="primary"
                disabled={!inputValue.trim() || isTyping}
                onClick={() => handleSend(inputValue)}
                className="size-10 rounded-full flex-shrink-0"
              >
                {isTyping ? <MoreHorizontal className="size-5 animate-pulse" /> : <ArrowUp className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
