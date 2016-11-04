/*global $:false */
(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompaniesTimeController', CompaniesTimeController);

  CompaniesTimeController.$inject = ['CompaniesService', '$scope', 'ApplicationsService'];

  function CompaniesTimeController(CompaniesService, $scope, ApplicationsService) {
    var vm = this;

    $scope.chosenStudents = [];
    
    // Get Companies
    vm.companies = CompaniesService.query(function(data) {
      function sortName(c1, c2){ return c1.name > c2.name ? 1 : -1; }
      vm.companies = data.sort(sortName);
      angular.forEach(vm.companies, function(company, key) {
        company.weOffer = company.weOffer || '';
        company.language = company.language || '';
      });
    });
    // Get Applications
    vm.applications = ApplicationsService.query(function(data){
      vm.applications = data;
    });
    function prettify(str){
      return str.replace(/[ÅÄÖåäöøé\/ÉüÜ ]/g, '');
    }

    // Set Chosen Students
    function getChosenStudents(company){
      function hasSelectedCompany(a){
        return a.companies.filter(function(c){ 
          return prettify(c.name) === prettify(company.name); 
        }).length > 0;
      }
      function setIsChosen(a){
        a.isChosen = company.chosenStudents.filter(function (c){ return c === a._id; }).length > 0;
      }
      var applications = vm.applications.filter(hasSelectedCompany);
      applications.forEach(setIsChosen);
      function byChosenAndName(s1, s2){ return (s2.isChosen - s1.isChosen) || (s1.name > s2.name ? 1 : -1); }
      applications.sort(byChosenAndName);
      applications.forEach(splitTimesToDayPeriodLists);
      return applications;
    }

    // Generate meetings
    function generateMeetings(company){
      var wed = company.wednesday;
      var thur = company.thursday;

      if(wed.hasMeetings){
        addWedMeetings(company, wed);   
      }
      if(thur.hasMeetings){
        addThurMeetings(company, thur);   
      }
    }
    function addWedMeetings(company, wed){
      var start = timeStrToInt(wed.starttime);
      company.wedMeetings = [];
      addMeetingIterator(start, wed, company, company.wedMeetings, 'wed');
    }
    function addThurMeetings(company, thur){
      var start = timeStrToInt(thur.starttime);
      company.thurMeetings = [];
      addMeetingIterator(start, thur, company, company.thurMeetings, 'thur');
    }
    function addMeetingIterator(start, day, company, list, dayStr){
      var dayEnd = timeStrToInt(day.endtime);
      var lunchstart = timeStrToInt(day.lunchstart);
      var lunchend = timeStrToInt(day.lunchend);
      if(start >= dayEnd){
        return;
      }
      var end = start + day.meetingLength;
      if(start >= lunchstart && start < lunchend && end >= lunchstart && end < lunchend){
        start = lunchend;
        end = start + day.meetingLength;
      }

      var m = company.meetings.filter(sameStartnDay);
      function sameStartnDay(m){ return m.startTime === timeIntToStr(start) && m.day === dayStr; }
      var hasMeeting = m.length > 0;
      if(!hasMeeting){
        list.push({ startTime: timeIntToStr(start), endTime: timeIntToStr(end), day: dayStr });
      } else {
        list.push(m[0]);
      }
      addMeetingIterator(end, day, company, list, dayStr);
    }

    // View Company
    $scope.viewCompany = function(company) {
      // Select only this company
      $scope.chosenStudents.forEach(unselect);
      unSelectAllMeetings(company);
      $scope.meeting = undefined;
      vm.companies.forEach(unselect);
      function unselect(c){ c.selected = false; }
      company.selected = true;
      
      $scope.company = company; // Company is the selected one.
      $scope.chosenStudents = getChosenStudents(company);
      generateMeetings(company);
      $scope.message = undefined;
    };

    // Update Company
    vm.updateCompany = function(){
      // Update DB.
      function saveCompany(company){
        var comp = CompaniesService.get({ companyId: company._id }, function() {
          comp = company;
          comp.$save();
          $scope.message = 'Saved company';
        });
      }
      saveCompany($scope.company);
    };

    function unselect(s){ s.selected = false; }
    // Select Student
    $scope.selectStudent = function(student){
      // Select only this company
      $scope.chosenStudents.forEach(unselect);
      student.selected = true;

      $scope.company.meetings.forEach(isSameStudent);
      function isSameStudent(m){ m.isSelectedStudent = (m.student.id === student._id); }


      student.wedPeriodList = student.times.filter(isTimesWed).map(timesToPeriodList)[0];
      student.thurPeriodList = student.times.filter(isTimesThur).map(timesToPeriodList)[0];
      // Merge periods that collide. (ex: 540-600 & 600-660 minutes);
      student.wedPeriodList = mergePeriodList(student.wedPeriodList);
      student.thurPeriodList = mergePeriodList(student.thurPeriodList);

      if($scope.company.wednesday.hasMeetings){
        $scope.company.wedMeetings.forEach(isStudentAvailableWed);
      }
      function isStudentAvailableWed(m){
        m.available = isAvailable(student.wedPeriodList, timeStrToInt(m.startTime), timeStrToInt(m.endTime));
      }
      if($scope.company.thursday.hasMeetings){
        $scope.company.thurMeetings.forEach(isStudentAvailableThur);
      }
      function isStudentAvailableThur(m){
        m.available = isAvailable(student.thurPeriodList, timeStrToInt(m.startTime), timeStrToInt(m.endTime));
      }
    };

    function unSelectAllMeetings(company){
      if(company.wednesday.hasMeetings && company.wedMeetings){
        company.wedMeetings.forEach(unselect);
      }
      if(company.thursday.hasMeetings && company.thurMeetings){
        company.thurMeetings.forEach(unselect);
      }
    }

    // Select Meeting
    $scope.selectMeeting = function(company, meeting){
      // Select only this company
      unSelectAllMeetings(company);
      function unselect(s){ s.selected = false; }
      meeting.selected = true;

      if(meeting.student){
        var stuList = $scope.chosenStudents.filter(function(s){ return s._id === meeting.student.id; });
        if(stuList.length > 0){
          vm.studentToAdd = stuList[0];
        }
      }
      $scope.meeting = meeting;
    };

    // Update Meeting
    $scope.updateMeeting = function(){
      alert('not yet implemented');
    };





    // Time int/string conversion
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
















    // PeriodList Code
    // For handling everything with periods on a application. A period is a
    // time span with a start and end, both as int's. The int refer to minute
    // in the day. 540 is for example 09:00. (9 * 60 minutes)
    // =====================================================
    function splitTimesToDayPeriodLists(application){
      application.wedPeriodList = application.times.filter(isTimesWed).map(timesToPeriodList)[0];
      application.thurPeriodList = application.times.filter(isTimesThur).map(timesToPeriodList)[0];

      // Merge periods that collide. (ex: 540-600 & 600-660 minutes);
      application.wedPeriodList = mergePeriodList(application.wedPeriodList);
      application.thurPeriodList = mergePeriodList(application.thurPeriodList);
    }

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









































  }
})();
