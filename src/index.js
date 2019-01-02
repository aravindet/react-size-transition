import React, { PureComponent, Children, createRef, cloneElement } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

export default class SizeTransition extends PureComponent {
  contentEl = createRef();

  state = {};

  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    children: PropTypes.element.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
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

  componentDidMount() {
    this.postRender();
  }

  componentDidUpdate() {
    this.postRender();
  }

  getSize = el => {
    const { width, height } = el.getBoundingClientRect();
    return { width: `${width}px`, height: `${height}px` };
  };

  cleanup = () => {
    const { prevChild } = this.state;
    if (!prevChild) return;
    this.setState({ prevChild: null, prevSize: null });
  };

  postRender() {
    const { prevChild, nextSize: size } = this.state;
    const { timeout } = this.props;

    if (!size) {
      const nextSize = this.getSize(this.contentEl.current);
      this.setState(prevState => ({ ...prevState, nextSize }));
    } else if (prevChild) {
      setTimeout(this.cleanup, timeout);
    }
  }

  render() {
    const { transition, children, timeout, hiddenClassName, ...props } = this.props;
    const { prevChild, prevSize, nextChild, nextSize, flip } = this.state;

    const outer = {
      display: 'inline-block',
      transition,
      ...(nextSize ? { ...nextSize, position: 'relative' } : { ...prevSize, position: 'static' }),
    };

    const inner = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    };

    return (
      <div style={outer}>
        {prevChild && (
          <div key={flip ? 'front' : 'back'} style={{ ...inner, ...prevSize }} {...props}>
            {prevChild.hidden}
          </div>
        )}
        {nextChild && (
          <div key={flip ? 'back' : 'front'} style={{ ...inner, ...nextSize }} {...props} ref={this.contentEl}>
            {!nextSize ? nextChild.hidden : nextChild.shown}
          </div>
        )}
      </div>
    );
  }
}
