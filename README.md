# Mangrove Carbon App

![GitHub License](https://img.shields.io/github/license/globalwetlands/mangrove-carbon-app)

View the app at __[mangrove-carbon.wetlands.app](https://mangrove-carbon.wetlands.app/)__

## About

#### Nations measure the amount of carbon stored in their forests and wetlands when calculating their total carbon emissions.

Mangroves have among the highest carbon densities of any tropical forest and are referred to as “blue carbon” ecosystems. Much of this carbon is stored in the soils beneath the trees, a stock of carbon that was historically overlooked in national carbon accounts.

This web app is designed to help you explore the contribution of mangrove protection to mitigating emissions. The app will predict forgone opportunities to store carbon, given a rate of deforestation. These predictions tell us how much carbon would be stored in the mangrove forests if deforestation was prevented. They include carbon emitted when mangroves are deforested and missed opportunities to sequester carbon in mangroves that are deforested.

Predictions for future emissions cannot be made with perfect certainty. These predictions depend on the accuracy of measurements of mangrove area, carbon storage, carbon sequestration and the rate of deforestation. Errors in these inputs, especially the rate of deforestation, will affect the predictions for emissions. However, the results at the national scale are [robust for comparing hotspots of emissions across countries](https://www.biorxiv.org/content/10.1101/2020.08.27.271189v1)</a>.

The app uses models and data from the publications:

- [The undervalued contribution of mangrove protection in Mexico to
  carbon emission targets](https://doi.org/10.1111/conl.12445) – Adame et al. 2018
- [Future carbon emissions from global mangrove forest loss](https://www.biorxiv.org/content/10.1101/2020.08.27.271189v1) – Adame et al. 2020
- data from the [Global Mangrove Watch](https://globalmangrovewatch.org).

**Please cite these publication if you use output from this app or the associated data.**

## Development

### Prequisites
* [node.js 12+](https://nodejs.org/en/)
  * Run `npm install` in your terminal to install node dependencies before running the commands below. 

In the project directory, you can then run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### Deployment: `npm run deploy`

Build the app and push the built app to the `gh-pages` branch. Will be deployed via GitHub pages to https://globalwetlands.github.io/mangrove-carbon-app/

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
