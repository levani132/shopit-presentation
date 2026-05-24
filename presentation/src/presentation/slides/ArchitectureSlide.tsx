import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";

interface ComponentBlock {
  number: string;
  title: string;
  description: string;
}

const components: ReadonlyArray<ComponentBlock> = [
  {
    number: "01",
    title: "მაღაზიის შემქმნელი",
    description:
      "თვითმომსახურების კონფიგურატორი — ვაჭარს მაღაზია ეშვება წუთებში.",
  },
  {
    number: "02",
    title: "კურიერების მარკეტპლეისი",
    description:
      "ღია მიწოდების ფენა — კურიერები კონკურენციით ღებულობენ შეკვეთებს.",
  },
  {
    number: "03",
    title: "დამატებითი მოდულები",
    description:
      "გადახდა, ანალიტიკა, მარკეტინგი — ერთიანი ფიფერი ვაჭრებისთვის.",
  },
];

/**
 * Platform architecture slide. Three numbered columns introduce the
 * platform's three layers. Cards have a thin yellow leading rule and
 * stagger in via CSS animation — the in-slide animation demo.
 */
export function ArchitectureSlide() {
  return (
    <SlideCard eyebrow="პლატფორმის არქიტექტურა · 02" size="lg">
      <SlideHeading level={2}>
        ShopIt-ის ძირითადი კომპონენტები
      </SlideHeading>

      <p className="mt-4 text-[15px] leading-relaxed text-white/70">
        პლატფორმა აშენებულია სამ ფენაზე, რომელიც ერთად ქმნის ერთიან
        გამოცდილებას — ვაჭრიდან მომხმარებლამდე.
      </p>

      <div className="mt-7 grid grid-cols-3 gap-5">
        {components.map((component, idx) => (
          <div
            key={component.number}
            className="animate-fade-in-up border-l border-nebula-rule pl-4"
            style={{ animationDelay: `${220 + idx * 200}ms` }}
          >
            <span className="font-mono text-[11px] tracking-eyebrow text-nebula-gold">
              {component.number}
            </span>
            <h3 className="mt-2 text-[16px] font-semibold leading-snug text-white">
              {component.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/65">
              {component.description}
            </p>
          </div>
        ))}
      </div>
    </SlideCard>
  );
}
