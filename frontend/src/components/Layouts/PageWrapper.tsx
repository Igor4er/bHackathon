import { FC, ReactNode } from 'react';
import cn from 'classnames';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface Props {
  children: ReactNode;
  className?: string;
  mainClassName?: string;
  popup?: FC;
}

export const PageWrapper: FC<Props> = ({
  children,
  className,
  mainClassName,
  popup: Popup,
}) => {
  return (
    <div>
      {/* Fixed Header */}
      <div className="top-0 right-0 left-0 z-50">
        <Header />
      </div>

      {/* Main Content with padding for header and footer */}
      <div
        className={cn(
          'scrollbar flex flex-1 flex-col gap-4 overflow-y-auto',
          className
        )}
      >
        <main className={cn('flex-1 items-center', mainClassName)}>
          {children}
        </main>
      </div>

      {/* Fixed Footer */}
      <div className="right-0 bottom-0 left-0 z-40">
        <Footer />
      </div>

      {Popup && <Popup />}
    </div>
  );
};
