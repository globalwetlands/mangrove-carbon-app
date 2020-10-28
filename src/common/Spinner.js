import React from 'react'

import styles from './Spinner.module.scss'

const Spinner = (props) => (
  <svg
    className={styles.spinner}
    data-testid="spinner"
    width="65px"
    height="65px"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      className={styles.path}
      fill="none"
      strokeWidth="6"
      strokeLinecap="round"
      cx="33"
      cy="33"
      r="30"
    />
  </svg>
)

export default Spinner
