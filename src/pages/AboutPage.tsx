import { Shield, Award, Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function AboutPage() {
  const { t } = useApp();

  const stats = [
    { number: '500+', label: t('about.stats.propertiesSold') },
    { number: '1000+', label: t('about.stats.happyClients') },
    { number: '20+', label: t('about.stats.yearsExperience') },
    { number: '50+', label: t('about.stats.countries') },
  ];

  const values = [
    {
      icon: Award,
      title: t('about.values.excellence.title'),
      description: t('about.values.excellence.description'),
    },
    {
      icon: Shield,
      title: t('about.values.integrity.title'),
      description: t('about.values.integrity.description'),
    },
    {
      icon: Heart,
      title: t('about.values.dedication.title'),
      description: t('about.values.dedication.description'),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-10">
      <section className="relative py-20 mb-10">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&dpr=2"
            alt="Luxury office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/70 to-secondary-900/90" />
        </div>

        <div className="relative z-10 container-custom text-center text-white">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            {t('about.title')}
          </h1>
          <p className="text-xl text-secondary-200 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-6">
                {t('about.story.title')}
              </h2>
              <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6">
                {t('about.story.content')}
              </p>
              <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                From contemporary penthouses in the heart of Dubai Marina to beachfront villas on Palm Jumeirah,
                our portfolio represents the finest properties in the most sought-after locations. We believe
                that buying a property should be an exciting journey, and we are committed to making that
                journey as smooth and enjoyable as possible.
              </p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2"
                alt="Luxury property interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-secondary-900" id="values">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-heading">{t('about.values.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-luxury-cream dark:bg-secondary-800"
              >
                <div className="w-16 h-16 rounded-2xl bg-luxury-gold/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-luxury-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-secondary-600 dark:text-secondary-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
