import React, { Fragment, useState } from 'react'

import IconButton from '../../common/IconButton'
import Popup from '../../common/Popup'
import './Menu.css'

const MenuPopupContent = () => (
  <div>
    <h3>About the app</h3>
    <p>
      Countries measure the amount of carbon stored in their forests and
      wetlands when calculating their total carbon emissions, however,
      assessments often overlook the carbon stored in the soils beneath these
      ecosystems which is where most of the carbon is actually stored. This
      leads to countries underestimating their total carbon emissions and the
      true value of protecting their coastal wetlands.
    </p>
    <p>
      Mangroves have among the highest carbon densities of any tropical forest
      and are referred to as “blue carbon” ecosystems. This web app is designed
      to help you explore the contribution of mangrove protection to mitigating
      emissions using data from the publication <mark>________________</mark>{' '}
      and Global Mangrove Watch.
    </p>
    <p>
      <mark>
        Include bit here about carbon pricing and the intended use of this app.
      </mark>{' '}
      Please cite this publication if you use output from this app or the
      associated data.
    </p>
    <h3>Instructions</h3>
    <p>
      Click on any country to view country specific information about carbon and
      projected emissions. To compare future scenarios, set your Forecast Years
      and click + Add Series and change the deforestation rate (you can add more
      than one series).
    </p>
    <p>
      To place a dollar value on these emissions, click the drop down next to
      the Projected Emissions graph title and switch from Mt CO2e to Price
      (USD). On the left you will now see that Carbon Price has appeared below
      Forecast Years. Different carbon prices are used around the world. To find
      out what carbon price might be appropriate for a specific area, visit{' '}
      <a href="https://www.worldbank.org/en/programs/pricing-carbon">
        https://www.worldbank.org/en/programs/pricing-carbon
      </a>
      .
    </p>
    <br />
  </div>
)

const MenuIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="11.5"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )
}

const Menu = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const menuPopupTitle = 'Mangrove Carbon App'

  const openMenu = () => {
    setMenuIsOpen(true)
  }

  return (
    <Fragment>
      <IconButton
        Icon={MenuIcon}
        onClick={openMenu}
        className="Menu--MenuButton"
        title="Open Menu"
        tabIndex={1}
      />
      <Popup
        title={menuPopupTitle}
        modalIsOpen={menuIsOpen}
        setModalIsOpen={setMenuIsOpen}
      >
        <MenuPopupContent />
      </Popup>
    </Fragment>
  )
}

export default Menu
