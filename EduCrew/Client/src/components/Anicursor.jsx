import React from 'react'
import AnimatedCursor from "react-animated-cursor"

const Anicursor = () => {
    return (
        <AnimatedCursor
        innerSize={8}
        outerSize={35}
        innerScale={1}
        outerScale={2}
        outerAlpha={0}
        hasBlendMode={true}
        innerStyle={{
          backgroundColor: 'white'
        }}
        outerStyle={{
          borderColor: 'white',
          borderStyle: 'solid',
          borderWidth: '3px'
        }}
        clickables={[
          'p',
          'a',
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'label[for]',
          'select',
          'textarea',
          'button',
          '.link',
          {
            target: '.custom',
            options: {
              innerSize: 12,
              outerSize: 12,
              color: '255, 255, 255',
              outerAlpha: 0.3,
              innerScale: 0.7,
              outerScale: 5
            }
          }
        ]}
      />
    )
}

export default Anicursor