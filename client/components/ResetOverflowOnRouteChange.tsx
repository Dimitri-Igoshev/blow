'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ResetOverflowOnRouteChange() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = '';
  }, [pathname]);

  return null;
}