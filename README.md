# D3-Challenge
This is the 13th homework from the coding boot camp course.
Last time we had used Plotly to generate some interactive dashboards over a webpage and this time we will focus on a even more dynamic plots using D3 lib. The aim is to project the csv data over to as a scatter plot with multiple axes, both in x and y, and the user could click on the axis labels to change the data for a new plot.

## Key Reflects
### New Findings
This homework is really about 'copy-paste' from what we have covered within the last activity of lession 3 of this topic, the only difference is we need to include the change on Y-axis as well, and this is going to be 3-axis systems for both x and y axes!
The basic concept:
1. set svg area and make a chartGroup
2. set function with 2 intakes to return the xLinearScale on x-axis
3. do the same on y-axis above
4. set function with 2 intakes to return the xAxis
5. do the same on y-axis above
6. set function to return the scatter objects (circlesGroup)
7. set function to return toolTip message when mouse hovering at each circle, using tip() and event listeners
8. read csv file and parse the data
9. call each function to generate initial 2-5 values
10. create initial circleGroup, with both the shape and text on each item
11. create each axis labels for x and y, totally 6 of them
12. call toolTip function on existing circlesGroup
13. create event listener on "click" different axis labels for both x and y
14. ending with error printout if any

The challenge part is how to add both shape and text on to each item within the plot. The key points:
1. text cannot be added on shapes, they should be added individually over the 'g' as a group
2. to show the text, we need to firstly add the shape and then the text, so the text will be on top of the shape...
3. It is hard to set the cx and cy for circle shapes, and x, y for text items, and also to swap the circles when changing axis. Hence, it is pretty handy to set attr of transform on the circlesGroup, as well as the 'g'. In this case, there is no need to set the circle's cx and cy, nor the x, y for text. But for text should have dx and dy, which is the 'relative' attributes of coordinates, to make the text showed in the center of each circle item.

When setting up the mouseover event, I had it as:
  circlesGroup.on("mouseover", function(data){toolTip.show(data,this)})
Where I did not include the 'this' and it failed to display the data...

### Uncertainties
1. I have used a relative sizing on the svg area but I only made it for the svg, where the webpage contains other stuff then it is not working properly... 
2. The toolTip message should have a unit of a % sign after some of the values, I have tried to set a third variable when defining the toolTip as:
      function updateTooltip(chosenXaxis,chosenYaxis,circlesGroup){
        var xlabel
        var ylabel
        **var theUnit**
        
        if(chosenXaxis === "poverty"){
            xlabel = "Poverty: "
            **theUnit = "%"**
        }
        else if (chosenXaxis === "age"){
            xlabel = "Age: "
            **theUnit = ""**
        }
        else {xlabel = "Household Income: "
        **theUnit = ""**}

        if(chosenYaxis === "healthcare"){
            ylabel = "Lacks Healthcare: "
            **theUnit = "%"**
        }
        else if (chosenYaxis === "smokes"){
            ylabel = "Smokes: "
            **theUnit = "%"**
        }
        else {ylabel = "Obesity: "
        **theUnit = "%"**}

        var toolTip = d3.tip().attr("class","d3-tip").offset([50,-75]).html(function(d){
            return (`<strong>${d.state}</strong><br>${xlabel}${d[chosenXaxis]} **${theUnit}** <br>${ylabel}${d[chosenYaxis]} **${theUnit}** `)
        })
        //call toolTip
        circlesGroup.call(toolTip)
        //set mouse events
        circlesGroup.on("mouseover",function(data){toolTip.show(data,this)})
                    .on("mouseout",function(data,index){toolTip.hide(data)})
        
        return circlesGroup
    }
    
    It only shows the "%" for all cases... could not figure out the reason
