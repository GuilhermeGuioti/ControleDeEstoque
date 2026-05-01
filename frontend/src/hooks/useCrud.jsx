import { useState, useCallback } from 'react';
import api from '../services/api';

const useCrud = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const handleSave = async (payload, existingItem = null) => {
    try {
      const hasId = existingItem && (existingItem.id || existingItem._id);
      if (hasId) {
        await api.put(`${endpoint}/${existingItem.id || existingItem._id}`, payload);
      } else {
        await api.post(endpoint, payload);
      }
      await fetchData(); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleEdit = async (payload) => {
    try {
      const id = payload.id || payload._id;
      await api.put(`${endpoint}/${id}`, payload);
      await fetchData(); 
    } catch (error) {
      console.error("Erro ao editar:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return { data, loading, fetchData, handleSave, handleDelete, handleEdit };
};

export default useCrud