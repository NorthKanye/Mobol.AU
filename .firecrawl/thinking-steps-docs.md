[ShowcaseShowcase](https://www.fluidfunctionalism.com/) [IntroductionIntroduction](https://www.fluidfunctionalism.com/docs)

Components19

[AccordionAccordion](https://www.fluidfunctionalism.com/docs/accordion) [BadgeBadge](https://www.fluidfunctionalism.com/docs/badge) [ButtonButton](https://www.fluidfunctionalism.com/docs/button) [CheckboxGroupCheckboxGroup](https://www.fluidfunctionalism.com/docs/checkbox-group) [ColorPickerColorPicker](https://www.fluidfunctionalism.com/docs/color-picker) [DialogDialog](https://www.fluidfunctionalism.com/docs/dialog) [DropdownDropdown](https://www.fluidfunctionalism.com/docs/dropdown) [InputCopyInputCopy](https://www.fluidfunctionalism.com/docs/input-copy) [InputGroupInputGroup](https://www.fluidfunctionalism.com/docs/input-group) [RadioGroupRadioGroup](https://www.fluidfunctionalism.com/docs/radio-group) [SelectSelect](https://www.fluidfunctionalism.com/docs/select) [SliderSlider](https://www.fluidfunctionalism.com/docs/slider) [SwitchSwitch](https://www.fluidfunctionalism.com/docs/switch) [TableTable](https://www.fluidfunctionalism.com/docs/table) [TabsTabs](https://www.fluidfunctionalism.com/docs/tabs) [TabsSubtleTabsSubtle](https://www.fluidfunctionalism.com/docs/tabs-subtle) [ThinkingIndicatorThinkingIndicator](https://www.fluidfunctionalism.com/docs/thinking-indicator) [ThinkingStepsThinkingSteps](https://www.fluidfunctionalism.com/docs/thinking-steps) [TooltipTooltip](https://www.fluidfunctionalism.com/docs/tooltip)

# ThinkingSteps

Chain-of-thought reasoning display with collapsible steps, sequential animation, source badges, and image support.

[Previous: ThinkingIndicator](https://www.fluidfunctionalism.com/docs/thinking-indicator)[Next: Tooltip](https://www.fluidfunctionalism.com/docs/tooltip)

## Installation

npx shadcn@latest add https://www.fluidfunctionalism.com/r/thinking-steps.json

## Basic

PreviewPreviewCodeCode

ThinkingThinking

Searched the web

Read 3 sources

Explored 6 filesExplored 6 files

Done

## Minimal

The simplest usage — two dots with no children or extras.

PreviewPreviewCodeCode

ThinkingThinking

Ran a command

Done

## Streaming

Steps appear sequentially as they stream in. Active steps show a shimmer effect.

PreviewPreviewCodeCode

ThinkingThinking

Searching for micka.design…

## Streaming Text

Dots with long descriptions that stream in character by character, simulating LLM output.

PreviewPreviewCodeCode

ThinkingThinking

## With Images

Steps can include inline images with optional captions using ThinkingStepImage.

PreviewPreviewCodeCode

Vision AgentVision Agent

## Full Example

A 6-step research agent combining sources, details, descriptions, images, and a custom header.

PreviewPreviewCodeCode

Research AgentResearch Agent

## API Reference

### ThinkingSteps

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| defaultOpen | boolean | true | Whether the accordion starts expanded (uncontrolled). |
| open | boolean | — | Controlled open state. Use with onOpenChange. |
| onOpenChange | (open: boolean) => void | — | Callback when the open state changes. |
| className | string | — | Additional CSS classes for the root container. |

### ThinkingStepsHeader

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| children | ReactNode | "Thinking" | Header label text. |

### ThinkingStep

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| icon | IconName | "dot" | Icon name from the icon library. |
| showIcon | boolean | true | Show the icon. When false, displays a small dot instead. |
| label | string | — | Step label text. |
| description | string | — | Optional secondary text below the label. |
| status | "complete" \| "active" \| "pending" | "complete" | Step state. Pending steps are hidden; active steps show shimmer text. |
| index | number | — | Position index for proximity hover registration. |
| delay | number | 0 | Entrance animation delay in seconds. |
| isLast | boolean | false | Hides the connector line below this step. |

### ThinkingStepDetails

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| summary | string | — | Collapsed label text (e.g. "Explored 6 files"). |
| details | string\[\] | — | Shorthand list of detail lines rendered automatically. |
| defaultOpen | boolean | false | Whether the nested accordion starts expanded. |
| children | ReactNode | — | Custom content inside the expanded area. |

### ThinkingStepSource

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| color | BadgeColor | "gray" | Badge color from the Tailwind palette. |
| delay | number | 0 | Entrance animation delay in seconds. |
| children | ReactNode | — | Source label text. |

### ThinkingStepImage

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| src | string | — | Image URL. |
| alt | string | "" | Alt text for accessibility. |
| caption | string | — | Optional caption below the image. |
| delay | number | 0 | Entrance animation delay in seconds. |

## Make them yours

Theme

System

System

Light

Dark

Radius

Pill

Rounded

Pill

Icons

Lucide

Lucide

Tabler

Phosphor

HugeIcons

![](https://www.fluidfunctionalism.com/micka.png)

Created by [@micka\_design](https://x.com/micka_design)

[Chat with Micka](https://t.me/micka_design) [307](https://github.com/mickadesign/fluid-functionalism)