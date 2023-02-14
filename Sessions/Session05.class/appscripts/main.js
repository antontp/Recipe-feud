//source = https://codepen.io/etpinard/pen/XKOOeo
//source = https://codepen.io/plotly/pen/EVrRxR

// e) Declare a variable called counter. And initialize it to 0, in the first few lines of your main.js file, before you define the function. Here is an example of how declaration and initialization can be different steps.
var counter;
counter = 0;



Plotly.plot('graph', [{
    type: 'choropleth',
    locations: ['SGP', 'MYS','THA', 'IDN'],
    z: [10,20, 30,  40]
  }], {
    geo: {
      resolution: 50,
      lataxis: {
        range: [-50, 50]
      }, 
      lonaxis: {
        range: [70, 140]
      }
    },width:700, height:500
  })


//source = https://codepen.io/mmoskorz/pen/maPExb
var ctx = document.getElementById("mybarChart").getContext("2d");

var mybarChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Population'],
    datasets: [{
      label: 'Singapore',
      backgroundColor: "#dcdcdc",
      data: [10]
    }, {
      label: 'Thailand',
      backgroundColor: "#d75d47",
      data: [30]
    }, {
      label: 'Malaysia',
      backgroundColor: "#f5ac7a",
      data: [20]
    }, {
      label: 'Indonesia',
      backgroundColor: "#b20a1c",
      data: [40]
    }]
  },

  options: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        fontColor: "#000080",
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var header = document.getElementById("headerID");

// b) b.	Edit your empty function so that it prints “Hello” to the console.log.
function hello() {
  // console.log("Hello");

  //d)	Now, comment out the command that satisfies Step b. Instead of printing to the console log, edit your function so that it should print “Hello” to the header element
  // header.innerHTML = "Hello";

  // f)	Comment out the command that Satisfies step d. Now, instead of printing “Hello”, your function should now print counter’s value to the header element.
  // header.innerHTML = counter;

  //- Track the number of clicks. It can do this by increasing the value of the counter variable that you set in Step 1e, by 1.
  counter++;
  // - Change the text in the header element to read something like "OK, I have now received X clicks" (where X is the click count). So comment out the command for Step 1f and write a new one to achieve this instead.
  header.innerHTML = "OK, I have now received " + counter + " clicks";
  // - Now make it lie: have it print out 100 times the number of actual clicks it has received.
  header.innerHTML = "OK, I have now received " + (counter*100) + " clicks";
}

// c) c.	Add a function call. Now, how many times will “Hello” be printed to the console?
// hello();
// i.	The answer is “only once,” because the function is executed only when it is called, and it is called only once (only when we load or refresh the page).


// Step 2

//Helper function to set rgb color:
function rgb(val) {
  val = val * 255
  return "rgb(" + val + "," + val + "," + val + ")";
}

var slider = document.getElementById("slider");
function changeSlider() {
  console.log("slider value = " + slider.value);
  header.style.backgroundColor = rgb(slider.value);
}