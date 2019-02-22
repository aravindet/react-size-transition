import React, { PureComponent, Children, createRef, cloneElement } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import ResizeObserver from 'resize-observer-polyfill';

export default class SizeTransition extends PureComponent {
  contentEl = createRef();
  outerEl = createRef();

  state = {};

  static propTypes = {
    children: PropTypes.element.isRequired,
    hiddenClassName: PropTypes.string,
    transition: PropTypes.string,
    timeout: PropTypes.number,
  };

  static defaultProps = {
    transition: '0.5s ease-in-out',
    hiddenClassName: 'hidden',
    timeout: 1000,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const child = Children.only(nextProps.children);
    if (prevState.nextChild && isEqual(child, prevState.nextChild.shown)) return prevState;

    return {
      ...prevState,
      prevChild: prevState.nextChild,
      prevSize: prevState.nextSize,
      nextChild: {
        shown: child,
        hidden: cloneElement(child, {
          className: `${child.props.className} ${nextProps.hiddenClassName}`,
        }),
      },
      nextSize: undefined,
      flip: !prevState.flip,
    };
  }

  handleResize = () => {
    const { nextSize: prevSize } = this.state;
    const nextSize = this.getSize(this.contentEl.current);
    if (!prevSize || (prevSize.height !== nextSize.height || prevSize.width !== nextSize.width)) {
      this.setState(prevState => ({ ...prevState, nextSize }));
    }
  };

  componentDidMount() {
    this.ro = new ResizeObserver(this.handleResize);
    this.postRender();
  }

  componentDidUpdate() {
    this.postRender();
  }

  postRender() {
    this.ro.disconnect();
    this.ro.observe(this.contentEl.current);
  }

  getSize = el => {
    const { width, height } = el.getBoundingClientRect();
    return { width: `${width}px`, height: `${height}px` };
  };

  onTransitionEnd = ({ target }) => {
    if (target !== this.outerEl.current || !this.state.prevChild) return;
    this.setState({ prevChild: null, prevSize: null });
  }

  render() {
    const { transition, children, timeout, hiddenClassName, ...props } = this.props;
    const { prevChild, prevSize, nextChild, nextSize, flip } = this.state;

    const outer = {
      display: 'inline-block',
      transition,
      ...(nextSize || prevSize || {}),
      position: 'relative',
    };

    /*
      This middle layer exists to provide layout isolation between the outer
      and inner divs. Otherwise, as outer is relative positioned, text flow
      inside the content will be affected by the width of "outer".
    */
    const middle = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '100vw',
      height: '100vh',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    };

    const inner = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'auto',
    };

    const inTransition = !!(prevChild && nextChild);

    return (
      <div style={outer} {...props} ref={this.outerEl} onTransitionEnd={this.onTransitionEnd}>
        <div style={middle}>
          {prevChild && (
            <div key={flip ? 'front' : 'back'} style={{ ...inner, ...(inTransition ? prevSize : {}) }} >
              {prevChild.hidden}
            </div>
          )}
          {nextChild && (
            <div key={flip ? 'back' : 'front'} style={{ ...inner, ...(inTransition ? nextSize : {}) }} ref={this.contentEl}>
              {!nextSize ? nextChild.hidden : nextChild.shown}
            </div>
          )}
        </div>
      </div>
    );
  }
}
