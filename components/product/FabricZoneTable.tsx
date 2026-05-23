import type { FabricZone } from '@/lib/types';

type Props = { zones: FabricZone[] };

export function FabricZoneTable({ zones }: Props) {
  if (!zones || zones.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-lg border border-ink/10">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-vanilla">
          <tr className="text-start">
            <th className="px-4 py-3 font-medium text-ink">Zone</th>
            <th className="px-4 py-3 font-medium text-ink">Fabric</th>
            <th className="px-4 py-3 font-medium text-ink">Properties</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((z, i) => (
            <tr key={i} className="border-t border-ink/10">
              <td className="px-4 py-3 font-medium text-ink">{z.zone}</td>
              <td className="px-4 py-3 text-ink">{z.fabric}</td>
              <td className="px-4 py-3 text-ink-soft">{z.properties}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
