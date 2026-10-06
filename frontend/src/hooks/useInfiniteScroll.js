// import { useEffect, useRef } from "react";

// export default function useInfiniteScroll(callback, hasMore, isLoading) {
//   const sentinelRef = useRef(null);

//   useEffect(() => {
//     if (!hasMore || isLoading) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasMore && !isLoading) {
//           callback();
//         }
//       },
//       {
//         threshold: 0.1,
//         rootMargin: "50px",
//       }
//     );

//     const currentRef = sentinelRef.current;
//     if (currentRef) {
//       observer.observe(currentRef);
//     }

//     return () => {
//       if (currentRef) {
//         observer.unobserve(currentRef);
//       }
//     };
//   }, [callback, hasMore, isLoading]);

//   return sentinelRef;
// }

import { useEffect, useRef } from "react";

export default function useInfiniteScroll(
  callback,
  hasMore,
  isLoading
) {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    loadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (!hasMore) return;

    const currentRef = sentinelRef.current;

    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loadingRef.current
        ) {
          // Immediately lock before calling API
          loadingRef.current = true;

          callback();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [callback, hasMore]);

  return sentinelRef;
}