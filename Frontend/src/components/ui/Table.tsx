import React from "react";
import { cn } from "@/lib/utils";

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export const Table: React.FC<TableProps> & {
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Head: typeof TableHead;
  Cell: typeof TableCell;
} = ({ children, className, containerClassName, ...props }) => {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-border/80 bg-surface shadow-xs",
        containerClassName
      )}
    >
      <table
        className={cn("w-full caption-bottom text-sm border-collapse text-left", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, className, ...props }) => {
  return (
    <thead
      className={cn("border-b border-border/70 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}
      {...props}
    >
      {children}
    </thead>
  );
};

export const TableBody: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, className, ...props }) => {
  return (
    <tbody
      className={cn("divide-y divide-border/40 [&_tr:last-child]:border-0", className)}
      {...props}
    >
      {children}
    </tbody>
  );
};

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  isClickable?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  isClickable = false,
  ...props
}) => {
  return (
    <tr
      className={cn(
        "transition-colors duration-150 hover:bg-muted/30",
        isClickable && "cursor-pointer active:bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<
  React.ThHTMLAttributes<HTMLTableCellElement>
> = ({ children, className, ...props }) => {
  return (
    <th
      className={cn(
        "h-11 px-4 py-3 text-left align-middle font-semibold text-muted-foreground whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement>
> = ({ children, className, ...props }) => {
  return (
    <td
      className={cn(
        "p-4 align-middle text-foreground transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
