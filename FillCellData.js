function runFillCellDataTest() {
  fillDateCells(cbSheet, dataVals)

  INDICES.forEach((indexName) => {
    fillAndColorIndividualIndices(indexName)
  })
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
    if (ad === LARGE_ACCUMULATION_DAY_LETTER) {
      return [
        TEXT_STYLE_LARGE_ACCUMULATION_DAY,
        TEXT_STYLE_LARGE_ACCUMULATION_DAY,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
      ]
    }

    if (ad === SMALL_ACCUMULATION_DAY_LETTER) {
      return [
        TEXT_STYLE_SMALL_ACCUMULATION_DAY,
        TEXT_STYLE_SMALL_ACCUMULATION_DAY,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
      ]
    }

    if (ad === SMALL_DISTRIBUTION_DAY_LETTER) {
      return [
        TEXT_STYLE_SMALL_DISTRIBUTION_DAY,
        TEXT_STYLE_SMALL_DISTRIBUTION_DAY,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
      ]
    }

    if (ad === LARGE_DISTRIBUTION_DAY_LETTER) {
      return [
        TEXT_STYLE_LARGE_DISTRIBUTION_DAY,
        TEXT_STYLE_LARGE_DISTRIBUTION_DAY,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
      ]
    }

    if (+per >= 0) {
      return [
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_PERC_UP,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
        TEXT_STYLE_MED_DARK,
      ]
    } else if (+per <= 0) {
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

function colorRange(sheet, startRow, startCol, numRows, numCols, colorsArr) {
  const range = sheet.getRange(startRow, startCol, numRows, numCols)
  range.setBackgrounds(colorsArr)
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
