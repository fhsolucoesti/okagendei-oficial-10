import { useCallback } from 'react';
import { toast } from 'sonner';
import { useApi } from './useApi';
import { useConfirmation } from './useConfirmation';

interface UseCrudOptions<T> {
  entityName?: string;
  onSuccess?: {
    create?: (item: T) => void;
    update?: (item: T) => void;
    delete?: (id: string) => void;
  };
  onError?: {
    create?: (error: string) => void;
    update?: (error: string) => void;
    delete?: (error: string) => void;
  };
}

export const useCrud = <T extends { id: string }>(
  api: {
    create: (data: Omit<T, 'id'>) => Promise<T>;
    update: (id: string, data: Partial<T>) => Promise<T>;
    delete: (id: string) => Promise<void>;
  },
  options: UseCrudOptions<T> = {}
) => {
  const { entityName = 'item', onSuccess, onError } = options;
  const createApi = useApi<T>();
  const updateApi = useApi<T>();
  const deleteApi = useApi<void>();
  const { confirmDelete } = useConfirmation();

  const create = useCallback(async (data: Omit<T, 'id'>) => {
    try {
      const result = await createApi.execute(() => api.create(data));
      toast.success(`${entityName} criado com sucesso!`);
      onSuccess?.create?.(result);
      return result;
    } catch (error) {
      const message = `Erro ao criar ${entityName}`;
      toast.error(message);
      onError?.create?.(message);
      throw error;
    }
  }, [api, createApi, entityName, onSuccess, onError]);

  const update = useCallback(async (id: string, data: Partial<T>) => {
    try {
      const result = await updateApi.execute(() => api.update(id, data));
      toast.success(`${entityName} atualizado com sucesso!`);
      onSuccess?.update?.(result);
      return result;
    } catch (error) {
      const message = `Erro ao atualizar ${entityName}`;
      toast.error(message);
      onError?.update?.(message);
      throw error;
    }
  }, [api, updateApi, entityName, onSuccess, onError]);

  const remove = useCallback(async (id: string, itemName?: string) => {
    try {
      const confirmed = await confirmDelete(itemName || entityName);
      if (!confirmed) return false;

      await deleteApi.execute(() => api.delete(id));
      toast.success(`${entityName} excluído com sucesso!`);
      onSuccess?.delete?.(id);
      return true;
    } catch (error) {
      const message = `Erro ao excluir ${entityName}`;
      toast.error(message);
      onError?.delete?.(message);
      throw error;
    }
  }, [api, deleteApi, entityName, confirmDelete, onSuccess, onError]);

  return {
    create,
    update,
    remove,
    isLoading: createApi.loading || updateApi.loading || deleteApi.loading,
    createLoading: createApi.loading,
    updateLoading: updateApi.loading,
    deleteLoading: deleteApi.loading,
    error: createApi.error || updateApi.error || deleteApi.error
  };
};