import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CategoryEditor } from '../components/CategoryEditor';
import { PageHeader } from '../components/layout/PageHeader';
import { apiFetch } from '../lib/api';

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const payload = await apiFetch('/categories');
    setCategories(payload.categories);
  };

  useEffect(() => {
    load().catch(() => null);
  }, []);

  const wrap = async (promiseFactory, successMessage) => {
    setSaving(true);
    try {
      const payload = await promiseFactory();
      setCategories(payload.categories);
      if (successMessage) toast.success(successMessage);
    } catch (error) {
      toast.error(error.message);
      load().catch(() => null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="organização" title="Categorias de serviço" description="Defina as opções que o cliente verá no formulário público, com exemplos para orientar a descrição do pedido." />
      <CategoryEditor
        categories={categories}
        saving={saving}
        onCreate={(data) => wrap(() => apiFetch('/categories', { method: 'POST', body: data }), 'Categoria criada.')}
        onUpdate={(id, data) => wrap(() => apiFetch(`/categories/${id}`, { method: 'PUT', body: data }))}
        onDelete={(id) => wrap(() => apiFetch(`/categories/${id}`, { method: 'DELETE' }), 'Categoria removida.')}
        onMove={(id, direction) => wrap(() => apiFetch(`/categories/${id}/move`, { method: 'POST', body: { direction } }))}
      />
    </div>
  );
}
