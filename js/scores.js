
      $(document).ready(function() {

        var opts = {
          lines: 13, // The number of lines to draw
          length: 20, // The length of each line
          width: 10, // The line thickness
          radius: 30, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: '#000', // #rgb or #rrggbb or array of colors
          speed: 1, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: true, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: '60%', // Top position relative to parent
          left: '50%' // Left position relative to parent
        };
        
        var spinner = new Spinner(opts).spin();
        $('#loading').append(spinner.el);

        $('.canvas').hide();

        var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
        //var baseURI = "http://civicdata.com/api/action/datastore_search_sql?sql=";
        
        // Helper function to make request for JSONP.
        function requestJSON(url, callback) {
          $.ajax({
            beforeSend: function(){
            // Handle the beforeSend event
            },
            url: url,
            complete: function(xhr) {
              callback.call(null, xhr.responseJSON);
             $('.canvas').show();
             $('#loading').hide();
               
            }
          });
        }

        var businessListQuery = "SELECT \"c8a749e9-dee3-4259-bdb4-7c3e45e0867e\".\"business_id\",\"c8a749e9-dee3-4259-bdb4-7c3e45e0867e\".\"name\",\"8d88d266-e6e2-4db5-9c5d-28cae92bad2e\".\"date\",\"8d88d266-e6e2-4db5-9c5d-28cae92bad2e\".\"score\" from \"8d88d266-e6e2-4db5-9c5d-28cae92bad2e\",\"c8a749e9-dee3-4259-bdb4-7c3e45e0867e\" where \"8d88d266-e6e2-4db5-9c5d-28cae92bad2e\".\"business_id\" = \"c8a749e9-dee3-4259-bdb4-7c3e45e0867e\".\"business_id\" order by \"c8a749e9-dee3-4259-bdb4-7c3e45e0867e\".\"business_id\", \"8d88d266-e6e2-4db5-9c5d-28cae92bad2e\".\"date\"";
        var businessList = baseURI + encodeURIComponent(businessListQuery);
        
        
        var businesses = [];


        requestJSON(businessList, function(json) {
          
          var totalBusineses = 0;
          var improvedOrSameScore = 0;
          var decreasedScore = 0;
          var yelpDate = moment("2014-10-15"); 
        
          var records = json.result.records;
          
          for(var i=0; i<records.length; i++) {
            if (businesses.indexOf(records[i].business_id) == -1)
              businesses.push(records[i].business_id);
          }

          for (var x in businesses) {
            var inspections = [];

            var beforeInspections = [];
            var afterInspections = [];

            for(var i=0; i<records.length; i++) {  
              if (businesses[x] == records[i].business_id) {
                var inspDate = moment(records[i].date,'YYYYMMDD');

                if (moment(records[i].date,'YYYYMMDD').isBefore(yelpDate))
                  beforeInspections.push(records[i].score);
                else
                  afterInspections.push(records[i].score);

                            
              }
                  
            } 
            
            //only include businesses with more than 1 inspections
            if (beforeInspections.length > 0 && afterInspections.length > 0) {
              totalBusineses++;
              if (parseInt(afterInspections[afterInspections.length - 1]) >= parseInt(beforeInspections[beforeInspections.length - 1]))
                improvedOrSameScore++;
              else
                decreasedScore++;
            }
            
          }


          $("#improved").text(improvedOrSameScore);
          $("#decreased").text(decreasedScore);
          $("#qualified").text(totalBusineses);
          console.log("Qualified Busineses: " + totalBusineses);
          console.log("improvedOrSameScore: " + improvedOrSameScore);
          console.log("decreasedScore: " + decreasedScore);
          console.log("Total Businesses: " + businesses.length); 
          
        }); 
           
              

      });


