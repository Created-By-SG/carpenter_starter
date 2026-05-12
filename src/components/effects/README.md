# Effect Module Slots

The site imports stable slot files. The shared toolbox files are descriptive source effects only.

To change an effect, copy the chosen file from `C:\Users\sam_g\Desktop\Codex\1_tools` into the matching slot file here and keep the slot filename the same. Site slot files should not import from the shared toolbox, and client website folders should not keep their own `toolbox/` folder.

## Text Slots

| Site slot | Default toolbox effect |
| --- | --- |
| `Text-Effect-Services-Hero.astro` | `1_tools/text/text-typewriter.astro` |
| `Text-Effect-Services-Section.astro` | `1_tools/scroll/scroll-stagger-grid.astro` |
| `Text-Effect-Services-Sub.astro` | `1_tools/scroll/scroll-fade-up-once.astro` |
| `Text-Effect-Services-Body.astro` | `1_tools/scroll/scroll-fade-up-once.astro` |
| `Text-Effect-Suburbs-Hero.astro` | `1_tools/scroll/scroll-fade-up-once.astro` |
| `Text-Effect-Suburbs-Section.astro` | `1_tools/scroll/scroll-stagger-grid.astro` |
| `Text-Effect-Suburbs-Sub.astro` | `1_tools/scroll/scroll-fade-up-once.astro` |
| `Text-Effect-Suburbs-Body.astro` | `1_tools/scroll/scroll-fade-up-once.astro` |
| `Text-Effect-Home-Hero.astro` | `1_tools/text/text-typewriter.astro` |
| `Text-Effect-Home-Section.astro` | `1_tools/text/text-underline-sweep.astro` |
| `Text-Effect-Home-Sub.astro` | `1_tools/scroll/scroll-fade-up-once.astro` |
| `Text-Effect-Home-Body.astro` | `1_tools/scroll/scroll-fade-up-once.astro` |
| `Text-Effect-Span.astro` | `1_tools/text/text-highlight-span.astro` |

## Block Slots

| Site slot | Default toolbox effect |
| --- | --- |
| `Block-Reveal.astro` | `1_tools/scroll/scroll-fade-up-once.astro` |
| `Block-Reviews.astro` | `1_tools/blocks/block-reviews-carousel.astro` |
| `Block-FAQ.astro` | `1_tools/blocks/block-faq-accordion.astro` |
| `Block-Process.astro` | `1_tools/blocks/block-process-steps.astro` |
| `Block-CTA.astro` | `1_tools/blocks/block-cta-centered.astro` |
| `Block-BeforeAfter.astro` | `1_tools/blocks/block-before-after.astro` |
| `Block-Stats.astro` | `1_tools/blocks/block-stats-strip.astro` |
| `Block-WhyChoose.astro` | project-specific slot component |
| `Block-Services.astro` | project-specific slot component |
| `Block-TrustChecklist.astro` | project-specific slot component |
| `Block-SuburbLinks.astro` | project-specific slot component |
| `Block-SplitFeature.astro` | project-specific slot component |
| `Block-FinalCTA.astro` | project-specific slot component |
| `Block-ReviewsFAQ.astro` | project-specific slot component |
| `Block-ServiceAreaMap.astro` | project-specific slot component |

The legacy text slots (`Text-Effect-Hero.astro`, `Text-Effect-Section.astro`, `Text-Effect-Sub.astro`, and `Text-Effect-Body.astro`) are compatibility aliases to the home slots.
