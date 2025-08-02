import CapsuleCreator from '@/components/CapsuleCreator';
// import { withAuthGuard } from '@/utils/withAuthGuard'; // Disabled for debug

function CreateCapsulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Preserve Your Truth
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Create an immutable memory capsule that will preserve your truth for generations. 
            Share your story, document evidence, or leave a legacy that cannot be erased.
          </p>
        </div>
        
        <CapsuleCreator />
      </div>
    </div>
  );
}

// Protect this route - only authenticated users can create capsules
export default CreateCapsulePage; // withAuthGuard(CreateCapsulePage, 'explorer'); // Disabled for debug