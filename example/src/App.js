import React, { Component } from 'react';

import SizeTransition from 'react-size-transition';

export default class App extends Component {
  state = { short: 0, shown: false };

  toggle = () => { this.setState(({ short }) => ({ short: short + 1 })) };

  componentDidMount() {
    // This is to test that the transition works correctly even if the element
    // is hidden using CSS when mounted.
    setTimeout(() => { this.setState({ shown: true }); }, 1000);
  }

  render () {
    const display = this.state.shown ? '' : 'none';
    return (
      <div className="box" style={{ display }} onClick={this.toggle}>
        <SizeTransition transition="0.5s ease-in-out">
          <div className="fade">
            {this.state.short % 3 === 0
              ? 'Short'
              : 'Some long text to make this break into multiple lines.'}
          </div>
        </SizeTransition>
      </div>
    )
  }
}
