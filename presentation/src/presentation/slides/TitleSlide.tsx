import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { FreeUniMark } from "@/ui/FreeUniMark";
import { ShopItMark } from "@/ui/ShopItMark";

/**
 * Opening slide. Free Uni mark in the corner, a large serif "ShopIt" hero,
 * and a structured author/supervisor/year/city block as a thesis cover
 * would have.
 */
export function TitleSlide() {
  return (
    <SlideCard size="lg">
      <div className="flex flex-col gap-10">
        <FreeUniMark />

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-7">
            <ShopItMark size={104} />
            <SlideHeading level={1} variant="serif">
              ShopIt
            </SlideHeading>
          </div>
          <p className="text-[30px] leading-snug text-white/80">
            ციფრული კომერციის პლატფორმა — ბიზნეს გეგმა
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-16 gap-y-8 border-t border-nebula-rule pt-10">
          <Field label="ავტორი" value="ლევან ბეროშვილი" />
          <Field label="ხელმძღვანელი" value="დავით მარკოზაშვილი" />
          <Field label="წელი" value="2026" />
          <Field label="ქალაქი" value="თბილისი" />
        </div>
      </div>
    </SlideCard>
  );
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div>
      <p className="font-mono text-[16px] uppercase tracking-eyebrow text-white/50">
        {label}
      </p>
      <p className="mt-2 text-[24px] font-medium text-white">{value}</p>
    </div>
  );
}
