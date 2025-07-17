import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { CapsuleForm } from "@/components/capsule/capsule-form";

export default function CreateCapsule() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </Link>
          <h1 className="text-4xl font-bold mb-4 gradient-text">Create Truth Capsule</h1>
          <p className="text-slate-400 text-lg">
            Submit your truth claim with supporting evidence for community verification and earn GTT tokens.
          </p>
        </div>

        <CapsuleForm />
      </div>
    </div>
  );
}