import type { ChatWidget } from "../types";
// Legacy widgets (kept for back-compat; v2 script does not reference them).
import VoiceMessage from "./VoiceMessage";
import ImageGrid from "./ImageGrid";
import AnalyticsChart from "./AnalyticsChart";
import PhoneCallCard from "./PhoneCallCard";
import AgentTaskList from "./AgentTaskList";
import CTACard from "./CTACard";
// v2 capability-sprint widgets.
import LiveStatCounter from "./LiveStatCounter";
import SupportThread from "./SupportThread";
import LiveCallPanel from "./LiveCallPanel";
import ToolCallConsole from "./ToolCallConsole";
import AgentFeed from "./AgentFeed";
import ImpactDashboard from "./ImpactDashboard";
import BrandAssetPack from "./BrandAssetPack";

type WidgetCommon = { reducedMotion: boolean; isLatest: boolean };

export function renderWidget(widget: ChatWidget, common: WidgetCommon) {
  switch (widget.type) {
    case "voice":
      return <VoiceMessage widget={widget} {...common} />;
    case "images":
      return <ImageGrid widget={widget} {...common} />;
    case "chart":
      return <AnalyticsChart widget={widget} {...common} />;
    case "phone":
      return <PhoneCallCard widget={widget} {...common} />;
    case "agentTasks":
      return <AgentTaskList widget={widget} {...common} />;
    case "cta":
      return <CTACard widget={widget} {...common} />;
    case "liveStat":
      return <LiveStatCounter widget={widget} {...common} />;
    case "supportThread":
      return <SupportThread widget={widget} {...common} />;
    case "liveCall":
      return <LiveCallPanel widget={widget} {...common} />;
    case "toolCall":
      return <ToolCallConsole widget={widget} {...common} />;
    case "agentFeed":
      return <AgentFeed widget={widget} {...common} />;
    case "impactDashboard":
      return <ImpactDashboard widget={widget} {...common} />;
    case "brandPack":
      return <BrandAssetPack widget={widget} {...common} />;
  }
}
