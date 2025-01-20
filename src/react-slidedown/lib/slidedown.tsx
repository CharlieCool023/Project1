import React, { forwardRef, Component, ReactNode, Ref, JSX } from 'react';

interface SlideDownProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  closed?: boolean;
  transitionOnAppear?: boolean;
}

interface SlideDownContentProps extends SlideDownProps {
  forwardedRef: Ref<HTMLDivElement> | null;
}

interface SlideDownContentState {
  children: ReactNode | null;
  childrenLeaving: boolean;
}

class SlideDownContent extends Component<SlideDownContentProps, SlideDownContentState> {
  static defaultProps: Partial<SlideDownProps> = {
    transitionOnAppear: true,
    closed: false,
  };

  private outerRef: HTMLDivElement | null = null;

  constructor(props: SlideDownContentProps) {
    super(props);

    this.state = {
      children: props.children,
      childrenLeaving: false,
    };
  }

  private handleRef = (ref: HTMLDivElement | null) => {
    this.outerRef = ref;

    const { forwardedRef } = this.props;
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(ref);
      } else if (forwardedRef && typeof forwardedRef === 'object' && 'current' in forwardedRef) {
        forwardedRef.current = ref;
      }
    }
  };

  componentDidMount() {
    if (this.outerRef) {
      if (this.props.closed || !this.props.children) {
        this.outerRef.classList.add('closed');
        this.outerRef.style.height = '0px';
      } else if (this.props.transitionOnAppear) {
        this.startTransition('0px');
      } else {
        this.outerRef.style.height = 'auto';
      }
    }
  }

  getSnapshotBeforeUpdate(): string | null {
    return this.outerRef ? `${this.outerRef.getBoundingClientRect().height}px` : null;
  }

  static getDerivedStateFromProps(
    props: SlideDownContentProps,
    state: SlideDownContentState
  ): Partial<SlideDownContentState> | null {
    if (props.children) {
      return {
        children: props.children,
        childrenLeaving: false,
      };
    } else if (state.children) {
      return {
        children: state.children,
        childrenLeaving: true,
      };
    } else {
      return null;
    }
  }

  componentDidUpdate(
    _prevProps: Readonly<SlideDownContentProps>,
    _prevState: Readonly<SlideDownContentState>,
    snapshot: string | null
  ) {
    if (this.outerRef) {
      this.startTransition(snapshot || '0px');
    }
  }

  private startTransition(prevHeight: string) {
    if (!this.outerRef) return;

    let endHeight = '0px';

    if (!this.props.closed && !this.state.childrenLeaving && this.state.children) {
      this.outerRef.classList.remove('closed');
      this.outerRef.style.height = 'auto';
      endHeight = getComputedStyle(this.outerRef).height;
    }

    if (parseFloat(endHeight).toFixed(2) !== parseFloat(prevHeight).toFixed(2)) {
      this.outerRef.classList.add('transitioning');
      this.outerRef.style.height = prevHeight;
      // Force reflow
      this.outerRef.offsetHeight; // eslint-disable-line no-unused-expressions
      this.outerRef.style.transitionProperty = 'height';
      this.outerRef.style.height = endHeight;
    }
  }

  private endTransition() {
    if (!this.outerRef) return;

    this.outerRef.classList.remove('transitioning');
    this.outerRef.style.transitionProperty = 'none';
    this.outerRef.style.height = this.props.closed ? '0px' : 'auto';

    if (this.props.closed || !this.state.children) {
      this.outerRef.classList.add('closed');
    }
  }

  private handleTransitionEnd = (evt: React.TransitionEvent<HTMLDivElement>) => {
    if (evt.target === this.outerRef && evt.propertyName === 'height') {
      if (this.state.childrenLeaving) {
        this.setState({ children: null, childrenLeaving: false }, this.endTransition);
      } else {
        this.endTransition();
      }
    }
  };

  render() {
    const {
      as: ComponentType = 'div',
      className,
      forwardedRef,
      ...rest
    } = this.props;

    const containerClassName = className
      ? `react-slidedown ${className}`
      : 'react-slidedown';

    return (
      <ComponentType
        ref={this.handleRef}
        className={containerClassName}
        onTransitionEnd={this.handleTransitionEnd}
        {...rest}
      >
        {this.state.children}
      </ComponentType>
    );
  }
}

export const SlideDown = forwardRef<HTMLDivElement, SlideDownProps>((props, ref) => (
  <SlideDownContent {...props} forwardedRef={ref} />
));

export default SlideDown;
