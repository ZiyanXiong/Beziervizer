
#' @title Plot a cubic Bezier curve
#'
#' @description This function will lunch a Shiny app for plotting an interactive Bezier curve. The slider t controls the animation of De Casteljau's algorithm. The coordinates of each control points will be printed out on each movement.
#'
#' @export
#'
#' @examples
#' #plot_cubic_bezier()
plot_cubic_bezier <- function()
{
  shiny::runApp(appDir = system.file("Slider", package = "Beziervizer"))
}
