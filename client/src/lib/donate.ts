// Mock donation system for development - replace with actual Supabase when ready
const mockSupabaseClient = {
  from: (table: string) => ({
    insert: (data: any) => ({
      then: (callback: (result: any) => void) => {
        // Simulate successful donation
        callback({ 
          data: [{ id: Date.now(), ...data[0] }], 
          error: null 
        });
      }
    })
  })
};

export async function donateCapsuleCredits({ to, amount }: { to: string, amount: number }) {
  try {
    // Moves credits from the current user to a recipient, tracked in Supabase
    return new Promise((resolve, reject) => {
      mockSupabaseClient.from('capsule_donations').insert([{ 
        to, 
        amount, 
        at: new Date().toISOString() 
      }]).then((result: any) => {
        if (result.error) {
          reject(new Error(result.error.message));
        } else {
          resolve(result.data);
        }
      });
    });
  } catch (error) {
    console.error('Donation error:', error);
    throw error;
  }
}