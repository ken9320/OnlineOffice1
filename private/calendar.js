let Cal = function(divId) {
  //Store div id
  this.divId = divId;
  // Days of week, starting on Sunday
  this.DaysOfWeek = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];
  // Months, stating on January
  this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  // Set the current month, year
  let d = new Date();
  this.currMonth = d.getMonth();
  this.currYear = d.getFullYear();
  this.currDay = d.getDate();
 
};
// Goes to next month
Cal.prototype.nextMonth = function() {
  if ( this.currMonth == 11 ) {
    this.currMonth = 0;
    this.currYear = this.currYear + 1;
  }
  else {
    this.currMonth = this.currMonth + 1;
  }
  this.showcurr();
};
// Goes to previous month
Cal.prototype.previousMonth = function() {
  if ( this.currMonth == 0 ) {
    this.currMonth = 11;
    this.currYear = this.currYear - 1;
  }
  else {
    this.currMonth = this.currMonth - 1;
  }
  this.showcurr();
};
// Show current month
Cal.prototype.showcurr = function() {
  this.showMonth(this.currYear, this.currMonth);
};
// Show month (year, month)
Cal.prototype.showMonth = function(y, m) {
  let d = new Date()
  // First day of the week in the selected month
  , firstDayOfMonth = new Date(y, m, 1).getDay()
  // Last day of the selected month
  , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
  // Last day of the previous month
  , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();
  let html = '<table>';
  // Write selected month and year
  html += '<thead><tr>';
  html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
  html += '</tr></thead>';
  // Write the header of the days of the week
  html += '<tr class="days">';
  for(let i=0; i < this.DaysOfWeek.length;i++) {
    html += '<td>' + this.DaysOfWeek[i] + '</td>';
  }
  html += '</tr>';
 
  // Write the days
  let i=1;
  do {
    let dow = new Date(y, m, i).getDay();
    // If Sunday, start new row
    if ( dow == 0 ) {
      html += '<tr>';
    }
    // If not Sunday but first day of the month
    // it will write the last days from the previous month
    else if ( i == 1 ) {
      html += '<tr>';
      let k = lastDayOfLastMonth - firstDayOfMonth+1;
      for(let j=0; j < firstDayOfMonth; j++) {
        html += `<td data-id="${k}" class="not-current">${k}</td>`;
        k++;
      }
    }
    // Write the current day in the loop
    let chk = new Date();
    let chkY = chk.getFullYear();
    let chkM = chk.getMonth();
    if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
      html += `<td id="${i}" class="today">${i}</td>`;
    } else {
      html += `<td id="${i}" class="normal">${i}</td>`;
    }
    // If Saturday, closes the row
    if ( dow == 6 ) {
      html += '</tr>';
    }
    // If not Saturday, but last day of the selected month
    // it will write the next few days from the next month
    else if ( i == lastDateOfMonth ) {
      let k=1;
      for(dow; dow < 6; dow++) {
        html += `<td data-id="${k}" class="not-current">${k}</td>`;
        k++;
      }
    }
    i++;
  }while(i <= lastDateOfMonth);
  // Closes table
  html += '</table>';
  // Write HTML to the div
  document.getElementById(this.divId).innerHTML = html;
};
// On Load of the window
window.onload = function() {
  // Start calendar
  let c = new Cal("divCal");			
  c.showcurr();
  // Bind next and previous button clicks
  // getId('btnNext').onclick = function() {
  //   c.nextMonth();
  // };
  document.querySelector('#btnNext').addEventListener('click', function() {
    c.nextMonth();
  });
  // getId('btnPrev').onclick = function() {
  //   c.previousMonth();
  // };
  document.querySelector('#btnPrev').addEventListener('click', function() {
    c.previousMonth();
  });
}
// Get element by id
function getId(id) {
  return document.getElementById(id);
}

  document.querySelector("#date").innerHTML = `${new Date().getDate()} / ${new Date().getMonth()+1}`;

  const cal = document.querySelector("divCal");
  const table = document.querySelector("table");
  const tbody = document.querySelector("tbody");
  const tr = document.querySelector("tr");
  const td = document.querySelector("td");
  
  cal.addEventListener("click", function(e) {
    console.log('table click')
  },true);
  table.addEventListener("click", function(e) {
    console.log('table click')
  },true);
  tbody.addEventListener("click", function(e) {
    console.log('tbody click')
  },true);
  tr.addEventListener("click", function(e) {
    console.log('tr click')
  },true);
  td.addEventListener("click", function(e) {
    console.log('td click')
  },true);


  // const dates = document.querySelectorAll("td")
  // for(const date of dates){
  //   date.addEventListener("click", function () {
  //     document.querySelector("#date").innerHTML = `${i}/${chkM}`
  //   });
  // }