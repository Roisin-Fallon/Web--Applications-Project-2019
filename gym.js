//This section of the javascript file is used for the charts on the Gym Stats page, it sets the x and y axis height and width for the chart. It also appends the svg object to the html page - stats.html

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("gymstats.csv", function(data) {

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.Country; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 13000])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.Country); })
    .attr("y", function(d) { return y(d.Value); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.Value); })
    .attr("fill", "#69b3a2")

})


// This function is called by the buttons on top of the plot
function changeColor(color){
  d3.selectAll("rect")
    .transition()
    .duration(2000)
    .style("fill", color)
}

function graphs(){
 GraphFromData("#GraphA", "Reasons to go to the Gym");
}
function GraphFromData(myDiv, title){ 
	console.log('Barchart');
	
  // Code Source:  https://stackoverflow.com/a/52607019
  // Create an array to pass into function
  key=['Reduce Stress','Socialise','Fun','Weight Loss','General Health','Event Training'];
  // create an array of values to pass into the fnction call.
  array=[31,12,7,18,30,2];
  // Empty array generated so the 
  data = [];
  //loop throught the arrayss and create json object array 
  for (i = 0; i < key.length; i++) {
    data[i]={"tag":key[i],"val":array[i]};
  }
  
  //call thefunction
  drawGraph(myDiv, data,title);
}

function drawGraph(myDiv, data, title){
  
  tag=[]; // Array for graph labels 
  array=[]; // Array for data in function
 
 // For loop is used to loop through data object
  for (var i = 0, l = data.length; i < l; i++) {
    var obj = data[i];
    tag.push(obj.tag);
    array.push(obj.val);
  }

  // Values for the bar chart
  var height = document.getElementById('chartHeight').value;	// Height can be picked by the user
  var width = 600;
  var dataCount = array.length; 			                       // Calculates the number of blocks i.e. 6 in this code
  var gap = 3;							                      //Gap between bars
  var chartColor = document.getElementById('colorPicker').value;    // Color will be piccked by the user
  var graphTitle=title; 
  // create a scale for y
  // D3 method looks at the dataset to find the highest value in the array
  var yScale = d3.scaleLinear()
	.domain([0,d3.max(array)])
	.range([height,0]);
  
  // Create a scale for x
  // Allows us to space out different categorises in a bar chart. 
  // Thus it allows the names e.g. FUN to sit under the rectangle it belongs to
  var xScale = d3.scaleBand()																
	.domain(tag).range([0, width])
  
  // Create y Axis
  var yAxis = d3.axisLeft()						  // This will be shown on the left of the graph
    .scale(yScale)								 // Specify the scale in this case the x scale
	
  // Create x Axis
  var xAxis = d3.axisBottom()					// This will be shown on the bottom of the graph
    .scale(xScale);							   // Specify the scale in this case the x scale
 
  //removes previous svg code the svg container
  d3.select(myDiv).selectAll("*").remove();

  // svgContainer created that is appending a svg tag with the data in the array
  let svgContainer = d3.select(myDiv).append("svg")
    .attr("height", 1000)
    .attr("width", 1000);
 
  // Used to add rectangels based on the value in the array. Use a selectAll and create an 
  //association with the data in the array
  let myRectangle = svgContainer.selectAll('rect')
    .data(array);
 
// Add attributes to the rectangle 

  myRectangle.enter()
    .append("rect")
      .attr("x",function(d,i){							
          return (50+(i*(width/dataCount))); 
        })
      .attr("y",function(d){
          return yScale(d);  		//Specify the attribute for y and the height of the rectangle
        })
      .attr("width",(width/dataCount - gap)) // calculate bar width leaving gaps
      .attr("height",function(d){
          return height-yScale(d); // calculate bar height bottom up, so gap at top really
        })
      .attr("fill", chartColor);                        // Fill the color of the chart based on the user input
		
  
  // Position the axis - allow us to see the line and numbers
  // By setting the graph to 45 it will give a specified gap between axis
  svgContainer.append("g")
   .attr("transform", "translate(45,0)")				  // Moves 45 pixels from the top
   .call(yAxis);										 // call the axis created
   
  
  svgContainer.append("g")
    .attr("transform", "translate(50," +height+")") // Move the element 50 pixels from the left
    .call(xAxis)								  // call the axis creaated
    .selectAll("text")							 // This will apply to all elements on the x-axis
    .attr("transform")			// Slants the writing on the x-axi
    .attr("text-anchor", "start")			   // Align text to beginning of the x-axis
    .attr("x", "9")							  // Nudge to ensure names appear in the correct position
    .attr("y", "3")
	.text("% of Participants asked")
	.style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '3px'});
	
	
	// Add title to the graph
  svgContainer.append("text")
        .attr("x", (50+(width/2)-(graphTitle.length)/2))
        .attr("y", 16)
        .attr("text-anchor", "middle") 
        .style("font-size", "14px")
        .style("text-decoration", "underline") 
        .text(graphTitle);		
}


// This section of javascript is the validation used on the contact form on the contact.html page, it will check for empty values on some fields and check others to ensure number e.g. Zip is NaN or empty - will it will focus back in that field and request correct information. 

//Once all fields are populated correctly using the validation below a pop up will advise - "Submitted". You then have the option to reset the form or navigate to another page.

      function validate() {
      
         if( document.myForm.Name.value == "" ) {
            alert( "Please provide your name!" );
            document.myForm.Name.focus() ;
            return false;
         }
         if( document.myForm.EMail.value == "" ) {
            alert( "Please provide your Email!" );
            document.myForm.EMail.focus() ;
            return false;
         }
         if( document.myForm.Zip.value == "" || isNaN( document.myForm.Zip.value ) ||
            document.myForm.Zip.value.length != 5 ) {
            
            alert( "Please provide a zip in the format #####." );
            document.myForm.Zip.focus() ;
            return false;
         }
         if( document.myForm.Country.value == "-1" ) {
            alert( "Please provide your country!" );
            return false;
         }
		 
		  if( document.myForm.question.value == "" ) {
            alert( "Please ask your question!" );
            document.myForm.Name.focus() ;
            return false;
         }
		 
         return( true );
		 
	  }


//This section of javascript validates the input on the login form and ensures the password includes a capital, lowercase, number and a specific length. Once a successfully login is received, you will be automatically redirected to the homepage.

var myInput = document.getElementById("psw");
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
myInput.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) { 
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
}

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) { 
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) { 
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}