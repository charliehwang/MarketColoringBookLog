function runTestUtilitySheet() {
  // const headerRowData = dataVals[0]
  // const headerIdxLocations = getHeaderIdxLocationsAsDictForIndexName(
  //   "COMP",
  //   headerRowData
  // )
  // console.log(headerIdxLocations)
  // getColDataFor("NAA50R", dataVals)
}

function getDataColNum(fieldName) {
  return getDataIDX(fieldName) + 1
}

function getCBColNum(fieldName) {
  if (!cbHeaders || cbHeaders.length === 0)
    throw new Error("No Data Headers Found")
  const headers = cbHeaders[0]
  //Logger.log(headers)
  return headers.indexOf(fieldName) + 1
}

function getDataIDX(fieldName) {
  if (!dataHeaders || dataHeaders.length === 0)
    throw new Error("No Data Headers Found")
  const headers = dataHeaders[0]
  //Logger.log(headers)
  return headers.indexOf(fieldName)
}

function getHeaderIdxLocationsAsDictForIndexName(indexName, headerData) {
  const regExp = new RegExp(`^${indexName}(_+)?`)
  return headerData
    .map((d, i) => (d.match(regExp) ? [d, i] : undefined))
    .filter((d) => d)
    .reduce((acc, arr) => {
      const [headerName, i] = arr
      acc[headerName] = i
      return acc
    }, {})
}

function removeDateData(arr) {
  return arr.map((d) => {
    const [date, ...other] = d
    return other
  })
}

function getColDataFor(fieldName, data) {
  const colNum = getDataColNum(fieldName)
  const idxNum = colNum - 1

  const colData = data.reduce((acc, d) => {
    if (d[idxNum] === undefined)
      throw new Error(
        "Data for column: " +
          fieldName +
          " with col number: " +
          colNum +
          " does not exist."
      )

    const date = d[DATE_COL - 1]
    acc.push([date, d[idxNum]])
    return acc
  }, [])

  // const colData = data[colNum]
  // console.log(colData)
  return colData
}

// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
function standardDeviation(values) {
  var avg = average(values)

  var squareDiffs = values.map(function (value) {
    var diff = value - avg
    var sqrDiff = diff * diff
    return sqrDiff
  })

  var avgSquareDiff = average(squareDiffs)

  var stdDev = Math.sqrt(avgSquareDiff)
  return stdDev
}

function average(data) {
  var sum = data.reduce(function (sum, value) {
    return sum + value
  }, 0)

  var avg = sum / data.length
  return avg
}

function calculateColumnDataStats(data) {
  const [header, ...onlyData] = removeDateData(data).map((d) => d[0])
  const avg = average(onlyData)
  const stdDev = standardDeviation(onlyData)
  return { avg, stdDev }
}

function colorRange(sheet, startRow, startCol, numRows, numCols, colorsArr) {
  const range = sheet.getRange(startRow, startCol, numRows, numCols)
  range.setBackgrounds(colorsArr)
}
