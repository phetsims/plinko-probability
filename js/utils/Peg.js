define( function( require ) {
  'use strict';

  return {
    
      getPositionX: function(column, row) {
        return column - 0.5 * row;
      },

      getPositionY: function(column, row) {
        return row;
      }
  };

});