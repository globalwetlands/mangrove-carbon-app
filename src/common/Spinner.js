import React from 'react'

import styles from './Spinner.module.scss'

const Spinner = ({ isSmall = false, ...props }) => {
  const size = isSmall ? 25 : 66
  return (
    <svg
      className={styles.spinner}
      data-testid="spinner"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        className={isSmall ? styles.pathSmall : styles.path}
        fill="none"
        strokeWidth={size / 10}
        strokeLinecap="round"
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 3}
      />
    </svg>
  )
}
export default Spinner
