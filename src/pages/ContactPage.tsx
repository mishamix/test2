import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Button from '../components/Button';

export default function ContactPage() {
  const { t } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('property_inquiries').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message || null,
        preferred_contact: formData.preferredContact,
        property_id: null,
        status: 'new',
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferredContact: 'email',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <section className="relative py-20 mb-10">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&dpr=2"
            alt="Contact hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/80 via-secondary-900/60 to-secondary-900/80" />
        </div>

        <div className="relative z-10 container-custom text-center text-white">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-secondary-200 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-xl p-8">
              <h2 className="font-display text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                {t('contact.title')}
              </h2>

              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
                    {t('contact.form.success')}
                  </h3>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-luxury-gold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      name="name"
                      label={t('contact.form.name')}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                    <Input
                      type="email"
                      name="email"
                      label={t('contact.form.email')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="tel"
                      name="phone"
                      label={t('contact.form.phone')}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                    />
                    <Select
                      name="preferredContact"
                      label={t('contact.form.preferredContact')}
                      value={formData.preferredContact}
                      onChange={handleChange}
                      options={[
                        { value: 'email', label: 'Email' },
                        { value: 'whatsapp', label: 'WhatsApp' },
                        { value: 'telegram', label: 'Telegram' },
                      ]}
                    />
                  </div>

                  <Textarea
                    name="message"
                    label={t('contact.form.message')}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="I am interested in..."
                    rows={4}
                  />

                  {error && (
                    <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button type="submit" loading={loading} className="w-full md:w-auto">
                    <Send className="w-5 h-5 mr-2" />
                    {t('contact.form.submit')}
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-secondary-900 dark:bg-secondary-800 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="font-display text-2xl font-bold mb-6">
                {t('contact.info.title')}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.info.address')}</h3>
                    <p className="text-secondary-400 text-sm">
                      Downtown Dubai, Burj Khalifa Tower<br />
                      Level 120, Dubai, UAE
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.info.phone')}</h3>
                    <p className="text-secondary-400 text-sm">+971 4 123 4567</p>
                    <p className="text-secondary-400 text-sm">+971 50 987 6543</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.info.email')}</h3>
                    <p className="text-secondary-400 text-sm">info@luxuryestates.com</p>
                    <p className="text-secondary-400 text-sm">sales@luxuryestates.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.info.workingHours')}</h3>
                    <p className="text-secondary-400 text-sm">Mon - Fri: 9:00 AM - 7:00 PM</p>
                    <p className="text-secondary-400 text-sm">Sat - Sun: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-secondary-700">
                <a
                  href="https://wa.me/97141234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-full bg-green-600 hover:bg-green-700 text-white mb-3"
                >
                  WhatsApp Us
                </a>
                <a
                  href="https://t.me/luxuryestates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Telegram Us
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-xl overflow-hidden h-[400px]">
            <div className="w-full h-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-secondary-400">Downtown Dubai, Burj Khalifa Tower</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-500 mt-2">Interactive map would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
