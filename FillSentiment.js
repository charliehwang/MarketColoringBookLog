function runFillSentimentTest() {
  colorAndFillinSentimentCells(cbSheet, dataVals)
}

function colorAndFillinSentimentCells(sheet, data) {
  const [header, ...onlyData] = dataVals

  FIELDS_SENTIMENT.forEach((fieldName) => {
    colorAndFillIndividualSentimentCell(sheet, fieldName, onlyData)
  })
}

function colorAndFillIndividualSentimentCell(sheet, fieldName, data) {
  console.log(
    "Working on Coloring and Filling in Sentiment Cells for " + fieldName
  )

  const dataForField = getDataFromFieldNames([fieldName], DATA_HEADERS, data)

  const startIdx = COLORING_BOOK_SUB_HEADERS.indexOf(fieldName)
  const startCol = startIdx + 1
  const numCols = 1

  fillCellValues(sheet, dataForField, DATA_START_ROW, startCol, numCols)
}
