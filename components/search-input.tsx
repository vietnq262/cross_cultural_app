import { zodResolver } from '@hookform/resolvers/zod';
import { SearchIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';

export interface GenericPaginatedTableSearchInputProps {
  className?: string;
  value?: string;
  onChange?: (value?: string) => void;
}

const SearchInput = (props: GenericPaginatedTableSearchInputProps) => {
  const { className, value: initialValue, onChange } = props;

  const form = useForm<SearchFormValue>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: initialValue || '',
    },
  });

  return (
    <Form<SearchFormValue> {...form}>
      <form
        className={className}
        onSubmit={(formEvent) => {
          formEvent.stopPropagation();
          form.handleSubmit(
            (data) => {
              onChange?.(data.search || undefined);
            },
            (errors) => {},
          )(formEvent);
        }}
      >
        <div className='flex flex-row gap-2'>
          <FormField<SearchFormValue, 'search'>
            control={form.control}
            name='search'
            render={({ field }) => (
              <FormItem className='min-w-0 flex-1'>
                <FormControl>
                  <div className='relative'>
                    <Input
                      className='w-full rounded-full pr-12 pl-4'
                      placeholder='Type to search...'
                      ref={field.ref}
                      name={field.name}
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                    <Button
                      className={cn(
                        'absolute right-10 top-1/2 -translate-y-1/2 size-8 rounded-full p-2 text-muted-foreground hover:text-red transition-all',
                        !!field.value
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-0',
                      )}
                      type='button'
                      variant='ghost'
                      disabled={!field.value}
                      onClick={() => {
                        field.onChange('');
                      }}
                    >
                      <XIcon className='size-4' />
                    </Button>
                    <Button
                      className='absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full p-2'
                      variant='ghost'
                      type='submit'
                    >
                      <SearchIcon className='size-4' />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

type SearchFormValue = {
  search: string;
};

const SearchFormSchema = z.object({
  search: z.string().trim().nullish(),
});

export default SearchInput;
