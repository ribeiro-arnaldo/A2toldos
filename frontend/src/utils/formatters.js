export const formatarDocumento = (doc, tipo) => {
  if (!doc) return "";
  const docLimpo = String(doc).replace(/\D/g, "");
  if (tipo === "FISICA") {
    return docLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return docLimpo.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5"
  );
};

export const formatarTelefone = (tel) => {
  if (!tel) return "";
  const telLimpo = String(tel).replace(/\D/g, "").slice(0, 11);
  if (telLimpo.length === 11)
    return telLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (telLimpo.length === 10)
    return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return telLimpo;
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
};

export const formatCurrency = (value) => {
  if (typeof value !== "number") return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};