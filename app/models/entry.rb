class Entry < ActiveRecord::Base
  belongs_to :user
  validates :title, :content, :user, presence: true
  validates :title, presence: true, length: { :minimum => 2 }
end
