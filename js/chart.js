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
          top: '50%', // Top position relative to parent
          left: '50%' // Left position relative to parent
        };
        
        var spinner = new Spinner(opts).spin();
        $('#loading').append(spinner.el);

        $('.canvas').hide();

        var resourceId = "8d88d266-e6e2-4db5-9c5d-28cae92bad2e";
        //var baseURI = "http://www.civicdata.com/api/action/datastore_search_sql?sql=";
        var baseURI = "http://civicdataprod1.cloudapp.net/api/action/datastore_search_sql?sql=";
        
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

        var livesCompareQuery = "SELECT substring(\"date\" from 1 for 4) as Year, substring(\"date\" from 5 for 2) as Month, avg(CAST(coalesce(\"score\", '0') AS integer)) as averageScore FROM \"resource_id\" GROUP BY Year, Month ORDER BY Year, Month";

        var livesCompare = baseURI + encodeURIComponent(livesCompareQuery.replace("resource_id",resourceId));

        requestJSON(livesCompare, function(json) {
          var records = json.result.records
          var count13 = ['2013'];
          var count14 = ['2014'];
          var count15 = ['2015'];
          for(var i=0; i<records.length; i++) {

            if (records[i].year == "2013")
              count13.push(parseInt(records[i].averagescore));
            if (records[i].year == "2014")
              count14.push(parseInt(records[i].averagescore));
            if (records[i].year == "2015")
              count15.push(parseInt(records[i].averagescore));
          }

          
            var chart = c3.generate({
              bindto: '#chartYear',
              data: {
                  columns: [
                      //['x', '01', '02','03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                      count13,
                      count14,
                      count15
                  ]
              },
              axis: {
                  x: {
                      type: 'categorized',
                      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  }
              }
            }); 
          
        });        

      });