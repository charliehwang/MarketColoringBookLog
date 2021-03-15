function runCalculateTest() {
  // Logger.log(getCBIDX("DIST_COMP"))
  // Logger.log(cbHeaders)
  // const distributionDaysData = getCalculatedDistributedDays()

  //  fillIndices(cbSheet, dataSheet)
  //  fillIndices(cbSheet, dataSheet, 10)
  // Logger.log(getDataIDX("NAA50R"))
  // Logger.log(getDataIDX("COMP20ema"))

  // calculateIndividualIndiceColoringBookData("COMP", dataVals)
  const data = getBreadthPerAboveStats(dataVals)
  console.log("received breadth stats")
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

//
// { "NAA50R" : [
//     [date, stats : {
//                       average: ....,
//                       stdDev: ....,
//                       posFirstStdDev: ....,
//                       ....,
//                    }]
// ]}
//
function getBreadthPerAboveStats(dataVals) {
  // return FIELDS_BREADTH_PER_ABOVE.reduce((acc, fieldName) => {
  const fields = [FIELD_DATE, ...FIELDS_BREADTH_PER_ABOVE]
  const [headers, ...onlyData] = getDataFromFieldNames(
    fields,
    DATA_HEADERS,
    dataVals
  )
  const dateFieldIdx = fields.indexOf(FIELD_DATE)

  console.log("stats received")
  return FIELDS_BREADTH_PER_ABOVE.reduce((acc, fieldName) => {
    acc[fieldName] = acc[fieldName] || []
    const fieldIdx = fields.indexOf(fieldName)

    onlyData.forEach((od, i) => {
      // this data should only be for one column
      const pastDataForFieldFromCurrentDay = onlyData
        .slice(i)
        .reduce((acc, d) => {
          acc.push(d[fieldIdx])
          return acc
        }, [])
      const stats = calculateColumnDataStats(pastDataForFieldFromCurrentDay)

      acc[fieldName].push({
        average: stats.avg,
        stdDev: stats.stdDev,
        posFirstStdDev: stats.avg + stats.stdDev,
        posSecondStdDev: stats.avg + 2 * stats.stdDev,
        negFirstStdDev: stats.avg - stats.stdDev,
        negSecondStdDev: stats.avg - 2 * stats.stdDev,
      })
    })

    return acc
  }, {})
}

//
// [
//     [date,  {
//                       average: ....,
//                       stdDev: ....,
//                       posFirstStdDev: ....,
//                       ....,
//             }]
// ]
//
function getBreadthStats(fieldName, dataVals) {
  // return FIELDS_BREADTH_PER_ABOVE.reduce((acc, fieldName) => {
  const fields = [FIELD_DATE, fieldName]
  const [headers, ...onlyData] = getDataFromFieldNames(
    fields,
    DATA_HEADERS,
    dataVals
  )
  const dateFieldIdx = fields.indexOf(FIELD_DATE)
  const dataIdx = 1

  return onlyData.reduce((acc, data, i) => {
    // this data should only be for one column
    const pastDataForFieldFromCurrentDay = onlyData
      .slice(i)
      .reduce((acc, d) => {
        acc.push(d[dataIdx])
        return acc
      }, [])
    const stats = calculateColumnDataStats(pastDataForFieldFromCurrentDay)

    const date = data[dateFieldIdx]

    acc.push([
      date,
      {
        average: stats.avg,
        stdDev: stats.stdDev,
        posFirstStdDev: stats.avg + stats.stdDev,
        posSecondStdDev: stats.avg + 2 * stats.stdDev,
        negFirstStdDev: stats.avg - stats.stdDev,
        negSecondStdDev: stats.avg - 2 * stats.stdDev,
      },
    ])

    return acc
  }, [])
}
