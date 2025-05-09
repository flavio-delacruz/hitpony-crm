export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Reemplaza espacios con -
    .replace(/[^\w-]+/g, '')  // Elimina caracteres no alfanuméricos (excepto '-')
    .replace(/--+/g, '-')    // Reemplaza múltiples '-' con uno solo
    .replace(/^-+/, '')      // Elimina '-' del inicio
    .replace(/-+$/, '');     // Elimina '-' del final
};