const lineRender = (f, l, r) => `${''.padStart(l * 2, ' ')}- ${r(f)}`;

exports.formatMarkdown = function(features) {
  const render = f => `${f.message} ${f.hash}`;
  const renderKey = k => `### ${k}\n`;

  return traverse(features, render, renderKey, '\n\n\n');
};

exports.formatReport = function(features) {
  const render = f => f.message;
  const renderKey = k => `${k}:`;

  return traverse(features, render, renderKey, '\n\n');
};

function traverse(features, render, renderKey, join) {
  const feats = features.default.filter(f => f.type === 'feat').map(f => lineRender(f, 1, render));
  const fixes = features.default.filter(f => f.type === 'fix').map(f => lineRender(f, 1, render));
  const others = [];

  for (let key in features) {
    if (key !== 'default') {
      const oFeats = features[key].filter(f => f.type === 'feat').map(f => lineRender(f, 1, render));
      const oFixes = features[key].filter(f => f.type === 'fix').map(f => lineRender(f, 1, render));

      others.push([renderKey(key), ...oFeats, ...oFixes]);
    }
  }
  const result = [];

  if (feats.length) {
    result.push([renderKey('Features'), ...feats]);
  }

  result.push(...others);

  if (fixes.length) {
    result.push([renderKey('Bug fixes'), ...fixes]);
  }

  return result.map(f => f.join('\n')).join(join);
}
