class Post < ActiveRecord::Base
  has_many :messages
  has_many :joy_counts, dependent: :destroy
  belongs_to :user
  belongs_to :location,  dependent: :destroy

  validates :title, :content, :user, :name, presence: true
  validates :title, length: { :minimum => 2 }
end
