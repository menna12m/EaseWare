'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, MessageCircle } from 'lucide-react';

type ShareWidgetProps = {
  url: string;
  title: string;
};

export function ShareWidget({ url, title }: ShareWidgetProps) {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const messengerHref = `fb-messenger://share/?link=${encodeURIComponent(url)}`;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-cream-50 p-1">
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label={copied ? 'Link copied' : 'Share'}
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-100"
      >
        {copied ? <LinkIcon className="h-4 w-4 text-clay" /> : <Share2 className="h-4 w-4 text-ink" />}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share to WhatsApp"
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-100"
      >
        <WhatsAppIcon />
      </a>
      <a
        href={messengerHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share to Messenger"
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-100"
      >
        <MessageCircle className="h-4 w-4 text-ink" />
      </a>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-ink" aria-hidden>
      <path d="M20.52 3.48A11.94 11.94 0 0012.04 0C5.43 0 .07 5.36.07 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.95 11.95 0 005.84 1.49h.01c6.6 0 11.96-5.37 11.96-11.97 0-3.2-1.24-6.21-3.49-8.41zm-8.48 18.4h-.01a9.93 9.93 0 01-5.05-1.38l-.36-.21-3.68.96.98-3.58-.23-.37a9.93 9.93 0 01-1.52-5.33c0-5.49 4.47-9.96 9.96-9.96 2.66 0 5.16 1.04 7.04 2.92a9.9 9.9 0 012.91 7.04c0 5.5-4.47 9.91-9.97 9.91zm5.45-7.45c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.21 5.08 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.24-.7.24-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}
