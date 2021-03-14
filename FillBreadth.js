function runFillBreadthTest() {
  const breadthData = getBreadthPerAbove(dataVals)
  console.log("ran")
}

function getBreadthPerAbove(dataVals) {
  const FIELDS_BREADTH_PER_ABOVE = [
    "NAA50R",
    "SPXA50R",
    "NAA150R",
    "SPXA150R",
    "NAA200R",
    "SPXA200R",
  ]

  return getDataFromFieldNames(FIELDS_BREADTH_PER_ABOVE, DATA_HEADERS, dataVals)
}
