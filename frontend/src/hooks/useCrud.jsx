import { useState, useCallback } from 'react';
import api from '../services/api';

// FastAPI retorna `detail` como string OU array de objetos (erros de validação Pydantic).
// Sem o formatter o toast vira "[object Object]".
const formatApiError = (error) => {
  const detail = error.response?.data?.detail;
  if (!detail) return error.message;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const field = Array.isArray(d.loc) ? d.loc.slice(1).join('.') : '';
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join('; ');
  }
  return JSON.stringify(detail);
};

// Detecta violação de FK do Postgres vinda em qualquer forma do detail/message.
// O backend não normaliza esse erro hoje, então o toast vinha com SQL bruto.
// Cobre variações de psycopg2/asyncpg/SQLAlchemy e também 409 genérico.
const isForeignKeyViolation = (error) => {
  const status = error.response?.status;
  if (status === 409) return true;
  const raw = (
    JSON.stringify(error.response?.data || '') +
    ' ' +
    (error.message || '')
  ).toLowerCase();
  return (
    raw.includes('foreign key') ||
    raw.includes('foreignkey') ||
    raw.includes('foreignkeyviolation') ||
    raw.includes('still referenced') ||
    raw.includes('integrityerror') ||
    raw.includes('violates') ||
    raw.includes('constraint') ||
    raw.includes('vínculo') ||
    raw.includes('vinculado') ||
    raw.includes('vinculada')
  );
};

const useCrud = (endpoint, notify) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // FastAPI expõe coleção em `/recurso/` (com barra) e item em `/recurso/{id}` (sem barra).
  // Chamar sem a barra final dispara 307 que descarta o header Authorization no CORS.
  const collectionUrl = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
  const itemUrl = (id) => `${collectionUrl}${id}`;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(collectionUrl);
      setData(response.data);
    } catch (error) {
      notify?.('error', `Erro ao carregar dados: ${formatApiError(error)}`);
    } finally {
      setLoading(false);
    }
  }, [collectionUrl]);

  const handleSave = async (payload) => {
    try {
      await api.post(collectionUrl, payload);
      await fetchData();
      notify?.('success', 'Cadastrado com sucesso!');
    } catch (error) {
      notify?.('error', `Erro ao salvar: ${formatApiError(error)}`);
    }
  };

  const handleEdit = async (id, payload) => {
    try {
      const { id: _id, ...body } = payload;
      await api.put(itemUrl(id), body);
      await fetchData();
      notify?.('success', 'Atualizado com sucesso!');
    } catch (error) {
      notify?.('error', `Erro ao editar: ${formatApiError(error)}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(itemUrl(id));
      await fetchData();
      notify?.('success', 'Excluído com sucesso!');
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        notify?.(
          'error',
          'Não é possível excluir: este registro está vinculado a outros (ex.: vendas, lotes de estoque). Remova os vínculos antes de excluir.',
        );
        return;
      }
      notify?.('error', `Erro ao excluir: ${formatApiError(error)}`);
    }
  };

  return { data, loading, fetchData, handleSave, handleDelete, handleEdit };
};

export default useCrud;
