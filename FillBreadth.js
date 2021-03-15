function runFillBreadthTest() {
  // const breadthData = getBreadthPerAbove(dataVals)
  // console.log("ran")

  colorAndFillinBreadthCells(cbSheet, dataVals)
  // const breadthDataStats = getBreadthDataStats()
  // colorBreadthCells(cbSheet, breadthData, breadthDataStats)
}

function colorAndFillinBreadthCells(sheet, data) {
  console.log("Working on BreadthPerAbove")
  const firstField = FIELDS_BREADTH_PER_ABOVE[0]
  const lastField =
    FIELDS_BREADTH_PER_ABOVE[FIELDS_BREADTH_PER_ABOVE.length - 1]
  const startIdx = COLORING_BOOK_SUB_HEADERS.indexOf(firstField)
  const startCol = startIdx + 1
  const endIdx = COLORING_BOOK_SUB_HEADERS.indexOf(lastField)
  const numCols = endIdx - startIdx + 1
  // const endCol = endIdx + 1
  // const lastCol = COLORING_BOOK_SUB_HEADERS.indexOf(lastField) + 1

  const breadthData = getBreadthPerAbove(dataVals, DATA_HEADERS)
  const [header, ...onlyData] = breadthData

  // const breadthDataStats = getBreadthDataStats()

  fillBreadthCells(sheet, onlyData, DATA_START_ROW, startCol, numCols)
  colorBreadthCells(sheet, onlyData, DATA_START_ROW, startCol, numCols)

  const breadthDataStats = getBreadthPerAboveStats(dataVals)

  setBreadthPerAboveCellTextStyles(
    sheet,
    onlyData,
    breadthDataStats,
    DATA_START_ROW,
    startCol,
    numCols
  )
}

function setBreadthPerAboveCellTextStyles(
  sheet,
  onlyData,
  breadthDataStats,
  DATA_START_ROW,
  startCol,
  numCols
) {
  const range = sheet.getRange(
    DATA_START_ROW,
    startCol,
    onlyData.length,
    numCols
  )

  const styles = FIELDS_BREADTH_PER_ABOVE.reduce((acc, fieldName, i) => {
    const statsData = breadthDataStats[fieldName]
    const fieldIdx = FIELDS_BREADTH_PER_ABOVE.indexOf(fieldName)

    const stylesForFieldName = onlyData.map((d, j) => {
      const {
        average,
        stdDev,
        posFirstStdDev,
        posSecondStdDev,
        negFirstStdDev,
        negSecondStdDev,
      } = statsData[j]

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

  console.log("Setting BreadthPerAbove TextStyles")
  range.setTextStyles(styles)
}

function getBreadthPerAbove(dataVals, DATA_HEADERS) {
  return getDataFromFieldNames(FIELDS_BREADTH_PER_ABOVE, DATA_HEADERS, dataVals)
}

function fillBreadthCells(sheet, onlyData, DATA_START_ROW, startCol, numCols) {
  const range = sheet.getRange(
    DATA_START_ROW,
    startCol,
    onlyData.length,
    numCols
  )
  range.setValues(onlyData)
}

function colorBreadthCells(sheet, onlyData, DATA_START_ROW, startCol, numCols) {
  const breadthBackgroundColors = getBackgroundColorsForBreadth(onlyData)

  colorRange(
    sheet,
    DATA_START_ROW,
    startCol,
    breadthBackgroundColors.length,
    numCols,
    breadthBackgroundColors
  )
}

function getBackgroundColorsForBreadth(breadthData, breadthDataStats) {
  return breadthData.map((arr) =>
    arr.map((val, i) => {
      // const fieldName = BREADTH_FIELDS[i]
      // if (breadthDataStats[fieldName] === undefined)
      //   throw new Error(`No breadth data stats for ${fieldName}`)

      // const stats = breadthDataStats[fieldName]
      const valNum = Number(val)

      if (valNum >= BREADTH_PERC_ABOVE_MIDLINE) {
        return TREND.BULLISH
      } else if (valNum < BREADTH_PERC_ABOVE_MIDLINE) {
        return TREND.BEARISH
      }

      // if (valNum >= stats.posSecondStdDev) {
      //   return TREND.VERY_BULLISH
      // } else if (valNum >= stats.posFirstStdDev) {
      //   return TREND.BULLISH
      // } else if (valNum <= stats.negSecondStdDev) {
      //   return TREND.VERY_BEARISH
      // } else if (valNum <= stats.negFirstStdDev) {
      //   return TREND.BEARISH
      // }

      return COLOR_HEX.DARK_GREY
    })
  )
}
