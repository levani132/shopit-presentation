import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { BulletList } from "@/ui/BulletList";

/**
 * Market analysis slide. Editorial section heading, a short standfirst,
 * and a divided list of competitor categories — no chips, no glass blur.
 */
export function MarketSlide() {
  return (
    <SlideCard eyebrow="ბაზრის ანალიზი · 01" size="lg">
      <SlideHeading level={2}>
        კონკურენტული გარემო საქართველოში
      </SlideHeading>

      <p className="mt-4 text-[15px] leading-relaxed text-white/70">
        ქართულ e-commerce ეკოსისტემაში ShopIt იპოვის თავის ნიშას შემდეგ
        მოთამაშეებთან შედარებით.
      </p>

      <BulletList
        staggered
        items={[
          <>
            <span className="font-semibold text-white">
              Instagram / Facebook მაღაზიები
            </span>
            {" — "}დაბალი ბარიერი, მაგრამ არ აქვს გადახდისა და მიწოდების
            ერთიანი ფენა.
          </>,
          <>
            <span className="font-semibold text-white">
              MyMarket.ge · Extra.ge · Veli.store
            </span>
            {" — "}დიდი მარკეტპლეისები ცენტრალიზებული ლოგისტიკით.
          </>,
          <>
            <span className="font-semibold text-white">
              Shopify · Wix · WooCommerce
            </span>
            {" — "}გლობალური SaaS პლატფორმები, რომელთა ლოკალური ინტეგრაცია
            (გადახდა, კურიერი) რთულია.
          </>,
        ]}
      />
    </SlideCard>
  );
}
