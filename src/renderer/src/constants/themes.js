export const themes = {
  classic: 'Github',
  paper: 'Newsprint',
  night: 'Night',
  modern: 'Whitey'
}

export function normalizeTheme(theme) {
  return themes[theme] ? theme : 'classic'
}
