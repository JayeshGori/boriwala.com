'use client';

import { FaWhatsapp } from 'react-icons/fa';
import { whatsappLink } from '@/lib/contact';

export default function WhatsAppButton() {
  const message = 'Hello! I am interested in your products. Please share more details.';

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}
