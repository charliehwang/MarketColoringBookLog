function runFillCellDataTest() {
  // fillDateCells(cbSheet, dataVals)
  // INDICES.forEach((indexName) => {
  //   fillAndColorIndividualIndices(indexName)
  // })

  colorAndFillinBreadthCells(dataSheet, dataVals)

  const breadthData = getBreadthData(dataSheet, dataVals)
  const breadthDataStats = getBreadthDataStats()
  colorBreadthCells(cbSheet, breadthData, breadthDataStats)
}

function fillAndColorIndividualIndices(indexName, sheet) {
  const data = calculateIndividualIndiceColoringBookData(indexName, dataVals)
  const { calculatedColors, calculatedData } = data

  colorIndividualIndiceCellBackgrounds(
    indexName,
    calculatedColors,
    INDICES_MERGE_LENGTH
  )

  fillIndividualIndiceData(indexName, cbSheet, calculatedData)

  setFormattingForIndividualIndiceCells(
    indexName,
    cbSheet,
    calculatedColors,
    calculatedData
  )
}

function fillIndividualIndiceData(indexName, sheet, calculatedData) {
  const onlyCalculatedData = removeDateData(calculatedData)
  const startingColNum = cbHeaders.indexOf(indexName) + 1
  const numCols = INDICES_MERGE_LENGTH

  const range = sheet.getRange(
    DATA_START_ROW,
    startingColNum,
    onlyCalculatedData.length,
    numCols
  )
  range.setValues(onlyCalculatedData)
}

function setFormattingForIndividualIndiceCells(
  indexName,
  sheet,
  calculatedColors,
  calculatedData
) {
  const onlyCalculatedData = removeDateData(calculatedData)
  const onlyColors = removeDateData(calculatedColors)

  const startingColNum = cbHeaders.indexOf(indexName) + 1
  const numCols = INDICES_MERGE_LENGTH

  const range = sheet.getRange(
    DATA_START_ROW,
    startingColNum,
    onlyCalculatedData.length,
    numCols
  )

  const styles = onlyCalculatedData.map((d, i) => {
    const [trendColor, ...rest] = onlyColors[i]
    const [ad, per, l8, l25, trend] = d
    const stats = { ad, per, l8, l25 }

    return getTextStyleForIndividualIndiceCells(stats)
  })

  range.setTextStyles(styles)
}

function colorIndividualIndiceCellBackgrounds(
  indexName,
  calculatedColors,
  numCols
) {
  const startingColNum = cbHeaders.indexOf(indexName) + 1
  const onlyColors = removeDateData(calculatedColors)
  colorRange(
    cbSheet,
    DATA_START_ROW,
    startingColNum,
    onlyColors.length,
    numCols,
    onlyColors
  )
}

function fillBreadthCells(sheet, breadthData) {
  const firstField = BREADTH_FIELDS[0]
  const lastField = BREADTH_FIELDS[BREADTH_FIELDS.length - 1]
  const startIdx = COLORING_BOOK_SUB_HEADERS.indexOf(firstField)
  const startCol = startIdx + 1
  const endIdx = COLORING_BOOK_SUB_HEADERS.indexOf(lastField)
  const numCols = endIdx - startIdx + 1
  // const endCol = endIdx + 1
  // const lastCol = COLORING_BOOK_SUB_HEADERS.indexOf(lastField) + 1

  const [header, ...onlyData] = breadthData

  const range = sheet.getRange(
    DATA_START_ROW,
    startCol,
    onlyData.length,
    numCols
  )
  range.setValues(onlyData)
}

function colorAndFillinBreadthCells(sheet, data) {
  const [header, ...breadthData] = getBreadthData(sheet, data)
  const breadthDataStats = getBreadthDataStats()

  fillBreadthCells(cbSheet, dataVals)
}

function colorBreadthCells(sheet, breadthData, breadthDataStats) {
  const [header, ...onlyData] = breadthData

  const firstField = BREADTH_FIELDS[0]
  const lastField = BREADTH_FIELDS[BREADTH_FIELDS.length - 1]
  const startIdx = cbSubHeaders.indexOf(firstField)
  const startCol = startIdx + 1
  const endIdx = cbSubHeaders.indexOf(lastField)
  const numCols = endIdx - startIdx + 1

  const breadthBackgroundColors = getBackgroundColorsForBreadth(
    onlyData,
    breadthDataStats
  )

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
      const fieldName = BREADTH_FIELDS[i]
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
  const startIdx = dataHeaders.indexOf(firstField)
  const startCol = startIdx + 1
  const endIdx = dataHeaders.indexOf(lastField)
  const fieldIdxsToFilter = dataHeaders
    .map((h, i) => (h.match(/_/) ? i : undefined))
    .filter((d) => d !== undefined) // don't want columns like "NASI_EMA20", "NASI_EMA10"

  // const endCol = endIdx + 1
  // const lastCol = COLORING_BOOK_SUB_HEADERS.indexOf(lastField) + 1
  const numCols = BREADTH_FIELDS.length

  if (startIdx === -1 || endIdx === -1)
    throw new Error(
      `Could not find either the firstField(${firstField}) or the lastField(${lastField}) in dataHeaders`
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

function fillDateCells(sheet, data) {
  // filter out the header, which is a string.
  const [header, ...restOfData] = data
  const onlyDates = restOfData.map((d) => {
    const [date, ...other] = d
    return [date]
  })

  const range = sheet.getRange(DATA_START_ROW, DATE_COL, onlyDates.length, 1)
  range.setValues(onlyDates)
}

function getTextStyleForIndividualIndiceCells(stats) {
  if (stats.ad === LARGE_ACCUMULATION_DAY_LETTER) {
    return [
      TEXT_STYLE_LARGE_ACCUMULATION_DAY,
      TEXT_STYLE_LARGE_ACCUMULATION_DAY,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
    ]
  }

  if (stats.ad === SMALL_ACCUMULATION_DAY_LETTER) {
    return [
      TEXT_STYLE_SMALL_ACCUMULATION_DAY,
      TEXT_STYLE_SMALL_ACCUMULATION_DAY,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
    ]
  }

  if (stats.ad === SMALL_DISTRIBUTION_DAY_LETTER) {
    return [
      TEXT_STYLE_SMALL_DISTRIBUTION_DAY,
      TEXT_STYLE_SMALL_DISTRIBUTION_DAY,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
    ]
  }

  if (stats.ad === LARGE_DISTRIBUTION_DAY_LETTER) {
    return [
      TEXT_STYLE_LARGE_DISTRIBUTION_DAY,
      TEXT_STYLE_LARGE_DISTRIBUTION_DAY,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
    ]
  }

  if (+stats.per >= 0) {
    return [
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_PERC_UP,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
    ]
  } else if (+stats.per <= 0) {
    return [
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_PERC_DN,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
      TEXT_STYLE_MED_DARK,
    ]
  }

  return [
    TEXT_STYLE_MED_DARK,
    TEXT_STYLE_MED_DARK,
    TEXT_STYLE_MED_DARK,
    TEXT_STYLE_MED_DARK,
    TEXT_STYLE_MED_DARK,
  ]
}
