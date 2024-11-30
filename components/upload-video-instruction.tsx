'use client';

import { useCompletion } from 'ai/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { MarkDownMessageViewer } from './chat-messages';

export default function UploadVideoInstruction() {
  const {
    completion: instruction,
    input: instructionTopicInput,
    handleInputChange: handleInstructionTopicInputChange,
    handleSubmit: handleInstructionTopicInputSubmit,
  } = useCompletion({
    api: '/api/assistants/video-guide',
  });

  return (
    <div className='space-y-2'>
      <Label htmlFor='cultural-question'>
        What kind of traditional culture do you want to create a video about?
      </Label>
      <div className='flex space-x-2'>
        <Input
          id='cultural-question'
          value={instructionTopicInput}
          onChange={handleInstructionTopicInputChange}
          placeholder='E.g., Traditional Japanese tea ceremony'
        />
        <Button onClick={handleInstructionTopicInputSubmit}>Guide me</Button>
      </div>
      {instruction && (
        <div className='mt-2 text-sm text-muted-foreground max-h-96 overflow-auto rounded-md border p-4 bg-muted'>
          <MarkDownMessageViewer content={instruction} />
        </div>
      )}
    </div>
  );
}
