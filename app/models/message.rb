class Message < ActiveRecord::Base
  belongs_to :post

  validate :content, presence: true, length: { minimum:2 }
end
