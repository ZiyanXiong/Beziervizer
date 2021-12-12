#' Plot an interactive cubic bezier curve
#'
#' @param Points The control points for a Bezier curve. The control points can be in the form of dataframe or matrix.
#' If not provided, this function will plot a Bezier curve with default control points.
#' If a dataframe is provided, it should have 4 rows and 2 columns and the column's name should be "x" and "y".
#' If a matrix is provided, it also should have 4 rows and 2 columns. The data in first column will be the x coordinates of control points and data in the second column will be the y coordinates of control ponints.
#'
#' @description This function will plot an interactive Bezier curve. The blue points are the control points for this bezier curve, which can be dragged at will.
#' The variable t controls the animation of De Casteljau's algorithm, which can be adjusted using the slider in the bottom of the plot.
#'
#' @export
#'
#' @examples
#' #Plot with default control points
#' plot_cubic_bezier()
#'
#' #Plot with dataframe as control points
#' x = c(100, 200, 300, 400)
#' y = c(100, 400, 100, 400)
#' control_points = data.frame(x,y)
#' plot_cubic_bezier(control_points)
#'
#' #Plot with a matrix as control points
#' x = c(100, 200, 300, 400)
#' y = c(100, 400, 100, 400)
#' control_points = matrix(c(x,y),length(x),2)
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


#' Plot an interactive high order bezier curve
#'
#' @param Points The control points for a Bezier curve. The control points can be in the form of dataframe or matrix or an integer.
#' If not provided, this function will plot a 20-order Bezier curve with random control points.
#' If a dataframe is provided, it should have more than 5 rows and 2 columns and the column's name should be "x" and "y".
#' If a matrix is provided, it also should have more than 5 rows and 2 columns. The data in first column will be the x coordinates of control points and data in the second column will be the y coordinates of control ponints.
#' If an integer is provided, it will plot a Bezier curve at this order with random control points.
#'
#' @description This function will plot an interactive Bezier curve at more than 5 order. The blue points are the control points for this bezier curve, which can be dragged at will.
#' This high order Bezier curve is obtained by subdividing the original Bezier curve with De Casteljau's algorithm recursively. After the fixed iteration times, this function will use generated control points as the Bezier Curve.
#' The variable Iterate times controls how many times the De Casteljau's algorithm will be performed, which can be adjusted using the slider in the bottom of the plot.
#'
#' @export
#'
#' @examples
#' #Plot with 20 random control points
#' plot_high_order_bezier()
#'
#' #Plot with a dataframe as control points
#' x = c(100, 200, 300, 400, 500, 900)
#' y = c(100, 400, 100, 400, 700, 300)
#' control_points = data.frame(x,y)
#' plot_high_order_bezier(control_points)
#'
#' #Plot with a matrix as control points
#' x = c(100, 200, 300, 400, 500, 900)
#' y = c(100, 400, 100, 400, 700, 300)
#' control_points = matrix(c(x,y),length(x),2)
#' plot_high_order_bezier(control_points)
#'
#' #Plot with an integer as the order of Bezier curve
#' plot_high_order_bezier(11)
#'
plot_high_order_bezier <- function(Points = NULL)
{
  control_points = NULL
  # If users don't provide control points, plot bezier curve with default control points.
  if(is.null(Points)){
    control_points = 20
  }

  # If users provide the number of control points
  if(length(Points) == 1){
    if(Points < 5){
      stop("High Order Bezier Curve requires at least 5 control points, please check the number of input points.")
    }
    control_points = as.integer(Points)
  }

  # If users provide a data frame, check its compatibility
  if(is.data.frame(Points)){
    if(dim(Points)[1] <= 4){
      stop("High Order Bezier Curve requires at least 5 control points, please check the number of input points.")
    }
    if(dim(Points)[2] != 2){
      stop("Bezier Curve requires x and y coordinates, please check the format of input points.")
    }
    colnames(Points) = c("x","y")
    control_points = Points
  }

  # If users provide a matrix, check its compatibility
  if(is.matrix(Points)){
    if(dim(Points)[1] <= 4){
      stop("High order Bezier Curve requires 5 control points, please check the number of input points.")
    }
    if(dim(Points)[2] != 2){
      stop("Bezier Curve requires x and y coordinates, please check the format of input points.")
    }
    x = Points[,1]
    y = Points[,2]
    control_points = data.frame(x,y)
  }

  # If the control points are not data frame or matrix, stop plotting.
  if(is.null(control_points)){
    stop("Please provide the control points using dataframe or matrix.")
  }


  r2d3::r2d3(system.file("JS/High_Order_Bezier_Curve.js", package = "Beziervizer"), data=control_points)
  #r2d3::r2d3("inst/JS/High_Order_Bezier_Curve.js", data = control_points)
}


#' Plot an interactive rational quadratic bezier curve
#'
#' @param Points The control points for a Bezier curve. The control points can be in the form of dataframe or matrix.
#' If not provided, this function will plot a Bezier curve with default control points.
#' If a dataframe is provided, it should have 3 rows and 2 columns and the column's name should be "x" and "y".
#' If a matrix is provided, it also should have 3 rows and 2 columns. The data in first column will be the x coordinates of control points and data in the second column will be the y coordinates of control ponints.
#'
#' @description This function will plot an interactive rational quadratic bezier curve. The upper part of the plot is this bezier curve in rational space.
#' The middle part is this curve in 2D space. Blue points are the control points for bezier curve, which can be dragged at will.
#' The black line is a quadratic bezier curve formed by control points and the brown line is the rational bezier curve.
#' The variable w controls how the rational bezier curve would change from the original Bezier curve, which can be adjusted using the slider in the bottom of the plot.
#'
#' @export
#'
#' @examples
#' #Plot with default control points
#' plot_rational_bezier()
#'
#' #Plot with dataframe as control points
#' x = c(100, 200, 300)
#' y = c(100, 400, 100)
#' control_points = data.frame(x,y)
#' plot_rational_bezier(control_points)
#'
#' #Plot with a matrix as control points
#' x = c(100, 200, 300)
#' y = c(100, 400, 100)
#' control_points = matrix(c(x,y),length(x),2)
#' plot_rational_bezier(control_points)
#'
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
