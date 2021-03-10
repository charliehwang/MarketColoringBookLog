function runCalculateMaTrendsTest() {
  const calculateMATrendDays = getCalculateMATrendDaysFn()
  const output = calculateMATrendDays(10, 20, 30, 0.03)
  console.log(output)
}

function getCalculateMATrendDaysFn() {
  let lastTrendColor = undefined
  let trendCount = 1

  return (close, ema10, ema20, perFrom20ema) => {
    const color = getMATrendColor(close, ema10, ema20, perFrom20ema)

    if (
      ((color === TREND.VERY_BULLISH ||
        color === TREND.BULLISH ||
        color === TREND.SLIGHTLY_BULLISH) &&
        (lastTrendColor === TREND.VERY_BEARISH ||
          lastTrendColor === TREND.BEARISH ||
          lastTrendColor === TREND.SLIGHTLY_BEARISH)) ||
      ((color === TREND.VERY_BEARISH ||
        color === TREND.BEARISH ||
        color === TREND.SLIGHTLY_BEARISH) &&
        (lastTrendColor === TREND.VERY_BULLISH ||
          lastTrendColor === TREND.BULLISH ||
          lastTrendColor === TREND.SLIGHTLY_BULLISH)) ||
      color === COLOR_HEX.DARK_GREY // there isn't a trend color found
    ) {
      trendCount = 1
    } else {
      trendCount++
    }

    lastTrendColor = color
    return [color, trendCount]
  }
}

// function changeCompCellColor(
//   cell,
//   data,
//   row,
//   idxClose,
//   idxVolume,
//   idxPerChange,
//   idx10ema,
//   idx20ema,
//   idxPercFrom20ema
// ) {
//   const valClose = data[row - 1][idxClose]
//   const val10ema = data[row - 1][idx10ema]
//   const val20ema = data[row - 1][idx20ema]
//   const valPercFrom20ema = data[row - 1][idxPercFrom20ema]

//   //  console.log(valClose, val10ema, val20ema, valPercFrom20ema)

//   const valColor = getValColor(valClose, val10ema, val20ema, valPercFrom20ema)
//   cell.setBackgroundRGB(...valColor)
// }

function getMATrendColor(valClose, val10ema, val20ema, valPercFrom20ema) {
  if (!valClose) return COLOR_HEX.DARK_GREY

  if (valClose >= val10ema && valClose >= val20ema && valPercFrom20ema >= 0.01)
    return TREND.VERY_BULLISH
  if (valClose <= val10ema && valClose <= val20ema && valPercFrom20ema <= -0.01)
    return TREND.VERY_BEARISH
  if (valClose >= val20ema && valPercFrom20ema >= 0.01) return TREND.BULLISH
  if (valClose <= val20ema && valPercFrom20ema <= -0.01) return TREND.BEARISH
  if (valClose >= val20ema && valPercFrom20ema >= 0)
    return TREND.SLIGHTLY_BULLISH
  if (valClose <= val20ema && valPercFrom20ema > -0.01)
    return TREND.SLIGHTLY_BEARISH

  return COLOR_HEX.CYAN
}
