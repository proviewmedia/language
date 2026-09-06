import { useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const DEMO_PHRASES: { text: string; src: string }[] = [
  { text: "Buenos días", src: "/audio/male/buenos-dias.m4a" },
  { text: "La cuenta, por favor", src: "/audio/male/la-cuenta-por-favor.m4a" },
  { text: "¿Dónde está el baño?", src: "/audio/male/donde-esta-el-bano.m4a" },
  { text: "Para mí, una cerveza", src: "/audio/male/para-mi-una-cerveza.m4a" },
  { text: "Muchas gracias", src: "/audio/male/muchas-gracias.m4a" },
];

export function AudioDemo() {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (phrase: { text: string; src: string }) => {
    audioRef.current?.pause();
    const audio = new Audio(phrase.src);
    audioRef.current = audio;
    setPlaying(phrase.text);
    audio.onended = () => setPlaying(null);
    audio.play().catch(() => setPlaying(null));
  };

  return (
    <section className="bg-[#f9f9f9] py-[100px] text-center">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-accent">Try it now</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-2 font-heading text-4xl font-bold text-foreground">
            Hear real <span className="font-logo italic font-normal text-accent">Spanish</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-3 max-w-[480px] font-body text-muted-foreground">
            Tap any phrase to hear it spoken aloud. This is what learning with
            EspTalk sounds like.
          </p>
        </Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {DEMO_PHRASES.map((phrase, i) => (
            <Reveal key={phrase.text} delay={i * 40}>
              <button
                onClick={() => play(phrase)}
                className={`flex items-center gap-2 rounded-full border px-5 py-3 font-body text-sm font-medium transition-colors ${
                  playing === phrase.text
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-black/[0.07] text-foreground hover:border-accent"
                }`}
              >
                <Volume2 className="h-4 w-4" />
                {phrase.text}
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
