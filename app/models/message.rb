class Message < ActiveRecord::Base
  belongs_to :post

  validates :content, presence: true, length: { minimum:2 }
end
