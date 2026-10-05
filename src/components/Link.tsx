'use client';

import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>, Omit<NextLinkProps, 'href'> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
}

export const Link = ({ to, href, children, ...props }: LinkProps) => {
  const target = href || to || '#';
  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  );
};

export default Link;
