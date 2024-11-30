import React, { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

// Placeholder functions for LLM and save actions
const checkWithLLM = async (content: string) => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 'LLM Suggestion: Your writing looks good! Consider adding more examples to support your arguments.';
};

const saveEssay = async (essay: string) => {
  // Simulating API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return 'Essay saved successfully!';
};

export default function EssayWritingPage() {
  const [introduction, setIntroduction] = useState('');
  const [body, setBody] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [introSuggestion, setIntroSuggestion] = useState('');
  const [bodySuggestion, setBodySuggestion] = useState('');
  const [conclusionSuggestion, setConclusionSuggestion] = useState('');
  const [finalEssay, setFinalEssay] = useState('');
  const [contentSuggestion, setContentSuggestion] = useState('');
  const [grammarSuggestion, setGrammarSuggestion] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [isReferenceExpanded, setIsReferenceExpanded] = useState(false);

  const handleLLMCheck = async (section: string, content: string) => {
    const suggestion = await checkWithLLM(content);
    switch (section) {
      case 'intro':
        setIntroSuggestion(suggestion);
        break;
      case 'body':
        setBodySuggestion(suggestion);
        break;
      case 'conclusion':
        setConclusionSuggestion(suggestion);
        break;
      case 'content':
        setContentSuggestion(suggestion);
        break;
      case 'grammar':
        setGrammarSuggestion(suggestion);
        break;
    }
  };

  const handleCombineEssay = () => {
    setFinalEssay(`${introduction}\n\n${body}\n\n${conclusion}`);
  };

  const handleSaveEssay = async () => {
    const message = await saveEssay(finalEssay);
    setSaveMessage(message);
  };

  const toggleReferenceSection = () => {
    setIsReferenceExpanded(!isReferenceExpanded);
  };

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h1 className='text-2xl font-bold mb-4'>Essay Writing App</h1>

      {/* Reference Section */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>Reference Materials</CardTitle>
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleReferenceSection}
              aria-expanded={isReferenceExpanded}
              aria-controls='reference-content'
            >
              {isReferenceExpanded ? (
                <ChevronUp className='size-4' />
              ) : (
                <ChevronDown className='size-4' />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            id='reference-content'
            className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${isReferenceExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div>
              <h3 className='font-semibold'>Video Reference</h3>
              <video controls className='w-full aspect-video bg-gray-200'>
                <source src='/placeholder.mp4' type='video/mp4' />
                Your browser does not support the video tag.
              </video>
              <p className='mt-2'>
                Video Description: Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </p>
              <p className='mt-2'>
                Transcription: Lorem ipsum dolor sit amet, consectetur
                adipiscing elit...
              </p>
              <div className='mt-2'>
                <span className='font-semibold'>Tags:</span> essay writing,
                academic, research
              </div>
            </div>
            <div>
              <h3 className='font-semibold'>Sample Essay</h3>
              <p className='mt-2'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout for Writing Parts and Final Essay */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Writing Parts Section */}
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>Writing Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold'>Introduction</h3>
                <Textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder='Write your introduction here...'
                  className='mt-2'
                />
                <Button
                  onClick={() => handleLLMCheck('intro', introduction)}
                  className='mt-2'
                >
                  Check Introduction
                </Button>
                {introSuggestion && (
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {introSuggestion}
                  </p>
                )}
              </div>
              <div>
                <h3 className='font-semibold'>Body</h3>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='Write your body paragraphs here...'
                  className='mt-2'
                />
                <Button
                  onClick={() => handleLLMCheck('body', body)}
                  className='mt-2'
                >
                  Check Body
                </Button>
                {bodySuggestion && (
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {bodySuggestion}
                  </p>
                )}
              </div>
              <div>
                <h3 className='font-semibold'>Conclusion</h3>
                <Textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder='Write your conclusion here...'
                  className='mt-2'
                />
                <Button
                  onClick={() => handleLLMCheck('conclusion', conclusion)}
                  className='mt-2'
                >
                  Check Conclusion
                </Button>
                {conclusionSuggestion && (
                  <p className='mt-2 text-sm text-muted-foreground'>
                    {conclusionSuggestion}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Essay Section */}
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>Final Essay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Button onClick={handleCombineEssay} className='w-full'>
                Combine Essay Parts
              </Button>
              <Textarea
                value={finalEssay}
                onChange={(e) => setFinalEssay(e.target.value)}
                placeholder='Your combined essay will appear here...'
                className='min-h-[200px]'
              />
              <div className='flex flex-wrap gap-2'>
                <Button onClick={() => handleLLMCheck('content', finalEssay)}>
                  Check Content
                </Button>
                <Button onClick={() => handleLLMCheck('grammar', finalEssay)}>
                  Check Grammar
                </Button>
                <Button onClick={handleSaveEssay}>Save Essay</Button>
              </div>
              {contentSuggestion && (
                <p className='mt-2 text-sm text-muted-foreground'>
                  {contentSuggestion}
                </p>
              )}
              {grammarSuggestion && (
                <p className='mt-2 text-sm text-muted-foreground'>
                  {grammarSuggestion}
                </p>
              )}
              {saveMessage && (
                <p className='mt-2 text-sm text-green-600'>{saveMessage}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
