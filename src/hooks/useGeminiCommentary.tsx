import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CommentaryRequest {
  type: 'commentary' | 'strategy' | 'victory';
  data: any;
}

export const useGeminiCommentary = () => {
  const [commentary, setCommentary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getCommentary = async ({ type, data }: CommentaryRequest) => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('game-ai', {
        body: { type, data }
      });

      if (error) throw error;
      
      setCommentary(result.commentary);
      return result.commentary;
    } catch (error) {
      console.error('Gemini commentary error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    commentary,
    isLoading,
    getCommentary,
    clearCommentary: () => setCommentary('')
  };
};
