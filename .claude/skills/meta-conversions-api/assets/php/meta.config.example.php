<?php
/**
 * On the server this becomes meta.config.php (drop the ".example"), next to meta.php.
 *
 * This is where the secrets live. meta.php reads it automatically.
 * NEVER commit it. In cPanel set the file permission to 600.
 */

define('META_PIXEL_ID', '1234567890123456');
define('META_CAPI_TOKEN', 'EAAG...');   // Events Manager > Settings > Conversions API

// Shared secret between the Next.js route handler and capi-lead.php.
// Must equal CAPI_SHARED_SECRET in the Next .env. Generate one:
//   php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
// Only needed for the standalone capi-lead.php (variant A).
define('CAPI_SHARED_SECRET', 'change-me-to-64-random-hex-chars');

// Optional:
// define('META_API_VERSION', 'v21.0');
// define('META_TEST_EVENT_CODE', 'TEST12345');   // testing only - REMOVE afterwards
// define('META_PHONE_DEFAULT_PREFIX', '40');     // country code when the number starts with 0
