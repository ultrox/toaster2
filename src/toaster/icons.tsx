import * as React from 'react';

import { IconTheme, Toast } from './core/types';

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

export type ErrorTheme = Partial<IconTheme>;

export type IconThemes = Partial<{
  success: CheckmarkTheme;
  error: ErrorTheme;
  loading: LoaderTheme;
}>;

const ErrorIcon = ({
  children,
  className,
  ...rest
}: React.ComponentProps<'div'> & ErrorTheme) => {
  return (
    <div {...rest} className={`ErrorIcon ${className}`}>
      {children}
    </div>
  );
};

export type CheckmarkTheme = Partial<IconTheme>;

const CheckmarkIcon = ({
  children,
  className,
  ...rest
}: React.ComponentProps<'div'> & CheckmarkTheme) => {
  return (
    <div {...rest} className={`CheckmarkIcon ${className}`}>
      {children}
    </div>
  );
};

export type LoaderTheme = Partial<IconTheme>;

const LoaderIcon = ({
  children,
  className,
  ...rest
}: React.ComponentProps<'div'> & LoaderTheme) => {
  return (
    <div {...rest} className={`LoaderIcon ${className}`}>
      {children}
    </div>
  );
};
