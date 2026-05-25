# Homepage AI Mock Chat Plan

This is the working script and placement map for the homepage AI integration visual.
The goal is a natural multi-industry demo, not a maximal feature reel.

## Research Notes

- Start with proof. The first visible payoff should happen before the viewer feels a sales pitch starting.
- Use user bubbles as honest objections: "normal businesses", "messy questions", "team control".
- Rotate industries, but keep the same logic: answer from trusted material, take the next step, keep a human-visible trail.
- Motion should show a state change: image read, source lookup, tool call, handoff, metric update. Avoid constant decorative movement.
- Keep the copy plain. Avoid "unlock", "leverage", "cutting-edge", "10x", and "transform your business".
- Keep the loop around 75 seconds. More industries can be added later, but the homepage version should feel easy to follow.

Reference sources used for the script direction:

- NN/g, "The Role of Animation and Motion in UX": https://www.nngroup.com/articles/animation-purpose-ux/
- NN/g, "Auto-Forwarding Carousels and Accordions Annoy Users": https://www.nngroup.com/articles/auto-forwarding/
- NN/g, "The User Experience of Chatbots": https://www.nngroup.com/articles/chatbots/
- WCAG 2.2, "Pause, Stop, Hide": https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
- Google Conversation Design: https://developers.google.com/assistant/conversation-design/learn-about-conversation
- Microsoft Human-AI Interaction Guidelines: https://www.microsoft.com/en-us/research/articles/guidelines-for-human-ai-interaction-eighteen-best-practices-for-human-centered-ai-design/
- Mobol brand voice: `brand-identity.md`

## Script Beats

1. Hook: "Show me AI for normal businesses, not a party trick."
   Placement: plain assistant text in the chat.

2. MobolRealEstate: image analysis and renovation concept.
   Placement: `imageAnalysis` widget.
   Assets:
   - `/ai-demo/homepage-industries/realestate-before.png`
   - `/ai-demo/homepage-industries/realestate-after.png`

3. MobolSkincare: generated campaign stills.
   Placement: `generatedAssets` widget.
   Assets:
   - `/ai-demo/homepage-industries/skincare-product.png`
   - `/ai-demo/homepage-industries/skincare-flatlay.png`
   - `/ai-demo/homepage-industries/skincare-cinematic.png`

4. MobolSkincare: generated video storyboard.
   Placement: `generatedVideo` widget.
   Final video slot:
   - `/ai-demo/homepage-industries/mobolskincare-reveal.mp4`

5. MobolFood, MobolFitness, MobolCommunity: messy customer questions.
   Placement: `supportThread` widget.

6. MobolFood: backend action proof.
   Placement: `toolCall` widget for quote, calendar hold, and CRM follow-up.

7. MobolFitness: voice support.
   Placement: `voiceStudio` widget.
   Final audio slots:
   - `/ai-demo/audio/mobolfitness-local-calm.mp3`
   - `/ai-demo/audio/mobolfitness-clear-desk.mp3`
   - `/ai-demo/audio/mobolfitness-measured.mp3`
   - `/ai-demo/audio/mobolfitness-soft-apology.mp3`

8. Team control: safe actions, approval actions, and audit trail.
   Placement: `thinkingSteps` plus `workflowAutomation`.

9. Measurement: reply time, manual follow-up, clean handoffs.
   Placement: `impactDashboard`.

10. CTA: "Bring us one process that keeps slipping."
    Placement: `cta` widget.

## Image Prompts

### MobolRealEstate Before

Create a realistic property photo for a fictional WA real estate AI demo. This is the before photo that an AI chat will analyse before proposing a renovation. No visible words, no logo, no watermark.

Scene: a modest 1970s coastal brick house in Perth, Western Australia, slightly dated but structurally sound. Cream brick walls, brown tiled roof, old aluminium windows, plain concrete driveway, overgrown native shrubs, tired lawn, blue sky, subtle coastal light.

Composition: 4:3 front three-quarter angle from street level. Whole house visible. No people, no cars.

### MobolRealEstate Renovation After

Keep the same house, camera angle, roofline, driveway, and window placement. Refresh the exterior with soft white render, charcoal frames, timber entry battens, cleaned landscaping, and a realistic Perth coastal renovation finish.

Constraints: recognisably the same home and lot; no second storey; no mansion transformation; no text, signage, watermark, people, or cars.

### MobolSkincare Campaign Stills

Create quiet skincare campaign photography for a refillable serum system: frosted glass, paper refill pouch, soft morning light, warm plaster, muted sage, no text, no logo.

Variants:
- Landing page hero.
- Social flatlay.
- Cinematic video poster.

## Video Prompt

Slow macro push-in on a frosted skincare serum bottle in warm morning light. Fine mist drifts across soft plaster, shadows move gently, camera settles on the bottle and refill pouch. No text, no logo.

Storyboard:
- 0:00: Soft light lands on bottle.
- 0:02: Mist passes across refill pouch.
- 0:05: Camera settles for final frame.

## Voice Prompts

Use Gemini Flash voice TTS with a calm, practical delivery. Avoid character voices.

Script:

> Hi Mia, your 6:15 strength class is confirmed. I have added the intro note for your coach, and you can reply to this message if you need to move the booking.

Variants:
- Local calm: clear Perth reception voice, warm but not over-friendly.
- Clear desk: direct front-desk voice, clean articulation, no character acting.
- Measured: polished and steady, suitable for a higher-touch service brand.
- Soft apology: gentle service-recovery tone for delays, cancellations, or rescheduling.
