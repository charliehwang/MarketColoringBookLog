function runFillCellDataTest() {
  fillAllCells(cbSheet, dataVals)
}

function fillAllCells(sheet, data) {
  fillDateCells(sheet, data)

  INDICES.forEach((indexName) => {
    fillAndColorIndividualIndices(indexName)
  })

  colorAndFillinBreadthCells(sheet, data)

  colorAndFillinSentimentCells(cbSheet, dataVals, DATA_START_ROW)
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
