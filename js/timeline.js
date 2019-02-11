function barCluster(agency) {

    let agency_cluster = svgSelection.selectAll(null)
        .data([agency])
        .enter()
        .append("g");


    agency_cluster.append("text")
        .attr("x", 2400 + lhPadding)
        .attr("y", y_index * (minBarThickness + padding) + 5)
        .attr('id', "agency")
        .text((d) => agency.agency_name);

    const agencyLineLength = (y_index * (minBarThickness + padding))

    for (let position in agency["positions"]) {

        let positions_cluster = svgSelection.selectAll(null)
            .data([position])
            .enter()
            .append("g");

        for (let person in agency["positions"][position]){

            const one_person = agency["positions"][position][person];
            staffer_line_xy[one_person.staffer_id] = y_index;
            // console.log(one_person.linkedin_url)

            const start_x = linearScale(one_person.start_date ? new Date(one_person.start_date) : new Date("2017-1-19"));
            const end_x = linearScale(one_person.end_date ? new Date(one_person.end_date) : new Date("2018-10-15"));

            let bars = positions_cluster.selectAll(null)
                .data([one_person])
                .enter()
                .append("g");

            bars.append("a")
                .attr("xlink:href", function(d) {return d.linkedin_url})
                .append("rect")
                .attr("x", start_x + lhPadding)
                .attr("y", y_index * (minBarThickness + padding))
                .attr("height", minBarThickness)
                .attr("width", end_x - start_x)
                .attr("fill", (d, i) => d.staffer_id == 1032 ?
                    "#ff00ff"
                    :
                    start_x == linearScale(new Date("2017-1-19")) ? "#eaeaea" : "#ffccff"
                )
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut);

            bars.on("mouseover", (d, i) => {tooltip.html("<div class=tip><strong><span id=name>" + d.name + "</span></strong><br>"
                + position + " (" + agency["agency_name"] + ") " + "<br><br>" + gradeLevel(d.grade_level) + "<br><br>" + (d.start_date ? d.start_date : "unknown") + " - " + (d.end_date ? d.end_date : "present") + "<br><br>" +
                d.linkedin_url + "</div>"
            );
                tooltip.style("visibility", "visible")
                    .transition()
                    .delay(0)
                    .duration(400)
                    .style("opacity",1);})
                .on("mousemove", (d, i) => {return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                .on("mouseout", (d, i) => {return tooltip.style("visibility", "hidden").transition().delay(0).duration(300).style("opacity",0);})

            staffer_line_xy[one_person.staffer_id] = y_index * (minBarThickness + padding);

            y_index += 1;
        }
        y_index += 1;
    }
    svgSelection.append("line")
        .attr("x1", 2380 + lhPadding) // vertical position on x-axis
        .attr("y1", agencyLineLength)
        .attr("x2", 2380 + lhPadding)
        .attr("y2", y_index);

    y_index += agencyPadding
}