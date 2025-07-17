import { useState } from 'react';
import { Plus, GripVertical, Trash2, FileText, Image, Shield, Video, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CapsuleBlock from './CapsuleBlock';
import { useToast } from '@/hooks/use-toast';

interface Block {
  id: number;
  type: string;
  content: string;
}

interface CapsuleData {
  title: string;
  blocks: Block[];
  metadata: {
    category: string;
    tags: string[];
    griefScore: number;
    credibilityScore: number;
  };
}

interface ForgeEditorProps {
  capsuleData: CapsuleData;
  setCapsuleData: (data: CapsuleData) => void;
}

export default function ForgeEditor({ capsuleData, setCapsuleData }: ForgeEditorProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const { toast } = useToast();

  const blockTypes = [
    { type: 'text', label: 'Text Block', icon: FileText, color: 'text-blue-400' },
    { type: 'image', label: 'Image', icon: Image, color: 'text-green-400' },
    { type: 'video', label: 'Video', icon: Video, color: 'text-red-400' },
    { type: 'link', label: 'Link', icon: Link, color: 'text-purple-400' },
    { type: 'seal', label: 'Veritas Seal', icon: Shield, color: 'text-yellow-400' }
  ];

  const addBlock = (type: string) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: ''
    };
    
    setCapsuleData({
      ...capsuleData,
      blocks: [...capsuleData.blocks, newBlock]
    });

    toast({
      title: "Block Added",
      description: `${type} block added to your capsule`,
    });
  };

  const updateBlock = (index: number, content: string) => {
    const updatedBlocks = [...capsuleData.blocks];
    updatedBlocks[index].content = content;
    setCapsuleData({
      ...capsuleData,
      blocks: updatedBlocks
    });
  };

  const removeBlock = (index: number) => {
    const updatedBlocks = capsuleData.blocks.filter((_, i) => i !== index);
    setCapsuleData({
      ...capsuleData,
      blocks: updatedBlocks
    });

    toast({
      title: "Block Removed",
      description: "Block has been deleted from your capsule",
    });
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const updatedBlocks = [...capsuleData.blocks];
    const [movedBlock] = updatedBlocks.splice(fromIndex, 1);
    updatedBlocks.splice(toIndex, 0, movedBlock);
    setCapsuleData({
      ...capsuleData,
      blocks: updatedBlocks
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== dropIndex) {
      moveBlock(draggedItem, dropIndex);
    }
    setDraggedItem(null);
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <FileText className="h-5 w-5 text-purple-400" />
          </div>
          <span className="text-white">Capsule Editor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="text-sm font-medium text-slate-400 mb-2 block">
            Capsule Title
          </label>
          <Input
            type="text"
            placeholder="Enter your truth capsule title..."
            value={capsuleData.title}
            onChange={(e) => setCapsuleData({
              ...capsuleData,
              title: e.target.value
            })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-lg font-semibold"
          />
        </div>

        {/* Content Blocks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Content Blocks</h3>
            <span className="text-sm text-slate-400">{capsuleData.blocks.length} blocks</span>
          </div>

          {capsuleData.blocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="group relative bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
            >
              {/* Drag Handle */}
              <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
              </div>

              {/* Remove Button */}
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBlock(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Block Content */}
              <div className="p-4 pl-8 pr-12">
                <CapsuleBlock
                  block={block}
                  onUpdate={(content) => updateBlock(index, content)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add Block Controls */}
        <div className="border-t border-slate-600 pt-4">
          <h4 className="text-sm font-medium text-slate-400 mb-3">Add Content Block</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {blockTypes.map((blockType) => {
              const IconComponent = blockType.icon;
              return (
                <Button
                  key={blockType.type}
                  variant="outline"
                  onClick={() => addBlock(blockType.type)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center gap-2 justify-start"
                >
                  <IconComponent className={`w-4 h-4 ${blockType.color}`} />
                  <span className="text-xs">{blockType.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-700/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold">Auto-save</h4>
              <p className="text-xs text-slate-400">Changes saved automatically</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                Save Draft
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                Preview
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}