function runMeTest() {
  // Logger.log(getCBIDX("DIST_COMP"))
  // Logger.log(cbHeaders)
  // const distributionDaysData = getDistributionDaysData()
  //  fillIndices(cbSheet, dataSheet)
  //  fillIndices(cbSheet, dataSheet, 10)
  // Logger.log(getDataIDX("NAA50R"))
  // Logger.log(getDataIDX("COMP20ema"))
}

// function onEdit(e) {
//   console.log("onEdit")
//   const sheet = e.range.getSheet()
//   console.log(e.range.getSheet().getSheetName())
//   if (e.range.getSheet().getSheetName() == "Coloring Book") {
//     fillIndices(cbSheet, dataSheet, 10) // color last 10 rows
//   }

//   return
// }

function fillIndices(cbSheet, dataSheet, numberOfRows) {
  const cbLastRow = cbSheet.getLastRow()

  numberOfRows = numberOfRows || cbLastRow

  // prefetch data ranges and the values
  const data = dataSheet.getRange("A:BD").getValues()
  const distributionDaysData = calculateDistributionDays(data)

  for (let col = 1; col <= cbLastCol; col++) {
    for (let row = 2; row <= numberOfRows; row++) {
      var cell = cbSheet.getRange(row, col)

      if (col === getCBColNum("DIST_COMP")) {
        const startRow = 2 // skip header
        const numRows = cbLastRow
        const numCols = 1
        const colRange = cbSheet.getRange(startRow, col, numRows, numCols)

        const distValues = distributionDaysData.map((d) => {
          return d.distDay ? "*" : ""
        })

        // console.log(distValues)
        // colRange.setValues(distValues)

        // colRange.setBackgroundRGB(...COLOR.WHITE);
      }
      //   else if (col >= getCBColNum("COMP") && col <= getCBColNum("IWM")) {
      //     let idxData = []
      //     if (col === getCBColNum("COMP")) idxData = [getDataIDX("COMP"), getDataIDX("COMPVolume"), getDataIDX("COMPPerChange"), getDataIDX("COMP10ema"), getDataIDX("COMP20ema"), getDataIDX("COMPPercFrom20ema")]
      //     if (col === getCBColNum("SPY")) idxData = [getDataIDX("SPX"), getDataIDX("SPXVolume"), getDataIDX("SPXPerChange"), getDataIDX("SPX10ema"), getDataIDX("SPX20ema"), getDataIDX("SPXPercFrom20ema")]
      //     if (col === getCBColNum("IWM")) idxData = [getDataIDX("IWM"), getDataIDX("IWMVolume"), getDataIDX("IWMPerChange"),getDataIDX("IWM10ema"), getDataIDX("IWM20ema"), getDataIDX("IWMPercFrom20ema")]
      // //  Logger.log(idxData)

      //     changeCompCellColor(cell, data, row, ...idxData)
      // }
    }
  }
}
