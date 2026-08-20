import React from 'react';
import { Player } from '../../types';

interface SavantStudioViewProps {
  player?: Player;
  onUpdatePlayer?: (player: Player) => void;
}

export function SavantStudioView({ player, onUpdatePlayer }: SavantStudioViewProps) {
  const savantUrl = 'https://savant.glovall.app/';

  return (
    <div className="w-full h-[calc(100vh-100px)] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
      <iframe
        src={savantUrl}
        className="w-full h-full border-0 block"
        title="Savant App"
        allow="camera; microphone; fullscreen; clipboard-read; clipboard-write; autoplay"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads allow-modals"
      />
    </div>
  );
}
