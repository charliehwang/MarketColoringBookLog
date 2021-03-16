function runFillBreadthTest() {
  // const breadthData = getBreadthPerAbove(dataVals)
  // console.log("ran")

  colorAndFillinBreadthCells(cbSheet, dataVals)
  // const breadthDataStats = getBreadthDataStats()
  // colorBreadthPerAbove(cbSheet, breadthData, breadthDataStats)
}

function colorAndFillinBreadthCells(sheet, data) {
  fillAndColorBreadthPerAbove(sheet, data)
  fillAndColorBreadthNASI(sheet, data)
  fillAndColorBreadthNYMO(sheet, data)
}

function setBreadthPerAboveCellTextStyles(sheet, onlyData, breadthDataStats, DATA_START_ROW, startCol, numCols) {
  console.log("Setting Breadth PerAbove Text Styles")
  const range = sheet.getRange(DATA_START_ROW, startCol, onlyData.length, numCols)

  const styles = FIELDS_BREADTH_PER_ABOVE.reduce((acc, fieldName, i) => {
    const statsData = breadthDataStats[fieldName]
    const fieldIdx = FIELDS_BREADTH_PER_ABOVE.indexOf(fieldName)

    const stylesForFieldName = onlyData.map((d, j) => {
      const { average, stdDev, posFirstStdDev, posSecondStdDev, negFirstStdDev, negSecondStdDev } = statsData[j]

      const fieldVal = +d[fieldIdx]

      let textStyle = TEXT_STYLE_MED_DARK
      if (fieldVal >= BREADTH_PER_ABOVE_EXTREME_BULLISHNESS) {
        textStyle = TEXT_STYLE_POS_STD_DEV2
      } else if (fieldVal >= BREADTH_PER_ABOVE_BULLISHNESS) {
        textStyle = TEXT_STYLE_POS_STD_DEV
      } else if (fieldVal <= BREADTH_PER_ABOVE_EXTREME_BEARISHNESS) {
        textStyle = TEXT_STYLE_NEG_STD_DEV2
      } else if (fieldVal <= BREADTH_PER_ABOVE_BEARISHNESS) {
        textStyle = TEXT_STYLE_NEG_STD_DEV
      }

      acc[j] = acc[j] === undefined ? [] : acc[j]
      acc[j].push(textStyle)
    })

    return acc
  }, [])

  range.setTextStyles(styles)
}

function fillAndColorBreadthPerAbove(sheet, data) {
  console.log("Working on BreadthPerAbove")
  const breadthPerAboveData = getDataFromFieldNames(FIELDS_BREADTH_PER_ABOVE, DATA_HEADERS, dataVals)
  const [header, ...onlyData] = breadthPerAboveData

  const firstField = FIELDS_BREADTH_PER_ABOVE[0]
  const lastField = FIELDS_BREADTH_PER_ABOVE[FIELDS_BREADTH_PER_ABOVE.length - 1]
  const startIdx = COLORING_BOOK_SUB_HEADERS.indexOf(firstField)
  const startCol = startIdx + 1
  const endIdx = COLORING_BOOK_SUB_HEADERS.indexOf(lastField)
  const numCols = endIdx - startIdx + 1

  fillCellValues(sheet, onlyData, DATA_START_ROW, startCol, numCols)

  const breadthBackgroundColors = getBackgroundColorsForBreadthPerAbove(onlyData)
  colorRange(sheet, DATA_START_ROW, startCol, breadthBackgroundColors.length, numCols, breadthBackgroundColors)

  const stats = getBreadthPerAboveStats(dataVals)
  setBreadthPerAboveCellTextStyles(sheet, onlyData, stats, DATA_START_ROW, startCol, numCols)
}

function fillAndColorBreadthNASI(sheet, data) {
  const fieldName = "NASI"
  console.log("Fill Color Breadth " + fieldName)
  const breadthData = getDataFromFieldNames([FIELDS_BREADTH_NASI], DATA_HEADERS, dataVals)
  const [header, ...onlyData] = breadthData

  const NASIema10Data = getDataFromFieldNames([FIELDS_BREADTH_NASI + "_EMA10"], DATA_HEADERS, dataVals)
  const [, ...NASIema10] = NASIema10Data

  const startIdx = COLORING_BOOK_SUB_HEADERS.indexOf(FIELDS_BREADTH_NASI)
  const startCol = startIdx + 1
  const numCols = 1

  fillCellValues(sheet, onlyData, DATA_START_ROW, startCol, numCols)

  const breadthBackgroundColors = getBackgroundColorsForNASI(onlyData, NASIema10)
  colorRange(sheet, DATA_START_ROW, startCol, breadthBackgroundColors.length, numCols, breadthBackgroundColors)

  console.log("Setting Breadth Text Styles for " + fieldName)
  const stats = getStats(FIELDS_BREADTH_NASI, dataVals)
  setCellTextStylesBasedOnStdDevs(sheet, onlyData, stats, DATA_START_ROW, startCol, numCols)
}

function fillAndColorBreadthNYMO(sheet, data) {
  const fieldName = "NYMO"
  console.log("Fill Color Breadth " + fieldName)
  const breadthData = getDataFromFieldNames([FIELDS_BREADTH_NYMO], DATA_HEADERS, dataVals)
  const [header, ...onlyData] = breadthData

  const startIdx = COLORING_BOOK_SUB_HEADERS.indexOf(FIELDS_BREADTH_NYMO)
  const startCol = startIdx + 1
  const numCols = 1

  fillCellValues(sheet, onlyData, DATA_START_ROW, startCol, numCols)

  const breadthBackgroundColors = getBackgroundColorsForNYMO(onlyData)
  colorRange(sheet, DATA_START_ROW, startCol, breadthBackgroundColors.length, numCols, breadthBackgroundColors)

  console.log("Setting Breadth Text Styles for " + fieldName)
  const stats = getStats(FIELDS_BREADTH_NYMO, dataVals)
  setCellTextStylesBasedOnStdDevs(sheet, onlyData, stats, DATA_START_ROW, startCol, numCols)
}

function getBackgroundColorsForBreadthPerAbove(breadthData) {
  return breadthData.map((arr) =>
    arr.map((val, i) => {
      const valNum = Number(val)

      if (valNum >= BREADTH_PERC_ABOVE_MIDLINE) {
        return TREND.BULLISH
      } else if (valNum < BREADTH_PERC_ABOVE_MIDLINE) {
        return TREND.BEARISH
      }

      return COLOR_HEX.DARK_GREY
    })
  )
}

function getBackgroundColorsForNASI(breadthData, NASIema10) {
  return breadthData.map((arr, i) =>
    arr.map((val) => {
      const valNum = Number(val)
      const lastVal = i !== breadthData.length - 1 ? breadthData[i + 1][0] : undefined
      const ema10 = NASIema10[i][0] // only one data in the array

      if (valNum >= ema10) {
        if (lastVal === undefined) return TREND.BULLISH
        if (val < lastVal) return TREND.SLIGHTLY_BULLISH
        return TREND.BULLISH
      } else if (valNum < ema10) {
        if (lastVal === undefined) return TREND.BEARISH
        if (val > lastVal) return TREND.SLIGHTLY_BEARISH
        return TREND.BEARISH
      }

      return COLOR_HEX.DARK_GREY
    })
  )
}

function getBackgroundColorsForNYMO(breadthData) {
  return breadthData.map((arr, i) =>
    arr.map((val) => {
      const valNum = Number(val)
      const lastVal = i !== breadthData.length - 1 ? breadthData[i + 1][0] : undefined

      if (valNum >= 0) {
        if (lastVal === undefined) return TREND.BULLISH
        if (val < lastVal) return TREND.SLIGHTLY_BULLISH
        return TREND.BULLISH
      } else if (valNum < 0) {
        if (lastVal === undefined) return TREND.BEARISH
        if (val > lastVal) return TREND.SLIGHTLY_BEARISH
        return TREND.BEARISH
      }

      return COLOR_HEX.DARK_GREY
    })
  )
}
