class Entry < ActiveRecord::Base
  belongs_to :user
  belongs_to :entry_location
  validates :title, :content, :user, presence: true
  validates :title, length: { :minimum => 2 }
end
