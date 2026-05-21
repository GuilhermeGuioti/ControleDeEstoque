const onlyDigits = (v) => String(v ?? '').replace(/\D/g, '');

export const maskCPF = (value) => {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskCNPJ = (value) => {
  const d = onlyDigits(value).slice(0, 14);
  return d
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const maskRG = (value) => {
  const d = onlyDigits(value).slice(0, 9);
  return d
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const maskPhone = (value) => {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return d
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

export const maskCEP = (value) => {
  const d = onlyDigits(value).slice(0, 8);
  return d.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
};

export const maskCurrencyBRL = (value) => {
  const d = onlyDigits(value);
  if (!d) return '';
  const number = Number(d) / 100;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseCurrencyBRL = (formatted) => {
  const d = onlyDigits(formatted);
  if (!d) return 0;
  return Number(d) / 100;
};

export const formatCurrencyBRLFromNumber = (number) => {
  if (number === null || number === undefined || number === '') return '';
  const n = Number(number);
  if (Number.isNaN(n)) return '';
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const MASKS = {
  cpf: maskCPF,
  cnpj: maskCNPJ,
  rg: maskRG,
  phone: maskPhone,
  cep: maskCEP,
  currency: maskCurrencyBRL,
};

export const applyMask = (maskName, value) => {
  const fn = MASKS[maskName];
  return fn ? fn(value) : value;
};

// Máscaras cujo valor deve ir ao backend SEM formatação (somente dígitos).
const DIGIT_ONLY_MASKS = new Set(['cpf', 'cnpj', 'rg', 'phone', 'cep']);

export const unmask = (maskName, value) => {
  if (value === null || value === undefined || value === '') return value;
  if (DIGIT_ONLY_MASKS.has(maskName)) return onlyDigits(value);
  return value;
};

// O backend grava Venda.criado_em como DateTime SEM timezone — o Postgres no
// Render está em UTC e o JSON sai como "2026-05-20T23:00:00" (sem Z). Sem o Z,
// new Date() do JS interpreta como horário LOCAL e perde o offset → vendas
// noturnas caem em dia errado nos filtros. Esse helper anexa "Z" se faltar.
export const parseBackendDate = (value) => {
  if (!value) return null;
  const s = String(value);
  // Se já vem com timezone (Z ou ±HH:MM no fim depois do T) confia
  const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(s);
  return new Date(hasTz ? s : `${s}Z`);
};
