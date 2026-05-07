export const animConfig = {
  "preset": "gentle_reveal",
  "enabled": true,
  "global": {
    "duration": "0.85s",
    "easing": "cubic-bezier(0.16, 1, 0.3, 1)",
    "stagger": "0.1s"
  },
  "behaviours": {
    "page_load": "fade_up",
    "scroll_reveal": "slide_up",
    "hover_lift": "subtle_scale",
    "modal_enter": "fade_scale",
    "mobile_menu": "slide_right"
  }
};
export default animConfig;