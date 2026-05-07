export function getLayoutClasses(sectionKey, config) {
  if (!config) return '';
  const classes = [];
  if (config.layout) classes.push(`layout-${config.layout}`);
  if (config.image_position) classes.push(`img-${config.image_position}`);
  if (config.columns) classes.push(`cols-${config.columns}`);
  if (config.card_style) classes.push(`card-${config.card_style}`);
  if (config.direction) classes.push(`dir-${config.direction}`);
  if (config.style) classes.push(`style-${config.style}`);
  if (config.min_height) classes.push(`min-h-${config.min_height}`);
  return classes.join(' ');
}
