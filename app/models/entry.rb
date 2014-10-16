class Entry < ActiveRecord::Base
  belongs_to :user

  validates :title, presence: true
  validates :content, length: { :maximum => 3000 }
end
