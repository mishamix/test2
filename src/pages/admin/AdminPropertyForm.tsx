import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../contexts/AppContext';
import { Property, Language, MultilingualText } from '../../types';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

export default function AdminPropertyForm() {
  const { t } = useApp();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const languages: Language[] = ['en', 'uk', 'ru', 'fr', 'ar'];

  const [formData, setFormData] = useState({
    title: { en: '', uk: '', ru: '', fr: '', ar: '' } as MultilingualText,
    description: { en: '', uk: '', ru: '', fr: '', ar: '' } as MultilingualText,
    price: '',
    currency: 'USD',
    location: '',
    address: '',
    property_type: 'house',
    status: 'available',
    bedrooms: '',
    bathrooms: '',
    area_size: '',
    features: [] as string[],
    images: [] as string[],
    video_url: '',
    is_featured: false,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (data) {
        setFormData({
          title: data.title || { en: '', uk: '', ru: '', fr: '', ar: '' },
          description: data.description || { en: '', uk: '', ru: '', fr: '', ar: '' },
          price: data.price.toString(),
          currency: data.currency || 'USD',
          location: data.location || '',
          address: data.address || '',
          property_type: data.property_type || 'house',
          status: data.status || 'available',
          bedrooms: data.bedrooms?.toString() || '',
          bathrooms: data.bathrooms?.toString() || '',
          area_size: data.area_size?.toString() || '',
          features: data.features || [],
          images: data.images || [],
          video_url: data.video_url || '',
          is_featured: data.is_featured || false,
        });
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      setError('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (lang: Language, value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: { ...prev.title, [lang]: value },
    }));
  };

  const handleDescriptionChange = (lang: Language, value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: { ...prev.description, [lang]: value },
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImage.trim()] }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    if (!formData.title.en.trim()) {
      setError('English title is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('Valid price is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setError(null);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        currency: formData.currency,
        location: formData.location,
        address: formData.address || null,
        property_type: formData.property_type,
        status: formData.status,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0,
        area_size: formData.area_size ? Number(formData.area_size) : 0,
        features: formData.features,
        images: formData.images,
        video_url: formData.video_url || null,
        is_featured: formData.is_featured,
      };

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (insertError) throw insertError;
      }

      navigate('/admin/properties');
    } catch (err) {
      console.error('Error saving property:', err);
      setError(err instanceof Error ? err.message : 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/admin/properties')}
        className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-luxury-gold mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Properties
      </button>

      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
          {isEdit ? t('admin.editProperty') : t('admin.addProperty')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Property Titles (Multilingual)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map((lang) => (
                <Input
                  key={lang}
                  label={`Title (${lang.toUpperCase()})${lang === 'en' ? ' *' : ''}`}
                  value={formData.title[lang]}
                  onChange={(e) => handleTitleChange(lang, e.target.value)}
                  placeholder={`Property title in ${lang.toUpperCase()}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Descriptions (Multilingual)
            </h2>
            <div className="space-y-4">
              {languages.map((lang) => (
                <Textarea
                  key={lang}
                  label={`Description (${lang.toUpperCase()})`}
                  value={formData.description[lang]}
                  onChange={(e) => handleDescriptionChange(lang, e.target.value)}
                  placeholder={`Detailed description in ${lang.toUpperCase()}`}
                  rows={3}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              name="price"
              type="number"
              label="Price *"
              value={formData.price}
              onChange={handleChange}
              placeholder="500000"
              required
            />
            <Select
              name="currency"
              label="Currency"
              value={formData.currency}
              onChange={handleChange}
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'AED', label: 'AED' },
              ]}
            />
            <Input
              name="location"
              label="Location *"
              value={formData.location}
              onChange={handleChange}
              placeholder="Dubai Marina, UAE"
              required
            />
          </div>

          <Input
            name="address"
            label="Full Address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Marina Promenade, Tower 1, Dubai"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Select
              name="property_type"
              label="Property Type"
              value={formData.property_type}
              onChange={handleChange}
              options={[
                { value: 'house', label: 'House' },
                { value: 'apartment', label: 'Apartment' },
                { value: 'villa', label: 'Villa' },
                { value: 'penthouse', label: 'Penthouse' },
              ]}
            />
            <Select
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'available', label: 'Available' },
                { value: 'sold', label: 'Sold' },
                { value: 'reserved', label: 'Reserved' },
              ]}
            />
            <Input
              name="bedrooms"
              type="number"
              label="Bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="4"
            />
            <Input
              name="bathrooms"
              type="number"
              label="Bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="3"
            />
          </div>

          <Input
            name="area_size"
            type="number"
            label="Area Size (sq ft)"
            value={formData.area_size}
            onChange={handleChange}
            placeholder="5000"
          />

          <div>
            <label className="label">Features</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Swimming Pool"
                className="flex-1"
              />
              <button type="button" onClick={addFeature} className="btn btn-primary">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-luxury-gold/10 text-secondary-900 dark:text-white"
                >
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="label">{t('admin.images')}</label>
            <div className="flex gap-2 mb-3">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              <button type="button" onClick={addImage} className="btn btn-primary">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                  <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Input
            name="video_url"
            label="Video URL (YouTube/Vimeo)"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="https://www.youtube.com/embed/..."
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-5 h-5 rounded border-secondary-300 text-luxury-gold focus:ring-luxury-gold"
            />
            <label htmlFor="is_featured" className="text-secondary-900 dark:text-white">
              Feature this property on homepage
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/properties')}
              className="btn btn-ghost"
            >
              {t('common.cancel')}
            </button>
            <Button type="submit" loading={saving}>
              <Save className="w-5 h-5 mr-2" />
              {t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
