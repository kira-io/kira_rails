# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )


# textAngular
Rails.application.config.assets.precompile += %w( textAngular.min.css )
Rails.application.config.assets.precompile += %w( angular.min.js )
Rails.application.config.assets.precompile += %w( textAngular-sanitize.min.js )
Rails.application.config.assets.precompile += %w( textAngular.min.js )
Rails.application.config.assets.precompile += %w( text_angular_diary.js )
Rails.application.config.assets.precompile += %w( ng-infinite-scroll.min.js )

# spinning globe
Rails.application.config.assets.precompile += %w( topojson.v1.min.js )