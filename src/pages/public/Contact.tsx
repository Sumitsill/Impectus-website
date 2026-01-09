import React, { useState } from "react";
import LightPillar from "../../components/specific/LightPillar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useLanguage } from "../../context/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      setStatus("success");
      setResponseMsg("Your message has been sent successfully.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setResponseMsg("Failed to send message. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden pt-28 md:pt-44 pb-12 px-4 md:px-6">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LightPillar topColor="#ff00cc" bottomColor="#333399" intensity={0.4} />
      </div>
      <div className="relative z-50 container mx-auto max-w-5xl">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-display mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          {t('contact_title')}
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pink-500/10 rounded-lg text-pink-500">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('email_us')}</h3>
                <p className="text-gray-400">support@care4you.com</p>
                <p className="text-gray-400">admin@care4you.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('helpline')}</h3>
                <p className="text-gray-400">+91 1800-CARE-4-YOU</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('support_247')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{t('headquarters')}</h3>
                <p className="text-gray-400">Civil Hospital Complex,</p>
                <p className="text-gray-400">Nabha, Punjab 147201</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10 relative z-[60] pointer-events-auto">
            <h3 className="text-2xl font-bold mb-6">{t('send_message')}</h3>

            {status === "success" ? (
              <div className="p-6 text-center space-y-4">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h4 className="text-xl font-bold text-white">Message Sent!</h4>
                <p className="text-gray-400 text-sm">{responseMsg}</p>
                <Button
                  onClick={() => setStatus("idle")}
                  variant="outline"
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder={t('first_name')}
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    className="relative z-[60] cursor-text pointer-events-auto"
                  />
                  <Input
                    placeholder={t('last_name')}
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    className="relative z-[60] cursor-text pointer-events-auto"
                  />
                </div>
                <Input
                  placeholder={t('email_address')}
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="relative z-[60] cursor-text pointer-events-auto"
                />
                <textarea
                  className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:border-pink-500 min-h-[120px] text-white transition-all relative z-[60] cursor-text pointer-events-auto"
                  placeholder={t('message_placeholder')}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />

                {status === "error" && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {responseMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 font-bold"
                  isLoading={isLoading}
                >
                  {t('submit_request')}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
