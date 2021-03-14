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
