exports.icon = (unicode='f128', color='#ffffff') => {
  return `<span lang='music' foreground='${color}' face='Font Awesome'>&#x${unicode};</span>`
}

exports.color = (color='#ffffff', text='') => {
  return `<span foreground='${color}'>${text};</span>`
}