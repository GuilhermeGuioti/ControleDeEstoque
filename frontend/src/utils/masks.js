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
