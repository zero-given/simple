import { useCallback } from 'react';
import { ListOnItemsRenderedProps } from 'react-window';
import { useInView } from 'react-intersection-observer';

interface UseVirtualListProps<T> {
  items: T[];
  loadMore?: () => Promise<void>;
  hasMore?: boolean;
  threshold?: number;
}

export function useVirtualList<T>({ 
  items, 
  loadMore, 
  hasMore = false,
  threshold = 0.5 
}: UseVirtualListProps<T>) {
  const { ref: loadMoreRef, inView } = useInView({
    threshold,
  });

  // Automatically trigger load more when the load more element comes into view
  if (inView && hasMore && loadMore) {
    loadMore();
  }

  const onItemsRendered = useCallback(
    ({ visibleStopIndex }: ListOnItemsRenderedProps) => {
      const lastItemIndex = items.length - 1;
      if (visibleStopIndex === lastItemIndex && hasMore && loadMore) {
        loadMore();
      }
    },
    [items.length, hasMore, loadMore]
  );

  return {
    onItemsRendered,
    loadMoreRef,
    itemCount: items.length,
  };
} 