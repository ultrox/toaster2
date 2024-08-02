import * as React from 'react';

import { Toast, ToastPosition, resolveValue, Renderable } from './core/types';
import { ToastIcon } from './icons';

const ToastBarBase = ({
  children,
  className,
  ...rest
}: React.ComponentProps<'div'>) => {
  return (
    <div {...rest} className={`ToastBarBase ${className}`}>
      {children}
    </div>
  );
};

const Message = ({
  children,
  className,
  ...rest
}: React.ComponentProps<'div'>) => {
  return (
    <div {...rest} className={`${Message} ${className}`}>
      {children}
    </div>
  );
};

interface ToastBarProps {
  toast: Toast;
  position?: ToastPosition;
  style?: React.CSSProperties;
  children?: (components: {
    icon: Renderable;
    message: Renderable;
  }) => Renderable;
}

const getAnimationStyle = (
  position: ToastPosition,
  visible: boolean
): React.CSSProperties => {
  const top = position.includes('top');
  const animationName = `${visible ? 'enter' : 'exit'}${
    top ? 'Top' : 'Bottom'
  }`;

  return {
    animation: `${animationName} ${visible ? '0.35s' : '0.4s'} ${
      visible ? 'cubic-bezier(.21,1.02,.73,1)' : 'cubic-bezier(.06,.71,.55,1)'
    } forwards`,
  };
};
export const ToastBar: React.FC<ToastBarProps> = React.memo(
  ({ toast, position, style, children }) => {
    const animationStyle: React.CSSProperties = toast.height
      ? getAnimationStyle(
          toast.position || position || 'top-center',
          toast.visible
        )
      : { opacity: 0 };

    const icon = <ToastIcon toast={toast} />;

    const message = (
      <Message {...toast.ariaProps}>
        {resolveValue(toast.message, toast)}
      </Message>
    );

    return (
      <ToastBarBase
        className={toast.className}
        style={{
          ...animationStyle,
          ...style,
          ...toast.style,
        }}
      >
        {typeof children === 'function' ? (
          children({ icon, message })
        ) : (
          <>
            {icon}
            {message}
          </>
        )}
      </ToastBarBase>
    );
  }
);
