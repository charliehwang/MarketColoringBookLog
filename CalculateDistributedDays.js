function runDistributeDaysTest() {
  // Logger.log(getCBIDX("DIST_COMP"))
  // Logger.log(cbHeaders)
  // const distributionDaysData = getCalculatedDistributedDays()
  //  fillIndices(cbSheet, dataSheet)
  //  fillIndices(cbSheet, dataSheet, 10)
  // Logger.log(getDataIDX("NAA50R"))
  // Logger.log(getDataIDX("COMP20ema"))
  // calculateIndividualIndiceColoringBookData("COMP", dataVals);
}

// function calculateAllIndicesColoringBookData() {
//     const indicesDistData = {"COMP":[], "SPX":[], "IWM":[]}
//     Object.keys(indicesDistData).forEach( (index, i) => {
//       const idxDistData = calculateIndexDistributionDays(index, data)
//       indicesDistData[index] = idxDistData
//     })

// }

function getCalculateDistributedDaysFn() {
  let last8TradingDays = []
  let last25TradingDays = []

  // distribution day
  // - volume higher than previous day's volume
  // - down greater than or equal to -0.2%
  const isDistributionDay = (vol, volYest, perChange) =>
    vol > volYest && perChange <= -0.002

  const isAccumulationDay = (vol, volYest, perChange) =>
    vol > volYest && perChange >= 0.002

  const sumDistributionDays = (daysData) =>
    daysData.reduce((acc, d) => {
      const [date, distDay] = d
      distDay === true && acc++
      return acc
    }, 0)

  return (date, dYest, vol, volYest, perChange) => {
    const distDay = dYest && isDistributionDay(vol, volYest, perChange)
    const accDay = dYest && isAccumulationDay(vol, volYest, perChange)
    // const daysData = [date, distDay];

    let adStr = ""
    if (distDay === true) {
      if (perChange <= -0.02) {
        adStr = LARGE_DISTRIBUTION_DAY_LETTER
      } else {
        adStr = SMALL_DISTRIBUTION_DAY_LETTER
      }
    } else if (accDay === true) {
      if (perChange >= 0.02) {
        adStr = LARGE_ACCUMULATION_DAY_LETTER
      } else {
        adStr = SMALL_ACCUMULATION_DAY_LETTER
      }
    }

    const perStr =
      perChange >= 0.02 ||
      perChange <= -0.02 ||
      distDay === true ||
      accDay === true
        ? perChange
        : ""

    const daysData = [adStr, perStr]

    // this array is sorted newest to oldest
    last8TradingDays =
      last8TradingDays.length >= 8
        ? last8TradingDays.slice(0, last8TradingDays.length - 1)
        : last8TradingDays // remove the oldest trading day if there are more than or equal to 8 items
    last8TradingDays = [[date, distDay], ...last8TradingDays]
    let distDaySumLast8Days = sumDistributionDays(last8TradingDays)
    const distDaySumLast8DaysStr =
      distDaySumLast8Days === 0 ? "" : distDaySumLast8Days

    last25TradingDays =
      last25TradingDays.length >= 25
        ? last25TradingDays.slice(0, last25TradingDays.length - 1)
        : last25TradingDays // remove the oldest trading day if there are more than or equal to 8 items
    last25TradingDays = [[date, distDay], ...last25TradingDays]
    let distDaySumLast25Days = sumDistributionDays(last25TradingDays)
    const distDaySumLast25DaysStr =
      distDaySumLast25Days === 0 ? "" : distDaySumLast25Days

    return [...daysData, distDaySumLast8DaysStr, distDaySumLast25DaysStr]
  }
}

function initialFillForDatabaseDistributionData() {
  const calculatedDistSheet = SpreadsheetApp.getActive().getSheetByName(
    "CalculatedDistDaysData"
  )
  const data = dataSheet.getRange("A:BP").getValues()
  const indicesDistData = calculateIndicesDistributionDays(data)

  Object.keys(indicesDistData).forEach((index, i) => {
    console.log(index, i)
    const rowStart = 1
    const data = indicesDistData[index]
    const colStart = i === 0 ? i + 1 : (i + 1) * data[0].length
    const range = calculatedDistSheet.getRange(
      1,
      colStart,
      data.length,
      data[0].length
    )
    range.setValues(data)
  })

  // const groupedData = groupIndicesDistDataForSpreadsheet(indicesDistData)
  // Logger.log(groupedData)

  // const headers = ["DATE", "DIST_DAY", "DIST_LAST_8_DAYS", "DIST_LAST_25_DAYS"]
  // const range = calculatedDistSheet.getRange(1,1, distData.length + 1, headers.length)
  // const values = [headers, ...distData]
  // // console.log(values)
  // range.setValues(values)
}

//
// - Note dist clusters : 4 dist days in last 8 trading days
// - Track dist day count for last 25 days
// -
// - Accumulation days last 25 days
// -
// - Track number of days the last trend lasted
//
// - Power Trend Market School
function calculateIndicesDistributionDays(data) {
  //Logger.log(data)

  //let calculatedData = []

  const indicesDistData = { COMP: [], SPX: [], IWM: [] }
  Object.keys(indicesDistData).forEach((index, i) => {
    const idxDistData = calculateIndexDistributionDays(index, data)
    indicesDistData[index] = idxDistData
  })

  //  const idxDistData = calculateIndexDistributionDays("SPX", data)
  // Logger.log(indicesDistData)
  return indicesDistData
}
