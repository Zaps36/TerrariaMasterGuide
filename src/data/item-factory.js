/**
 * Item factories.
 *
 * Every entry in the item database goes through one of these so the shape
 * stays consistent and the UI never has to guard against missing fields.
 */

const base = (o) => ({
  id: o.id,
  name: o.name,
  sprite: o.sprite || 'unknown',
  tint: o.tint || 'iron',
  type: o.type || 'material',
  subtype: o.subtype || '',
  cls: o.cls || 'universal',
  rarity: o.rarity || 'white',
  stage: o.stage || 'early',
  rating: o.rating ?? 3,
  desc: o.desc || '',
  source: o.source || '',
  craft: o.craft || null,
  usedFor: o.usedFor || [],
  evil: o.evil || null,
  tags: o.tags || [],
  stats: o.stats || {},
  slot: o.slot || '',
});

export function weapon(o) {
  return base({
    ...o,
    type: 'weapon',
    stats: {
      Damage: o.dmg != null ? `${o.dmg}` : '—',
      Crit: o.crit != null ? `${o.crit}%` : '4%',
      Knockback: o.kb || 'Average',
      Speed: o.speed || 'Average',
      ...(o.extraStats || {}),
    },
  });
}

export function armor(o) {
  return base({
    ...o,
    type: 'armor',
    stats: {
      Defense: o.defense != null ? `${o.defense}` : '—',
      'Set bonus': o.setBonus || '—',
      ...(o.extraStats || {}),
    },
  });
}

export function accessory(o) {
  return base({
    ...o,
    type: 'accessory',
    stats: {
      Effect: o.effect || '—',
      ...(o.extraStats || {}),
    },
  });
}

export function ammo(o) {
  return base({
    ...o,
    type: 'ammo',
    stats: {
      Damage: o.dmg != null ? `+${o.dmg}` : '—',
      Effect: o.effect || '—',
      ...(o.extraStats || {}),
    },
  });
}

export function tool(o) {
  return base({
    ...o,
    type: 'tool',
    stats: {
      Power: o.power || '—',
      Effect: o.effect || '—',
      ...(o.extraStats || {}),
    },
  });
}

export function material(o) {
  return base({
    ...o,
    type: 'material',
    stats: {
      Use: o.use || '—',
      ...(o.extraStats || {}),
    },
  });
}

export function summonItem(o) {
  return base({
    ...o,
    type: 'summon',
    stats: {
      Summons: o.summons || '—',
      Where: o.where || '—',
      ...(o.extraStats || {}),
    },
  });
}

export function potionItem(o) {
  return {
    ...base({
      ...o,
      type: 'potion',
      sprite: 'potion',
      stats: {
        Effect: o.effect || '—',
        Duration: o.duration || '—',
        ...(o.extraStats || {}),
      },
    }),
    // potion-specific fields used by the Potion Guide
    priority: o.priority || 'optional',
    ingredients: o.ingredients || [],
    where: o.where || '',
  };
}
