'use client';

import { buttonVariants } from '@/components/ui/button';
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  className?: string;
  contentClassName?: string;
  pageSize: number;
  pageIndex: number;
  total: number;
  siblingCount?: number;
  onClickPage: (pageIndex: number) => void;
}

const defaultSiblingCount: number = 3;

export default function ListingPagination(props: PaginationProps) {
  const items: Array<
    | {
        key: string;
        type: 'dot';
      }
    | {
        key: string;
        type: 'page';
        pageIndex: number;
        pageNumber: string;
        isCurrentPage?: boolean;
        isFirstPage?: boolean;
        isLastPage?: boolean;
        isPreviousPage?: boolean;
        isNextPage?: boolean;
      }
  > = [];

  const currentPageIndex = props.pageIndex;
  const previousPageIndex = currentPageIndex - 1;
  const nextPageIndex = currentPageIndex + 1;

  const siblingCount = props.siblingCount || defaultSiblingCount;
  const minVisiblePageIndex = currentPageIndex - siblingCount;
  const maxVisiblePageIndex = currentPageIndex + siblingCount;

  let hasLeftEllipsis = false;
  let hasRightEllipsis = false;

  const {
    numberOfPages,
    isOutOfIndex,
    firstPageIndex,
    lastPageIndex,
    currentPageFirstItemIndex,
    currentPageLastItemIndex,
  } = getPaginatedSpecs(props.total, props.pageSize, currentPageIndex);

  if (isOutOfIndex) {
    return (
      <p
        className={cn(
          'w-full text-center text-xs text-muted-foreground',
          props.className,
        )}
      >
        Page out of indexes!
      </p>
    );
  }

  for (let pageIndex = 0; pageIndex <= lastPageIndex; pageIndex++) {
    const shouldAlwaysVisible = [
      firstPageIndex,
      currentPageIndex,
      lastPageIndex,
    ].includes(pageIndex);
    if (shouldAlwaysVisible) {
      items.push({
        type: 'page',
        key: pageIndex.toString(),
        pageIndex: pageIndex,
        pageNumber: (pageIndex + 1).toString(),
        isCurrentPage: pageIndex === currentPageIndex,
        isFirstPage: pageIndex === firstPageIndex,
        isLastPage: pageIndex === lastPageIndex,
        isPreviousPage: pageIndex === previousPageIndex,
        isNextPage: pageIndex === nextPageIndex,
      });
    } else if (pageIndex <= minVisiblePageIndex) {
      if (!hasLeftEllipsis) {
        items.push({
          type: 'dot',
          key: 'dot-left',
        });
        hasLeftEllipsis = true;
      }
    } else if (pageIndex >= maxVisiblePageIndex) {
      if (!hasRightEllipsis) {
        items.push({
          type: 'dot',
          key: 'dot-right',
        });
        hasRightEllipsis = true;
      }
    } else {
      items.push({
        type: 'page',
        key: pageIndex.toString(),
        pageIndex: pageIndex,
        pageNumber: (pageIndex + 1).toString(),
        isCurrentPage: pageIndex === currentPageIndex,
        isFirstPage: pageIndex === firstPageIndex,
        isLastPage: pageIndex === lastPageIndex,
        isPreviousPage: pageIndex === previousPageIndex,
        isNextPage: pageIndex === nextPageIndex,
      });
    }
  }

  return (
    <PaginationRoot className={cn('w-full', props.className)}>
      <PaginationContent className={props.contentClassName}>
        {previousPageIndex >= firstPageIndex && (
          <PaginationItem key='pagination-prev'>
            <PaginationPrevious
              onClick={() => props.onClickPage(previousPageIndex)}
            >
              <span className='sr-only'>Page </span>
            </PaginationPrevious>
          </PaginationItem>
        )}
        {items.map((item) => {
          if (item.type === 'dot') {
            return (
              <PaginationItem key={item.key}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          } else {
            return (
              <PaginationItem key={item.key}>
                {item.isCurrentPage ? (
                  <div
                    className={cn(
                      buttonVariants({
                        variant: 'outline',
                        size: 'icon',
                      }),
                      'className',
                    )}
                  >
                    <span className='sr-only'>Page </span>
                    {item.pageNumber}
                    <span className='sr-only'> (current page)</span>
                  </div>
                ) : (
                  <PaginationLink
                    onClick={() => props.onClickPage(item.pageIndex)}
                    isActive={item.isCurrentPage}
                  >
                    <span className='sr-only'>Page </span>
                    <span>{item.pageNumber}</span>
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          }
        })}
        {nextPageIndex <= lastPageIndex && (
          <PaginationItem key='pagination-next'>
            <PaginationNext onClick={() => props.onClickPage(nextPageIndex)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationRoot>
  );
}

function getPaginatedSpecs(total: number, size: number, index: number) {
  const firstPageIndex = 0;
  const numberOfPages = Math.ceil(total / size);
  const lastPageIndex = numberOfPages - 1;

  const isOutOfIndex = !!total && index > lastPageIndex;

  let currentPageFirstItemIndex = size * index;
  let currentPageLastItemIndex = currentPageFirstItemIndex + size - 1;

  const lastIndex = total - 1;
  if (currentPageLastItemIndex > lastIndex) {
    currentPageLastItemIndex = lastIndex;
  }

  return {
    numberOfPages,
    isOutOfIndex,
    firstPageIndex,
    lastPageIndex,
    currentPageFirstItemIndex,
    currentPageLastItemIndex,
  };
}
