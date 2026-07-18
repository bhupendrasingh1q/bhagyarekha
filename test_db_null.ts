import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');

async function testInsert() {
  const newOrder = {
    name: 'Test TOB Null',
    email: 'test_tob@example.com',
    phone: '1234567890',
    gender: 'male',
    dob: '1990-01-01',
    tob: null, // Test if null is allowed
    pobCity: 'Delhi',
    pobState: 'Delhi',
    status: 'pending'
  };

  const { data, error } = await supabase
    .from('orders')
    .insert([newOrder])
    .select();

  if (error) {
    console.error('Supabase Insert Error with null:', error);
  } else {
    console.log('Successfully inserted with null TOB:', data);
    
    // Clean up the test order
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', data[0].id);
      
    if (deleteError) {
      console.error('Error deleting test order:', deleteError);
    } else {
      console.log('Successfully cleaned up test order');
    }
  }
}

testInsert();
