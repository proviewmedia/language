import { Reveal } from "@/components/Reveal";

const items = [
  { value: "16", label: "Modules" },
  { value: "Audio", label: "Every word" },
  { value: "Offline", label: "PWA support" },
  { value: "$9.99", label: "One-time" },
];

export function ProofBar() {
  return (
    <section className="border-y border-black/[0.07] bg-[#f9f9f9] py-10">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 60}>
              <div className="font-heading text-2xl font-bold text-foreground">{item.value}</div>
              <div className="mt-1 font-body text-sm text-muted-foreground">{item.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
