import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function fetchLatestOrder() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching orders:', error);
  } else {
    console.log('Latest 3 Orders:', JSON.stringify(data, null, 2));
  }
}

fetchLatestOrder();
