import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

const emptyCategory = { name: '', example_text: '' };

export function CategoryEditor({ categories, onCreate, onUpdate, onDelete, onMove, saving }) {
  const [draft, setDraft] = useState(emptyCategory);

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Nova categoria</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Crie opções como Energia Solar, SPDA ou Outro.</p>
          </div>
          <Button
            onClick={() => {
              if (!draft.name.trim()) return;
              onCreate(draft);
              setDraft(emptyCategory);
            }}
            disabled={saving}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Nome da categoria" value={draft.name} onChange={(e) => setDraft((current) => ({ ...current, name: e.target.value }))} />
          <Textarea
            className="min-h-[88px]"
            placeholder="Exemplo exibido no formulário público"
            value={draft.example_text}
            onChange={(e) => setDraft((current) => ({ ...current, example_text: e.target.value }))}
          />
        </div>
      </Card>

      <div className="space-y-3">
        {categories.map((category, index) => (
          <Card key={category.id} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Ordem {index + 1}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{category.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => onMove(category.id, 'up')} disabled={index === 0 || saving}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="secondary" onClick={() => onMove(category.id, 'down')} disabled={index === categories.length - 1 || saving}><ArrowDown className="h-4 w-4" /></Button>
                <Button variant="danger" onClick={() => onDelete(category.id)} disabled={saving}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input value={category.name} onChange={(e) => onUpdate(category.id, { name: e.target.value })} />
              <Textarea className="min-h-[88px]" value={category.example_text || ''} onChange={(e) => onUpdate(category.id, { example_text: e.target.value })} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
