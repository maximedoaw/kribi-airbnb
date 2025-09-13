"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center" // Changé de top-right à top-center
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4500}
      visibleToasts={4}
      gap={12}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "hsl(143 85% 96%)",
          "--success-text": "hsl(140 100% 27%)",
          "--success-border": "hsl(145 92% 91%)",
          "--error-bg": "hsl(0 93% 94%)",
          "--error-text": "hsl(0 84% 37%)",
          "--error-border": "hsl(0 93% 94%)",
          "--warning-bg": "hsl(49 100% 97%)",
          "--warning-text": "hsl(31 92% 45%)",
          "--warning-border": "hsl(49 91% 91%)",
          "--info-bg": "hsl(214 100% 97%)",
          "--info-text": "hsl(214 84% 56%)",
          "--info-border": "hsl(214 100% 91%)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "var(--normal-bg)",
          border: "1px solid var(--normal-border)",
          color: "var(--normal-text)",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "16px 20px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 255 255 / 0.05)",
          backdropFilter: "blur(12px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          marginTop: "20px", // Ajout d'une marge en haut
        },
        classNames: {
          toast: [
            "group toast",
            "data-[type=success]:bg-[var(--success-bg)]",
            "data-[type=success]:text-[var(--success-text)]",
            "data-[type=success]:border-[var(--success-border)]",
            "data-[type=error]:bg-[var(--error-bg)]",
            "data-[type=error]:text-[var(--error-text)]",
            "data-[type=error]:border-[var(--error-border)]",
            "data-[type=warning]:bg-[var(--warning-bg)]",
            "data-[type=warning]:text-[var(--warning-text)]",
            "data-[type=warning]:border-[var(--warning-border)]",
            "data-[type=info]:bg-[var(--info-bg)]",
            "data-[type=info]:text-[var(--info-text)]",
            "data-[type=info]:border-[var(--info-border)]",
            "hover:scale-[1.02]",
            "hover:shadow-xl",
            "active:scale-[0.98]",
            // Animation modifiée pour venir du haut
            "animate-in slide-in-from-top-full fade-in-0 duration-500",
            "data-[swipe=cancel]:translate-x-0",
            "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
            "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
            "data-[state=open]:animate-in",
            "data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-80",
            "data-[state=closed]:slide-out-to-top-full", // Changé pour sortir vers le haut
          ].join(" "),
          title: [
            "font-semibold text-base leading-tight",
            "data-[type=success]:text-[var(--success-text)]",
            "data-[type=error]:text-[var(--error-text)]",
            "data-[type=warning]:text-[var(--warning-text)]",
            "data-[type=info]:text-[var(--info-text)]",
          ].join(" "),
          description: [
            "text-sm opacity-90 mt-1 leading-relaxed",
            "data-[type=success]:text-[var(--success-text)]",
            "data-[type=error]:text-[var(--error-text)]",
            "data-[type=warning]:text-[var(--warning-text)]",
            "data-[type=info]:text-[var(--info-text)]",
          ].join(" "),
          actionButton: [
            "inline-flex items-center justify-center rounded-md text-sm font-medium",
            "transition-colors focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "h-8 px-3 ml-auto shrink-0",
          ].join(" "),
          cancelButton: [
            "inline-flex items-center justify-center rounded-md text-sm font-medium",
            "transition-colors focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            "h-8 px-3 mr-2 shrink-0",
          ].join(" "),
          closeButton: [
            "absolute right-3 top-3 rounded-md p-1 opacity-70",
            "transition-opacity hover:opacity-100",
            "focus:opacity-100 focus:outline-none focus:ring-2",
            "focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none",
            "data-[state=open]:bg-secondary",
            "text-muted-foreground",
          ].join(" "),
          icon: [
            "w-5 h-5 mr-3 flex-shrink-0",
            // Couleurs améliorées pour les icônes
            "data-[type=success]:text-green-500", // Vert plus agréable
            "data-[type=error]:text-red-500", // Rouge amélioré
            "data-[type=warning]:text-amber-500", // Jaune amélioré
            "data-[type=info]:text-blue-500", // Bleu amélioré
          ].join(" "),
          loading: [
            "w-5 h-5 mr-3 flex-shrink-0 animate-spin",
            "text-muted-foreground",
          ].join(" "),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }