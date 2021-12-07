#' Plot an interactive cubic bezier curve
#'
#' @param Points The control points for a Bezier curve. The control points can be in the form of dataframe or matrix.
#' If not provided, this function will plot a Bezier curve with default control points.
#' If a dataframe is provided, it should has 4 rows and 2 columns and the column's name should be "x" and "y".
#' If a matrix is provided, it also should have 4 rows and 2 columns. The data in first column will be the x coordinates of control points and data in the second column will be the y coordinates of control ponints.
#'
#' @description This function will plot an interactive Bezier curve. The blue points are the control points for this bezier curve, which can be dragged at will.
#' The variable t controls the animation of De Casteljau's algorithm, which can be adjusted using the slider in the bottom of the plot.
#'
#' @export
#'
#' @examples
#' plot_cubic_bezier()
#'
#' x = c(100, 200, 300, 400)
#' y = c(100, 400, 100, 400)
#' control_points = data.frame(x,y)
#' plot_cubic_bezier(control_points)
#'
plot_cubic_bezier <- function(Points = NULL)
{
  control_points = NULL
  # If users don't provide control points, plot bezier curve with default control points.
  if(is.null(Points)){
    x = c(100, 200, 300, 400)
    y = c(100, 400, 100, 400)
    control_points = data.frame(x,y)
  }

  # If users provide a data frame, check its compatibility
  if(is.data.frame(Points)){
    if(dim(Points)[1] != 4){
      stop("Cubic Bezier Curve requires 4 control points, please check the number of input points.")
    }
    if(dim(Points)[2] != 2){
      stop("Cubic Bezier Curve requires x and y coordinates, please check the format of input points.")
    }
    colnames(Points) = c("x","y")
    control_points = Points
  }

  # If users provide a matrix, check its compatibility
  if(is.matrix(Points)){
    if(dim(Points)[1] != 4){
      stop("Cubic Bezier Curve requires 4 control points, please check the number of input points.")
    }
    if(dim(Points)[2] != 2){
      stop("Cubic Bezier Curve requires x and y coordinates, please check the format of input points.")
    }
    x = Points[,1]
    y = Points[,2]
    control_points = data.frame(x,y)
  }

  # If the control points are not data frame or matrix, stop plotting.
  if(is.null(control_points)){
    stop("Please provide the control points using dataframe or matrix.")
  }


  r2d3::r2d3(system.file("JS/Cubic_Bezier_Curve_Slider.js", package = "Beziervizer"), data=control_points)
  #r2d3::r2d3("inst/JS/Cubic_Bezier_Curve_Slider.js", data = control_points)
}


#' Plot an interactive rational quadratic bezier curve
#'
#' @param Points The control points for a Bezier curve. The control points can be in the form of dataframe or matrix.
#' If not provided, this function will plot a Bezier curve with default control points.
#' If a dataframe is provided, it should has 3 rows and 2 columns and the column's name should be "x" and "y".
#' If a matrix is provided, it also should have 3 rows and 2 columns. The data in first column will be the x coordinates of control points and data in the second column will be the y coordinates of control ponints.
#'
#' @description This function will plot an interactive rational quadratic bezier curve. The upper part of the plot this bezier curve in rational space.
#' The middle part is this curve in 2D space. Blue points are the control points for bezier curve, which can be dragged at will.
#' The black line is a quadratic bezier curve formed by control points and the brown line is the rational bezier curve.
#' The variable w controls how the rational bezier curve would change from the original Bezier curve, which can be adjusted using the slider in the bottom of the plot.
#'
#' @export
#'
#' @examples
#' plot_rational_bezier()
plot_rational_bezier <- function(Points = NULL)
{
  control_points = NULL
  # If users don't provide control points, plot bezier curve with default control points.
  if(is.null(Points)){
    x = c(100, 300, 500)
    y = c(400, 600, 400)
    control_points = data.frame(x,y)
  }

  # If users provide a data frame, check its compatibility
  if(is.data.frame(Points)){
    if(dim(Points)[1] != 3){
      stop("Cubic Bezier Curve requires 4 control points, please check the number of input points.")
    }
    if(dim(Points)[2] != 2){
      stop("Cubic Bezier Curve requires x and y coordinates, please check the format of input points.")
    }
    colnames(Points) = c("x","y")
    control_points = Points
  }

  # If users provide a matrix, check its compatibility
  if(is.matrix(Points)){
    if(dim(Points)[1] != 3){
      stop("Cubic Bezier Curve requires 4 control points, please check the number of input points.")
    }
    if(dim(Points)[2] != 2){
      stop("Cubic Bezier Curve requires x and y coordinates, please check the format of input points.")
    }
    x = Points[,1]
    y = Points[,2]
    control_points = data.frame(x,y)
  }

  # If the control points are not data frame or matrix, stop plotting.
  if(is.null(control_points)){
    stop("Please provide the control points using dataframe or matrix.")
  }


  r2d3::r2d3(system.file("JS/Rational_Bezier_Curve.js", package = "Beziervizer"), data=control_points)
  #r2d3::r2d3("inst/JS/Rational_Bezier_Curve.js", data = control_points)
}
