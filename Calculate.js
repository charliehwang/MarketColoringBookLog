function runCalculateTest() {
  // Logger.log(getCBIDX("DIST_COMP"))
  // Logger.log(cbHeaders)
  // const distributionDaysData = getCalculatedDistributedDays()

  //  fillIndices(cbSheet, dataSheet)
  //  fillIndices(cbSheet, dataSheet, 10)
  // Logger.log(getDataIDX("NAA50R"))
  // Logger.log(getDataIDX("COMP20ema"))

  calculateIndividualIndiceColoringBookData("COMP", dataVals)
}

function calculateIndividualIndiceColoringBookData(indexName, dataVals) {
  // console.log(dataVals)
  if (dataVals.length <= 0)
    throw new Error("There is no data in the 'Data' sheet.")

  const headerRowData = dataVals[0]
  const headerIdxLocations = getHeaderIdxLocationsAsDictForIndexName(
    indexName,
    headerRowData
  )
  //console.log(headerIdxLocations)

  return calculateIndexData(indexName, headerIdxLocations, dataVals)
}

function calculateIndexData(indexName, headerIdxLocations, dataVals) {
  console.log("Calculating Dist Days For index: " + indexName)

  const [headerData, ...data] = dataVals

  const calculateDistributedDays = getCalculateDistributedDaysFn()
  const calculateMATrendDays = getCalculateMATrendDaysFn()

  let calculatedData = []
  let calculatedColors = []

  // start from oldest date first ( reversed order )
  for (let row = data.length - 1; row >= 0; row--) {
    const d = data[row]
    const dYest = row === data.length - 1 ? undefined : data[row + 1]

    const date = d[DATE_COL - 1]
    const vol = d[headerIdxLocations[indexName + "_VOLUME"]]
    const volYest = dYest && dYest[headerIdxLocations[indexName + "_VOLUME"]]
    const perChange = d[headerIdxLocations[indexName + "_PER_CHANGE"]]
    //    console.log(vol, volYest, perChange, distDay)

    const close = d[headerIdxLocations[indexName]]
    const ema10 = d[headerIdxLocations[indexName + "_10EMA"]]
    const ema20 = d[headerIdxLocations[indexName + "_20EMA"]]
    const perFrom20ema = d[headerIdxLocations[indexName + "_PERC_FROM_20EMA"]]
    // console.log(close, ema10, ema20, perFrom20ema)

    const distributedDaysData = calculateDistributedDays(
      date,
      dYest,
      vol,
      volYest,
      perChange
    )

    const [maTrenDayColor, maTrendDayCnt] = calculateMATrendDays(
      close,
      ema10,
      ema20,
      perFrom20ema
    )
    const maTrendDaysColors = [...Array(5)].map(() => maTrenDayColor)
    const maTrendDayCntStr = maTrendDayCnt === 1 ? "" : maTrendDayCnt // don't display a trend count of 1

    calculatedColors = [[date, ...maTrendDaysColors], ...calculatedColors]

    calculatedData = [
      [date, ...distributedDaysData, maTrendDayCntStr],
      ...calculatedData,
    ] // reverse the data, latest date first.
  }

  // console.log(calculatedData)
  // console.log(calculatedColors)
  return { calculatedData, calculatedColors }
}
