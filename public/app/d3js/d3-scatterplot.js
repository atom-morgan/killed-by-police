////
//Tutorial: http://www.ng-newsletter.com/posts/d3-on-angular.html
////

angular.module('d3.directives', ['d3'])
.directive('d3Scatterplot', function(d3Service) {
  return {
    restrict: 'EA',
    scope: {
      data: '=',    //bi-directional data-binding
      onClick: '&'  //parent execution binding
    },
    link: function(scope, ele, attrs) {
      var w = 500;
      var h = 300;

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

        console.log("render");

        svg.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return d[0];
          })
          .attr("cy", function(d) {
            return d[1];
          })
          .attr("r", function(d) {
            return Math.sqrt(h/2 - d[1]);
          });

        svg.selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .text(function(d) {
            return d[0] + "," + d[1];
          })
          .attr("x", function(d) {
            return d[0];
          })
          .attr("y", function(d) {
            return d[1];
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "red");

      };//render

    }//link
  };
});
