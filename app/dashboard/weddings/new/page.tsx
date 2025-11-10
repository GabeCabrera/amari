'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';

type Template = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  timeline: string;
};

const templates: Template[] = [
  {
    id: '6-month',
    name: '6-Month Timeline',
    description: 'Perfect for traditional weddings with a 6-month planning period',
    icon: <Calendar className="h-8 w-8" />,
    timeline: '6 months'
  },
  {
    id: 'destination',
    name: 'Destination Wedding',
    description: 'Specialized template for destination weddings with travel coordination',
    icon: <MapPin className="h-8 w-8" />,
    timeline: '8-12 months'
  },
  {
    id: 'intimate',
    name: 'Intimate Celebration',
    description: 'Streamlined planning for smaller, intimate weddings',
    icon: <Users className="h-8 w-8" />,
    timeline: '3-4 months'
  },
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch and build your own custom timeline',
    icon: <Sparkles className="h-8 w-8" />,
    timeline: 'Flexible'
  }
];

export default function NewWeddingPage() {
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep('details');
  };

  const handleCreateWedding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create wedding
      const { data: wedding, error: weddingError } = await supabase
        .from('weddings')
        .insert({
          name,
          date: date || null,
          description,
          owner_id: user.id,
          status: 'planning'
        })
        .select()
        .single();

      if (weddingError) throw weddingError;

      // TODO: Create template-specific tasks based on selectedTemplate
      // This would populate default tasks based on the chosen template

      router.push(`/dashboard/weddings/${wedding.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create wedding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-semibold text-[#2E2E2E]">
          Create New Wedding
        </h1>
        <p className="text-[#6E6E6E] mt-2">
          {step === 'template' 
            ? 'Choose a template to get started or build from scratch'
            : 'Add details about your wedding project'
          }
        </p>
      </div>

      {step === 'template' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="glass-card border-white/15 hover:scale-105 transition-all duration-200 cursor-pointer group"
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#EFB7B7] to-[#F5C16C] text-white group-hover:scale-110 transition-transform">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-[#2E2E2E] mb-2">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-[#6E6E6E]">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-[#6E6E6E]">
                  <Calendar className="h-4 w-4" />
                  <span>{template.timeline}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card border-white/15 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-[#2E2E2E]">
                Wedding Details
              </CardTitle>
              <CardDescription className="text-[#6E6E6E]">
                Using {templates.find(t => t.id === selectedTemplate)?.name} template
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateWedding}>
              <CardContent className="space-y-6">
                {error && (
                  <div className="rounded-xl bg-[#C97070]/10 border border-[#C97070]/20 backdrop-blur-xl p-3 text-sm text-[#C97070]">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#2E2E2E] font-medium">
                    Wedding Name <span className="text-[#C97070]">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Sarah & John's Wedding"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    className="glass-input rounded-xl"
                  />
                  <p className="text-xs text-[#6E6E6E]">
                    This will be the name displayed across your project
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[#2E2E2E] font-medium">
                    Wedding Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={loading}
                    className="glass-input rounded-xl"
                  />
                  <p className="text-xs text-[#6E6E6E]">
                    Optional - you can add this later
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#2E2E2E] font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="A romantic garden celebration..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    className="glass-input rounded-xl min-h-[100px]"
                  />
                  <p className="text-xs text-[#6E6E6E]">
                    Add any notes or details about the wedding
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('template')}
                    disabled={loading}
                    className="glass-button rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !name}
                    className="flex-1 bg-[#EFB7B7] hover:bg-[#F5C16C] text-[#2E2E2E] font-medium rounded-xl py-6 transition-all duration-200 hover:scale-105 shadow-lg border-0"
                  >
                    {loading ? 'Creating...' : 'Create Wedding'}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
