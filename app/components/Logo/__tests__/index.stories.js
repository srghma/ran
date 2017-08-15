import React from 'react'

import { storiesOf } from '@storybook/react'
import { specs, describe, it } from 'storybook-addon-specifications'

import { mount } from 'enzyme'

import Logo from '../'

const stories = storiesOf('Logo', module)

stories.add('default', () => {
  const story = <Logo />

  specs(() =>
    describe('default', function() {
      it('should have image', function() {
        let wrapper = mount(story)
        expect(wrapper.find('img')).toHaveLength(1)
      })
    })
  )

  return story
})
