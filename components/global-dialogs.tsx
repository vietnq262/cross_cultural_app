'use client';

import React from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const GlobalDialogContext = React.createContext<
  <T extends GlobalDialogAction>(
    params: T,
  ) => Promise<T['type'] extends 'alert' | 'confirm' ? boolean : null | string>
>(() => null!);

export type GlobalDialogAction =
  | { type: 'alert'; title: string; body?: string; cancelButton?: string }
  | {
      type: 'confirm';
      title: string;
      body?: string;
      cancelButton?: string;
      actionButton?: string;
    }
  | {
      type: 'prompt';
      title: string;
      body?: string;
      cancelButton?: string;
      actionButton?: string;
      defaultValue?: string;
      inputProps?: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >;
    }
  | { type: 'close' };

interface GlobalDialogState {
  open: boolean;
  title: string;
  body: string;
  type: 'alert' | 'confirm' | 'prompt';
  cancelButton: string;
  actionButton: string;
  defaultValue?: string;
  inputProps?: React.PropsWithoutRef<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  >;
}

export function globalDialogReducer(
  state: GlobalDialogState,
  action: GlobalDialogAction,
): GlobalDialogState {
  switch (action.type) {
    case 'close':
      return { ...state, open: false };
    case 'alert':
    case 'confirm':
    case 'prompt':
      return {
        ...state,
        open: true,
        ...action,
        cancelButton:
          action.cancelButton ||
          (action.type === 'alert' ? 'Confirm' : 'Cancel'),
        actionButton:
          ('actionButton' in action && action.actionButton) || 'Confirm',
      };
    default:
      return state;
  }
}

export function GlobalDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(globalDialogReducer, {
    open: false,
    title: '',
    body: '',
    type: 'alert',
    cancelButton: 'Cancel',
    actionButton: 'Confirm',
  });

  const resolveRef = React.useRef<(tf: any) => void>();

  function close() {
    dispatch({ type: 'close' });
    resolveRef.current?.(false);
  }

  function confirm(value?: string) {
    dispatch({ type: 'close' });
    resolveRef.current?.(value ?? true);
  }

  const dialog = React.useCallback(
    async <T extends GlobalDialogAction>(params: T) => {
      dispatch(params);

      return new Promise<
        T['type'] extends 'alert' | 'confirm' ? boolean : null | string
      >((resolve) => {
        resolveRef.current = resolve;
      });
    },
    [],
  );

  return (
    <GlobalDialogContext.Provider value={dialog}>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) close();
          return;
        }}
      >
        <AlertDialogContent asChild>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              confirm(event.currentTarget.prompt?.value);
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>{state.title}</AlertDialogTitle>
              {state.body ? (
                <AlertDialogDescription>{state.body}</AlertDialogDescription>
              ) : null}
            </AlertDialogHeader>
            {state.type === 'prompt' && (
              <Input
                name='prompt'
                defaultValue={state.defaultValue}
                {...state.inputProps}
              />
            )}
            <AlertDialogFooter>
              <Button type='button' variant='outline' onClick={close}>
                {state.cancelButton}
              </Button>
              {state.type === 'alert' ? null : (
                <Button type='submit'>{state.actionButton}</Button>
              )}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </GlobalDialogContext.Provider>
  );
}

type Params<T extends 'alert' | 'confirm' | 'prompt'> =
  | Omit<Extract<GlobalDialogAction, { type: T }>, 'type'>
  | string;

export function useConfirmDialog() {
  const dialog = React.useContext(GlobalDialogContext);

  return React.useCallback(
    (params: Params<'confirm'>) => {
      return dialog({
        ...(typeof params === 'string' ? { title: params } : params),
        type: 'confirm',
      });
    },
    [dialog],
  );
}

export function usePromptDialog() {
  const dialog = React.useContext(GlobalDialogContext);

  return (params: Params<'prompt'>) =>
    dialog({
      ...(typeof params === 'string' ? { title: params } : params),
      type: 'prompt',
    });
}

export function useAlertDialog() {
  const dialog = React.useContext(GlobalDialogContext);
  return (params: Params<'alert'>) =>
    dialog({
      ...(typeof params === 'string' ? { title: params } : params),
      type: 'alert',
    });
}
