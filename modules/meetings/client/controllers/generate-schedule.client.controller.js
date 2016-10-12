/* global $:false */
(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('GenerateScheduleController', GenerateScheduleController);

  GenerateScheduleController.$inject = ['$scope', 'MeetingsService', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve', 'Authentication', '$timeout'];

  function GenerateScheduleController($scope, MeetingsService, meeting, facilities, applications, companies, Authentication, $timeout) {
    var vm = this;


    // Examples of variables that are useful;
    vm.day = [{
      name: 'wed',
      date: '',
      startHours: 0,
      endHours: 0
    }, {
      name: 'thur',
      date: '',
      startHours: 0,
      endHours: 0
    }];
    vm.lunchStart = {}; // ??
    vm.lunchEnd = {}; // ??

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

      // Get active Companies
      function isActive(c){ return c.active; }
      vm.activeCompanies = vm.companies.filter(isActive);

      // Get Companies that have student session on wednesdays, sorted by first 
      // those with only wednesday, then by longest meetingLength
      function isWed(c) { return c.wednesday; }
      vm.wedCompanies = vm.activeCompanies.filter(isWed);
      function onlyWedFirstThenMeetingLength(c1, c2) { 
        return (c2.wednesday + c2.thursday) - (c1.wednesday + c1.thursday) || c1.meetingLength - c2.meetingLength; 
      }
      vm.wedCompanies = vm.wedCompanies.sort(onlyWedFirstThenMeetingLength);

      // Get Companies that have student session on thursday, sorted by first 
      // those with only thursday
      function isThur(c) { return c.thursday; }
      vm.thurCompanies = vm.activeCompanies.filter(isThur);
      function onlyThurFirstThenMeetingLength(c1, c2) { 
        return (c2.wednesday + c2.thursday) - (c1.wednesday + c1.thursday) || c1.meetingLength - c2.meetingLength; 
      }
      vm.thurCompanies = vm.thurCompanies.sort(onlyThurFirstThenMeetingLength);

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
        application.wedPeriodList = application.times.filter(isTimesWed).map(timesToPeriodList);
        application.thurPeriodList = application.times.filter(isTimesThur).map(timesToPeriodList);

        // Merge periods that collide. (ex: 540-600 & 600-660 minutes);
        application.wedPeriodList = mergePeriodList(application.wedPeriodList);
        application.thurPeriodList = mergePeriodList(application.thurPeriodList);
      }
      vm.applications.forEach(splitTimesToDayPeriodLists);
    }

    // Deletes all meetings
    vm.deleteAllMeetings = function (){
      function deleteMeeting(m){
        var meeting = MeetingsService.get({ meetingId: m._id }, function() {
          meeting.$delete();
        });
      }
      vm.meetings.forEach(deleteMeeting);
      vm.meetings = [];
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
      return { start: start, end: start + 60 };
    }
    function isTimesWed(t) { return t.day === 'wed'; }
    function isTimesThur(t) { return t.day === 'thur'; }

    
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
        return period.start <= start && period.end >= end ? 1 : -1;
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
          }
          if(newPeriod2.start !== newPeriod2.end){
            periodList.push(newPeriod2);
            periodList = periodList.sort(sortByStart);
          }
        }
      } 
      periodList.forEach(addPauseToPeriod);
    }

    // Book meeting
    function bookMeeting(student, company, start, end, day){
      // Create meeting-object.
      var startTime = Math.floor(start / 60) + ':' + start % 60;
      var endTime = Math.floor(end / 60) + ':' + end % 60;
      var newMeeting = {
        student: {
          id: student._id,
          name: student.name
        },
        company: {
          id: company._id,
          name: company.name
        },
        facilities: company.facility,
        startTime: startTime,
        endTime: endTime,
        day: day
      };
      MeetingsService.post(newMeeting);

      // Remove period from Student.
      function bookPeriod(a){
        if(a._id === student._id){
          addPause(a.periodList, start, end);
        }
      }
      vm.applications.forEach(removeCompany);

      // Remove company from the students list.
      function removeCompany(a){
        function filterIsNotCompany(c){ return c._id !== company._id; }
        if(a._id === student._id){
          a.companies = a.companies.filter(filterIsNotCompany);
        }
      }
      vm.applications.forEach(removeCompany);

      // Remove student from the companies list.
      function notBooked(s){ return s._id === student._id; }
      company.chosenStudents = company.chosenStudents.filter(notBooked);
    }


    // Generate Schedule - This is where the magic happens
    // ===================================================
    function generateSchedule(companies, applications, startTime, timeLeftAvailableToday, day, counter){
      if(companies.length === 0){
        vm.schedulingSuccess = true;
        return; // Do nothing
      }

      // Add startTime as currentTime to all companies.
      function addStartTime(company){ company.currentTime = startTime; }
      // Only first time
      if(startTime >= 0){
        companies.forEach(addStartTime);
      }

      // For each company, book a student from applications.
      function bookStudent(company){
        // Set start and end
        var start = company.currentTime;
        var end = start + company.meetingLength;

        // Get latest application data from applicationList
        function mapIdToApplication(id){
          function idMatch (a) { return a._id === id; }
          var appl = applications.filter(idMatch)[0];
          // Set timeleft available today.
          appl.timeLeft = timeLeftAvailableToday(appl, company.currentTime);
        }
        company.students = company.chosenStudents.map(mapIdToApplication);

        // Sort company.students by timeLeft
        function sortByTimeLeft(a1, a2){
          return a1.timeLeft < a2.timeLeft;
        }
        company.students.sort(sortByTimeLeft);

        function bookIfAvailable(students, start, end){
          if(students.length === 0){
            return null; // Do nothing.
          }
          var isFree = isAvailable(students[0].periodList, start, end);
          if(isFree){
            bookMeeting(students[0], company, start, end, day);
            return students[0];
          } else {
            return bookIfAvailable(students.slice(1), start, end);
          }
        }
        var bookedStudent = bookIfAvailable(company.students, start, end);
      }
      companies.forEach(bookStudent);

      // TODO: Implement.
      // Filter only companies with students left.
      function hasStudentsLeft(company){ return company.chosenStudents.length > 0; }
      companies.filter(hasStudentsLeft);

      // Filter only applications with companies left.
      function hasCompaniesLeft(student){ return student.companies.length > 0; }
      companies.filter(hasCompaniesLeft);

      if(counter > 0){
      // Recursive call. Continue until no companies are left.
        generateSchedule(companies, applications, -1, timeLeftAvailableToday, day, counter--);
      } else {
        var err = 'ERROR, not able to generate schedule.';
        vm.schedulingSuccess = false;
        $scope.error = err;
        console.log(err);
      }
    }

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
    function generateWednesdaySchedule(){
      // TODO: implement
      function setPeriodListForWed(application){
        application.periodList = application.wedPeriodList;
      }
      var wedApplications = vm.applications.forEach(setPeriodListForWed);
      generateSchedule(vm.wedCompanies, vm.applications, 9 * 60, timeLeftAvailableWednesday, 'wed', vm.wedCompanies.length * 2); // Get time from setting?
    }
    function generateThursdaySchedule(){
      function setPeriodListForThur(application){
        application.periodList = application.thurPeriodList;
      }
      var thurApplications = vm.applications.forEach(setPeriodListForThur);
      generateSchedule(vm.thurCompanies, vm.applications, 10 * 60, timeLeftAvailableThursday, 'thur', vm.thurCompanies.length * 2); // Get time from setting?
    }

    function generateBothSchedule(){
      fixLists();
      generateWednesdaySchedule();
      generateThursdaySchedule();
      if(!vm.schedulingSuccess){
        fixLists();
        generateThursdaySchedule();
        generateWednesdaySchedule();
      }
    }
    $scope.generateSchedule = generateBothSchedule;

  }
})();
