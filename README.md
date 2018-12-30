# react-size-transition

> Gently transition the sizes of containers when their contents change.

[![NPM](https://img.shields.io/npm/v/react-size-transition.svg)](https://www.npmjs.com/package/react-size-transition)

## Install

```bash
npm install --save react-size-transition
```

## Usage

```jsx
import React, { Component } from 'react';
import SizeTransition from 'react-size-transition';

// This example uses styled components, but you can use any CSS framework.
import styled from 'styled-components';

MyContent

class Example extends Component {
  render () {
    return (
      <SizeTransition>
        <FadeText>{this.props.fadeText}</FadeText>
      </SizeTransition>
    )
  }
}
```

## How it works

Whenever the SizeTransition component is re-rendered with new content, the old children continue to be rendered for a short while with an extra className, `hidden`. The new content is also rendered overlapping the old content.

Note that during the transition content may render outside the container. This should be accounted for in the animation timings.

## Future work

Several additional features are required before we hit 1.0:

- Improve content comparison to avoid transitions when the new content is identical to old.
- Support custom alignment between old and new content (during the transition). Currently it is centered both vertically and horizontally.
- Support more than one child element.
- Support all the react transition group states.
- Use DOM resize sensors to detect size changes outside the React lifecycle.

## License

MIT © [aravindet](https://github.com/aravindet)
