import React from 'react';
import { cn } from '../../utils/cn';

const Textarea = React.forwardRef(({ className, label, description, error, required = false, id, rows = 5, ...props }, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).slice(2,9)}`;
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={textareaId} className={cn('text-sm font-medium leading-none', error ? 'text-destructive' : 'text-foreground')}>
          {label}{required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={cn('w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', error && 'border-destructive focus-visible:ring-destructive', className)}
        aria-invalid={!!error}
        aria-describedby={description ? `${textareaId}-desc` : undefined}
        {...props}
      />
      {description && !error && (
        <p id={`${textareaId}-desc`} className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
