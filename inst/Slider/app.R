#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(r2d3)

ui <- fluidPage(
    inputPanel(
        sliderInput("bar_max", label = "t:",
                    min = 0, max = 1, value = 1, step = 0.05)
    ),
    verbatimTextOutput("selected"),
    d3Output("d3")
)

server <- function(input, output) {

    coordinates <- reactive({
        i = 1:12
        data.frame(
            x = input$circle_clicked[i %% 3 == 1],
            y = input$circle_clicked[i %% 3 == 2],
            t = rep(input$bar_max, length(input$circle_clicked) / 3),
            stringsAsFactors = FALSE)

    })
    output$d3 <- renderD3({
        r2d3(
            coordinates(),
            #script = "C:/Users/dsdsx/Documents/Beziervizer/JS/Cubic_Bezier_Curve.js"
            system.file("JS/Cubic_Bezier_Curve.js", package = "Beziervizer")
        )
    })

    output$selected <- renderText({
        points = rep(NULL,5)
        points[1] = "The coordinates of control points: \n"
        for(i in 2:5){
            points[i] = paste(" p", i - 1, "(x: ", coordinates()$x[i - 1], ", y: ", coordinates()$y[i - 1], ")\n" ,sep="")
        }
        #bar_number <- as.numeric(req(input$circle_clicked))
        #points = str(coordinates())
        #points
        points
    })

}

shinyApp(ui = ui, server = server)

