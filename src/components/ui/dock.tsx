'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from 'framer-motion';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 80;
const DEFAULT_DISTANCE = 150;
const DEFAULT_PANEL_HEIGHT = 64;
const DEFAULT_ITEM_SIZE = 44;

type DockProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockChildProps = {
  width?: MotionValue<number>;
  isHovered?: MotionValue<number>;
};

type DockItemProps = {
  className?: string;
  children: ReactNode;
  href?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>;

type DockLabelProps = DockChildProps & {
  className?: string;
  children: ReactNode;
};

type DockIconProps = DockChildProps & {
  className?: string;
  children: ReactNode;
};

type DockContextType = {
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

type DockProviderProps = {
  children: ReactNode;
  value: DockContextType;
};

const DockContext = createContext<DockContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);

  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }

  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const effectiveMagnification = reducedMotion ? DEFAULT_ITEM_SIZE : magnification;
  const effectiveSpring = reducedMotion ? { duration: 0 } : spring;

  const maxHeight = useMemo(() => {
    if (reducedMotion) return panelHeight;
    return Math.max(DOCK_HEIGHT, effectiveMagnification + effectiveMagnification / 2 + 4);
  }, [effectiveMagnification, panelHeight, reducedMotion]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, effectiveSpring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: 'none' }}
      className="dock-scroller"
    >
      <motion.div
        onMouseMove={({ clientX }) => {
          isHovered.set(1);
          mouseX.set(clientX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        onFocus={() => isHovered.set(1)}
        onBlur={({ currentTarget, relatedTarget }) => {
          if (!relatedTarget || !currentTarget.contains(relatedTarget as Node)) {
            isHovered.set(0);
            mouseX.set(Infinity);
          }
        }}
        className={cn('dock-panel', className)}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, spring: effectiveSpring, distance, magnification: effectiveMagnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, href, ...anchorProps }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (value: number) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [DEFAULT_ITEM_SIZE, magnification, DEFAULT_ITEM_SIZE],
  );

  const width = useSpring(widthTransform, spring);
  const dockChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child as ReactElement<DockChildProps>, { width, isHovered });
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn('dock-item', className)}
    >
      {href ? (
        <a {...anchorProps} href={href} className="dock-link">
          {dockChildren}
        </a>
      ) : dockChildren}
    </motion.div>
  );
}

function DockLabel({ children, className, isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;

    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn('dock-label', className)}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, width }: DockIconProps) {
  const fallbackWidth = useMotionValue(DEFAULT_ITEM_SIZE);
  const widthTransform = useTransform(width ?? fallbackWidth, (value) => value / 2);

  return (
    <motion.div
      style={{ width: widthTransform, height: widthTransform }}
      className={cn('dock-icon', className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
