import * as React from 'react';

import { Toast } from '../core/types';

export const ToastIcon: React.FC<{
  toast: Toast;
}> = ({ toast }) => {
  const { icon, type, iconTheme } = toast;
  if (icon !== undefined) {
    if (typeof icon === 'string') {
      return <div className="AnimatedIconWrapper">{icon}</div>;
    } else {
      return icon;
    }
  }

  if (type === 'blank') {
    return null;
  }

  return (
    <div className="IndicatorWrapper">
      <LoaderIcon {...iconTheme} />
      {type !== 'loading' && (
        <div className="StatusWrapper">
          {type === 'error' ? (
            <ErrorIcon {...iconTheme} />
          ) : (
            <CheckmarkIcon {...iconTheme} />
          )}
        </div>
      )}
    </div>
  );
};

export interface ErrorTheme {
  primary?: string;
  secondary?: string;
}

export type IconThemes = Partial<{
  success: CheckmarkTheme;
  error: ErrorTheme;
  loading: LoaderTheme;
}>;

const ErrorIcon = ({
  children,
  className,
  ...rest
}: React.ComponentProps<'div'> & IconThemes) => {
  return (
    <div {...rest} className={`ErrorIcon ${className}`}>
      {children}
    </div>
  );
};

export interface CheckmarkTheme {
  primary?: string;
  secondary?: string;
}
const CheckmarkIcon = ({
  children,
  className,
  ...rest
}: React.ComponentProps<'div'> & IconThemes) => {
  return (
    <div {...rest} className={`CheckmarkIcon ${className}`}>
      {children}
    </div>
  );
};

export interface LoaderTheme {
  primary?: string;
  secondary?: string;
}

const LoaderIcon = ({
  children,
  className,
  ...rest
}: React.ComponentProps<'div'> & IconThemes) => {
  return (
    <div {...rest} className={`LoaderIcon ${className}`}>
      {children}
    </div>
  );
};
