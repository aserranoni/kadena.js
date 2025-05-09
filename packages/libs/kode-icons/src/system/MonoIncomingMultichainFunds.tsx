import * as React from 'react';
import type { SVGProps } from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const MonoIncomingMultichainFunds = (
  { title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-style="mono"
    viewBox="0 0 24 24"
    fontSize="1.5em"
    fill="currentColor"
    height="1em"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M13.1 9.12 8.12 14.1 6 11.98v5.66h5.66l-2.12-2.12 4.98-4.98a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0zM17.34 6.29a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41.996.996 0 1 0 1.41-1.41" />
  </svg>
);
export default MonoIncomingMultichainFunds;
