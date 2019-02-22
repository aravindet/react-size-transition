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

FadeText = styled.div`
  transition: 0.5s;
  opacity: 1;
  &.hidden { opacity: 0; }
`

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

Whenever the SizeTransition component is re-rendered with new content, the old children continue to be rendered, overlapping the new children, for a short while. A `hidden` class is added to children to trigger transitions.

A typical lifecycle, showing initial rendering and an update:

|                       | First child           | Second child          |
|-----------------------|-----------------------|-----------------------|
| **Initial render**    | Mounted with `hidden` | -                     |
| Immediately after     | `hidden` removed      | -                     |
| **Content update**    | `hidden` added        | Mounted with `hidden` |
| Immediately after     | -                     | `hidden` removed      |
| 1 second later        | Unmounted             | -                     |

Note that during transitions, content may render outside the container. This should be accounted for in the design.

## Props

- **transition**: The `transition` CSS property applied on the resizing container. Default: `0.5s ease-in-out`. Note that this must not be `none`. Old children are removed from the DOM when this transition ends.
- **hiddenClassName**: The class name to add to children that should be hidden.

## Future work

Several additional features are required before we hit 1.0:

- Support custom alignment between old and new content (during the transition). Currently it is centered both vertically and horizontally.
- Separate the container size transition and the child entry/exit transition into separate components.

## License

MIT © [aravindet](https://github.com/aravindet)
