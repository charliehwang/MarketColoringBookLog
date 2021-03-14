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
  if (!DATA_HEADERS || DATA_HEADERS.length === 0)
    throw new Error("No Data Headers Found")
  //Logger.log(headers)
  return DATA_HEADERS.indexOf(fieldName)
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

function getDataFromFieldNames(fieldNames, dataHeaders, dataVals) {
  const firstField = fieldNames[0]
  const lastField = fieldNames[fieldNames.length - 1]
  const startIdx = dataHeaders.indexOf(firstField)
  const startCol = startIdx + 1
  const endIdx = dataHeaders.indexOf(lastField)

  const breadthFieldIdxs = dataHeaders.reduce((acc, headerName, i) => {
    if (fieldNames.indexOf(headerName) >= 0) acc.push(i)
    return acc
  }, [])

  return filterDataWithFromIndexes(breadthFieldIdxs, dataVals)
}

function filterDataWithFromIndexes(wantedFieldIdxs, data) {
  return data.map((d) => {
    const filtered = d.filter((value, i) => {
      if (wantedFieldIdxs.indexOf(i) !== -1) {
        return true
      }
      return false
    })
    return filtered
  })
}
