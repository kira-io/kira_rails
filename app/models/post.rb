class Post < ActiveRecord::Base
  has_many :messages
  belongs_to :user

  validates :title, :content, :user, :name, presence: true
  validates :title, length: { :minimum => 2 }
end
