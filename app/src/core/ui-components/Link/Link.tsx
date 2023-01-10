import { joinClasses } from "core/utils/classes";
import { forwardRef, AnchorHTMLAttributes } from "react";

export const Link = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ children, className, ...restProps }, ref) => {
  return (
    <a
      ref={ref}
      {...restProps}
      className={joinClasses(className, "text-link cursor-pointer hover:text-blue-500")}
    >
      {children}
    </a>
  );
});

Link.displayName = "Link";