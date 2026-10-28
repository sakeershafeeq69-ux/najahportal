import React, { createContext, useContext, useEffect, useRef } from 'react';
import { usePortal } from '../../context/PortalContext';
import { ShieldCheck, Lock } from 'lucide-react';

interface ReadOnlyContextValue {
  isReadOnly: boolean;
  studentId: string | null;
  blockedActionCount: number;
}

const ReadOnlyContext = createContext<ReadOnlyContextValue>({
  isReadOnly: false,
  studentId: null,
  blockedActionCount: 0,
});

export const useReadOnlyStudentStatus = () => useContext(ReadOnlyContext);

interface ReadOnlyStudentBoundaryProps {
  children: React.ReactNode;
  viewName?: string;
  showBadge?: boolean;
}

/**
 * ReadOnlyStudentBoundary:
 * Middleware wrapper for student-facing views that strictly intercepts and blocks
 * any unauthorized DOM form submissions, clicks on administrative controls,
 * or programmatic mutation triggers.
 */
export const ReadOnlyStudentBoundary: React.FC<ReadOnlyStudentBoundaryProps> = ({
  children,
  viewName = 'Student View',
  showBadge = false,
}) => {
  const { currentUser } = usePortal();
  const isStudent = currentUser?.role === 'student';
  const containerRef = useRef<HTMLDivElement>(null);
  const blockedAttemptsRef = useRef<number>(0);

  useEffect(() => {
    if (!isStudent || !containerRef.current) return;

    const container = containerRef.current;

    // Intercept form submissions targeting admin actions
    const handleFormSubmit = (e: Event) => {
      // Check if target is attempting an admin mutation
      const form = e.target as HTMLFormElement;
      const isAdminForm =
        form.getAttribute('data-admin-mutation') === 'true' ||
        form.classList.contains('admin-action-form') ||
        form.querySelector('[data-admin-action="true"]') !== null;

      if (isAdminForm) {
        e.preventDefault();
        e.stopPropagation();
        blockedAttemptsRef.current += 1;
        console.warn(
          `[Student Read-Only Middleware] Blocked unauthorized form submission in ${viewName}.`
        );
      }
    };

    // Intercept unauthorized clicks on any admin mutation buttons
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const adminButton = target.closest('button[data-admin-only="true"], [data-admin-action="true"]');
      if (adminButton) {
        e.preventDefault();
        e.stopPropagation();
        blockedAttemptsRef.current += 1;
        console.warn(
          `[Student Read-Only Middleware] Blocked unauthorized admin action trigger in ${viewName}.`
        );
      }
    };

    container.addEventListener('submit', handleFormSubmit, true);
    container.addEventListener('click', handleClick, true);

    return () => {
      container.removeEventListener('submit', handleFormSubmit, true);
      container.removeEventListener('click', handleClick, true);
    };
  }, [isStudent, viewName]);

  const contextValue: ReadOnlyContextValue = {
    isReadOnly: isStudent,
    studentId: isStudent ? currentUser?.id || null : null,
    blockedActionCount: blockedAttemptsRef.current,
  };

  return (
    <ReadOnlyContext.Provider value={contextValue}>
      <div ref={containerRef} className="w-full relative student-readonly-boundary" data-student-readonly="true">
        {showBadge && isStudent && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Student Read-Only Protected View: {viewName}</span>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <Lock className="w-3 h-3" />
              Mutation Locked
            </span>
          </div>
        )}
        {children}
      </div>
    </ReadOnlyContext.Provider>
  );
};

/**
 * withReadOnlyStudentGuard:
 * Higher-Order Component (HOC) wrapping student-facing views to enforce strict read-only execution.
 */
export function withReadOnlyStudentGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  viewDisplayName?: string
): React.FC<P> {
  const GuardedComponent: React.FC<P> = (props) => {
    return (
      <ReadOnlyStudentBoundary viewName={viewDisplayName || WrappedComponent.displayName || WrappedComponent.name || 'Component'}>
        <WrappedComponent {...props} />
      </ReadOnlyStudentBoundary>
    );
  };

  GuardedComponent.displayName = `withReadOnlyStudentGuard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return GuardedComponent;
}
