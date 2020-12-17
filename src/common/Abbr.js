import React from 'react'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css' // optional

import './InfoPopup'
const Abbr = ({ title, children }) => {
  return (
    <Tippy content={title} interactive={true}>
      <abbr title={title}>{children}</abbr>
    </Tippy>
  )
}

export default Abbr
