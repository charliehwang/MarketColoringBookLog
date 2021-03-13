function runTest() {
  setupColoringBook()
}

function setupColoringBook() {
  const numOfColumns = COLORING_BOOK_SUB_HEADERS.length
  const numOfRows = dataLastRow

  setColoringBookColumnWidths()
  // set everything to dark mode
  const allRange = cbSheet.getRange(
    HEADERS_ROW_NUM,
    DATE_COL,
    numOfRows,
    numOfColumns
  )
  allRange.setBackground(COLOR_HEX.DARK_GREY)
  allRange.setTextStyle(TEXT_STYLE_NORMAL)

  const range = cbSheet.getRange(HEADERS_ROW_NUM, 1, numOfRows, numOfColumns)

  //
  // setup the first header row
  //
  const mergeCellColsData = getMergeCellColsData(
    COLORING_BOOK_SUB_HEADERS,
    INDICES_MERGE_FROM_TO
  )
  if (COLORING_BOOK_HEADERS.length !== mergeCellColsData.length)
    throw new Error("Main header lengths should match.")

  console.log(mergeCellColsData)
  mergeCellColsData.forEach((d) => {
    const [firstColNum, secondColNum] = d
    // only merge if there are possible merges
    if (secondColNum) {
      const numCols = secondColNum - firstColNum + 1
      const range = cbSheet.getRange(HEADERS_ROW_NUM, firstColNum, 1, numCols)
      range.merge()
    }
  })

  // set styles
  var headerStyle = SpreadsheetApp.newTextStyle()
    .setBold(true)
    .setForegroundColor("#E6E6E6")
    .build()

  const headerRange = cbSheet.getRange(HEADERS_ROW_NUM, 1, 1, numOfColumns)
  headerRange.setBackgroundRGB(...COLOR.DARK_GREY)
  headerRange.setTextStyle(headerStyle)

  //
  // setup the sub header row
  //
  COLORING_BOOK_HEADERS.forEach((headerName, i) => {
    // figure out where to put the header from the col num vals from mergeCellsColsData
    const colData = mergeCellColsData[i]
    const [firstColNum] = colData

    console.log(i, headerName, firstColNum)
    const range = cbSheet.getRange(HEADERS_ROW_NUM, firstColNum, 1, 1)
    range.setValue(headerName)
  })

  console.log(COLORING_BOOK_SUB_HEADERS.length)
  const subHeaderRange = cbSheet.getRange(
    SUB_HEADERS_ROW_NUM,
    1,
    1,
    COLORING_BOOK_SUB_HEADERS.length
  )
  subHeaderRange.setValues([COLORING_BOOK_SUB_HEADERS])

  // set styles
  var subHeaderStyle = SpreadsheetApp.newTextStyle()
    .setBold(true)
    .setForegroundColor("#CDCDCD")
    .build()

  subHeaderRange.setBackgroundRGB(...COLOR.GREY)
  subHeaderRange.setTextStyle(subHeaderStyle)

  // // setup date column
  // const dateColRange = cbSheet.getRange(HEADERS_ROW_NUM, DATE_COL, numOfRows, 1)
  // dateColRange.setBackgroundRGB(...COLOR.DARK_GREY)
}

function setColoringBookColumnWidths() {
  const WIDER_WIDTH = 50
  const INDEX_WIDTH = 25
  const WIDTH = 50
  cbSheet.setColumnWidths(1, 1, WIDER_WIDTH + 10)
  cbSheet.setColumnWidths(2, 5, INDEX_WIDTH)
  cbSheet.setColumnWidths(3, 1, WIDER_WIDTH) // COMP PER
  cbSheet.setColumnWidths(7, 5, INDEX_WIDTH)
  cbSheet.setColumnWidths(8, 1, WIDER_WIDTH) // SPX PER
  cbSheet.setColumnWidths(12, 5, INDEX_WIDTH)
  cbSheet.setColumnWidths(13, 1, WIDER_WIDTH) // IWM PER
  cbSheet.setColumnWidths(17, 8, WIDTH)
  cbSheet.setColumnWidths(25, 6, WIDTH)
  cbSheet.setColumnWidths(31, 1, 500)
  cbSheet.setColumnWidths(32, 1, 800)
}

function getMergeCellColsData(subHeaders, INDICES_MERGE_FROM_TO) {
  let dupeCount = 0 // #TODO : Bad way to handle duplicate searches. Just doing this for now.
  return MERGE_CELLS_FROM_TO.map((d, i) => {
    // scan subHeaders for first instance of the col name
    // - if i > 0 then, scan for the following instances respectively for the col name

    const [firstCol, secondCol] = d

    // find all instances of the firstCol and then the secondCol
    // pick the right instance based upon the i
    const firstColNameInstancesFound = subHeaders.reduce((acc, header, i) => {
      if (header === firstCol) {
        acc.push(i + 1)
      }
      return acc
    }, [])

    const secondColNameInstancesFound = subHeaders.reduce((acc, header, i) => {
      if (header === secondCol) {
        acc.push(i + 1)
      }
      return acc
    }, [])

    // console.log(firstColNameInstancesFound)
    // console.log(secondColNameInstancesFound)

    const firstColNum =
      firstColNameInstancesFound.length > 1
        ? firstColNameInstancesFound[dupeCount]
        : firstColNameInstancesFound[0]
    const secondColNum =
      secondColNameInstancesFound.length > 1
        ? secondColNameInstancesFound[dupeCount]
        : secondColNameInstancesFound[0]

    firstColNameInstancesFound.length > 1 && dupeCount++

    return [firstColNum, secondColNum]
  })
}
