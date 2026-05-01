import { useState, useCallback } from 'react';
import api from '../services/api';

const useCrud = (endpoint, notify) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (error) {
      notify?.('error', `Erro ao carregar dados: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const handleSave = async (payload) => {
    try {
      await api.post(endpoint, payload);
      await fetchData();
      notify?.('success', 'Cadastrado com sucesso!');
    } catch (error) {
      notify?.('error', `Erro ao salvar: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleEdit = async (id, payload) => {
    try {
      // remove id do body — alguns backends rejeitam campos extras
      const { id: _id, ...body } = payload;
      await api.put(`${endpoint}/${id}`, body);
      await fetchData();
      notify?.('success', 'Atualizado com sucesso!');
    } catch (error) {
      notify?.('error', `Erro ao editar: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      await fetchData();
      notify?.('success', 'Excluído com sucesso!');
    } catch (error) {
      notify?.('error', `Erro ao excluir: ${error.response?.data?.detail || error.message}`);
    }
  };

  return { data, loading, fetchData, handleSave, handleDelete, handleEdit };
};

export default useCrud;
