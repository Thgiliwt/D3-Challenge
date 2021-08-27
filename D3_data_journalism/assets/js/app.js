// @TODO: YOUR CODE HERE!
//set a resize function
function resize(){
    //make the svg area is recreated everytime based on the relative window size
    var svgArea = d3.select("body").select("svg")
    if(!svgArea.empty()){
        svgArea.remove()
    }
    var svgHeight = window.innerHeight
    var svgWidth = window.innerWidth
    //setting up basic svg and plots area size etc.
    // var svgHeight = 1000
    // var svgWidth = 1000

    var margin = {
        top: 100,
        right:100,
        bottom:200,
        left:200
    }

    var width = svgWidth - margin.right - margin.left
    var height = svgHeight - margin.top - margin.bottom

    var svg = d3.select("#scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight)

    var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)
    //initial axises
    var chosenXaxis = "poverty"
    var chosenYaxis = "healthcare"   
    //function for updating x-scale var upon click on axis label
    function xScale(usdata, chosenXaxis){
        var xLinearScale = d3.scaleLinear().domain([d3.min(usdata,d=>
            d[chosenXaxis])*0.8, d3.max(usdata, d=>
                d[chosenXaxis])*1.2]).range([0,width])
        return xLinearScale
    }
    //function for updating y-scale var upon click on axis label
    function yScale(usdata,chosenYaxis){
        var yLinearScale = d3.scaleLinear().domain([d3.min(usdata,d=>
            d[chosenYaxis])*0.8, d3.max(usdata, d=>
                d[chosenYaxis])*1.2]).range([height,0])
        return yLinearScale
    }
    //function for updating xaxis var upon click on axis label
    function renderxAxes(newxScale,xAxis){
        var bottomAxis = d3.axisBottom(newxScale)
        xAxis.transition().duration(2000).call(bottomAxis)
        return xAxis
    }
    //function for updating xaxis var upon click on axis label
    function renderyAxes(newyScale,yAxis){
        var leftAxis = d3.axisLeft(newyScale)
        yAxis.transition().duration(2000).call(leftAxis)
        return yAxis
    }
    //function for updating circles group to new datasets
    function renderCircles(circlesGroup,newxScale,newyScale,chosenXaxis,chosenYaxis){

        circlesGroup.transition().duration(2000).attr("transform",d=>`translate(${newxScale(d[chosenXaxis])},${newyScale(d[chosenYaxis])})`)
        return circlesGroup
    }
    //function for updating toolitip on relative circles
    function updateTooltip(chosenXaxis,chosenYaxis,circlesGroup){
        var xlabel
        var ylabel

        if(chosenXaxis === "poverty"){
            xlabel = "Poverty: "
        }
        else if (chosenXaxis === "age"){
            xlabel = "Age: "
        }
        else {xlabel = "Household Income: "}

        if(chosenYaxis === "healthcare"){
            ylabel = "Lacks Healthcare: "
        }
        else if (chosenYaxis === "smokes"){
            ylabel = "Smokes: "
        }
        else {ylabel = "Obesity: "}

        var toolTip = d3.tip().attr("class","d3-tip").offset([50,-75]).html(function(d){
            return (`<strong>${d.state}</strong><br>${xlabel}${d[chosenXaxis]}<br>${ylabel}${d[chosenYaxis]}`)
        })
        //call toolTip
        circlesGroup.call(toolTip)
        //set mouse events
        circlesGroup.on("mouseover",function(data){toolTip.show(data,this)})
                    .on("mouseout",function(data,index){toolTip.hide(data)})
        
        return circlesGroup
    }
    //reading csv data and apply pre-defined function above
    d3.csv("assets/data/data.csv").then(function(usdata,err){
        if (err) {
            throw err}
        console.log(usdata)
        //parse data
        usdata.forEach((data=>{
            data.poverty = + data.poverty
            data.age = + data.age
            data.income = + data.income
            data.healthcare = + data.healthcare
            data.obesity = + data.obesity
            data.smokes = + data.smokes          
        }))
        //set xLinearScale and yLinearScale based on initial value
        var xLinearScale = xScale(usdata,chosenXaxis)
        var yLinearScale = yScale(usdata,chosenYaxis)
        //set bottomAxis and lefAxis based on initial value
        var bottomAxis = d3.axisBottom(xLinearScale)
        var leftAxis = d3.axisLeft(yLinearScale)
        //append xAxis and yAxis based on initial value
        var xAxis = chartGroup.append("g")
                              .classed("x-axis",true)
                              .attr("transform",`translate(0,${height})`)
                              .call(bottomAxis)
        var yAxis = chartGroup.append("g")
                              .classed("y-axis",true)
                              .call(leftAxis)
        //append circle groups based on initial chosen x and y axis value
        var circlesGroup = chartGroup.selectAll(null)
                                     .data(usdata)
                                     .enter()
                                     .append("g")
                                     .attr("transform",d=>`translate(${xLinearScale(d[chosenXaxis])},${yLinearScale(d[chosenYaxis])})`)
                                     
        circlesGroup.append("circle")
                    .attr("r",15)
                    .attr("class","stateCircle")
                    .attr("opacity",0.8)                             


        circlesGroup.append("text")
        .attr("dy","0.3em")
        .text(d=>`${d.abbr}`)
        .attr("class","stateText")
        //setting up for all x-axislabels and y-axislabels
        var xlabelsGroup = chartGroup.append("g")
                                     .attr("transform",`translate(${width/2},${height+20})`)
        
        var povertyLabel = xlabelsGroup.append("text")
                                       .attr("x",0)
                                       .attr("y",20)
                                       .attr("value","poverty")
                                       .classed("active",true)
                                       .classed("aText",true)
                                       .text("In Poverty (%)")
        var ageLabel = xlabelsGroup.append("text")
                                   .attr("x",0)
                                   .attr("y",40)
                                   .attr("value","age")
                                   .classed("inactive",true)
                                   .classed("aText",true)
                                   .text("Age (Median)")
        var incomeLabel = xlabelsGroup.append("text")
                                      .attr("x",0)
                                      .attr("y",60)
                                      .attr("value","income")
                                      .classed("inactive",true)
                                      .classed("aText",true)
                                      .text("Household Income (Median)")
        
        var ylabelsGroup = chartGroup.append("g")
                                     .attr("transform",`translate(${0-(margin.left)/6},${(height/2)}) rotate(-90)`)
                                    //  .attr("transform",`translate(${0-(margin.left)/2},${(height/2)})`)
                                     .attr("dy","1em")

        var healthcareLabel = ylabelsGroup.append("text")
                                          .attr("x",0)
                                          .attr("y",0)
                                          .attr("value","healthcare")
                                          .classed("active",true)
                                          .classed("aText",true)
                                          .text("Lacks Healthcare (%)")
        var smokesLabel = ylabelsGroup.append("text")
                                      .attr("x",0)
                                      .attr("y",-20)
                                      .attr("value","smokes")
                                      .classed("inactive",true)
                                      .classed("aText",true)
                                      .text("Smokes (%)")
        var obesityLabel = ylabelsGroup.append("text")
                                       .attr("x",0)
                                       .attr("y",-40)
                                       .attr("value","obesity")
                                       .classed("inactive",true)
                                       .classed("aText",true)
                                       .text("Obesity (%)")
        //set toolTip with initial csv values
        var circlesGroup = updateTooltip(chosenXaxis,chosenYaxis,circlesGroup)

        //x axis labels event listener
        xlabelsGroup.selectAll("text")
                    .on("click",function(){
                        var Xvalue =d3.select(this).attr("value")
                        //if clicked text value not same as pre-selected xaxis label text
                        if(Xvalue!==chosenXaxis){
                            chosenXaxis = Xvalue
                            //reset for x and y linearscales
                            xLinearScale = xScale(usdata,chosenXaxis)
                            yLinearScale = yScale(usdata,chosenYaxis)
                            //reset for x and y axis
                            xAxis = renderxAxes(xLinearScale,xAxis)
                            yAxis = renderyAxes(yLinearScale,yAxis)
                            //reset circlesgroups attributes with changed parameters
                            circlesGroup = renderCircles(circlesGroup,xLinearScale,yLinearScale,chosenXaxis,chosenYaxis)
                            circlesGroup = updateTooltip(chosenXaxis,chosenYaxis,circlesGroup)
                            //changes classes to change bold text
                            if (chosenXaxis === "poverty"){
                                povertyLabel.classed("active",true)
                                            .classed("inactive",false)
                                ageLabel.classed("active",false)
                                        .classed("inactive",true)
                                incomeLabel.classed("active",false)
                                           .classed("inactive",true)
                            }
                            else if (chosenXaxis === "age"){
                                povertyLabel.classed("active",false)
                                            .classed("inactive",true)
                                ageLabel.classed("active",true)
                                        .classed("inactive",false)
                                incomeLabel.classed("active",false)
                                           .classed("inactive",true) 
                            }
                            else {
                                povertyLabel.classed("active",false)
                                            .classed("inactive",true)
                                ageLabel.classed("active",false)
                                        .classed("inactive",true)
                                incomeLabel.classed("active",true)
                                           .classed("inactive",false)  
                            }
                        }
                    })
        //y axis labels event listener, similar to x axis labels above
        ylabelsGroup.selectAll("text")
                    .on("click",function(){
                        var Yvalue = d3.select(this).attr("value")
                        if(Yvalue!==chosenYaxis){
                            chosenYaxis = Yvalue
                            xLinearScale = xScale(usdata,chosenXaxis)
                            yLinearScale = yScale(usdata,chosenYaxis)
                            xAxis = renderxAxes(xLinearScale,xAxis)
                            yAxis = renderyAxes(yLinearScale,yAxis)
                            circlesGroup = renderCircles(circlesGroup,xLinearScale,yLinearScale,chosenXaxis,chosenYaxis)
                            circlesGroup = updateTooltip(chosenXaxis,chosenYaxis,circlesGroup)
                            if (chosenYaxis === "healthcare"){
                                healthcareLabel.classed("active",true)
                                               .classed("inactive",false)
                                smokesLabel.classed("active",false)
                                           .classed("inactive",true)
                                obesityLabel.classed("active",false)
                                            .classed("inactive",true)
                            }
                            else if (chosenYaxis === "smokes"){
                                healthcareLabel.classed("active",false)
                                               .classed("inactive",true)
                                smokesLabel.classed("active",true)
                                           .classed("inactive",false)
                                obesityLabel.classed("active",false)
                                            .classed("inactive",true)
                            }
                            else {
                                healthcareLabel.classed("active",false)
                                               .classed("inactive",true)
                                smokesLabel.classed("active",false)
                                           .classed("inactive",true)
                                obesityLabel.classed("active",true)
                                            .classed("inactive",false)
                            }
                        }
                    })
    }).catch(function(error){
        console.log(error)
    })
}
resize()