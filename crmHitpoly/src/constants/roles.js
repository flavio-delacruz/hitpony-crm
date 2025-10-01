export const getRoleFromIdTipo = (id_tipo) => {
  switch (id_tipo) {
    case 1:
      return "admin";
    case 2:
      return "setter";
    case 3:
      return "closer";
    case 4:
      return "cliente";
    default:
      return "undefined";
  }
};
