import React from 'react';
import VoiceControl from './VoiceControl';

const SystemHUD = () => (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-4 font-mono text-[10px] text-neon-blue uppercase">
        <span className="animate-pulse whitespace-nowrap hidden md:block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>● System: Active</span>
        <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-neon-blue to-transparent hidden md:block"></div>
        <span className="tracking-[0.3em] whitespace-nowrap hidden md:block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Lat: 12.9716° N</span>
        <span className="tracking-[0.3em] whitespace-nowrap hidden md:block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Long: 77.5946° E</span>
        <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-neon-blue to-transparent hidden md:block"></div>
        <span className="whitespace-nowrap hidden md:block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Velocity X // v2.0.4</span>
        <VoiceControl />
    </div>
);

export default SystemHUD;
