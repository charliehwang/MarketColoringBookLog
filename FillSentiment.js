function runFillSentimentTest() {
  colorAndFillinSentimentCells(cbSheet, dataVals, DATA_START_ROW)
}

function colorAndFillinSentimentCells(sheet, data) {
  const [header, ...onlyData] = dataVals
  const numCols = 1

  FIELDS_SENTIMENT.forEach((fieldName) => {
    const startCol = getStartColFor(fieldName)
    if (startIdx === undefined) throw new Error(`${fieldName} is not found in the COLORING_BOOK_SUB_HEADERSs const.`)

    colorAndFillIndividualSentimentCell(sheet, fieldName, onlyData, startCol, numCols)

    const stats = getStats(fieldName, data)
    setBreadthCellTextStylesBasedOnStdDevs(sheet, onlyData, stats, DATA_START_ROW, startCol, numCols)
  })
}

function colorAndFillIndividualSentimentCell(sheet, fieldName, data, startCol, numCols) {
  console.log("Working on Coloring and Filling in Sentiment Cells for " + fieldName)
  const dataForField = getDataFromFieldNames([fieldName], DATA_HEADERS, data)
  fillCellValues(sheet, dataForField, DATA_START_ROW, startCol, numCols)
}

function setSentimentTextStyles() {}
