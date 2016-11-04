/* global $:false */
(function () {
  'use strict';

  angular
    .module('companies')
    .controller('GeneratePreliminaryController', GeneratePreliminaryController);

  GeneratePreliminaryController.$inject = ['$scope', 'listApplicationsResolve', 'listCompaniesResolve', 'CompaniesService'];

  function GeneratePreliminaryController($scope, applications, companies, CompaniesService) {
    var vm = this;

    // Init lists.
    vm.rawApplications = applications;
    vm.rawCompanies = companies;
    vm.applications = [];
    vm.companies = [];
    vm.wedCompanies = [];
    vm.thurCompanies = [];
    // Fix lists.
    function fixLists(){
      vm.deleteAllMeetings();
      vm.applications = vm.rawApplications;
      vm.companies = vm.rawCompanies;

      // Fix company lists.

      // Remove old meetings that arent fixed
      vm.companies.forEach(rmNotFixedMeetings);
      function rmNotFixedMeetings(c){
        c.meetings = c.meetings.filter(fixed);
        function fixed(m){ return m.fixed; }
      }

      // Foreach fixed meeting, book 'em
      vm.companies.forEach(fixedMeetings);
      function fixedMeetings(c){
        c.meetings.forEach(bookFixed);
        function bookFixed(m){
          var start = timeStrToInt(m.startTime);
          var end = timeStrToInt(m.endTime);

          // Remove period from Student.
          function bookPeriod(a){
            if(a._id === m.student.id){
              addPause(a.periodList, start, end);
            }
          }
          vm.applications.forEach(bookPeriod);
          // Remove company from the students list.

          function removeCompany(a){
            function filterIsNotCompany(c){ return c._id !== c._id; }
            if(a._id === m.student.id){
              a.companies = a.companies.filter(filterIsNotCompany);
            }
          }
          vm.applications.forEach(removeCompany);

          // Remove student from the companies list.
          function notBooked(s){ 
            return s !== m.student.id; 
          }
          c.chosenStudents = c.chosenStudents.filter(notBooked);
        }
      }


      // Get Companies that have student session on wednesdays, sorted by first 
      // those with only wednesday, then by longest meetingLength
      function isWed(c) { return c.wednesday && c.wednesday.hasMeetings; }
      vm.wedCompanies = vm.companies.filter(isWed);
      function onlyWedFirstThenMeetingLength(c1, c2) { 
        return (c2.wednesday.hasMeetings + c2.thursday.hasMeetings) - (c1.wednesday.hasMeetings + c1.thursday.hasMeetings) || c1.wednesday.meetingLength - c2.wednesday.meetingLength; 
      }
      vm.wedCompanies = vm.wedCompanies.sort(onlyWedFirstThenMeetingLength);

      // Get Companies that have student session on thursday, sorted by first 
      // those with only thursday
      function isThur(c) { return c.thursday && c.thursday.hasMeetings; }
      vm.thurCompanies = vm.companies.filter(isThur);
      function onlyThurFirstThenMeetingLength(c1, c2) { 
        return (c2.wednesday.hasMeetings + c2.thursday.hasMeetings) - (c1.wednesday.hasMeetings + c1.thursday.hasMeetings) || c1.thursday.meetingLength - c2.thursday.meetingLength; 
      }
      vm.thurCompanies = vm.thurCompanies.sort(onlyThurFirstThenMeetingLength);

      // Fix applications lists.
      // Remove students choice of company if choice not mutual.
      function removeNonMutualChoice(application){
        function companiesWhomLikeMe(company){
          // Get company by Name
          function filterOnCompanyName(c){ return c.name === company.name; } 
          var comp1 = vm.companies.filter(filterOnCompanyName)[0];
          // Has company selected this application? 
          function likesMe(student){ return student === application._id; }
          return comp1.chosenStudents.filter(likesMe).length > 0;
        }
        application.companies = application.companies.filter(companiesWhomLikeMe);
      }
      vm.applications.forEach(removeNonMutualChoice);

      function splitTimesToDayPeriodLists(application){
        application.wedPeriodList = application.times.filter(isTimesWed).map(timesToPeriodList)[0];
        application.thurPeriodList = application.times.filter(isTimesThur).map(timesToPeriodList)[0];

        // Merge periods that collide. (ex: 540-600 & 600-660 minutes);
        application.wedPeriodList = mergePeriodList(application.wedPeriodList);
        application.thurPeriodList = mergePeriodList(application.thurPeriodList);
      }
      vm.applications.forEach(splitTimesToDayPeriodLists);
    }

    // Deletes all meetings
    vm.deleteAllMeetings = function (){
      vm.wedCompanies.forEach(removeMeetings);
      vm.thurCompanies.forEach(removeMeetings);
      function removeMeetings(c){
        c.meetings.filter(notFixed);
        function notFixed(m){ return m.fixed; }
      }
    };
    

    // Create periodList on each Application.
    // Sort PeriodList timewise
    function sortByStart(period1, period2){ return period1.start > period2.start; }

    // Merge colliding periods in list
    function mergePeriodList(periodList){
      periodList = periodList.sort(sortByStart);
      var newList = [];
      // Check if endtime <= any other starttime
      function endTimeCollidesWithStartTime(period1, index1){
        // Get all periods that collide
        function filterStartBeforeTime(period){ return period.start <= period1.end; }
        var collidingPeriods = periodList.filter(filterStartBeforeTime);
        // Nbr colliding periods
        var nbrCollidingPeriods = collidingPeriods.length;
        if(nbrCollidingPeriods > 0){ // Merge periods in a new one
          newList.push({ start: period1.start, end: collidingPeriods[nbrCollidingPeriods-1].end });
        } else { // No collision, just push.
          newList.push(period1);
        }
      }
      periodList.forEach(endTimeCollidesWithStartTime);
      // Update periodlist with merged.
      return newList;
    }
    // Create a period (in minutes) from a time-object.
    function timesToPeriodList(times) {
      var start = times.hour * 60;
      function toInt(h){ 
        var obj = { start: h * 60, end: h * 60 + 60 }; 
        return obj;
      }
      return times.hour.map(toInt);
    }
    function isTimesWed(t) { return t.day === 'wed'; }
    function isTimesThur(t) { return t.day === 'thur'; }

    // Time Str / int conversion
    function timeIntToStr(time){
      var hour = Math.floor(time / 60);
      if(hour < 10){
        hour = '0' + hour;
      }
      var minute = time % 60;
      if(minute < 10){
        minute = '0' + minute;
      }
      var t = hour + ':' + minute;
      return t;
    }
    function timeStrToInt(time){
      var time_hm = time.split(':');
      var timeStr = (+time_hm[0]) * 60 + (+time_hm[1]);
      return timeStr;
    }
    
    // Calculate time left the student is available 
    // from currentTime and forward.
    function timeLeftToday(application, currentTime, day){
      // Reduce function, checks against currentTime.
      function sumTimeLeft(previousValue, period){
        var diff = period.end - Math.max(period.start, currentTime);
        return previousValue + Math.max(0, diff);
      }
      if(day === 'wed'){
        return application.wedPeriodList.reduce(sumTimeLeft, 0);
      } else {
        return application.thurPeriodList.reduce(sumTimeLeft, 0);
      }
    }
    function timeLeftAvailableWednesday(application, currentTime){
      return timeLeftToday(application, currentTime, 'wed');
    }
    function timeLeftAvailableThursday(application, currentTime){
      return timeLeftToday(application, currentTime, 'thur');
    }

    // Check if periodList contains given period.
    function isAvailable(periodList, start, end){
      function isStartEndWithinPeriod(period){
        return period.start <= start && period.end >= end;
      } 
      return periodList.filter(isStartEndWithinPeriod).length > 0;
    }


    // Iterate periodList and add pause to colliding period
    function addPause(periodList, start, end){
      function addPauseToPeriod(period){
        if(period.start <= start && period.end >= end){
          var newPeriod1 = { start: period.start, end: start };
          var newPeriod2 = { start: end, end: period.end };
          if(newPeriod1.start !== newPeriod1.end){
            period = newPeriod1;
            if(newPeriod2.start !== newPeriod2.end){
              periodList.push(newPeriod2);
              periodList = periodList.sort(sortByStart);
            }
          } else {
            period.start = end;
          }
        }
      } 
      periodList.forEach(addPauseToPeriod);
    }

    // Book meeting
    function bookMeeting(student, company, start, end, day, forced){
      // Create meeting-object.
      var startString = timeIntToStr(start);
      var endString = timeIntToStr(end);

      var newMeeting = {
        student: {
          id: student._id,
          name: student.name
        },
        startTime: startString,
        endTime: endString,
        day: day,
        forced: forced,
        fixed: false
      };
      company.meetings.push(newMeeting);

      // Remove period from Student.
      function bookPeriod(a){
        if(a._id === student._id){
          addPause(a.periodList, start, end);
        }
      }
      vm.applications.forEach(bookPeriod);
      // Remove company from the students list.

      function removeCompany(a){
        function filterIsNotCompany(c){ return c._id !== company._id; }
        if(a._id === student._id){
          a.companies = a.companies.filter(filterIsNotCompany);
        }
      }
      vm.applications.forEach(removeCompany);

      // Remove student from the companies list.
      function notBooked(s){ 
        return s !== student._id; 
      }
      company.chosenStudents = company.chosenStudents.filter(notBooked);
    }


    // Generate Schedule - This is where the magic happens
    // ===================================================
    function generateSchedule(companies, applications, timeLeftAvailableToday, day, counter){
      // Filter only companies with students left.
      function hasStudentsLeft(company){ return company.chosenStudents.length > 0 && !company.isDone; }
      var companiesLeft = companies.filter(hasStudentsLeft);
      function resetCompany(c){ 
        c.currentTime = null; 
        c.isDone = false; 
      }
      if(companiesLeft.length === 0){
        vm.schedulingSuccess = true;
        companies.forEach(resetCompany);
        return companies;
      }

      // For each company, book a student from applications.
      function bookStudent(company){
        if(company.chosenStudents.length === 0 || company.isDone){
          return; // Do nothing
        }

        // Assign company.day to correct day (if wed/thur).
        company.day = day === 'wed' ? company.wednesday : company.thursday;

        // If first iteration, set currentTime.
        if(!company.currentTime){
          company.currentTime = company.day.starttime;
        }

        var startString = company.currentTime;
        var startInt = timeStrToInt(startString);
        var endInt = startInt + company.day.meetingLength;
      

        // If collide with lunch, move start to lunchEnd
        var start_hm = company.day.lunchstart.split(':');
        var end_hm = company.day.lunchend.split(':');
        var lunchStart = timeStrToInt(company.day.lunchstart);
        var lunchEnd = timeStrToInt(company.day.lunchend);

        if(startInt >= lunchStart && startInt < lunchEnd && endInt >= lunchStart && endInt < lunchEnd){
          startInt = lunchEnd;
          endInt = startInt + company.day.meetingLength;
        }
        company.currentTime = timeIntToStr(endInt);
 
        // Check that start isnt after this days endtime
        var day_endtime = timeStrToInt(company.day.endtime);
        if(startInt >= day_endtime){
          company.isDone = true;
          return;
        }

        // Get latest application data from applicationList
        function mapIdToApplication(id){
          function idMatch (a) { return a._id === id; }
          var appl = applications.filter(idMatch)[0];
          // Set timeleft available today.
          appl.timeLeft = timeLeftAvailableToday(appl, startInt);
          return appl;
        }
        company.students = company.chosenStudents.map(mapIdToApplication);

        // Sort company.students by timeLeft
        function sortByTimeLeft(a1, a2){
          return a1.timeLeft > a2.timeLeft;
        }
        company.students.sort(sortByTimeLeft);

        function bookIfAvailable(students, start, end){
          if(students.length === 0){
            return null; // Do nothing.
          }
          var isFree = isAvailable(students[0].periodList, start, end);
          if(isFree){
            bookMeeting(students[0], company, start, end, day, false);
            return students[0];
          } else {
            return bookIfAvailable(students.slice(1), start, end);
          }
        }
        var bookedStudent = bookIfAvailable(company.students, startInt, endInt);
       
        // Check if no student booked, then book student with least time available. 
        if(bookedStudent === null){
          bookMeeting(company.students[0], company, startInt, endInt, day, true);
        }
      }
      companies.forEach(bookStudent);

      // Booking done, prepare next iteration      

      // Filter only applications with companies left.
      function hasCompaniesLeft(a){ return a.companies.length > 0; }
      applications.filter(hasCompaniesLeft);

      if(counter > 0){
        // Recursive call. Continue until no companies are left.
        counter--;
        return generateSchedule(companies, applications, timeLeftAvailableToday, day, counter);
      } else {
        companies.forEach(resetCompany);
        return companies;
      }
    }

    function generateWednesdaySchedule(){
      function setPeriodListForWed(application){
        application.periodList = application.wedPeriodList;
      }
      var wedApplications = vm.applications.forEach(setPeriodListForWed);
      return generateSchedule(vm.wedCompanies, vm.applications, timeLeftAvailableWednesday, 'wed', vm.applications.length * 2); // Get time from setting?
    }
    function generateThursdaySchedule(wedCompanies){
      function setPeriodListForThur(application){
        application.periodList = application.thurPeriodList;
      }
      var thurApplications = vm.applications.forEach(setPeriodListForThur);

      // Update list with information from wednesdaylist
      vm.thurCompanies.forEach(updateToWedList);
      function updateToWedList(c){
        var wedC = wedCompanies.filter(isSame)[0];
        function isSame(comp){ return c._id === comp._id; }
        if(wedC){
          c.chosenStudents = wedC.chosenStudents;
          c.meetings = wedC.meetings;
        }
      }
      wedCompanies.forEach(addToThur);
      function addToThur(wedC){
        var newCompany = vm.thurCompanies.filter(isSame).length === 0;
        function isSame(comp){ return wedC._id === comp._id; }
        
        if(newCompany){
          vm.thurCompanies.push(wedC);
        }
      }


      return generateSchedule(vm.thurCompanies, vm.applications, timeLeftAvailableThursday, 'thur', vm.applications.length * 2); // Get time from setting?
    }

    function generateBothSchedule(){
      fixLists();
      var wedCompanies = generateWednesdaySchedule();
      var thurCompanies = generateThursdaySchedule(wedCompanies);
      $scope.completeComp = thurCompanies;
      var a = 1;
    }
    $scope.generateSchedule = generateBothSchedule;

    // Save all companies to the server.
    $scope.saveSchedule = function(){
      var size = $scope.completeComp.length;
      var count = size;
      $scope.completeComp.forEach(saveCompany);
      function saveCompany(c){
        console.log('Saving Company');
        var company = CompaniesService.get({ companyId: c._id }, function (){
          company.meetings = c.meetings;
          company.$save();
          count--;
          if(count <= 0){
            vm.message = 'Done saving ' + size + ' companies';
          } else {
            vm.message = count + ' companies left to save';
          }
        });
      }
    };
  }
})();

/*
   Ta bort studentens valda företag som inte vill träffa studenten.
   För varje gång ett företag bokat möte med studenten, ta bort företaget
   från studentens lista. När ett möte är bokat och studenten inte har fler
   företag att träffa, ta bort studenten från applicationsList.


// Gör om alla tider till antal minuter sen kl 00:00... 
Gör om studentens tillgängliga tider till perioder. Ex: 9-12 istället för 9,10,
11,12. Och helst då i minuter (ex: 540 - 720)

Ha en funktion för att dela upp en period i två, där man anger början och slut
av "pausen"

Skriv en funktion där man om man anger: application, tid i minut och dag
så ska man få ut antal minuter kvar studenter är tillgänglig den dagen. (alltså
från tid i minut till dagens slut.)


Börja med företagen för dag ett. Iterera igenom dem, där företag som enbart
har kontaktsamtal dag ett är först i listan, annars random, eller kanske
först de företag som har längst möten? Så att de små sedan kan fylla i hålen?. 

ForEach företag:
Bland studenterFöretagetVillTräffa sortera efter studenter med minst antal minuter
som den är tillgänglig den dagen. Ta första studenten som är tillgänglig att
ses på currentTime. Boka in den studenten på ett möte från currentTime till
currentTime + företagets meetingLength. Efter det addera meetingLength på
currentTime.
Efter varje iteration,
ta bort företag som inte har studenter kvar de vill träffa, iterera tills 
listan av företag är tom.


*/
