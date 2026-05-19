import { createSupabaseServerClient } from '@/lib/supabase-server';
import { type Policy } from '@/lib/design';
import { AllPoliciesClient } from './AllPoliciesClient';

export const dynamic = 'force-dynamic';

export default async function AllPoliciesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('policies')
    .select('*')
    .eq('status', 'published')
    .order('title');
  return <AllPoliciesClient policies={(data || []) as Policy[]} />;
}
