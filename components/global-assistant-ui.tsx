import { useUIState } from 'ai/rsc';

import { AssistantAIProvider } from '@/lib/chat/assistant-ai-actions';

type GlobalAssistantUIProps = {
  className?: string;
};

export default function GlobalAssistantUI(props: GlobalAssistantUIProps) {
  const [uiState] = useUIState<typeof AssistantAIProvider>();

  return <iframe className={props.className} src={'/chat'}></iframe>;
}
