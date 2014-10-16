class User < ActiveRecord::Base
  has_many :entries
  has_many :posts
  attr_accessor :password, :password_confirmation

  email_regex = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]+)\z/i

  validates :alias, presence: true, length: { :maximum => 25 }

  validates :password, presence: true, confirmation: true, length: { :within => 5..100 }

  before_save :encrypt_password
  before_save :default_kira

  def default_kira
    self.kira = true
  end

  def has_password?(submitted_password)
    self.encrypted_password == encrypt(submitted_password)
  end

  def self.authenticate(name, submitted_password)
    user = User.find_by(:alias => name)
    return nil if user.nil?
    return user if user.has_password?(submitted_password)
  end

  private
    def encrypt_password
      self.salt = Digest::SHA2.hexdigest("#{Time.now.utc}--#{self.password}") if self.new_record?
    
      self.encrypted_password = encrypt(self.password)
    end

    def encrypt(pass)
      Digest::SHA2.hexdigest("#{self.salt}--#{pass}")
    end
end
