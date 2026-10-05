'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  to?: string;
  href?: string;
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children?: React.ReactNode;
}

export const NavLink = ({ to, href, end = false, className, children, ...props }: NavLinkProps) => {
  const pathname = usePathname() || '';
  const target = href || to || '';

  const isActive = end
    ? pathname === target
    : (pathname === target || (target !== '/' && pathname.startsWith(target)));

  const evaluatedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link href={target} className={evaluatedClassName} {...props}>
      {children}
    </Link>
  );
};

export default NavLink;
