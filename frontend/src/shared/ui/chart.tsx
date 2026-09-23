import { createContext, useContext, useId, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "./cn";

export type ChartConfig = Record<string, { label?: ReactNode; color?: string }>;
type ChartContextValue = { config: ChartConfig };
const ChartContext = createContext<ChartContextValue | null>(null);

export function ChartContainer({ id, className, children, config, ...props }: ComponentProps<"div"> & { config: ChartConfig; children: ComponentProps<typeof ResponsiveContainer>["children"] }) {
  const uniqueId = useId(); const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
  const style = Object.entries(config).reduce((result, [key, value]) => ({ ...result, [`--color-${key}`]: value.color }), {}) as CSSProperties;
  return <ChartContext.Provider value={{ config }}><div data-chart={chartId} className={cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-[#89786e] [&_.recharts-cartesian-grid_line]:stroke-[#eee6e1]", className)} style={style} {...props}><ResponsiveContainer>{children}</ResponsiveContainer></div></ChartContext.Provider>;
}

export const ChartTooltip = Tooltip;

export function ChartTooltipContent({ active, payload, label, labelFormatter, className }: { active?: boolean; payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string }>; label?: string; labelFormatter?: (label: string) => ReactNode; className?: string }) {
  const context = useContext(ChartContext);
  if (!active || !payload?.length) return null;
  return <div className={cn("min-w-32 rounded-lg border border-[#e3d8d1] bg-white px-3 py-2.5 text-xs shadow-lg", className)}>{label && <p className="mb-2 font-semibold text-[#21140f]">{labelFormatter ? labelFormatter(label) : label}</p>}<div className="grid gap-1.5">{payload.map(item => { const key = String(item.dataKey ?? item.name ?? ""); const entry = context?.config[key]; return <div key={key} className="flex items-center justify-between gap-5"><span className="flex items-center gap-1.5 text-[#786961]"><i className="size-2 rounded-sm" style={{ backgroundColor: item.color ?? entry?.color }} />{entry?.label ?? item.name}</span><b className="font-medium text-[#21140f]">{Number(item.value ?? 0).toLocaleString()}</b></div>; })}</div></div>;
}
