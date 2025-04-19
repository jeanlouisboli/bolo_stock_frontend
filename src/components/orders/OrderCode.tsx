import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

interface OrderCodeProps {
  code: string;
  className?: string;
}

export const OrderCode: React.FC<OrderCodeProps> = ({ code, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erreur lors de la copie");
    }
  };

  // Split the code into groups of 2 characters
  const formattedCode = code.match(/.{1,2}/g)?.join(" ") || code;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1 text-sm font-medium",
        className
      )}
    >
      <span className="text-muted-foreground">Code:</span>
      <span className="font-mono">{formattedCode}</span>
      <button
        onClick={handleCopy}
        className="ml-1 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        title="Copier le code"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
};

export default OrderCode;
