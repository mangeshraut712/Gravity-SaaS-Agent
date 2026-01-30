'use client';

import { useState } from "react";
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
];

const personalities = [
  { id: "friendly", name: "Friendly & Casual", emoji: "😊", description: "Warm, approachable, and conversational" },
  { id: "professional", name: "Professional & Formal", emoji: "💼", description: "Polished, business-appropriate tone" },
  { id: "technical", name: "Technical & Precise", emoji: "🤖", description: "Accurate, detailed, and specific" },
  { id: "fun", name: "Enthusiastic & Fun", emoji: "🎉", description: "Energetic, playful, and engaging" },
];

export default function NewAgentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    template_type: searchParams.get("template") || "customer_service",
    personality: "friendly" as "friendly" | "professional" | "technical" | "fun",
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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0;
      default:
        return true;
    }
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
        monetization_enabled: formData.monetization_enabled,
        price_per_month: formData.price_per_month ? parseFloat(formData.price_per_month) : null,
        free_trial_days: formData.free_trial_days,
      });

      if (error) throw error;

      router.push("/agents");
    } catch (error: any) {
      setError(error.message || "Failed to deploy agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="w-fit -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create New Agent</h1>
          <p className="text-gray-400 mt-1">
            Follow the steps to build and deploy your custom AI agent.
          </p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all shadow-sm",
                  currentStep >= step.id
                    ? "border-purple-500 bg-purple-500 text-white shadow-purple-500/20"
                    : "border-white/10 bg-white/5 text-gray-500"
                )}
              >
                <step.icon className="h-5 w-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-12 sm:w-20 transition-all",
                    currentStep > step.id ? "bg-purple-500" : "bg-white/10"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 px-1 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">
          {steps.map((step) => (
            <span key={step.id} className={cn(
              "w-10 text-center transition-colors",
              currentStep >= step.id ? "text-purple-400" : ""
            )}>
              {step.name}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Step content */}
      <div className="card p-8 min-h-[400px]">
        {/* Step 1: Basic Setup */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Basic Setup</h2>
              <p className="text-gray-400">
                Identify your agent and choose a pre-configured template to get started.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-300">Agent Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Customer Support Bot"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className="bg-white/[0.02]"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-gray-300">Choose a Template</Label>
                <RadioGroup
                  value={formData.template_type}
                  onValueChange={(value) => updateFormData({ template_type: value })}
                  className="grid gap-3"
                >
                  {templates.map((template) => (
                    <label
                      key={template.id}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer",
                        formData.template_type === template.id
                          ? "border-purple-500 bg-purple-500/5"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                      )}
                    >
                      <RadioGroupItem value={template.id} id={template.id} className="border-white/20 text-purple-500" />
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        formData.template_type === template.id ? "text-white" : "text-gray-400"
                      )}>{template.name}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Personality */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Personality & Tone</h2>
              <p className="text-gray-400">
                How should your agent talk? This defines its character and response style.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {personalities.map((p) => (
                <button
                  key={p.id}
                  onClick={() => updateFormData({ personality: p.id as typeof formData.personality })}
                  className={cn(
                    "flex flex-col items-start p-6 rounded-2xl border transition-all text-left group",
                    formData.personality === p.id
                      ? "border-purple-500 bg-purple-500/5"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                  )}
                >
                  <span className="text-3xl mb-4 group-hover:scale-110 transition-transform">{p.emoji}</span>
                  <span className={cn(
                    "font-bold transition-colors",
                    formData.personality === p.id ? "text-white" : "text-gray-200"
                  )}>{p.name}</span>
                  <span className="text-sm text-gray-500 mt-1">{p.description}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <Label htmlFor="instructions" className="text-gray-300">Custom Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="Specific instructions: 'Never mention competitors', 'Always be slightly sarcastic'..."
                value={formData.custom_instructions}
                onChange={(e) => updateFormData({ custom_instructions: e.target.value })}
                className="min-h-[120px] bg-white/[0.02]"
              />
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-right">
                {formData.custom_instructions.length} / 2000
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Knowledge Base */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Knowledge Base</h2>
              <p className="text-gray-400">
                Give your agent the data it needs to provide accurate information.
              </p>
            </div>

            <div className="border-2 border-dashed border-white/5 rounded-2xl p-12 text-center bg-white/[0.01]">
              <Upload className="h-10 w-10 mx-auto mb-4 text-gray-600" />
              <p className="font-bold text-white mb-1">Upload Source Documents</p>
              <p className="text-xs text-gray-500 mb-6">
                PDF, TXT, DOCX unsupported in preview.
              </p>
              <Button variant="outline" size="sm" disabled>
                Browse Files
              </Button>
            </div>

            <div className="space-y-3">
              <Label htmlFor="knowledge" className="text-gray-300">Or Paste Source Text</Label>
              <Textarea
                id="knowledge"
                placeholder="Paste your FAQ, product docs, or context here..."
                value={formData.knowledge_text}
                onChange={(e) => updateFormData({ knowledge_text: e.target.value })}
                className="min-h-[200px] bg-white/[0.02]"
              />
            </div>
          </div>
        )}

        {/* Step 4: Channels */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Deployment Channels</h2>
              <p className="text-gray-400">
                Choose where this agent should be active.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'web', name: 'Web Chat Widget', desc: 'Embed on your website', icon: MessageSquare, color: 'text-purple-400', always: true },
                { id: 'whatsapp', name: 'WhatsApp Business', desc: 'Direct messaging', icon: MessageSquare, color: 'text-emerald-400' },
                { id: 'api', name: 'REST API', desc: 'Custom integrations', icon: Zap, color: 'text-amber-400' },
              ].map((channel) => (
                <div key={channel.id} className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className={cn("h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center", channel.color)}>
                      <channel.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{channel.name}</p>
                      <p className="text-xs text-gray-500">{channel.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={(formData.channels as any)[channel.id]}
                    disabled={channel.always}
                    onCheckedChange={(checked) =>
                      !channel.always && updateFormData({ channels: { ...formData.channels, [channel.id]: checked } })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Review & Deploy</h2>
              <p className="text-gray-400">
                Double check everything before firing up your agent.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <span className="text-gray-500">Agent Name</span>
                <span className="text-white font-medium text-right">{formData.name}</span>

                <span className="text-gray-500">Template</span>
                <span className="text-white font-medium text-right capitalize">{formData.template_type.replace(/_/g, " ")}</span>

                <span className="text-gray-500">Personality</span>
                <span className="text-white font-medium text-right capitalize">{formData.personality}</span>

                <span className="text-gray-500">Enabled Channels</span>
                <span className="text-white font-medium text-right">
                  {Object.entries(formData.channels)
                    .filter(([, v]) => v)
                    .map(([k]) => k.toUpperCase())
                    .join(", ")}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 p-6 flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Almost there!</p>
                <p className="text-sm text-gray-400 mt-1">
                  Once deployed, your agent will be instantly available on all selected channels. You can edit these settings anytime.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
            className="text-gray-500 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              variant="premium"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!canProceed()}
              className="px-8"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button variant="premium" onClick={handleDeploy} disabled={loading} className="px-10">
              {loading ? "Deploying..." : "🚀 Deploy Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
