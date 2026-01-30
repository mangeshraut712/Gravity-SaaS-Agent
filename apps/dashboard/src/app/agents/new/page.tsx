'use client';

export const dynamic = 'force-dynamic';

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  FileText,
  Globe,
  Sparkles,
  Upload,
  Zap,
  MessageSquare
} from "lucide-react";
import { supabaseClient } from "../../../lib/supabaseClient";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Switch } from "../../../components/ui/switch";
import { cn } from "../../../lib/utils";

const steps = [
  { id: 1, name: "Basic Setup", icon: Bot },
  { id: 2, name: "Personality", icon: Sparkles },
  { id: 3, name: "Knowledge", icon: FileText },
  { id: 4, name: "Channels", icon: Globe },
  { id: 5, name: "Deploy", icon: Check },
];

const templates = [
  { id: "customer_service", name: "Customer Service Bot" },
  { id: "sales_qualifier", name: "Sales Qualifier" },
  { id: "appointment_scheduler", name: "Appointment Scheduler" },
  { id: "faq_assistant", name: "FAQ Assistant" },
  { id: "lead_capture", name: "Lead Capture Bot" },
] as const;

const personalities = [
  { id: "friendly", name: "Friendly & Casual", emoji: "😊", description: "Warm, approachable, and conversational" },
  { id: "professional", name: "Professional & Formal", emoji: "💼", description: "Polished, business-appropriate tone" },
  { id: "technical", name: "Technical & Precise", emoji: "🤖", description: "Accurate, detailed, and specific" },
  { id: "fun", name: "Enthusiastic & Fun", emoji: "🎉", description: "Energetic, playful, and engaging" },
] as const;

type PersonalityType = "friendly" | "professional" | "technical" | "fun";

function NewAgentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    template_type: (searchParams.get("template") || "customer_service") as string,
    personality: "friendly" as PersonalityType,
    custom_instructions: "",
    knowledge_text: "",
    channels: {
      web: true,
      whatsapp: false,
      api: false,
    },
    monetization_enabled: false,
    price_per_month: "",
    free_trial_days: 7,
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleDeploy = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabaseClient.from("agents").insert({
        user_id: user.id,
        name: formData.name,
        template_type: formData.template_type,
        personality: formData.personality,
        custom_instructions: formData.custom_instructions,
        knowledge_base: formData.knowledge_text ? [{ type: "text", content: formData.knowledge_text }] : [],
        channels: formData.channels,
        status: "active",
      });

      if (error) throw error;

      router.push("/agents");
    } catch (err: any) {
      setError(err.message || "Failed to deploy agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 animate-slide-up bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit -ml-4 hover:bg-gray-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Agent</h1>
          <p className="text-gray-500 mt-1">Deploy an expert agent in minutes.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between card p-6 border-gray-100">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
              currentStep >= step.id ? "bg-violet-600 border-violet-600 text-white" : "border-gray-100 bg-gray-50 text-gray-400"
            )}>
              <step.icon className="h-5 w-5" />
            </div>
            {idx < steps.length - 1 && <div className={cn("h-0.5 w-12 sm:w-20 transition-all", currentStep > step.id ? "bg-violet-600" : "bg-gray-100")} />}
          </div>
        ))}
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}

      <div className="card p-8 min-h-[400px] border-gray-100 shadow-sm relative overflow-hidden">
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold text-gray-900">Basic Setup</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input id="name" placeholder="Support Bot" value={formData.name} onChange={(e) => updateFormData({ name: e.target.value })} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-3">
                <Label>Template</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {templates.map(t => (
                    <div key={t.id} onClick={() => updateFormData({ template_type: t.id })} className={cn(
                      "p-4 rounded-xl border-2 transition-all cursor-pointer",
                      formData.template_type === t.id ? "border-violet-500 bg-violet-50" : "border-gray-100 hover:border-gray-200"
                    )}>
                      <p className="font-medium text-gray-900">{t.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold text-gray-900">Personality</h2>
            <RadioGroup value={formData.personality} onValueChange={(v) => updateFormData({ personality: v as PersonalityType })} className="grid gap-4 sm:grid-cols-2">
              {personalities.map(p => (
                <div key={p.id} onClick={() => updateFormData({ personality: p.id as PersonalityType })} className={cn(
                  "p-6 rounded-2xl border-2 transition-all cursor-pointer",
                  formData.personality === p.id ? "border-violet-500 bg-violet-50" : "border-gray-100 hover:border-gray-200"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <RadioGroupItem value={p.id} id={p.id} />
                    <span className="text-2xl">{p.emoji}</span>
                    <Label htmlFor={p.id} className="font-bold cursor-pointer">{p.name}</Label>
                  </div>
                  <p className="text-sm text-gray-500">{p.description}</p>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold text-gray-900">Knowledge</h2>
            <div className="border-2 border-dashed border-gray-100 rounded-2xl p-12 text-center bg-gray-50">
              <Upload className="h-10 w-10 mx-auto mb-4 text-gray-300" />
              <p className="text-sm text-gray-500 font-medium">Click to upload training data or drag and drop</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">PDF, DOCX, TXT</p>
            </div>
            <Textarea
              placeholder="Or paste knowledge text here..."
              value={formData.knowledge_text}
              onChange={(e) => updateFormData({ knowledge_text: e.target.value })}
              className="min-h-[200px] bg-gray-50 border-gray-200"
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold text-gray-900">Channels</h2>
            <div className="space-y-4">
              {['web', 'whatsapp', 'api'].map(ch => (
                <div key={ch} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="capitalize font-medium text-gray-900">{ch} Channel</div>
                  <Switch checked={(formData.channels as any)[ch]} onCheckedChange={(v) => updateFormData({ channels: { ...formData.channels, [ch]: v } })} />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold text-gray-900">Ready to Deploy?</h2>
            <div className="rounded-2xl bg-violet-50 border border-violet-100 p-8 text-center space-y-4">
              <Zap className="h-12 w-12 mx-auto text-violet-600" />
              <p className="text-gray-900 font-medium">Your agent &quot;{formData.name}&quot; is configured and ready for production.</p>
              <p className="text-sm text-gray-500">System will automatically initialize model weights and set up API endpoints.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
          <Button variant="ghost" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1}>Previous</Button>
          {currentStep < 5 ? (
            <Button variant="premium" onClick={() => setCurrentStep(s => s + 1)} disabled={!formData.name}>Next Step</Button>
          ) : (
            <Button variant="premium" onClick={handleDeploy} disabled={loading}>{loading ? "Deploying..." : "Launch Agent"}</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewAgentPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" /></div>}>
      <NewAgentForm />
    </Suspense>
  );
}
