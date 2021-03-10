function calculateIndexDistributionDaysOLD(index, data) {
  const headers = [
    "DATE",
    index + "_DIST_DAY",
    index + "_DIST_LAST_8_DAYS",
    index + "_DIST_LAST_25_DAYS",
  ]

  let calculatedData = []

  // reverse order so that we can calculate and sum it at the same time
  // skip the header
  let numberTradingDaysPassed = 0
  // let distDaySum = 0
  let last25TradingDays = []
  let last8TradingDays = []
  for (let row = data.length - 1; row >= 1; row--) {
    const d = data[row]
    const dYest = row === data.length - 1 ? undefined : data[row + 1]

    numberTradingDaysPassed =
      numberTradingDaysPassed <= 25 ? numberTradingDaysPassed++ : 0

    // Logger.log(d)
    const date = d[getDataIDX("Date")]
    const vol = d[getDataIDX(index + "Volume")]
    const volYest = dYest && dYest[getDataIDX(index + "Volume")]
    const perChange = d[getDataIDX(index + "PerChange")]

    const distDay = dYest && isDistributionDay(vol, volYest, perChange)
    // distDaySum = distDay ? numberTradingDaysPassed === 0 ? 1 : distDaySum + 1
    //  : distDaySum

    //    calculatedData.push([date, distributionDay, vol, volYest, perChange])
    let daysData = [date, distDay]

    // this array is sorted newest to oldest
    last8TradingDays =
      last8TradingDays.length >= 8
        ? last8TradingDays.slice(0, last8TradingDays.length - 1)
        : last8TradingDays // remove the oldest trading day if there are more than or equal to 8 items
    last8TradingDays = [daysData, ...last8TradingDays]

    let distDaySumLast8Days = 0
    last8TradingDays.forEach((d) => {
      const distDay = d[1]
      distDay && distDaySumLast8Days++
    })

    last25TradingDays =
      last25TradingDays.length >= 25
        ? last25TradingDays.slice(0, last25TradingDays.length - 1)
        : last25TradingDays // remove the oldest trading day if there are more than or equal to 25 items
    last25TradingDays = [daysData, ...last25TradingDays]

    let distDaySumLast25Days = 0
    last25TradingDays.forEach((d) => {
      const distDay = d[1]
      distDay && distDaySumLast25Days++
    })

    daysData = [...daysData, distDaySumLast8Days, distDaySumLast25Days]
    calculatedData = [...calculatedData, daysData]

    distDaySum = numberTradingDaysPassed === 0 && 0 // reset the sum when
  }
  //  Logger.log(last25TradingDays.length)
  //  Logger.log(last25TradingDays)
  //  Logger.log(last8TradingDays.length)
  //  Logger.log(last8TradingDays)
  // Logger.log(calculatedData.reverse())
  return [headers, ...calculatedData.reverse()]
}

function getCalculatedDistributedDaysOLD() {
  const calculatedDistSheet = SpreadsheetApp.getActive().getSheetByName(
    "CalculatedDistDaysData"
  )
  const lastCol = calculatedDistSheet.getLastColumn()
  const lastRow = calculatedDistSheet.getLastRow()

  const distDaysRange = calculatedDistSheet.getRange(1, 1, lastRow, lastCol)
  const [header, ...values] = distDaysRange.getValues()

  const lastDistDaysDate = values[0][0]

  Logger.log(header)
  // Logger.log(values)
  Logger.log(lastDistDaysDate)
}
