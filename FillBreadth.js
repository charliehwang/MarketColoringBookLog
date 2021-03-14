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

function getBreadthData(sheet, data) {
  // const breadthStats = getBreadthDataStats()
  const firstField = BREADTH_FIELDS[0]
  const lastField = BREADTH_FIELDS[BREADTH_FIELDS.length - 1]
  const startIdx = DATA_HEADERS.indexOf(firstField)
  const startCol = startIdx + 1
  const endIdx = DATA_HEADERS.indexOf(lastField)
  const fieldIdxsToFilter = DATA_HEADERS.map((h, i) =>
    h.match(/_/) ? i : undefined
  ).filter((d) => d !== undefined) // don't want columns like "NASI_EMA20", "NASI_EMA10"

  // const endCol = endIdx + 1
  // const lastCol = COLORING_BOOK_SUB_HEADERS.indexOf(lastField) + 1
  const numCols = BREADTH_FIELDS.length

  if (startIdx === -1 || endIdx === -1)
    throw new Error(
      `Could not find either the firstField(${firstField}) or the lastField(${lastField}) in DATA_HEADERS`
    )

  return data.map((d) => {
    const filtered = d.filter((value, i) => {
      if (
        i >= startIdx &&
        i <= endIdx &&
        fieldIdxsToFilter.indexOf(i) === -1 // not in the filtered list
      ) {
        return true
      }
      return false
    })
    return filtered
  })
}
