import { Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CategoryEditor } from '../components/CategoryEditor';
import { LandingPreview } from '../components/LandingPreview';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { UploadField } from '../components/UploadField';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { supabase } from '../lib/supabase';
import { slugifyPreview } from '../lib/utils';

const initialDraft = {
  name: '',
  slug: '',
  description: '',
  city: '',
  phone: '',
  whatsapp: '',
  email: '',
  business_hours: '',
  response_time_hours: 6,
  intro_message: '',
  primary_color: '#0f172a',
  secondary_color: '#22c55e',
  logo_path: '',
  cover_path: '',
  logo_url: '',
  cover_url: '',
};

export function EditorPage() {
  const { user, company, refreshMe } = useAuth();
  const [draft, setDraft] = useState(initialDraft);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    const payload = await apiFetch('/categories');
    setCategories(payload.categories);
  };

  useEffect(() => {
    if (!company) return;
    setDraft({ ...initialDraft, ...company });
  }, [company]);

  useEffect(() => {
    loadCategories().catch(() => null);
  }, []);

  const previewCompany = useMemo(() => ({
    ...draft,
    slug: draft.slug || slugifyPreview(draft.name),
  }), [draft]);

  const uploadAsset = async (file, type) => {
    if (!user || !file) return null;
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/${type}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('branding').upload(filePath, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('branding').getPublicUrl(filePath);
    return { path: filePath, url: data.publicUrl };
  };

  const updateCompany = async () => {
    setSaving(true);
    try {
      const payload = await apiFetch('/company/me', { method: 'PUT', body: draft });
      setDraft({ ...initialDraft, ...payload.company });
      await refreshMe();
      toast.success('Landing page atualizada com sucesso.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const createCategory = async (category) => {
    try {
      const payload = await apiFetch('/categories', { method: 'POST', body: category });
      setCategories(payload.categories);
      toast.success('Categoria adicionada.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateCategory = async (id, changes) => {
    setCategories((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
    try {
      const payload = await apiFetch(`/categories/${id}`, { method: 'PUT', body: changes });
      setCategories(payload.categories);
    } catch (error) {
      toast.error(error.message);
      loadCategories().catch(() => null);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const payload = await apiFetch(`/categories/${id}`, { method: 'DELETE' });
      setCategories(payload.categories);
      toast.success('Categoria removida.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const moveCategory = async (id, direction) => {
    try {
      const payload = await apiFetch(`/categories/${id}/move`, { method: 'POST', body: { direction } });
      setCategories(payload.categories);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="editor visual"
        title="Monte sua landing page em tempo real"
        description="Ajuste branding, mensagem, cores, categorias e links de contato vendo a página pública ser atualizada instantaneamente."
        actions={<Button onClick={updateCompany} className="gap-2"><Save className="h-4 w-4" />{saving ? 'Salvando...' : 'Salvar alterações'}</Button>}
      />

      <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <Card className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dados da empresa</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Personalize a identidade exibida para o cliente final.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Nome da empresa" value={draft.name} onChange={(e) => setDraft((current) => ({ ...current, name: e.target.value }))} />
              <Input placeholder="Slug público" value={draft.slug} onChange={(e) => setDraft((current) => ({ ...current, slug: slugifyPreview(e.target.value) }))} />
              <Input placeholder="Cidade" value={draft.city} onChange={(e) => setDraft((current) => ({ ...current, city: e.target.value }))} />
              <Input placeholder="Telefone" value={draft.phone} onChange={(e) => setDraft((current) => ({ ...current, phone: e.target.value }))} />
              <Input placeholder="WhatsApp" value={draft.whatsapp} onChange={(e) => setDraft((current) => ({ ...current, whatsapp: e.target.value }))} />
              <Input placeholder="E-mail" value={draft.email} onChange={(e) => setDraft((current) => ({ ...current, email: e.target.value }))} />
              <Input placeholder="Horário de atendimento" value={draft.business_hours} onChange={(e) => setDraft((current) => ({ ...current, business_hours: e.target.value }))} />
              <Select value={draft.response_time_hours} onChange={(e) => setDraft((current) => ({ ...current, response_time_hours: Number(e.target.value) }))}>
                {[2, 6, 12, 24].map((hours) => <option key={hours} value={hours}>{hours} horas</option>)}
              </Select>
              <Input type="color" value={draft.primary_color} onChange={(e) => setDraft((current) => ({ ...current, primary_color: e.target.value }))} />
              <Input type="color" value={draft.secondary_color} onChange={(e) => setDraft((current) => ({ ...current, secondary_color: e.target.value }))} />
            </div>
            <Textarea placeholder="Descrição da empresa" value={draft.description} onChange={(e) => setDraft((current) => ({ ...current, description: e.target.value }))} />
            <Textarea placeholder="Mensagem exibida acima do formulário" value={draft.intro_message} onChange={(e) => setDraft((current) => ({ ...current, intro_message: e.target.value }))} />
            <div className="grid gap-4 md:grid-cols-2">
              <UploadField
                label="Logo"
                helper="Envie uma imagem quadrada para representar a empresa."
                previewUrl={draft.logo_url}
                onChange={async (event) => {
                  try {
                    const asset = await uploadAsset(event.target.files?.[0], 'logo');
                    if (!asset) return;
                    setDraft((current) => ({ ...current, logo_path: asset.path, logo_url: asset.url }));
                    toast.success('Logo enviada com sucesso.');
                  } catch (error) {
                    toast.error(error.message);
                  }
                }}
              />
              <UploadField
                label="Foto de capa"
                helper="Use uma imagem horizontal para destacar seus serviços."
                previewUrl={draft.cover_url}
                onChange={async (event) => {
                  try {
                    const asset = await uploadAsset(event.target.files?.[0], 'cover');
                    if (!asset) return;
                    setDraft((current) => ({ ...current, cover_path: asset.path, cover_url: asset.url }));
                    toast.success('Capa enviada com sucesso.');
                  } catch (error) {
                    toast.error(error.message);
                  }
                }}
              />
            </div>
          </Card>

          <CategoryEditor categories={categories} onCreate={createCategory} onUpdate={updateCategory} onDelete={deleteCategory} onMove={moveCategory} saving={saving} />
        </div>

        <div className="xl:sticky xl:top-28 xl:self-start">
          <LandingPreview company={previewCompany} categories={categories} />
        </div>
      </div>
    </div>
  );
}
