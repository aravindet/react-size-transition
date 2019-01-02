import React, { Component } from 'react';

import SizeTransition from 'react-size-transition';

export default class App extends Component {
  state = { short: 0 };

  toggle = () => { this.setState(({ short }) => ({ short: short + 1 })) };

  render () {
    return (
      <div className="box" onClick={this.toggle}>
        <SizeTransition transition="0.5s ease-in-out" timeout={10000} className="fade">
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
