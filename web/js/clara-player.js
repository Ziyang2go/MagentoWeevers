/**
 * Copyright © Exocortex, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

require([
  'claraplayer',
], function(claraPlayer) {
  window.claraplayer = claraPlayer;
  require([
    'js/main'
  ]);
});
