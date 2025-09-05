fx_version 'cerulean'
games { 'gta5' }

author 'Change Me - Boilerplate'
description 'Made By @0liver._'
version '1.0.0'
legacyversion '1.9.1'

use_experimental_fxv2_oal 'yes'
lua54 'yes'

shared_scripts {
  'config.lua',
  '@ox_lib/init.lua',
  '@es_extended/imports.lua',
}

client_scripts {
  'client/*.lua',
}

server_scripts {
  'server/*.lua',
  '@mysql-async/lib/MySQL.lua',
}

-- ui_page 'http://localhost:3000/' -- (for local dev) web/build/index.html
ui_page 'web/build/index.html'

files {
  'web/build/index.html',
  'web/build/**/*',
  'config/*.lua'
}
