import React, { Fragment, useState } from 'react'

import IconButton from '../../common/IconButton'
import Popup from '../../common/Popup'
import './Menu.css'

const MenuPopupContent = () => (
  <div>
    <h4>
      Nations measure the amount of carbon stored in their forests and wetlands
      when calculating their total carbon emissions.
    </h4>
    <p>
      Mangroves have among the highest carbon densities of any tropical forest
      and are referred to as “blue carbon” ecosystems. Much of this carbon is
      stored in the soils beneath the trees, a stock of carbon that was
      historically overlooked in national carbon accounts.
    </p>
    <p>
      This web app is designed to help you explore the contribution of mangrove
      protection to mitigating emissions. The app will predict forgone
      opportunities to store carbon, given a rate of deforestation. These
      predictions tell us how much carbon would be stored in the mangrove
      forests if deforestation was prevented. They include carbon emitted when
      mangroves are deforested and missed opportunities to sequester carbon in
      mangroves that are deforested.
    </p>
    <p>
      Predictions for future emissions cannot be made with perfect certainty.
      These predictions depend on the accuracy of measurements of mangrove area,
      carbon storage, carbon sequestration and the rate of deforestation. Errors
      in these inputs, especially the rate of deforestation, will affect the
      predictions for emissions. However, the results at the national scale are{' '}
      <a href="https://www.biorxiv.org/content/10.1101/2020.08.27.271189v1">
        robust for comparing hotspots of emissions across countries
      </a>
      .
    </p>
    <p>
      The app uses models and data from the publications:{' '}
      <ul>
        <li>
          <a href="https://doi.org/10.1111/conl.12445">
            The undervalued contribution of mangrove protection in Mexico to
            carbon emission targets
          </a>
          <br />
          {' – '}
          Adame et al. 2018
        </li>

        <li>
          <a href="https://www.biorxiv.org/content/10.1101/2020.08.27.271189v1">
            Future carbon emissions from global mangrove forest loss
          </a>
          <br />
          {' – '}Adame et al. 2020
        </li>
        <li>
          data from the{' '}
          <a href="https://globalmangrovewatch.org">Global Mangrove Watch</a>.{' '}
        </li>
      </ul>
      <strong>
        Please cite these publication if you use output from this app or the
        associated data.
      </strong>
    </p>

    <h3>Instructions</h3>
    <p>
      Click on any country to view country specific information about carbon and
      projected emissions. To compare future scenarios, set your{' '}
      <strong>Forecast Years</strong> and click <strong>+ Add Series</strong>{' '}
      and change the deforestation rate (you can add more than one series).
    </p>
    <p>
      To place a dollar value on these emissions, click the drop down next to
      the <strong>Projected Emissions</strong> graph title and switch from{' '}
      <strong>Mt CO2e</strong> to <strong>Price (USD)</strong>. On the left you
      will now see that <strong>Carbon Price</strong> has appeared below
      <strong>Forecast Years</strong>. Different carbon prices are used around
      the world. To find out what carbon price might be appropriate for a
      specific area, visit{' '}
      <a href="https://www.worldbank.org/en/programs/pricing-carbon">
        worldbank.org/en/programs/pricing-carbon
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
