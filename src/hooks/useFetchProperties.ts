import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Property, PropertyInquiry } from '../types';

export function useProperties(filters?: {
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  featured?: boolean;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (filters?.propertyType && filters.propertyType !== 'all') {
        query = query.eq('property_type', filters.propertyType);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  return { property, loading, error };
}

export function useFeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'available')
          .eq('is_featured', true)
          .limit(6);

        if (fetchError) throw fetchError;

        setProperties(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { properties, loading, error };
}

export function useInquiries() {
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('property_inquiries')
        .select(`
          *,
          properties:property_id (
            id,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setInquiries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const updateInquiryStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      const { error: updateError } = await supabase
        .from('property_inquiries')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchInquiries();
    } catch (err) {
      throw err;
    }
  };

  return { inquiries, loading, error, refetch: fetchInquiries, updateInquiryStatus };
}
