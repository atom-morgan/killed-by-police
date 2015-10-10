////
//Tutorial: http://www.ng-newsletter.com/posts/d3-on-angular.html
////

angular.module('d3.directives', ['d3'])
.directive('d3VerticalBars', function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',    //bi-directional data-binding
      onClick: '&'  //parent execution binding
    },
    link: function(scope, ele, attrs) {
      var w = 500;
      var h = 300;
      var barPadding = 1;

      var svg = d3.select(ele[0])
                  .append("svg")
                  .attr("height", h)
                  .attr("width", w);

      window.onresize = function() {
        scope.$apply();
      };

      scope.$watch(function() {
        return angular.element(window)[0].innerWidth;
      }, function() {
        scope.render(scope.data);
      });

      scope.$watch('data', function(newVals, oldVals) {
        return scope.render(newVals);
      }, true);

      scope.render = function(data) {
        // remove all previous items before render
        svg.selectAll('*').remove();

        if (!data) return;

        svg.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", function(d, i) {
            return i * (w / data.length);
          })
          .attr("y", function(d) {
            return h - d.killings;
          })
          .attr("width", (w / data.length - barPadding))
          .attr("height", function(d) {
            return d.killings;
          })
          .attr("fill", function(d) {
            return "rgb(0, 0, " + (d.killings * 10) + ")";
          });

        svg.selectAll("text.value")
          .data(data)
          .enter()
          .append("text")
          .text(function(d) {
            return d.killings;
          })
          .attr("x", function(d, i) {
            return i * (w / data.length) + 20;
          })
          .attr("y", function(d) {
            return h - (d.killings * 0.75);
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "12px")
          .attr("fill", "white")
          .attr("text-anchor", "middle");

        svg.selectAll("text.label")
          .data(data)
          .enter()
          .append("text")
          .text(function(d) {
            return d.month;
          })
          .attr("x", function(d, i) {
            return i * (w / data.length) + 20;
          })
          .attr("y", function(d) {
            // return h - (d.killings * 0.1);
            return h - 10;
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "10px")
          .attr("fill", "white")
          .attr("text-anchor", "middle");

        // svg.selectAll("circle")
        //   .data(data)
        //   .enter()
        //   .append("circle")
        //   .attr("cx", function(d, i) {
        //     return (i * 100) + 200;
        //   })
        //   .attr("cy", h/2)
        //   .attr("r", function(d) {
        //     return (d.killings / 3);
        //   })
        //   .attr("stroke", "black")
        //   .attr("stroke-width", 2)
        //   .attr("fill", function(d) {
        //     if (d.killings > 100) {
        //       return "red";
        //     }
        //     return "green";
        //   });
      };//render

    }//link
  };
});
