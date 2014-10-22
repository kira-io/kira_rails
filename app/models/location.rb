class Location < ActiveRecord::Base
  attr_accessor :ip_address
  has_many :posts
  geocoded_by :ip_address
  reverse_geocoded_by :latitude, :longitude do |obj,results|
    if geo = results.first
      obj.city = geo.city
      obj.country = geo.country_code
    end
  end
  after_validation :geocode, :reverse_geocode
end