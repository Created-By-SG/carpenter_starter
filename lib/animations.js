import animConfig from '@/config/animations.json';
export function getAnimation(behaviour) {
  if (!animConfig.enabled) return '';
  const preset = animConfig.behaviours?.[behaviour];
  if (!preset) return '';
  return `anim-${behaviour}`;
}
