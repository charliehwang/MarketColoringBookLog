function runFillSentimentTest() {
  const fieldName = "VIX_HIGH"
  const startCol = getStartColFor(fieldName)
  const [header, ...dataForField] = getDataFromFieldNames([fieldName], DATA_HEADERS, dataVals)
  const stats = getStats(fieldName, dataVals)

  // colorAndFillinSentimentCells(cbSheet, dataVals, DATA_START_ROW)
  console.log("done")
}

function colorAndFillinSentimentCells(sheet, data) {
  const [header, ...onlyData] = dataVals
  const numCols = 1

  FIELDS_SENTIMENT.forEach((fieldName) => {
    const startCol = getStartColFor(fieldName)
    if (startCol === undefined) throw new Error(`${fieldName} is not found in the COLORING_BOOK_SUB_HEADERSs const.`)
    const [header, ...dataForField] = getDataFromFieldNames([fieldName], DATA_HEADERS, data)

    console.log("Working on Filling Values on Sentiment Cells for " + fieldName)
    fillCellValues(sheet, dataForField, DATA_START_ROW, startCol, numCols)

    const stats = getStats(fieldName, data)
    console.log("Setting Text Styles on Sentiment Cells for " + fieldName)
    setCellTextStylesBasedOnStdDevs(sheet, dataForField, stats, DATA_START_ROW, startCol, numCols)
  })
}
