import type { ChatWidget } from "../types";
import VoiceMessage from "./VoiceMessage";
import ImageGrid from "./ImageGrid";
import AnalyticsChart from "./AnalyticsChart";
import PhoneCallCard from "./PhoneCallCard";
import AgentTaskList from "./AgentTaskList";
import CTACard from "./CTACard";

type WidgetCommon = { reducedMotion: boolean; isLatest: boolean };

export function renderWidget(
  widget: ChatWidget,
  common: WidgetCommon,
) {
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
  }
}
